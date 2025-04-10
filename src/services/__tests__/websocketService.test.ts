import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebSocketService } from '../websocketService';

describe('WebSocketService', () => {
  let mockWebSocket: any;
  let webSocketService: WebSocketService;

  beforeEach(() => {
    mockWebSocket = {
      send: vi.fn(),
      close: vi.fn(),
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
      readyState: WebSocket.OPEN,
    };

    vi.stubGlobal('WebSocket', vi.fn(() => mockWebSocket));

    webSocketService = new WebSocketService('ws://test-url');
  });

  it('should establish a WebSocket connection', () => {
    webSocketService.connect();

    expect(WebSocket).toHaveBeenCalledWith('ws://test-url');
    expect(mockWebSocket.onopen).not.toBeNull();
  });

  it('should send a message when the WebSocket is open', () => {
    webSocketService.connect();
    const message = { type: 'test', payload: 'data' };

    webSocketService.sendMessage(message);

    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(message));
  });

  it('should not send a message when the WebSocket is not open', () => {
    // Ensure the WebSocket is properly mocked with CLOSED readyState
    mockWebSocket.readyState = WebSocket.CLOSED;

    // Ensure the WebSocket is not reconnected in this test
    webSocketService.connect = vi.fn();

    const message = { type: 'test', payload: 'data' };

    webSocketService.sendMessage(message);

    expect(mockWebSocket.send).not.toHaveBeenCalled();
  });

  it('should close the WebSocket connection', () => {
    webSocketService.connect();
    webSocketService.close();

    expect(mockWebSocket.close).toHaveBeenCalled();
  });

  it('should call the onMessage callback when a message is received', () => {
    const callback = vi.fn();
    webSocketService.onMessage(callback);

    webSocketService.connect();

    const mockEvent = { data: JSON.stringify({ type: 'test', payload: 'data' }) };
    mockWebSocket.onmessage(mockEvent);

    expect(callback).toHaveBeenCalledWith({ type: 'test', payload: 'data' });
  });

  it('should store received messages', () => {
    webSocketService.connect();

    const mockEvent = { data: JSON.stringify({ type: 'test', payload: 'data' }) };
    mockWebSocket.onmessage(mockEvent);

    expect(webSocketService.getMessages()).toEqual([{ type: 'test', payload: 'data' }]);
  });
});