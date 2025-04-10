import { describe, it, expect, vi } from 'vitest';
import { addressToCoords, coordsToAddress } from '../geoCodingService';
import axios from 'axios';

vi.mock('axios');

describe('geoCodingService', () => {
  describe('addressToCoords', () => {
    it('should return coordinates for a valid address', async () => {
      const mockResponse = {
        data: [
          {
            lat: '59.9139',
            lon: '10.7522',
            address: {
              road: 'Karl Johans gate',
              house_number: '1',
              city: 'Oslo',
              postcode: '0154',
              country: 'Norway',
            },
          },
        ],
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const result = await addressToCoords('Karl Johans gate 1, Oslo');

      expect(axios.get).toHaveBeenCalledWith('https://nominatim.openstreetmap.org/search', {
        params: {
          q: 'Karl Johans gate 1, Oslo',
          format: 'json',
          addressdetails: 1,
          limit: 1,
        },
      });

      expect(result).toEqual({
        fullAddress: 'Karl Johans gate 1',
        area: '',
        city: 'Oslo',
        postnumber: '0154',
        country: 'Norway',
        latitude: '59.9139',
        longitude: '10.7522',
      });
    });

    it('should return null for an empty address', async () => {
      const result = await addressToCoords('');

      expect(result).toBeNull();
    });

    it('should throw an error when addressToCoords fails', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Failed to fetch coordinates'));

      await expect(() => addressToCoords('Karl Johans gate 1, Oslo')).rejects.toThrow('Failed to fetch coordinates');
    });
  });

  describe('coordsToAddress', () => {
    it('should return an address for valid coordinates', async () => {
      const mockResponse = {
        data: {
          lat: '59.9139',
          lon: '10.7522',
          address: {
            road: 'Karl Johans gate',
            house_number: '1',
            city: 'Oslo',
            postcode: '0154',
            country: 'Norway',
          },
        },
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const result = await coordsToAddress('59.9139', '10.7522');

      expect(axios.get).toHaveBeenCalledWith('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: '59.9139',
          lon: '10.7522',
          format: 'json',
          addressdetails: 1,
        },
      });

      expect(result).toEqual({
        fullAddress: 'Karl Johans gate 1',
        area: '',
        city: 'Oslo',
        postnumber: '0154',
        country: 'Norway',
        latitude: '59.9139',
        longitude: '10.7522',
      });
    });

    it('should return null for empty coordinates', async () => {
      const result = await coordsToAddress('', '');

      expect(result).toBeNull();
    });

    it('should throw an error when coordsToAddress fails', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Failed to fetch address'));

      await expect(() => coordsToAddress('59.9139', '10.7522')).rejects.toThrow('Failed to fetch address');
    });
  });
});