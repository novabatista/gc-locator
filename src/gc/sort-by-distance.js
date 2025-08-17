/**
 * Sort GCs by distance from provided coordinates
 * @param {{lat:number, lng:number}} coord - Latitude & Longitude to sort from
 * @param {Object} gcsData - The GCs data object (from gcs.json)
 * @returns {Array} Sorted array of GCs with distances
 */
export default function sortGcsByDistance(coord) {
  const {lat, lng} = coord;
  const gcsArray = Object.values(gcsData).map(gc => {
    const distance = calculateDistance(
      lat,
      lng,
      gc.address.lat,
      gc.address.lng
    );

    return {
      ...gc,
      distance: distance
    };
  });

  const sortedGcs = gcsArray.sort((a, b) => a.distance - b.distance);

  return sortedGcs;
}