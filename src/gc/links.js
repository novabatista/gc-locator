export const LINK_TYPES = {
  facebook:  {key: 'facebook',  label: 'Facebook',  icon: 'uil uil-facebook'},
  instagram: {key: 'instagram', label: 'Instagram', icon: 'uil uil-instagram'},
  tiktok:    {key: 'tiktok',    label: 'TikTok',    icon: 'uil uil-music'},
  web:       {key: 'web',       label: 'Site',      icon: 'uil uil-globe'},
}

export const LINK_TYPE_KEYS = Object.keys(LINK_TYPES)

/**
 * Build the persisted links array from a key→url map.
 * Empty/blank URLs are skipped.
 * @param {Object.<string,string>} urlsByKey
 * @returns {Array<{label:string,url:string,icon:string,key:string}>}
 */
export function buildLinksFromUrls(urlsByKey){
  return LINK_TYPE_KEYS
    .map(key => {
      const url = (urlsByKey?.[key] ?? '').trim()
      if(!url) return null
      const meta = LINK_TYPES[key]
      return {key, label: meta.label, icon: meta.icon, url}
    })
    .filter(Boolean)
}

/**
 * Reverse: convert a persisted links array into a key→url map for the form.
 * Links with unknown labels are ignored.
 * @param {Array<{label:string,url:string}>} links
 * @returns {Object.<string,string>}
 */
export function urlsByKeyFromLinks(links){
  const result = {}
  for (const key of LINK_TYPE_KEYS) result[key] = ''
  if (!Array.isArray(links)) return result

  const labelToKey = Object.fromEntries(
    Object.values(LINK_TYPES).map(t => [t.label.toLowerCase(), t.key])
  )

  for (const link of links) {
    const key = link?.key ?? labelToKey[link?.label?.toLowerCase()]
    if (key && key in result) result[key] = link.url ?? ''
  }
  return result
}
