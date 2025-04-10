/// <reference types="vitest" />

import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import { getJwtToken } from '../authService';
import { postDataWithoutAuth } from '../httpService';

vi.mock('../httpService', () => ({
  postDataWithoutAuth: vi.fn(),
}));

describe('authService', () => {
  describe('getJwtToken', () => {
    it('should return a token and expiration when login is successful', async () => {
      const mockResponse = {
        data: {
          token: 'mockToken',
          expiration: 1234567890,
        },
      };

      (postDataWithoutAuth as Mock).mockResolvedValue(mockResponse);

      const email = 'test@example.com';
      const password = 'password123';

      const result = await getJwtToken(email, password);

      expect(result).toEqual(mockResponse.data);
      expect(postDataWithoutAuth).toHaveBeenCalledWith('users/login', { email, password });
    });

    it('should throw an error when login fails', async () => {
      (postDataWithoutAuth as Mock).mockRejectedValue(new Error('Login Failed!'));

      const email = 'test@example.com';
      const password = 'wrongpassword';

      await expect(getJwtToken(email, password)).rejects.toThrow('Login Failed!');
      expect(postDataWithoutAuth).toHaveBeenCalledWith('users/login', { email, password });
    });

    it('should throw an error when response data is missing', async () => {
      (postDataWithoutAuth as Mock).mockResolvedValue(null);

      const email = 'test@example.com';
      const password = 'password123';

      await expect(getJwtToken(email, password)).rejects.toThrow('Login Failed!');
      expect(postDataWithoutAuth).toHaveBeenCalledWith('users/login', { email, password });
    });

    it('should throw an error when email is missing', async () => {
      const email = '';
      const password = 'password123';

      await expect(getJwtToken(email, password)).rejects.toThrow('Email is required');
      expect(postDataWithoutAuth).not.toHaveBeenCalled();
    });

    it('should throw an error when password is missing', async () => {
      const email = 'test@example.com';
      const password = '';

      await expect(getJwtToken(email, password)).rejects.toThrow('Password is required');
      expect(postDataWithoutAuth).not.toHaveBeenCalled();
    });

    it('should throw an error when both email and password are missing', async () => {
      const email = '';
      const password = '';

      await expect(getJwtToken(email, password)).rejects.toThrow('Email and password are required');
      expect(postDataWithoutAuth).not.toHaveBeenCalled();
    });
  });
});