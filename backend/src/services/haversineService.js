/**
 * Haversine Formula Utility for Seva Parivartan
 * Calculates spherical distance between two geographic coordinates (latitude and longitude) in kilometers.
 */

/**
 * Calculates distance between two points on Earth using Haversine formula
 * @param {number} lat1 Latitude of point 1 in degrees
 * @param {number} lon1 Longitude of point 1 in degrees
 * @param {number} lat2 Latitude of point 2 in degrees
 * @param {number} lon2 Longitude of point 2 in degrees
 * @returns {number} Distance in kilometers (rounded to 2 decimal places)
 */
export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 0;
  }

  const R = 6371; // Earth's mean radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
};

/**
 * Calculates match score bonus based on distance reduction
 * @param {number} currentDist Distance teacher currently travels
 * @param {number} targetDist Distance after mutual transfer
 * @returns {number} Efficiency score percentage (0-100%)
 */
export const calculateDistanceOptimization = (currentDist, targetDist) => {
  if (!currentDist || currentDist === 0) return 100;
  const reduction = ((currentDist - targetDist) / currentDist) * 100;
  return Math.max(0, Math.min(100, Math.round(reduction)));
};
