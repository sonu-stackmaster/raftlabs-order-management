import { Socket } from 'socket.io';
import { logger } from '@/utils/logger';
import { SOCKET_EVENTS } from '@/utils/constants';

export const setupOrderSocket = (socket: Socket): void => {
  socket.on(SOCKET_EVENTS.JOIN_ORDER, (orderId: string) => {
    if (!orderId || typeof orderId !== 'string') {
      logger.warn(`Invalid orderId received: ${orderId}`);
      return;
    }

    socket.join(orderId);
    logger.info(`Socket ${socket.id} joined order room: ${orderId}`);
    
    socket.emit('joined-order', { orderId });
  });

  socket.on('leave-order', (orderId: string) => {
    if (!orderId || typeof orderId !== 'string') {
      return;
    }

    socket.leave(orderId);
    logger.info(`Socket ${socket.id} left order room: ${orderId}`);
  });
};