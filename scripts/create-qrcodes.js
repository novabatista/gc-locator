const fs = require('fs')
const os = require('os')
const path = require('path')
const {exec} = require('child_process')
const {createClient} = require('@supabase/supabase-js')
const {loadEnvConfig} = require('@next/env')

loadEnvConfig(process.cwd())

const {NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY} = process.env

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase env vars.')
  process.exit(1)
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {persistSession: false, autoRefreshToken: false},
})

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'qrcodes-'))

function runQrencode(gcId, type, isRoot){
  const size = type === 'png' ? 20 : 10
  const filename = `${gcId}.${type}`
  const outputPath = path.join(tmpDir, filename)
  const url = `https://gc.novabatistatatuape.com.br${isRoot ? '' : `/gc/${gcId}`}?utm_source=qrcode&utm_campaign=qrcode&utm_medium=qrcode`
  const command = [
    'qrencode',
    `-s ${size}`,
    '-l H',
    '-m 2',
    `-t ${type}`,
    `-o '${outputPath}'`,
    `'${url}'`,
  ].join(' ')

  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) reject(error)
      else resolve(outputPath)
    })
  })
}

async function uploadFile(filePath){
  const filename = path.basename(filePath)
  const buffer = fs.readFileSync(filePath)
  const ext = path.extname(filename).slice(1).toLowerCase()
  const contentType = ext === 'png' ? 'image/png' : ext === 'svg' ? 'image/svg+xml' : 'application/octet-stream'
  const {error} = await supabase.storage.from('gc-qr').upload(filename, buffer, {
    upsert: true,
    contentType,
  })
  if (error) throw new Error(`${filename}: ${error.message}`)
  console.log(`  ✓ ${filename}`)
}

async function processGc(gcId, isRoot = false){
  for (const type of ['png', 'svg']) {
    const filePath = await runQrencode(gcId, type, isRoot)
    await uploadFile(filePath)
  }
}

async function main(){
  const {data: rows, error} = await supabase.from('gcs').select('id')
  if (error) {
    console.error('Failed to load gcs:', error)
    process.exit(1)
  }

  await processGc('000-base', true)
  for (const row of rows) {
    try {
      await processGc(row.id)
    } catch (ex) {
      console.error(`  ✗ ${row.id}: ${ex.message}`)
    }
  }

  fs.rmSync(tmpDir, {recursive: true, force: true})
  console.log('Done.')
}

main()
