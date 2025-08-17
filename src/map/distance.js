
/**
 * Calculate the distance between two points using the Haversine formula
 * @param {{lat:number, lng:number}} sourceCoord - Latitude & Longitude of source point
 * @param {{lat:number, lng:number}} destinationCoord - Latitude & Longitude of destination point
 * @returns {number} Distance in kilometers
 */
export default function calculateDistance(sourceCoord, destinationCoord) {
  if (destinationCoord.lat === 0 && destinationCoord.lng === 0) {
    return Infinity;
  }

  const R = 6371; // Radius of the Earth in km
  const dLat = (destinationCoord.lat - sourceCoord.lat) * (Math.PI / 180);
  const dLng = (destinationCoord.lng - sourceCoord.lng) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(sourceCoord.lat * (Math.PI / 180)) * Math.cos(destinationCoord.lat * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance.toFixed(2);
}