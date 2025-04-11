import { describe, it, expect, vi } from 'vitest';
import { fetchRecommendedItems, fetchRandomItems } from '../FeedService';
import { fetchDataWithoutAuth, fetchDataWithAuth } from '../httpService';
import { AxiosHeaders } from 'axios';

vi.mock('../httpService');

describe('FeedService', () => {
  describe('fetchRecommendedItems', () => {
    it('should fetch recommended items from the API', async () => {
      const mockResponse = {
        data: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };

      vi.mocked(fetchDataWithAuth).mockResolvedValue(mockResponse);

      const result = await fetchRecommendedItems(2);

      expect(fetchDataWithAuth).toHaveBeenCalledWith('listings/recommended?count=2', true);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when fetchRecommendedItems fails', async () => {
      vi.mocked(fetchDataWithAuth).mockRejectedValue(new Error('Failed to fetch recommended items'));

      await expect(fetchRecommendedItems(2)).rejects.toThrow('Failed to fetch recommended items');
    });
  });

  describe('fetchRandomItems', () => {
    it('should fetch random items from the API', async () => {
      const mockResponse = {
        data: [
          { id: 3, name: 'Item 3' },
          { id: 4, name: 'Item 4' },
        ],
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };

      vi.mocked(fetchDataWithoutAuth).mockResolvedValue(mockResponse);

      const result = await fetchRandomItems(2);

      expect(fetchDataWithoutAuth).toHaveBeenCalledWith('listings/random?count=2', true);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when fetchRandomItems fails', async () => {
      vi.mocked(fetchDataWithoutAuth).mockRejectedValue(new Error('Failed to fetch random items'));

      await expect(fetchRandomItems(2)).rejects.toThrow('Failed to fetch random items');
    });
  });
});