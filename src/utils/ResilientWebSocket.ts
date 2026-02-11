export class ResilientWebSocket {
  private url: string;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private onMessage: (data: any) => void;

  constructor(url: string, onMessage: (data: any) => void) {
    this.url = url;
    this.onMessage = onMessage;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket Connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      this.onMessage(parsed);
    };

    this.ws.onclose = (event) => {
      console.log("Disconnected:", event.code);
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.ws?.close();
    };
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    setTimeout(() => this.connect(), delay);
  }

  public close() {
    this.ws?.close(1000);
  }
}
