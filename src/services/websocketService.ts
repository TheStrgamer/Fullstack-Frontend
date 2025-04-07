export class WebSocketService {
    private socket: WebSocket | null = null;
    private socketUrl: string = '';
    private messages: Array<any> = [];
    private onMessageCallback: ((message: any) => void) | null = null;
  
    constructor(socketUrl: string) {
      this.socketUrl = socketUrl;
    }
  
    connect() {
      this.socket = new WebSocket(this.socketUrl);
  
      this.socket.onopen = () => {
        console.log("WebSocket connection established");
      };
  
      this.socket.onmessage = (event) => {
        console.log("Message received:", event.data);
        const message = JSON.parse(event.data);
        this.messages.push(message);
        if (this.onMessageCallback) {
          this.onMessageCallback(message);
        }
      };
  
      this.socket.onclose = () => {
        console.log("WebSocket connection closed");
      };
  
      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  
    sendMessage(message: any) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      }
    }
  
    getMessages() {
      return this.messages;
    }
  
    close() {
      if (this.socket) {
        this.socket.close();
      }
    }
  
    // Set callback for receiving messages
    onMessage(callback: (message: any) => void) {
      this.onMessageCallback = callback;
    }
  }
  