/**
 * OpenStreetMap Nominatim Geolocation Service for Seva Parivartan
 * Handles forward and reverse geocoding via OpenStreetMap API.
 */

/**
 * Reverse Geocode: Converts (lat, lon) coordinates into address metadata
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @returns {Promise<Object>} Address details (district, state, display_name)
 */
export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SevaParivartan-GovPortal/1.0 (contact@sevaparivartan.gov.in)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      displayName: data.display_name || 'Location Tagged',
      district: data.address?.state_district || data.address?.county || data.address?.city || 'Unknown District',
      state: data.address?.state || 'Unknown State',
      postcode: data.address?.postcode || '',
      raw: data,
    };
  } catch (error) {
    console.error('[Nominatim Service Error]', error.message);
    return {
      displayName: `Lat: ${lat}, Lon: ${lon}`,
      district: 'Selected District',
      state: 'Selected State',
      postcode: '',
      raw: null,
    };
  }
};

/**
 * Search Location: Forward Geocode search query
 * @param {string} query Address or District query string
 * @returns {Promise<Array>} Array of matching places with coordinates
 */
export const searchLocation = async (query) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SevaParivartan-GovPortal/1.0 (contact@sevaparivartan.gov.in)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim Search Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((item) => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      district: item.address?.state_district || item.address?.county || item.address?.city || '',
      state: item.address?.state || '',
    }));
  } catch (error) {
    console.error('[Nominatim Search Error]', error.message);
    return [];
  }
};
