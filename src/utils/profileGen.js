/**
 * Shadow Garden Bot — Profile Card Image Generator
 * Calls the Python genProfile.py script and returns a Buffer.
 */

const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const SCRIPT = path.join(__dirname, 'genProfile.py');
const PYTHON = 'python3';

/**
 * Generate a profile card image.
 * @param {Object} data  - Profile data object (mode, name, xp, etc.)
 * @returns {Promise<Buffer>} PNG image buffer
 */
function generateProfileCard(data) {
  return new Promise((resolve, reject) => {
    const tmpPath = path.join(os.tmpdir(), `sg_profile_${Date.now()}_${Math.random().toString(36).slice(2)}.png`);
    const jsonArg = JSON.stringify(data);

    execFile(PYTHON, [SCRIPT, jsonArg, tmpPath], { timeout: 30000 }, (err, stdout, stderr) => {
      if (err) {
        return reject(new Error(`Profile gen failed: ${err.message}\n${stderr}`));
      }
      try {
        const buf = fs.readFileSync(tmpPath);
        fs.unlinkSync(tmpPath);
        resolve(buf);
      } catch (e) {
        reject(e);
      }
    });
  });
}

module.exports = { generateProfileCard };
