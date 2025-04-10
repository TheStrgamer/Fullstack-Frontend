import { describe, it, expect, vi } from 'vitest';
import {
  fetchDataWithAuth,
  fetchDataWithoutAuth,
  postDataWithAuth,
  postDataWithoutAuth,
  deleteDataWithAuth,
} from '../httpService';
import axios from 'axios';

vi.mock('axios');

describe('httpService', () => {
  describe('fetchDataWithAuth', () => {
    it('should fetch data with authorization', async () => {
      const mockResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      sessionStorage.setItem('jwtToken', 'mockToken');
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const result = await fetchDataWithAuth('test-endpoint');

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/test-endpoint', {
        headers: {
          Authorization: 'Bearer mockToken',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if no token is found', async () => {
      sessionStorage.removeItem('jwtToken');

      await expect(fetchDataWithAuth('test-endpoint')).rejects.toThrow('No token found');
    });
  });

  describe('fetchDataWithoutAuth', () => {
    it('should fetch data without authorization', async () => {
      const mockResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const result = await fetchDataWithoutAuth('test-endpoint');

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/test-endpoint');
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when fetchDataWithoutAuth fails', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Failed to fetch data'));

      await expect(fetchDataWithoutAuth('test-endpoint')).rejects.toThrow('Failed to fetch data');
    });
  });

  describe('postDataWithAuth', () => {
    it('should post data with authorization', async () => {
      const mockResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      sessionStorage.setItem('jwtToken', 'mockToken');
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      const result = await postDataWithAuth('test-endpoint', { key: 'value' });

      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/test-endpoint', { key: 'value' }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mockToken',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when postDataWithAuth fails', async () => {
      sessionStorage.setItem('jwtToken', 'mockToken');
      vi.mocked(axios.post).mockRejectedValue(new Error('Failed to post data'));

      await expect(postDataWithAuth('test-endpoint', { key: 'value' })).rejects.toThrow('Failed to post data');
    });
  });

  describe('postDataWithoutAuth', () => {
    it('should post data without authorization', async () => {
      const mockResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      const result = await postDataWithoutAuth('test-endpoint', { key: 'value' });

      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/test-endpoint', { key: 'value' });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when postDataWithoutAuth fails', async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error('Failed to post data'));

      await expect(postDataWithoutAuth('test-endpoint', { key: 'value' })).rejects.toThrow('Failed to post data');
    });
  });

  describe('deleteDataWithAuth', () => {
    it('should delete data with authorization', async () => {
      const mockResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      sessionStorage.setItem('jwtToken', 'mockToken');
      vi.mocked(axios.delete).mockResolvedValue(mockResponse);

      const result = await deleteDataWithAuth('test-endpoint');

      expect(axios.delete).toHaveBeenCalledWith('http://localhost:8080/api/test-endpoint', {
        headers: {
          Authorization: 'Bearer mockToken',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when deleteDataWithAuth fails', async () => {
      sessionStorage.setItem('jwtToken', 'mockToken');
      vi.mocked(axios.delete).mockRejectedValue(new Error('Failed to delete data'));

      await expect(deleteDataWithAuth('test-endpoint')).rejects.toThrow('Failed to delete data');
    });
  });
});