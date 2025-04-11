import { describe, it, expect, vi } from 'vitest';
import { toggleFavorite, checkFavoriteStatus, checkIfUserOwnsListing } from '../favoriteService';
import { postDataWithAuth, fetchDataWithAuth } from '../httpService';
import { AxiosHeaders } from 'axios';

vi.mock('../httpService');

describe('favoriteService', () => {
  describe('toggleFavorite', () => {
    it('should toggle favorite status and return the updated status', async () => {
      const mockResponse = {
        data: { isFavorited: true },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };
      vi.mocked(postDataWithAuth).mockResolvedValue(mockResponse);

      const result = await toggleFavorite(123);

      expect(postDataWithAuth).toHaveBeenCalledWith('users/favorites/toggle/123', {});
      expect(result).toBe(true);
    });

    it('should throw an error when toggleFavorite fails', async () => {
      vi.mocked(postDataWithAuth).mockRejectedValue(new Error('Failed to toggle favorite'));

      await expect(toggleFavorite(123)).rejects.toThrow('Failed to toggle favorite');
    });
  });

  describe('checkFavoriteStatus', () => {
    it('should return true if the listing is favorited', async () => {
      const mockResponse = {
        data: true,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };
      vi.mocked(fetchDataWithAuth).mockResolvedValue(mockResponse);

      const result = await checkFavoriteStatus(123);

      expect(fetchDataWithAuth).toHaveBeenCalledWith('users/favorites/check/123');
      expect(result).toBe(true);
    });

    it('should return false if an error occurs', async () => {
      vi.mocked(fetchDataWithAuth).mockRejectedValue(new Error('Network error'));

      const result = await checkFavoriteStatus(123);

      expect(fetchDataWithAuth).toHaveBeenCalledWith('users/favorites/check/123');
      expect(result).toBe(false);
    });
  });

  describe('checkIfUserOwnsListing', () => {
    it('should return true if the user owns the listing', async () => {
      const mockResponse = {
        data: true,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };
      vi.mocked(fetchDataWithAuth).mockResolvedValue(mockResponse);

      const result = await checkIfUserOwnsListing(123);

      expect(fetchDataWithAuth).toHaveBeenCalledWith('users/owns/123');
      expect(result).toBe(true);
    });

    it('should return false if an error occurs', async () => {
      vi.mocked(fetchDataWithAuth).mockRejectedValue(new Error('Network error'));

      const result = await checkIfUserOwnsListing(123);

      expect(fetchDataWithAuth).toHaveBeenCalledWith('users/owns/123');
      expect(result).toBe(false);
    });
  });
});