const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  fetchLatestBaileysVersion,
  Browsers,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { messageHandler, handleGroupUpdate } = require('./src/handlers/messageHandler');

const SESSION_FOLDER = path.join(__dirname, 'sessions');
const TEMP_FOLDER    = path.join(__dirname, 'temp');
const ASSETS_FOLDER  = path.join(__dirname, 'assets');
[SESSION_FOLDER, TEMP_FOLDER, ASSETS_FOLDER].forEach(f => {
  if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
});

const logger = pino({ level: 'silent' });

// ── State ─────────────────────────────────────────────────────
let sock            = null;
let isConnected     = false;
let reconnectTimer  = null;
let reconnectCount  = 0;
let isStarting      = false;
let connectedAt     = 0;   // epoch ms when last 'open' fired

// ============================================================
// START BOT
// ============================================================
async function startBot() {
  // Prevent double-starts
  if (isStarting) return;
  isStarting  = true;
  isConnected = false;

  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }

  try {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER);
    const { version }          = await fetchLatestBaileysVersion();

    // ── Fresh store every boot — stale store blocks messages ──
    const store = makeInMemoryStore({ logger });

    sock = makeWASocket({
      version,
      logger,
      auth: {
        creds: state.creds,
        keys:  makeCacheableSignalKeyStore(state.keys, logger),
      },
      browser: Browsers.ubuntu('Chrome'),
      printQRInTerminal:          false,
      generateHighQualityLinkPreview: false,
      syncFullHistory:            false,
      keepAliveIntervalMs:        20_000,
      retryRequestDelayMs:        2_000,
      connectTimeoutMs:           60_000,
      defaultQueryTimeoutMs:      60_000,
      getMessage: async (key) => {
        try {
          const m = await store.loadMessage(key.remoteJid, key.id);
          return m?.message ?? { conversation: '' };
        } catch { return { conversation: '' }; }
      },
    });

    store.bind(sock.ev);

    // ── Connection events ─────────────────────────────────────
    sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
      if (connection === 'close') {
        isConnected = false;
        isStarting  = false;

        const code = new Boom(lastDisconnect?.error)?.output?.statusCode;

        if (code === DisconnectReason.loggedOut) {
          console.log('\n🔴 Logged out — clearing session and restarting…\n');
          try { fs.readdirSync(SESSION_FOLDER).forEach(f => fs.unlinkSync(path.join(SESSION_FOLDER, f))); } catch {}
          reconnectTimer = setTimeout(startBot, 2_000);
          return;
        }

        if (code === DisconnectReason.connectionReplaced) {
          console.log('\n⚠️  Connection replaced — reconnecting…\n');
          reconnectTimer = setTimeout(startBot, 3_000);
          return;
        }

        // Every other disconnect: exponential back-off capped at 15 s
        reconnectCount++;
        const delay = Math.min(2_000 * reconnectCount, 15_000);
        reconnectTimer = setTimeout(() => { isStarting = false; startBot(); }, delay);

      } else if (connection === 'open') {
        isConnected    = true;
        isStarting     = false;
        reconnectCount = 0;
        connectedAt    = Date.now();

        const rawId  = sock.user?.id ?? '';
        const botNum = rawId.split(':')[0] || rawId.split('@')[0];
        console.log('\n✅ ════════════════════════════════════');
        console.log('   🌸 Shadow Garden Bot is ONLINE!');
        console.log(`   📱 Bot number: ${botNum}`);
        console.log('════════════════════════════════════\n');
      }
    });

    // ── Pairing — only when session doesn't exist ─────────────
    if (!state.creds.registered) {
      await new Promise(r => setTimeout(r, 2_500));
      console.log('\n┌────────────────────────────────┐');
      console.log('│   🌸 SHADOW GARDEN BOT SETUP   │');
      console.log('└────────────────────────────────┘\n');
      console.log('Enter your WhatsApp number (with country code, no + sign)');
      console.log('Example: 2348012345678\n');

      const phoneNumber = await new Promise(resolve => {
        const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
        rl.question('📱 Number: ', n => { rl.close(); resolve(n.trim().replace(/\D/g, '')); });
      });

      if (!phoneNumber || phoneNumber.length < 7) {
        console.log('❌ Invalid number! Restart and try again.');
        process.exit(1);
      }

      await new Promise(r => setTimeout(r, 3_000));

      try {
        const code = await sock.requestPairingCode(phoneNumber);
        const fmt  = code?.match(/.{1,4}/g)?.join('-') ?? code;
        console.log('\n┌────────────────────────────────┐');
        console.log(`│  🔑 PAIRING CODE: ${fmt.padEnd(11)} │`);
        console.log('└────────────────────────────────┘\n');
        console.log('  1. Open WhatsApp → Settings → Linked Devices');
        console.log('  2. Link a Device → "Link with phone number instead"');
        console.log(`  3. Enter: ${fmt}\n`);
        console.log('⏳ Waiting for pairing…\n');
      } catch (e) {
        console.log('❌ Pairing error:', e.message, '— restart and try again.\n');
        isStarting = false;
      }
    }

    sock.ev.on('creds.update', saveCreds);

    // ── MESSAGE HANDLER ───────────────────────────────────────
    //
    // THE FIX FOR "stops responding after 3rd reconnect":
    //
    // ROOT CAUSE: Bailing out of handleMessage when !isConnected.
    // Baileys fires messages.upsert BEFORE connection.update fires
    // 'open' on every reconnect. The 3rd+ reconnect is slower so
    // the window grows — messages arrive, isConnected is still false,
    // they get dropped, and the bot looks dead.
    //
    // SOLUTION: NEVER gate on isConnected inside the message handler.
    // Instead, only skip messages that are genuinely old (>30 s) to
    // avoid re-processing a backlog from while the bot was offline.
    //
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;

      for (const msg of messages) {
        if (!msg.message) continue;
        if (msg.key.fromMe) continue;

        // Drop messages older than 30 seconds — avoids backlog replay
        // but keeps every real-time message regardless of isConnected state
        const msgAge = Date.now() - (Number(msg.messageTimestamp) * 1000);
        if (msgAge > 30_000) continue;

        try { await messageHandler(sock, msg); } catch {}
      }
    });

    // ── Group participant events ───────────────────────────────
    sock.ev.on('group-participants.update', async (update) => {
      try { await handleGroupUpdate(sock, update); } catch {}
    });

  } catch (err) {
    console.error('⚠️  Boot error:', err.message);
    isStarting = false;
    reconnectTimer = setTimeout(startBot, 5_000);
  }
}

// ============================================================
// BOOT
// ============================================================
console.log('\n🌸 Starting Shadow Garden Bot…\n');
startBot();

// ── Safety watchdog (every 30 s) ─────────────────────────────
// If somehow nothing is connected AND nothing is trying to connect,
// kick it back to life. Handles any edge case on Replit.
setInterval(() => {
  if (!isConnected && !isStarting && !reconnectTimer) {
    console.log('🔄 Watchdog: restarting bot…');
    startBot();
  }
}, 30_000);

// ── Global error catchers — never crash ──────────────────────
process.on('uncaughtException',  err  => console.error('Uncaught:', err.message));
process.on('unhandledRejection', ()   => {});
