import { describe, it, expect, vi, beforeEach } from 'vitest';
import { itemServices } from '../itemService';
import { useUserStore } from '@/stores/UserStore.ts';
import { fetchDataWithoutAuth, postDataWithAuth, putDataWithAuth, deleteDataWithAuth } from '../httpService';
import { AxiosHeaders } from 'axios';

// Simplified userStoreMock to directly mock the required methods
const userStoreMock = {
  refreshTokenIfNeeded: vi.fn(),
};

vi.mock('@/stores/UserStore.ts', () => ({
  useUserStore: vi.fn(() => userStoreMock),
}));

vi.mock('../httpService', () => ({
  fetchDataWithoutAuth: vi.fn(),
  postDataWithAuth: vi.fn(),
  putDataWithAuth: vi.fn(),
  deleteDataWithAuth: vi.fn(),
}));

describe('itemServices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchItemFromAPI', () => {
    it('should fetch item data from the API', async () => {
      const mockResponse = {
        data: { id: '123', title: 'Test Item' },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };
      vi.mocked(fetchDataWithoutAuth).mockResolvedValue(mockResponse);

      const { fetchItemFromAPI } = itemServices();
      const result = await fetchItemFromAPI('123');

      expect(fetchDataWithoutAuth).toHaveBeenCalledWith('listings/id/123');
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when fetchItemFromAPI fails', async () => {
      vi.mocked(fetchDataWithoutAuth).mockRejectedValue(new Error('Failed to fetch item'));

      const { fetchItemFromAPI } = itemServices();
      await expect(fetchItemFromAPI('123')).rejects.toThrow('Failed to fetch item');
    });
  });

  describe('createItem', () => {
    it('should create an item and return the response data', async () => {
      const mockResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };
      vi.mocked(postDataWithAuth).mockResolvedValue(mockResponse);

      const { createItem } = itemServices();
      const item = {
        category: 1,
        condition: 2,
        title: 'Test Item',
        sale_status: '1',
        price: 100,
        brief_description: 'Short description',
        full_description: 'Full description',
        size: 'M',
        latitude: 59.9139,
        longitude: 10.7522,
      };

      const result = await createItem(item);

      expect(userStoreMock.refreshTokenIfNeeded).toHaveBeenCalled();
      expect(postDataWithAuth).toHaveBeenCalledWith('listings/create', {
        category: 1,
        condition: 2,
        title: 'Test Item',
        saleStatus: 1,
        price: 100,
        briefDescription: 'Short description',
        fullDescription: 'Full description',
        size: 'M',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        latitude: 59.9139,
        longitude: 10.7522,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when createItem fails', async () => {
      vi.mocked(postDataWithAuth).mockRejectedValue(new Error('Failed to create item'));

      const { createItem } = itemServices();
      const item = {
        category: 1,
        condition: 2,
        title: 'Test Item',
        sale_status: '1',
        price: 100,
        brief_description: 'Short description',
        full_description: 'Full description',
        size: 'M',
        latitude: 59.9139,
        longitude: 10.7522,
      };

      await expect(createItem(item)).rejects.toThrow('Failed to create item');
    });
  });

  describe('deleteItem', () => {
    it('should delete an item and return the response', async () => {
      const mockResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };
      vi.mocked(deleteDataWithAuth).mockResolvedValue(mockResponse);

      const { deleteItem } = itemServices();
      const result = await deleteItem('123');

      expect(deleteDataWithAuth).toHaveBeenCalledWith('listings/123/delete');
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors gracefully when deleteItem fails', async () => {
      vi.mocked(deleteDataWithAuth).mockRejectedValue(new Error('Failed to delete item'));

      const { deleteItem } = itemServices();
      const result = await deleteItem('123');

      expect(result).toBeUndefined();
    });
  });
});