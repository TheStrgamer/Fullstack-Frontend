import { describe, it, expect, vi, beforeEach } from 'vitest';
import { imageService } from '../imageService';
import { useUserStore } from '@/stores/UserStore.ts';
import { fetchDataWithoutAuth, postImages, putDataWithAuth } from '../httpService';
import { AxiosHeaders } from 'axios';
import { setActivePinia, createPinia } from 'pinia';

// Initialize Pinia for tests
setActivePinia(createPinia());

// Simplify userStoreMock to directly mock the required methods
const userStoreMock = {
  refreshTokenIfNeeded: vi.fn(),
};

vi.mock('@/stores/UserStore.ts', () => ({
  useUserStore: () => userStoreMock,
}));

vi.mock('../httpService', () => ({
  fetchDataWithoutAuth: vi.fn(),
  postImages: vi.fn(),
  putDataWithAuth: vi.fn(),
}));

describe('imageService', () => {
  beforeEach(() => {
    // No need for redundant vi.mocked call
  });

  describe('fetchImageFromAPI', () => {
    it('should fetch image data from the API', async () => {
      const mockResponse = {
        data: { imageUrl: 'http://example.com/image.jpg' },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };
      vi.mocked(fetchDataWithoutAuth).mockResolvedValue(mockResponse);

      const { fetchImageFromAPI } = imageService();
      const result = await fetchImageFromAPI('123');

      expect(fetchDataWithoutAuth).toHaveBeenCalledWith('images/get123');
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when fetchImageFromAPI fails', async () => {
      vi.mocked(fetchDataWithoutAuth).mockRejectedValue(new Error('Failed to fetch image'));

      const { fetchImageFromAPI } = imageService();
      await expect(fetchImageFromAPI('123')).rejects.toThrow('Failed to fetch image');
    });
  });

  describe('uploadImages', () => {
    it('should upload images and return the response data', async () => {
      const mockResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };
      vi.mocked(postImages).mockResolvedValue(mockResponse);

      const { uploadImages } = imageService();
      const result = await uploadImages({ image: 'data' });

      expect(userStoreMock.refreshTokenIfNeeded).toHaveBeenCalled();
      expect(postImages).toHaveBeenCalledWith('images/uploadListing', {});
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when uploadImages fails', async () => {
      vi.mocked(postImages).mockRejectedValue(new Error('Failed to upload images'));

      const { uploadImages } = imageService();
      await expect(uploadImages({ image: 'data' })).rejects.toThrow('Failed to upload images');
    });
  });

  describe('updateItem', () => {
    it('should update an item and return the response data', async () => {
      const mockResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };
      vi.mocked(putDataWithAuth).mockResolvedValue(mockResponse);

      const { updateItem } = imageService();
      const item = {
        id: '123',
        title: 'Test Item',
        category: 1,
        condition: 2,
        price: 100,
        sale_status: '1',
        brief_description: 'Short description',
        full_description: 'Full description',
        size: 'M',
        latitude: 59.9139,
        longitude: 10.7522,
      };

      const result = await updateItem(item);

      expect(userStoreMock.refreshTokenIfNeeded).toHaveBeenCalled();
      expect(putDataWithAuth).toHaveBeenCalledWith('listings/update/123', {
        title: 'Test Item',
        category_id: 1,
        condition_id: 2,
        price: 100,
        sale_status: 1,
        brief_description: 'Short description',
        full_description: 'Full description',
        size: 'M',
        updatedAt: expect.any(String),
        latitude: 59.9139,
        longitude: 10.7522,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when updateItem fails', async () => {
      vi.mocked(putDataWithAuth).mockRejectedValue(new Error('Failed to update item'));

      const { updateItem } = imageService();
      const item = {
        id: '123',
        title: 'Test Item',
        category: 1,
        condition: 2,
        price: 100,
        sale_status: '1',
        brief_description: 'Short description',
        full_description: 'Full description',
        size: 'M',
        latitude: 59.9139,
        longitude: 10.7522,
      };

      await expect(updateItem(item)).rejects.toThrow('Failed to update item');
    });
  });
});