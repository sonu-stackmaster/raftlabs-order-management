import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinOrder(orderId: string): void {
    if (this.socket) {
      this.socket.emit('join-order', orderId);
    }
  }

  leaveOrder(orderId: string): void {
    if (this.socket) {
      this.socket.emit('leave-order', orderId);
    }
  }

  onOrderStatusUpdate(callback: (data: { orderId: string; status: string; updatedAt: string }) => void): void {
    if (this.socket) {
      this.socket.on('order-status-updated', callback);
    }
  }

  offOrderStatusUpdate(): void {
    if (this.socket) {
      this.socket.off('order-status-updated');
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();