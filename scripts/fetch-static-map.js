const https = require('https')
const {createClient} = require('@supabase/supabase-js')
const {loadEnvConfig} = require('@next/env')
const {generateStaticMapUrl, getMapStaticConfig} = require('../src/map/map')

loadEnvConfig(process.cwd())

const {NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY} = process.env

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase env vars.')
  process.exit(1)
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {persistSession: false, autoRefreshToken: false},
})

const mapConfigFull = getMapStaticConfig()
const mapConfigMin = getMapStaticConfig({width: 640, height: 180})

function downloadBuffer(url){
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed (${response.statusCode}) for ${url}`))
        return
      }
      const chunks = []
      response.on('data', chunk => chunks.push(chunk))
      response.on('end', () => resolve(Buffer.concat(chunks)))
      response.on('error', reject)
    }).on('error', reject)
  })
}

async function uploadMap(gc, variant, mapConfig){
  const url = generateStaticMapUrl(gc, mapConfig)
  const filename = `map-${gc.id}-${variant}.png`
  const buffer = await downloadBuffer(url)
  const {error} = await supabase.storage.from('gc-maps').upload(filename, buffer, {
    upsert: true,
    contentType: 'image/png',
  })
  if (error) throw new Error(`${filename}: ${error.message}`)
  console.log(`  ✓ ${filename}`)
}

async function fetchAllMaps(){
  const {data: rows, error} = await supabase.from('gcs').select('*')
  if (error) {
    console.error('Failed to load gcs:', error)
    process.exit(1)
  }

  for (const row of rows) {
    const addr = row.data?.address ?? {}
    const lat = addr.fake?.lat ?? addr.lat
    const lng = addr.fake?.lng ?? addr.lng
    if (!lat || !lng) {
      console.log(`  - skipping ${row.id} (no lat/lng)`)
      continue
    }
    const gc = {id: row.id, address: addr.fake ?? {lat, lng}}
    try {
      await uploadMap(gc, 'full', mapConfigFull)
      await uploadMap(gc, 'min', mapConfigMin)
    } catch (ex) {
      console.error(`  ✗ ${row.id}: ${ex.message}`)
    }
  }
  console.log('Done.')
}

fetchAllMaps()
