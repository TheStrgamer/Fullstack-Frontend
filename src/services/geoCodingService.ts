// api documentation: https://nominatim.org/release-docs/develop/api/Overview/
import axios from 'axios';

export interface GeocodeResult {
  fullAddress: string;
  area: string;
  city: string;
  postnumber: string;
  country: string;
  latitude: string;
  longitude: string;
}

export async function addressToCoords(address: string): Promise<GeocodeResult | null> {
  if (!address.trim()) {
    alert('Please enter an address.');
    return null;
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1,
        limit: 1,
      },
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return unpackAddressComponents(result);
    } else {
      throw new Error('No results found.');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw new Error('Failed to fetch coordinates.');
  }
}

export async function coordsToAddress(latitude: string, longitude: string): Promise<GeocodeResult | null> {
  if (!latitude.trim() || !longitude.trim()) {
    alert('Please enter both latitude and longitude.');
    return null;
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1,
      },
    });

    if (response.data) {
      return unpackAddressComponents(response.data);
    } else {
      throw new Error('No results found.');
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    throw new Error('Failed to fetch address.');
  }
}

function unpackAddressComponents(result: any): GeocodeResult {
  if (!result || !result.address) {
    console.error('Invalid result format:', result);
    return {
      fullAddress: '',
      area: '',
      city: '',
      postnumber: '',
      country: '',
      latitude: '',
      longitude: '',
    };
  }

  const address = result.address;
  const street = address.road || address.street || address.neighbourhood || address.suburb || '';
  const number = address.house_number || address.building || address.apartment || '';
  const fullAddress = street ? `${street} ${number}`.trim() : '';
  const area = address.state || address.region || address.county || '';
  const city = address.city || address.town || address.village || address.municipality || '';
  const postnumber = address.postcode || '';
  const country = address.country || '';
  const latitude = result.lat || '';
  const longitude = result.lon || '';

  return {
    fullAddress,
    area,
    city,
    postnumber,
    country,
    latitude,
    longitude,
  };
}
