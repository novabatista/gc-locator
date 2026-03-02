const fs = require('fs');
const path = require('path');
const gcs = require('../assets/gcs.json')
const { loadEnvConfig } = require('@next/env');
const gcFormater = require('../src/gc/formater').default

loadEnvConfig(process.cwd());

const CWD = process.cwd()
const PUBLIC = `${CWD}/public`


const outputDir = PUBLIC+'/qr';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createQR(gc, type, isRoot = false) {
  const size = type==='png' ? 20 : 10
  const filename = `${gc.id}.${type}`
  const outputPath = path.join(outputDir, filename);

  return new Promise((resolve, reject) => {
    const {exec} = require('child_process')
    const command = [
      'qrencode',
      `-s ${size}`,
      '-l H',
      '-m 2',
      `-t ${type}`,
      `-o \'${outputPath}\'`,
      `\'https://gc.novabatistatatuape.com.br${isRoot ? '' : `/gc/${gc.id}`}?utm_source=qrcode&utm_campaign=qrcode&utm_medium=qrcode\'`
    ].join(' ')

    // console.log(command); return;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`)
        reject(error)
        return
      }
      if (stderr) {
        console.error(`Command stderr: ${stderr}`)
      }
      console.log(command);
      console.log(`Generated image: ${filename}`)
      console.log('');
      resolve()
    })
  });
}


async function createQRCodes() {
  const promises = [];
  const list = Object.values(gcs);

  promises.push(createQR({id: '000-base'}, 'png', true));
  promises.push(createQR({id: '000-base'}, 'svg', true));
  list.forEach(gc => {
    promises.push(createQR(gc, 'png'));
    promises.push(createQR(gc, 'svg'));
  })

  try {
    await Promise.all(promises);
    console.log('All qrcode images generated successfully!');
  } catch (error) {
    console.error('Error generating qrcode images:', error);
    process.exit(1);
  }
}

createQRCodes();