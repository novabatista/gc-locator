import {unstable_cache} from 'next/cache'
import {createClient} from '@supabase/supabase-js'
import {SECTORS} from '@/gc/sectors'

const CACHE_TAG = 'gcs'
const tagFor = (id) => `gc:${id}`

let supabase

function getClient(){
  if (supabase) return supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Supabase env vars not set (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  }
  supabase = createClient(url, key, {
    auth: {persistSession: false, autoRefreshToken: false},
  })
  return supabase
}

function hydrateDescription(value){
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    return value.length ? value.split(/\n{2,}/) : []
  }
  return []
}

/**
 * Convert a DB row back into the GC shape consumers expect.
 * Injects derived fields (sector.name, config.color) and normalizes description into array form.
 */
function hydrate(row){
  if (!row) return null
  const sectorMeta = SECTORS[row.sector_id] ?? {id: row.sector_id, name: row.sector_id, color: '#000000'}
  const data = row.data ?? {}

  return {
    id: row.id,
    name: row.name,
    sheetId: row.sheet_id ?? undefined,
    sector: {id: sectorMeta.id, name: sectorMeta.name},
    config: {
      ...(data.config ?? {}),
      color: {primary: sectorMeta.color},
    },
    address: {
      text: row.address_text ?? '',
      street_number: data.address?.street_number ?? null,
      complement: data.address?.complement ?? '',
      lat: data.address?.lat ?? 0,
      lng: data.address?.lng ?? 0,
      ...(data.address?.fake ? {fake: data.address.fake} : {}),
    },
    contacts: data.contacts ?? [],
    schedules: Array.isArray(data.schedules) ? data.schedules : [],
    links: Array.isArray(data.links) ? data.links : [],
    images: Array.isArray(data.images) ? data.images : [],
    description: hydrateDescription(data.description),
  }
}

async function fetchAllRows(){
  const {data, error} = await getClient().from('gcs').select('*').order('name')
  if (error) {
    console.error('Supabase fetch gcs failed:', error)
    return []
  }
  return data
}

async function fetchOneRow(id){
  const {data, error} = await getClient().from('gcs').select('*').eq('id', id).maybeSingle()
  if (error) {
    console.error(`Supabase fetch gc ${id} failed:`, error)
    return null
  }
  return data
}

const getAllCached = unstable_cache(
  async () => fetchAllRows(),
  ['gcs:all'],
  {tags: [CACHE_TAG]}
)

const getOneCached = (id) => unstable_cache(
  async () => fetchOneRow(id),
  ['gcs:one', id],
  {tags: [CACHE_TAG, tagFor(id)]}
)()

/**
 * Get all GCs (hydrated with derived fields).
 * @returns {Promise<Array>}
 */
async function all(){
  const rows = await getAllCached()
  return rows.map(hydrate)
}

/**
 * Fetch a specific GC by ID.
 * @param {string} gcId
 * @returns {Promise<Object|undefined>}
 */
async function find(gcId){
  if (!gcId) return undefined
  const row = await getOneCached(gcId)
  return row ? hydrate(row) : undefined
}

/**
 * Check if a GC exists.
 * @param {string} gcId
 * @returns {Promise<boolean>}
 */
async function exists(gcId){
  const gc = await find(gcId)
  return !!gc
}

/**
 * Get all GCs keyed by id (raw-like, but hydrated).
 * @returns {Promise<Object>}
 */
async function raw(){
  const rows = await getAllCached()
  const obj = {}
  for (const row of rows) {
    obj[row.id] = hydrate(row)
  }
  return obj
}

const db = {
  raw,
  all,
  find,
  exists,
}

export default db
export {CACHE_TAG, tagFor}
