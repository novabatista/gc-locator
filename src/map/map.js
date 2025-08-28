
export const EARTH_RADIUS_KM = 6371;

export const getMapStaticConfig = (overrides={})=>({
  version: '1.0',
  width: 1200,
  height: 280,
  zoom: 16,
  radius: 180,
  path:{
    weight: 3,
    color: '0x0078dbAA',
    fill: '0x0078db22',
  },
  ...overrides,
})

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

  const dLat = (destinationCoord.lat - sourceCoord.lat) * (Math.PI / 180);
  const dLng = (destinationCoord.lng - sourceCoord.lng) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(sourceCoord.lat * (Math.PI / 180)) * Math.cos(destinationCoord.lat * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c; // Distance in km

  return distance.toFixed(2);
}

/**
 * Generates a set of latitude and longitude points forming a circle around a given center point.
 *
 * @param {number} lat - The latitude of the center point in degrees.
 * @param {number} lng - The longitude of the center point in degrees.
 * @param {number} radiusInMeters - The radius of the circle in meters.
 * @param {number} [numPoints=40] - The number of points to generate along the circumference of the circle.
 * @return {string} A pipe-separated string of points, where each point is represented as "latitude,longitude".
 */
export function generateCirclePoints(lat, lng, radiusInMeters, numPoints = 40) {
  const earthRadius = EARTH_RADIUS_KM * 1000 // meters
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints;
    const dx = (radiusInMeters * Math.cos(angle)) / (earthRadius * Math.cos(lat * Math.PI / 180));
    const dy = (radiusInMeters * Math.sin(angle)) / earthRadius;

    const pointLat = lat + (dy * 180 / Math.PI);
    const pointLng = lng + (dx * 180 / Math.PI);

    points.push(`${pointLat},${pointLng}`);
  }

  return points.join('|');
}

export function generateStaticMapUrl(gc, config) {
  const { lat, lng } = gc.address.fake ?? gc.address;
  const circlePoints = generateCirclePoints(lat, lng, config.radius);

  return [
    'https://maps.googleapis.com/maps/api/staticmap',
    `?center=${lat},${lng}`,
    `&zoom=${config.zoom}`,
    `&size=${config.width}x${config.height}`,
    // `&markers=color:red|${lat},${lng}`,
    `&path=color:${config.path.color}|fillcolor:${config.path.fill}|weight:2|${circlePoints}`,
    `&key=${process.env.GOOGLE_MAPS_STATIC_KEY}`,
  ].join('');
}