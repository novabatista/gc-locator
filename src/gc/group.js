
/**
 * Sort GCs by distance from provided coordinates
 * @param {GC} gcsData - The GCs data object (from gcs.json)
 * @returns {Array} Sorted array of GCs with distances
 */
export function groupGCBySector(gcsData){
  return Object.values(gcsData).reduce((acc, gc) => {
    const sectorId = gc.sector.id
    if (!acc[sectorId]) {
      acc[sectorId] = []
    }
    acc[sectorId].push(gc)
    acc[sectorId].sort((a, b) => a.name.localeCompare(b.name))
    return acc
  }, {})
}

/**
 * Sort GCs by distance from provided coordinates
 * @param {GC} gcsData - The GCs data object (from gcs.json)
 * @returns {Array} Sorted array of GCs with distances
 */
export function groupGCBySectorFlat(gcsData){
  const groupedBySector = Object.values(groupGCBySector(gcsData))

  return groupedBySector.reduce((acc, gcs) => acc.concat(...gcs), [])
}