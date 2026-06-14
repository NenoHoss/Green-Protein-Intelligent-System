import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Stable and Robust SafeWebSocket wrapper around the native browser WebSocket implementation
const OriginalWebSocket = typeof window !== 'undefined' ? window.WebSocket : null;

export class SafeWebSocket {
  private socket: WebSocket | null = null;

  constructor(url: string | URL, protocols?: string | string[]) {
    if (OriginalWebSocket) {
      try {
        this.socket = new OriginalWebSocket(url, protocols);
        this.socket.addEventListener('error', (event) => {
          console.warn("[SafeWebSocket] Native connection event error handled gracefully:", event);
        });
      } catch (err) {
        console.warn("[SafeWebSocket] Native creation exception intercepted:", err);
      }
    } else {
      console.warn("[SafeWebSocket] Native WebSocket is not available in the current context.");
    }
  }

  get readyState(): number {
    return this.socket ? this.socket.readyState : 3; // 3 represents WebSocket.CLOSED
  }

  get url(): string {
    return this.socket ? this.socket.url : '';
  }

  get protocol(): string {
    return this.socket ? this.socket.protocol : '';
  }

  get extensions(): string {
    return this.socket ? this.socket.extensions : '';
  }

  get bufferedAmount(): number {
    return this.socket ? this.socket.bufferedAmount : 0;
  }

  get binaryType(): BinaryType {
    return this.socket ? this.socket.binaryType : 'blob';
  }

  set binaryType(value: BinaryType) {
    if (this.socket) {
      this.socket.binaryType = value;
    }
  }

  get onopen() { return this.socket ? this.socket.onopen : null; }
  set onopen(val) { if (this.socket) this.socket.onopen = val; }

  get onclose() { return this.socket ? this.socket.onclose : null; }
  set onclose(val) { if (this.socket) this.socket.onclose = val; }

  get onerror() { return this.socket ? this.socket.onerror : null; }
  set onerror(val) { if (this.socket) this.socket.onerror = val; }

  get onmessage() { return this.socket ? this.socket.onmessage : null; }
  set onmessage(val) { if (this.socket) this.socket.onmessage = val; }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    if (this.socket && this.socket.readyState === 1) { // 1 represents WebSocket.OPEN
      try {
        this.socket.send(data);
      } catch (err) {
        console.warn("[SafeWebSocket] Intercepted native send exception:", err);
      }
    } else {
      console.info("[SafeWebSocket] Send call skipped. Current readyState:", this.readyState);
    }
  }

  close(code?: number, reason?: string): void {
    if (this.socket) {
      const state = this.socket.readyState;
      if (state === 1 || state === 0) { // OPEN or CONNECTING
        try {
          this.socket.close(code, reason);
        } catch (err) {
          console.warn("[SafeWebSocket] Intercepted native close exception:", err);
        }
      } else {
        console.info("[SafeWebSocket] Close command ignored. Socket already closed or closing.");
      }
    }
  }

  addEventListener<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (this.socket) {
      this.socket.addEventListener(type, listener as any, options);
    }
  }

  removeEventListener<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void {
    if (this.socket) {
      this.socket.removeEventListener(type, listener as any, options);
    }
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
