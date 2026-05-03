const sharp = require('sharp');
const fs = require('fs');
async function check() {
  for (let i=0; i<5; i++) {
    const n = String(i).padStart(3, '0');
    const f = 'public/images/sequence/ezgif-frame-' + n + '.jpg';
    if (!fs.existsSync(f)) continue;
    const { data } = await sharp(f).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
    console.log(f, Array.from(data));
  }
}
check();
