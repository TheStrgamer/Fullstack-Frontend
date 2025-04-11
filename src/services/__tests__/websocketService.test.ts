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

  it('should store received messages for different types', () => {
    webSocketService.connect();
  
    const addMessageEvent = { data: "ADD MESSAGE {\"type\": \"test\", \"payload\": \"data\"}" };
    mockWebSocket.onmessage(addMessageEvent);
  
    expect(webSocketService.getMessages()).toEqual([{ type: 'test', payload: 'data' }]);
  
    const updateOfferEvent = { data: "UPDATE OFFER 123 TO 1" };
    mockWebSocket.onmessage(updateOfferEvent);
  
    expect(webSocketService.getMessages()).toEqual([
      { type: 'test', payload: 'data' },
      { offerId: 123, isOffer: true, message: '', timestamp: expect.any(String), sentByMe: false, status: 1, price: "0", senderName: "System" }
    ]);
  
    const createOfferEvent = { data: "CREATE OFFER {\"offerId\": 456, \"updatedAt\": \"2025-04-11T10:31:44.235Z\", \"offeredByMe\": true, \"status\": 1, \"currentOffer\": \"100\", \"senderName\": \"Seller\"}" };
    mockWebSocket.onmessage(createOfferEvent);
  
    expect(webSocketService.getMessages()).toMatchObject([
      { type: 'test', payload: 'data' },
      {
        offerId: 123,
        isOffer: true,
        message: '',
        timestamp: expect.any(String),
        sentByMe: false,
        status: 1,
        price: "0",
        senderName: "System"
      },
      {
        offerId: 456,
        isOffer: true,
        message: '',
        timestamp: "11.4.2025, 12:31:44",
        sentByMe: true,
        status: 1,
        price: "100",
        senderName: "Seller"
      }
    ]);
    
  });
  
})
  