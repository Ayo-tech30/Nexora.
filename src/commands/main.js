const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { formatUptime } = require('../utils/helpers');

const startTime = Date.now();

const MENU_TEXT = `
👋🏻⃝⃘̉̉̉━⋆─⋆──❂
┊ ┊ ┊ ┊ ┊
┊ ┊ ✫ ˚㋛ ⋆｡ ❀
┊ ☠︎︎
✧ Hey {user}𓂃✍︎𝄞
╰────────────────❂
┏━━━━━━━━━━━━━❥❥❥
┃ ✦ Sʜᴀᴅᴏᴡ  Gᴀʀᴅᴇɴ ✦
┗━━━━━━━━━━━━━❥❥❥

┏━━━━━━━━━━━━━❥❥❥
┃ ɴᴀᴍᴇ - Delta
┃ ᴄʀᴇᴀᴛᴏʀ - ꨄ︎ 𝙆𝙔𝙉𝙓 ꨄ︎
┃ ᴘʀᴇꜰɪx - [ . ]
┗━━━━━━━━━━━━━❥❥❥

┏━「 📋 ᴍᴀɪɴ 」
┃ .ᴍᴇɴᴜ
┃ .ᴘɪɴɢ
┃ .ᴡᴇʙꜱɪᴛᴇ
┃ .ᴄᴏᴍᴍᴜɴɪᴛʏ
┃ .ᴀꜰᴋ
┃ .ʜᴇʟᴘ
┃ .ɪɴꜰᴏ
┃ .ᴜᴘᴛɪᴍᴇ
┃ .ᴅɪꜱᴄᴏʀᴅ
┗━━━━━━━━━━━━━❥❥❥

┏━「 ⚙️ ᴀᴅᴍɪɴ 」
┃ .ᴋɪᴄᴋ
┃ .ᴅᴇʟᴇᴛᴇ
┃ .ᴀɴᴛɪʟɪɴᴋ
┃ .ᴀɴᴛɪʟɪɴᴋ ꜱᴇᴛ [ᴀᴄᴛɪᴏɴ]
┃ .ᴡᴀʀɴ @ᴜꜱᴇʀ [ʀᴇᴀꜱᴏɴ]
┃ .ʀᴇꜱᴇᴛᴡᴀʀɴ
┃ .ɢʀᴏᴜᴘɪɴꜰᴏ / .ɢɪ
┃ .ᴡᴇʟᴄᴏᴍᴇ ᴏɴ/ᴏꜰꜰ
┃ .ꜱᴇᴛᴡᴇʟᴄᴏᴍᴇ
┃ .ʟᴇᴀᴠᴇ ᴏɴ/ᴏꜰꜰ
┃ .ꜱᴇᴛʟᴇᴀᴠᴇ
┃ .ᴘʀᴏᴍᴏᴛᴇ
┃ .ᴅᴇᴍᴏᴛᴇ
┃ .ᴍᴜᴛᴇ @ᴜꜱᴇʀ [ᴛɪᴍᴇ]
┃ .ᴜɴᴍᴜᴛᴇ
┃ .ʜɪᴅᴇᴛᴀɢ
┃ .ᴛᴀɢᴀʟʟ
┃ .ᴀᴄᴛɪᴠɪᴛʏ
┃ .ᴀᴄᴛɪᴠᴇ
┃ .ɪɴᴀᴄᴛɪᴠᴇ
┃ .ᴏᴘᴇɴ
┃ .ᴄʟᴏꜱᴇ
┃ .ᴘᴜʀɢᴇ [ᴄᴏᴅᴇ]
┃ .ᴀɴᴛɪꜱᴍ ᴏɴ/ᴏꜰꜰ
┃ .ʙʟᴀᴄᴋʟɪꜱᴛ ᴀᴅᴅ [ᴡᴏʀᴅ]
┃ .ʙʟᴀᴄᴋʟɪꜱᴛ ʀᴇᴍᴏᴠᴇ [ᴡᴏʀᴅ]
┃ .ʙʟᴀᴄᴋʟɪꜱᴛ ʟɪꜱᴛ
┃ .ɢʀᴏᴜᴘꜱᴛᴀᴛꜱ / .ɢꜱ
┗━━━━━━━━━━━━━❥❥❥

┏━「 👑 ᴏᴡɴᴇʀ ᴏɴʟʏ 」
┃ .ꜱᴜᴅᴏ <ɴᴜᴍʙᴇʀ>
┃ .ʀᴇᴍᴏᴠᴇꜱᴜᴅᴏ <ɴᴜᴍʙᴇʀ>
┃ .ʟɪꜱᴛꜱᴜᴅᴏ
┃ .ʙᴀɴ @ᴜꜱᴇʀ
┃ .ᴜɴʙᴀɴ @ᴜꜱᴇʀ
┃ .ᴊᴏɪɴ <ʟɪɴᴋ>
┗━━━━━━━━━━━━━❥❥❥

┏━「 💰 ᴇᴄᴏɴᴏᴍʏ 」
┃ .ᴍᴏɴᴇʏʙᴀʟᴀɴᴄᴇ / .ᴍʙᴀʟ
┃ .ɢᴇᴍꜱ
┃ .ᴘʀᴇᴍɪᴜᴍʙᴀʟ / .ᴘʙᴀʟ
┃ .ᴅᴀɪʟʏ
┃ .ᴡɪᴛʜᴅʀᴀᴡ / .ᴡɪᴅ [ᴀᴍᴏᴜɴᴛ]
┃ .ᴅᴇᴘᴏꜱɪᴛ / .ᴅᴇᴘ [ᴀᴍᴏᴜɴᴛ]
┃ .ᴅᴏɴᴀᴛᴇ [ᴀᴍᴏᴜɴᴛ]
┃ .ʟᴏᴛᴛᴇʀʏ
┃ .ʀɪᴄʜʟɪꜱᴛ
┃ .ʀɪᴄʜʟɪꜱᴛɢʟᴏʙᴀʟ / .ʀɪᴄʜʟɢ
┃ .ʀᴇɢɪꜱᴛᴇʀ / .ʀᴇɢ
┃ .ꜱᴇᴛɴᴀᴍᴇ <ɴᴀᴍᴇ>
┃ .ᴘʀᴏꜰɪʟᴇ / .ᴘ
┃ .ᴇᴅɪᴛ
┃ .ʙɪᴏ [ʙɪᴏ]
┃ .ꜱᴇᴛᴀɢᴇ [ᴀɢᴇ]
┃ .ɪɴᴠᴇɴᴛᴏʀʏ / .ɪɴᴠ
┃ .ᴜꜱᴇ [ɪᴛᴇᴍ ɴᴀᴍᴇ]
┃ .ꜱᴇʟʟ [ɪᴛᴇᴍ ɴᴀᴍᴇ]
┃ .ʙᴜʏ [ɪᴛᴇᴍ ɴᴀᴍᴇ]
┃ .ꜱʜᴏᴘ
┃ .ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ / .ʟʙ
┃ .ᴅɪɢ
┃ .ꜰɪꜱʜ
┃ .ʙᴇɢ
┃ .ʀᴏᴀꜱᴛ
┃ .ɢᴀᴍʙʟᴇ
┃ .ʀᴏʙ @ᴜꜱᴇʀ
┗━━━━━━━━━━━━━❥❥❥

┏━「 🎴 ᴄᴀʀᴅꜱ 」
┃ .ᴄᴏʟʟᴇᴄᴛɪᴏɴ / .ᴄᴏʟʟ
┃ .ᴅᴇᴄᴋ
┃ .ᴄᴀʀᴅ [ɪɴᴅᴇx]
┃ .ᴅᴇᴄᴋᴄᴀʀᴅ [ɪɴᴅᴇx]
┃ .ᴄᴀʀᴅɪɴꜰᴏ / .ᴄɪ [ɴᴀᴍᴇ]
┃ .ᴍʏᴄᴏʟʟᴇᴄᴛɪᴏɴꜱᴇʀɪᴇꜱ / .ᴍʏᴄᴏʟʟꜱ
┃ .ᴄᴀʀᴅʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ / .ᴄᴀʀᴅʟʙ
┃ .ᴄᴀʀᴅꜱʜᴏᴘ
┃ .ᴄʟᴀɪᴍ [ɪᴅ]
┃ .ꜱᴛᴀʀᴅᴜꜱᴛ
┃ .ᴠꜱ @ᴜꜱᴇʀ
┃ .ᴀᴜᴄᴛɪᴏɴ [card_id] [ᴘʀɪᴄᴇ]
┃ .ᴍʏᴀᴜᴄ
┃ .ʟɪꜱᴛᴀᴜᴄ
┃ .ʀᴄ [ɪɴᴅᴇx]
┃ .ꜱᴘᴀᴡɴᴄᴀʀᴅ [ʟɪɴᴋ ᴏʀ ʜᴇʀᴇ] [ᴍꜱɢ]
┗━━━━━━━━━━━━━❥❥❥

┏━「 🎮 ɢᴀᴍᴇꜱ 」
┃ .ᴛɪᴄᴛᴀᴄᴛᴏᴇ / .ᴛᴛᴛ @ᴜꜱᴇʀ
┃ .ᴄᴏɴɴᴇᴄᴛꜰᴏᴜʀ / .ᴄ4 @ᴜꜱᴇʀ
┃ .ᴡᴏʀᴅᴄʜᴀɪɴ / .ᴡᴄɢ
┃ .ꜱᴛᴀʀᴛʙᴀᴛᴛʟᴇ @ᴜꜱᴇʀ
┃ .ᴛʀᴜᴛʜᴏʀᴅᴀʀᴇ / .ᴛᴅ
┃ .ꜱᴛᴏᴘɢᴀᴍᴇ
┗━━━━━━━━━━━━━❥❥❥

┏━「 ⚔️ ʀᴘɢ 」
┃ .ʀᴘɢᴘʀᴏꜰɪʟᴇ
┃ .ꜱᴇᴛᴄʟᴀꜱꜱ [ᴄʟᴀꜱꜱ]
┃ .ᴅᴜɴɢᴇᴏɴ [ɴᴜᴍʙᴇʀ]
┃ .qᴜᴇꜱᴛ
┃ .ʜᴇᴀʟ
┃ .ᴄʀᴀꜰᴛ [ɴᴜᴍʙᴇʀ]
┗━━━━━━━━━━━━━❥❥❥

┏━「 🃏 ᴜɴᴏ 」
┃ .ᴜɴᴏ
┃ .ꜱᴛᴀʀᴛᴜɴᴏ
┃ .ᴜɴᴏᴘʟᴀʏ [ɴᴜᴍʙᴇʀ]
┃ .ᴜɴᴏᴅʀᴀᴡ
┃ .ᴜɴᴏʜᴀɴᴅ
┗━━━━━━━━━━━━━❥❥❥

┏━「 🎲 ɢᴀᴍʙʟᴇ 」
┃ .ꜱʟᴏᴛꜱ [ᴀᴍᴏᴜɴᴛ]
┃ .ᴅɪᴄᴇ [ᴀᴍᴏᴜɴᴛ]
┃ .ᴄᴀꜱɪɴᴏ [ᴀᴍᴏᴜɴᴛ]
┃ .ᴄᴏɪɴꜰʟɪᴘ / .ᴄꜰ [h/t] [ᴀᴍᴏᴜɴᴛ]
┃ .ᴅᴏᴜʙʟᴇʙᴇᴛ / .ᴅʙ [ᴀᴍᴏᴜɴᴛ]
┃ .ᴅᴏᴜʙʟᴇᴘᴀʏᴏᴜᴛ / .ᴅᴘ [ᴀᴍᴏᴜɴᴛ]
┃ .ʀᴏᴜʟᴇᴛᴛᴇ [ᴄᴏʟᴏʀ] [ᴀᴍᴏᴜɴᴛ]
┃ .ʜᴏʀꜱᴇ [1-4] [ᴀᴍᴏᴜɴᴛ]
┃ .ꜱᴘɪɴ [ᴀᴍᴏᴜɴᴛ]
┗━━━━━━━━━━━━━❥❥❥

┏━「 👤 ɪɴᴛᴇʀᴀᴄᴛɪᴏɴ 」
┃ .ʜᴜɢ
┃ .ᴋɪꜱꜱ
┃ .ꜱʟᴀᴘ
┃ .ᴡᴀᴠᴇ
┃ .ᴘᴀᴛ
┃ .ᴅᴀɴᴄᴇ
┃ .ꜱᴀᴅ
┃ .ꜱᴍɪʟᴇ
┃ .ʟᴀᴜɢʜ
┃ .ᴘᴜɴᴄʜ
┃ .ᴋɪʟʟ
┃ .ʜɪᴛ
┃ .ꜰᴜᴄᴋ
┃ .ᴋɪᴅɴᴀᴘ
┃ .ʟɪᴄᴋ
┃ .ʙᴏɴᴋ
┃ .ᴛɪᴄᴋʟᴇ
┃ .ꜱʜʀᴜɢ
┃ .ᴡᴀɴᴋ
┃ .ᴊɪʜᴀᴅ
┃ .ᴄʀᴜꜱᴀᴅᴇ
┗━━━━━━━━━━━━━❥❥❥

┏━「 🎉 ꜰᴜɴ 」
┃ .ɢᴀʏ
┃ .ʟᴇꜱʙɪᴀɴ
┃ .ꜱɪᴍᴘ
┃ .ᴍᴀᴛᴄʜ
┃ .ꜱʜɪᴘ
┃ .ᴄʜᴀʀᴀᴄᴛᴇʀ
┃ .ᴘꜱɪᴢᴇ / .ᴘᴘ
┃ .ꜱᴋɪʟʟ
┃ .ᴅᴜᴀʟɪᴛʏ
┃ .ɢᴇɴ
┃ .ᴘᴏᴠ
┃ .ꜱᴏᴄɪᴀʟ
┃ .ʀᴇʟᴀᴛɪᴏɴ
┃ .ᴡᴏᴜʟᴅʏᴏᴜʀᴀᴛʜᴇʀ / .ᴡʏʀ
┃ .ᴊᴏᴋᴇ
┃ .ᴛʀᴜᴛʜ
┃ .ᴅᴀʀᴇ
┃ .ᴛʀᴜᴛʜᴏʀᴅᴀʀᴇ / .ᴛᴅ
┃ .ᴜɴᴏ
┗━━━━━━━━━━━━━❥❥❥

┏━「 👑 ᴏᴡɴᴇʀ 」
┃ .ꜱᴜᴅᴏ ᴀᴅᴅ [ɴᴜᴍʙᴇʀ]
┃ .ꜱᴜᴅᴏ ʀᴇᴍᴏᴠᴇ [ɴᴜᴍʙᴇʀ]
┃ .ꜱᴜᴅᴏ ʟɪꜱᴛ
┃ .ʙᴀɴ @ᴜꜱᴇʀ
┃ .ᴜɴʙᴀɴ @ᴜꜱᴇʀ
┃ .ᴊᴏɪɴ [ʟɪɴᴋ]
┃ .ᴇxɪᴛ
┃ .ꜱᴘᴀᴡɴᴄᴀʀᴅ [ᴍᴇꜱꜱᴀɢᴇ]
┗━━━━━━━━━━━━━❥❥❥

┏━「 🎵 ᴍᴜꜱɪᴄ 」
┃ .ᴘʟᴀʏ [ꜱᴏɴɢ ɴᴀᴍᴇ / ᴜʀʟ]
┗━━━━━━━━━━━━━❥❥❥

┏━「 🔍 ꜱᴇᴀʀᴄʜ 」
┃ .ᴡᴀʟʟᴘᴀᴘᴇʀ [qᴜᴇʀʏ]
┃ .ɪᴍᴀɢᴇ [qᴜᴇʀʏ]
┃ .ʟʏʀɪᴄꜱ [ꜱᴏɴɢ ɴᴀᴍᴇ]
┗━━━━━━━━━━━━━❥❥❥

┏━「 🤖 ᴀɪ 」
┃ .ᴀɪ / .ɢᴘᴛ [qᴜᴇꜱᴛɪᴏɴ]
┃ .ᴛʀᴀɴꜱʟᴀᴛᴇ / .ᴛᴛ [ʟᴀɴɢ] [ᴛᴇxᴛ]
┗━━━━━━━━━━━━━❥❥❥

┏━「 🔄 ᴄᴏɴᴠᴇʀᴛᴇʀ 」
┃ .ꜱᴛɪᴄᴋᴇʀ / .ꜱ
┃ .ᴛᴀᴋᴇ <ɴᴀᴍᴇ>, <ᴀᴜᴛʜᴏʀ>
┃ .ᴛᴏɪᴍɢ / .ᴛᴜʀɴɪᴍɢ
┃ .ʀᴏᴛᴀᴛᴇ [90/180/270]
┃ .ᴠᴠ
┗━━━━━━━━━━━━━❥❥❥

┏━「 🌸 ᴀɴɪᴍᴇ ꜱꜰᴡ 」
┃ .ᴡᴀɪꜰᴜ
┃ .ɴᴇᴋᴏ
┃ .ᴍᴀɪᴅ
┃ .ᴏᴘᴘᴀɪ
┃ .ꜱᴇʟꜰɪᴇꜱ
┃ .ᴜɴɪꜰᴏʀᴍ
┃ .ᴍᴏʀɪ-ᴄᴀʟʟɪᴏᴘᴇ
┃ .ʀᴀɪᴅᴇɴ-ꜱʜᴏɢᴜɴ
┃ .ᴋᴀᴍɪꜱᴀᴛᴏ-ᴀʏᴀᴋᴀ
┗━━━━━━━━━━━━━❥❥❥

┏━「 🔞 ᴀɴɪᴍᴇ ɴꜱꜰᴡ 」
┃ .ɴᴜᴅᴇ ᴏɴ/ᴏꜰꜰ
┃ .ᴍɪʟꜰ
┃ .ᴀꜱꜱ
┃ .ʜᴇɴᴛᴀɪ
┃ .ᴏʀᴀʟ
┃ .ᴇᴄᴄʜɪ
┃ .ᴘᴀɪᴢᴜʀɪ
┃ .ᴇʀᴏ
┃ .ᴇʜᴇɴᴛᴀɪ
┃ .ɴʜᴇɴᴛᴀɪ
┗━━━━━━━━━━━━━❥❥❥

⋆☽ ᴘᴏᴡᴇʀᴇᴅ ʙʏ Sʜᴀᴅᴏᴡ Gᴀʀᴅᴇɴ ☾⋆
`;

