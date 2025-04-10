import { describe, it, expect, vi } from 'vitest';
import { fetchActiveChats, fetchConversation, startConversation } from '../chatService';
import { fetchDataWithAuth, postDataWithAuth } from '../httpService';
import type { AxiosResponse } from 'axios';
import { AxiosHeaders } from 'axios';

vi.mock('../httpService');

describe('chatService', () => {
  describe('fetchActiveChats', () => {
    it('should fetch and format active chats correctly', async () => {
      const mockResponse: AxiosResponse = {
        data: [
          {
            id: 1,
            other_user_name: 'John Doe',
            other_user_picture: 'avatar.png',
            last_message: 'Hello!',
            last_update: '2025-04-10T10:00:00Z',
          },
        ],
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };

      vi.mocked(fetchDataWithAuth).mockResolvedValue(mockResponse);

      const result = await fetchActiveChats();

      expect(result).toEqual([
        {
          id: 1,
          name: 'John Doe',
          avatar: 'avatar.png',
          lastMessage: 'Hello!',
          timestamp: '10.4.2025, 12:00',
        },
      ]);
    });

    it('should throw an error when fetchActiveChats fails', async () => {
      vi.mocked(fetchDataWithAuth).mockRejectedValue(new Error('Failed to fetch active chats'));

      await expect(fetchActiveChats()).rejects.toThrow('Failed to fetch active chats');
    });
  });

  describe('fetchConversation', () => {
    it('should fetch and format conversation messages correctly', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          id: 1,
          other_user_name: 'John Doe',
          other_user_picture: 'avatar.png',
          messages: [
            {
              id: 1,
              text: 'Hi!',
              sendtAt: '2025-04-10T10:00:00Z',
              sendtBySelf: true,
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };

      vi.mocked(fetchDataWithAuth).mockResolvedValue(mockResponse);

      const result = await fetchConversation(1);

      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        picture: 'avatar.png',
        messages: [
          {
            id: 1,
            message: 'Hi!',
            timestamp: '10.4.2025, 12:00',
            sentByMe: true,
          },
        ],
      });
    });

    it('should throw an error when fetchConversation fails', async () => {
      vi.mocked(fetchDataWithAuth).mockRejectedValue(new Error('Failed to fetch conversation'));

      await expect(fetchConversation(1)).rejects.toThrow('Failed to fetch conversation');
    });
  });

  describe('startConversation', () => {
    it('should start a conversation and return the response data', async () => {
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };

      vi.mocked(postDataWithAuth).mockResolvedValue(mockResponse);

      const result = await startConversation(123);

      expect(result).toEqual({ success: true });
    });

    it('should throw an error when startConversation fails', async () => {
      vi.mocked(postDataWithAuth).mockRejectedValue(new Error('Failed to start conversation'));

      await expect(startConversation(123)).rejects.toThrow('Failed to start conversation');
    });
  });
});