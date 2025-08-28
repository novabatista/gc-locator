const fs = require('fs');
const path = require('path');
const https = require('https');
const { generateStaticMapUrl, getMapStaticConfig } = require('../src/map/map');
const gcs = require('../assets/gcs.json')
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const mapConfigFull = getMapStaticConfig();
const mapConfigMin = getMapStaticConfig({width: 640, height: 180})

const outputDir = path.join(process.cwd(), 'public/maps');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, filename) {
  const outputPath = path.join(outputDir, filename);
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${outputPath}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete file on error
        reject(err);
      });
    }).on('error', reject);
  });
}


async function fetchAllMaps() {
  const promises = [];

  Object.keys(gcs).forEach(gcid => {
    const gc = gcs[gcid];

    promises.push(downloadImage(generateStaticMapUrl(gc, mapConfigFull), `map-${gcid}-full.png`));
    promises.push(downloadImage(generateStaticMapUrl(gc, mapConfigMin), `map-${gcid}-min.png`));
  });

  try {
    await Promise.all(promises);
    console.log('All maps downloaded successfully!');
  } catch (error) {
    console.error('Error downloading maps:', error);
    process.exit(1);
  }
}

fetchAllMaps();