module.exports = {
  async menu(ctx) {
    const { sock, msg, sender, groupId } = ctx;
    const userName = msg.pushName || sender.split('@')[0];
    const menuText = MENU_TEXT.replace('{user}', userName);

    const imgPath = path.join(__dirname, '../../assets/delta.jpg');

    if (fs.existsSync(imgPath)) {
      const imgBuffer = fs.readFileSync(imgPath);
      await sock.sendMessage(groupId, {
        image: imgBuffer,
        caption: menuText,
      }, { quoted: msg });
    } else {
      await sock.sendMessage(groupId, { text: menuText }, { quoted: msg });
    }
  },

  async ping(ctx) {
    const start = Date.now();
    await ctx.reply('🏓 Pinging...');
    const latency = Date.now() - start;
    await ctx.sock.sendMessage(ctx.groupId, {
      text: `🏓 *Pong!*\n⚡ Speed: ${latency}ms\n🟢 Bot is alive!`
    }, { quoted: ctx.msg });
  },

  async website(ctx) {
    await ctx.reply(`🌐 *Shadow Garden Website*\n\n🚧 *Coming Soon!*\n\nWe're working hard to bring you an amazing experience. Stay tuned! 🌸`);
  },

  async community(ctx) {
    await ctx.reply(`🌟 *Join the Shadow Garden Community!*\n\n${config.COMMUNITY_LINK}\n\n✨ Connect with other members, get updates, and more!`);
  },

  async afk(ctx) {
    const { sender, body } = ctx;
    const { Database } = require('../database/firebase');
    const reason = body || 'No reason provided';
    await Database.setAFK(sender, reason);
    await ctx.reply(`😴 *AFK Mode Activated!*\n📝 Reason: ${reason}\n\nYou'll be notified when someone mentions you.`);
  },

  async help(ctx) {
    await ctx.reply(`🆘 *Shadow Garden Bot Help*\n\n📖 Use *.menu* to see all available commands\n\n💡 *Tips:*\n• All commands start with *.* (dot)\n• Use *.ping* to check if bot is online\n• Use *.register* to create your profile\n• Join our community: ${config.COMMUNITY_LINK}\n\n📞 Contact creator: *${config.CREATOR}*`);
  },

  async info(ctx) {
    const uptime = formatUptime(Date.now() - startTime);
    await ctx.reply(`🤖 *Bot Information*\n\n┌─────────────────\n│ 🏷️ Name: ${config.BOT_NAME}\n│ 👤 Creator: ${config.CREATOR}\n│ ⌨️ Prefix: ${config.PREFIX}\n│ ⏱️ Uptime: ${uptime}\n│ 🌐 Platform: WhatsApp\n│ ⚡ Version: 2.0.0\n│ 📅 Build: 2025\n└─────────────────\n\n✨ Powered by Shadow Garden`);
  },

  async discord(ctx) {
    await ctx.reply(`https://discord.gg/mBTJDzKgs3`);
  },

  async uptime(ctx) {
    const uptime = formatUptime(Date.now() - startTime);
    await ctx.reply(`⏱️ *Bot Uptime*\n\n🟢 Running for: *${uptime}*\n✅ All systems operational!`);
  },
};
