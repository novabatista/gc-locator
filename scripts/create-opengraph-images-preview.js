const fs = require('fs');
const path = require('path');
const gcs = require('../assets/gcs.json')
const { loadEnvConfig } = require('@next/env');
const gcFormater = require('../src/gc/formater').default

loadEnvConfig(process.cwd());

const CWD = process.cwd()
const PUBLIC = `${CWD}/public`

const FONT_GEIST = `${PUBLIC}/fonts/geist/Geist-Regular.otf`
const FONT_UNIFORM = `${PUBLIC}/fonts/uniform/UniformBlack.otf`
const IMAGES = `${PUBLIC}/images`

const outputDir = PUBLIC+'/opengraph';
const inputImage = PUBLIC+'/bg-opengraph.png';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createImage(gc, filename) {
  const outputPath = path.join(outputDir, filename);
  return new Promise((resolve, reject) => {
    const {exec} = require('child_process')
    const command = [
      `magick ${inputImage}`,
      '-resize 1200',
      // title
      '-background none',
      '-fill white',
      `-font "${FONT_UNIFORM}"`,
      '-pointsize 60',
      '-gravity north',
      `-annotate +0+30 "${gcFormater.title(gc)}"`,

      // contacts
      '-background none',
      '-fill white',
      `-font "${FONT_GEIST}"`,
      '-pointsize 40',
      '-gravity north',
      `-annotate +0+120 "${gcFormater.contactsInline(gc)}"`,

      // address
      '\\(',
      '-background none',
      '-fill white',
      `-font "${FONT_GEIST}"`,
      '-pointsize 40',
      '-gravity north',
      '-size 1100x', // com base no tamanho original da imagem 2048
      `caption:"${gc.address.text}"`,
      '-geometry +0+220',
      '\\) -composite',
      outputPath,
    ].join(' ')

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`)
        reject(error)
        return
      }
      if (stderr) {
        console.error(`Command stderr: ${stderr}`)
      }
      console.log(`Generated image: ${filename}`)
      resolve()
    })
  });
}


async function fetchAllMaps() {
  const promises = [];

  Object.keys(gcs).forEach(gcid => {
    const gc = gcs[gcid];
    
    promises.push(createImage(gc, `opengraph-${gcid}.png`));
  });

  try {
    await Promise.all(promises);
    console.log('All opengraph images generated successfully!');
  } catch (error) {
    console.error('Error generating opengraph images:', error);
    process.exit(1);
  }
}

fetchAllMaps();