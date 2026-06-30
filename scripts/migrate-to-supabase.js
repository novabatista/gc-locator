const fs = require('fs')
const path = require('path')
const {createClient} = require('@supabase/supabase-js')
const {loadEnvConfig} = require('@next/env')

loadEnvConfig(process.cwd())

const {NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY} = process.env

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.')
  process.exit(1)
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {persistSession: false, autoRefreshToken: false},
})

const CWD = process.cwd()
const gcs = require(path.join(CWD, 'assets/gcs.json'))

function normalizeDescription(description){
  if (Array.isArray(description)) return description.join('\n\n')
  if (typeof description === 'string') return description
  return ''
}

function buildRow(gc){
  // Strip top-level fields and config.color (derived from sector). Keep everything else in data.
  const {id, name, sector, sheetId, address, ...rest} = gc
  const {config = {}, contacts = [], schedules = [], links = [], images = [], description, ...extra} = rest
  const {color, ...configWithoutColor} = config

  const data = {
    config: configWithoutColor,
    address: {
      street_number: address?.street_number ?? null,
      complement: address?.complement ?? '',
      lat: address?.lat ?? null,
      lng: address?.lng ?? null,
      fake: address?.fake ?? null,
    },
    contacts,
    schedules,
    links,
    images,
    description: normalizeDescription(description),
    ...extra,
  }

  return {
    id,
    name,
    sector_id: sector.id,
    sheet_id: sheetId ?? null,
    address_text: address?.text ?? null,
    data,
  }
}

async function seedDatabase(){
  const rows = Object.values(gcs).map(buildRow)
  console.log(`Seeding ${rows.length} GCs...`)

  const {error} = await supabase.from('gcs').upsert(rows, {onConflict: 'id'})
  if (error) {
    console.error('DB seed failed:', error)
    process.exit(1)
  }
  console.log('DB seed OK')
}

async function uploadDir(localDir, bucket){
  if (!fs.existsSync(localDir)) {
    console.log(`Skipping ${localDir} (does not exist)`)
    return
  }

  const files = fs.readdirSync(localDir).filter(name => !name.startsWith('.'))
  console.log(`Uploading ${files.length} files from ${localDir} to bucket "${bucket}"...`)

  let ok = 0
  let fail = 0
  for (const filename of files) {
    const filePath = path.join(localDir, filename)
    if (fs.statSync(filePath).isDirectory()) continue
    const buffer = fs.readFileSync(filePath)
    const ext = path.extname(filename).slice(1).toLowerCase()
    const contentType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream'

    const {error} = await supabase.storage.from(bucket).upload(filename, buffer, {
      upsert: true,
      contentType,
    })
    if (error) {
      console.error(`  ✗ ${filename}: ${error.message}`)
      fail++
    } else {
      ok++
    }
  }
  console.log(`  ${bucket}: ${ok} uploaded, ${fail} failed`)
}

async function seedStorage(){
  await uploadDir(path.join(CWD, 'public/maps'), 'gc-maps')
  await uploadDir(path.join(CWD, 'public/qr'), 'gc-qr')
  await uploadDir(path.join(CWD, 'public/opengraph'), 'gc-opengraph')
}

async function main(){
  await seedDatabase()
  await seedStorage()
  console.log('Done.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
