export class ResilientWebSocket<TMessage = unknown> {
  private url: string;
  private ws: WebSocket | null = null;

  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  private readonly BASE_DELAY = 1000;
  private readonly MAX_DELAY = 30000;

  private reconnectTimer: number | null = null;
  private manuallyClosed = false;

  private onMessage: (data: TMessage) => void;

  constructor(url: string, onMessage: (data: TMessage) => void) {
    this.url = url;
    this.onMessage = onMessage;
    this.connect();
  }

  private connect() {
    if (this.manuallyClosed) {
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket Connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as TMessage;
        this.onMessage(parsed);
      } catch (e) {
        console.error("Message parse error:", e);
      }
    };

    this.ws.onclose = (event) => {
      console.log("Disconnected:", event.code);

      if (!this.manuallyClosed) {
        this.reconnect();
      }
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

    const delay = Math.min(
      this.BASE_DELAY * 2 ** this.reconnectAttempts,
      this.MAX_DELAY,
    );

    this.reconnectAttempts++;

    this.reconnectTimer = window.setTimeout(() => {
      if (this.manuallyClosed) {
        return;
      }
      this.connect();
    }, delay);

    console.log(`Reconnecting in ${delay / 1000}s...`);
  }

  public close() {
    this.manuallyClosed = true;

    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.ws?.close(1000);
  }
}
