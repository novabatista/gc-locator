const fs = require('fs')
const os = require('os')
const path = require('path')
const {exec} = require('child_process')
const {createClient} = require('@supabase/supabase-js')
const {loadEnvConfig} = require('@next/env')
const gcFormater = require('../src/gc/formater').default

loadEnvConfig(process.cwd())

const {NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY} = process.env

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase env vars.')
  process.exit(1)
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {persistSession: false, autoRefreshToken: false},
})

const CWD = process.cwd()
const PUBLIC = `${CWD}/public`

const FONT_GEIST = `${PUBLIC}/fonts/geist/Geist-Regular.otf`
const FONT_UNIFORM = `${PUBLIC}/fonts/uniform/UniformBlack.otf`
const inputImage = `${PUBLIC}/bg-opengraph.png`
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'opengraph-'))

function text(value, top, size = 46, font = FONT_GEIST){
  return [
    '\\(',
    '-background none',
    '-fill white',
    `-font "${font}"`,
    `-pointsize ${size}`,
    '-gravity north',
    '-size 1100x',
    `caption:"${value}"`,
    `-geometry +0+${top}`,
    '\\)',
    '-composite',
  ].join(' ')
}

function runMagick(gc, outputPath){
  const command = [
    `magick ${inputImage}`,
    '-resize 1200',
    text(gcFormater.title(gc), 30, 60, FONT_UNIFORM),
    text(gcFormater.schedulesInline(gc), 80, 40),
    text(gcFormater.contactsInline(gc), 160),
    text(gc.address?.text ?? '', 240),
    outputPath,
  ].join(' ')

  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) reject(error)
      else resolve(outputPath)
    })
  })
}

function rowToGc(row){
  return {
    id: row.id,
    name: row.name,
    contacts: row.data?.contacts ?? [],
    schedules: row.data?.schedules ?? [],
    address: {text: row.address_text ?? ''},
  }
}

async function uploadFile(filePath){
  const filename = path.basename(filePath)
  const buffer = fs.readFileSync(filePath)
  const {error} = await supabase.storage.from('gc-opengraph').upload(filename, buffer, {
    upsert: true,
    contentType: 'image/png',
  })
  if (error) throw new Error(`${filename}: ${error.message}`)
  console.log(`  ✓ ${filename}`)
}

async function main(){
  const {data: rows, error} = await supabase.from('gcs').select('*')
  if (error) {
    console.error('Failed to load gcs:', error)
    process.exit(1)
  }

  for (const row of rows) {
    const gc = rowToGc(row)
    const filename = `opengraph-${gc.id}.png`
    const outputPath = path.join(tmpDir, filename)
    try {
      await runMagick(gc, outputPath)
      await uploadFile(outputPath)
    } catch (ex) {
      console.error(`  ✗ ${gc.id}: ${ex.message}`)
    }
  }

  fs.rmSync(tmpDir, {recursive: true, force: true})
  console.log('Done.')
}

main()
