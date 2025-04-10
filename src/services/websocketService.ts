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
        const rawData = event.data;
        
        if (rawData.startsWith("ADD MESSAGE ")) {
            const messageContent = rawData.substring("ADD MESSAGE ".length);
            try {
                const message = JSON.parse(messageContent);
                this.messages.push(message);
                if (this.onMessageCallback) {
                    this.onMessageCallback(message);
                }
            } catch (e) {
                console.error("Failed to parse message:", e);
            }
        } 
        else if (rawData.startsWith("UPDATE STATUS ")) {
            const updateParts = rawData.substring("UPDATE STATUS ".length).split(" TO ");
            if (updateParts.length === 2) {
                const offerId = parseInt(updateParts[0]);
                const status = parseInt(updateParts[1]);
                console.log(`Offer ${offerId} status updated to ${status}`);
            }
        } 
        else if (rawData.startsWith("CREATE OFFER ")) {
            // New offer created
            const offerString = rawData.substring("CREATE OFFER ".length);
            try {
                const offer = JSON.parse(offerString);
                console.log("New offer created:", offer);
            } catch (e) {
                console.error("Failed to parse offer:", e);
            }
        } 
        else {
            console.log("Unknown message type received:", rawData);
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

    onMessage(callback: (message: any) => void) {
      this.onMessageCallback = callback;
    }
  }
  