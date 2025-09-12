import calculateDistance from '@/map/map'

/**
 * Sort GCs by distance from provided coordinates
 * @param {{lat:number, lng:number}} coord - Latitude & Longitude to sort from
 * @param {Object} gcsData - The GCs data object (from gcs.json)
 * @returns {Array} Sorted array of GCs with distances
 */
export function sortGcsByDistance(coord, gcsData) {
  const {lat, lng} = coord;
  const gcsArray = Object.values(gcsData).map(gc => {
    const distance = calculateDistance({lat, lng}, gc.address);

    return {
      ...gc,
      distance: distance
    };
  });

  const sortedGcs = gcsArray.sort((a, b) => a.distance - b.distance);

  return sortedGcs;
}

/**
 * Sort GCs by distance from provided coordinates
 * @param {{lat:number, lng:number}} coord - Latitude & Longitude to sort from
 * @param {number} maxRadiusKm
 * @param {Object} gcsData - The GCs data object (from gcs.json)
 * @returns {Array} Sorted array of GCs with distances
 */
export function sortGcsByDistanceWithRadius(coord, maxRadiusKm, gcsData) {
  const sortedByDistance = sortGcsByDistance(coord, gcsData);
  return sortedByDistance.filter(gc => gc.distance < maxRadiusKm)
}