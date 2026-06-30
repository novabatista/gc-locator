const BUCKETS = {
  maps: 'gc-maps',
  qr: 'gc-qr',
  opengraph: 'gc-opengraph',
}

function publicUrl(bucket, path){
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  return `${base}/storage/v1/object/public/${bucket}/${path}`
}

/**
 * URL of the static map for a given GC.
 * @param {string} gcId
 * @param {'full'|'min'} [variant='full']
 */
export function getMapUrl(gcId, variant='full'){
  return publicUrl(BUCKETS.maps, `map-${gcId}-${variant}.png`)
}

/**
 * URL of the QR code image for a given GC.
 * @param {string} gcId
 */
export function getQrUrl(gcId){
  return publicUrl(BUCKETS.qr, `${gcId}.png`)
}

/**
 * URL of the OpenGraph preview image for a given GC.
 * @param {string} gcId
 */
export function getOgUrl(gcId){
  return publicUrl(BUCKETS.opengraph, `opengraph-${gcId}.png`)
}

export const STORAGE_BUCKETS = BUCKETS
