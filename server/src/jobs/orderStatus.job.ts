import { OrderService } from '@/services/order.service';
import { ORDER_STATUS, STATUS_PROGRESSION_DELAYS } from '@/utils/constants';
import { logger } from '@/utils/logger';
import { getSocketInstance } from '@/sockets';
import { SOCKET_EVENTS } from '@/utils/constants';

const orderService = new OrderService();

export const startOrderStatusProgression = (orderId: string): void => {
  logger.info(`Starting status progression for order: ${orderId}`);

  // Progress to "Preparing" after 5 seconds
  setTimeout(async () => {
    try {
      const order = await orderService.updateOrderStatus(orderId, ORDER_STATUS.PREPARING);
      if (order) {
        const io = getSocketInstance();
        io.to(orderId).emit(SOCKET_EVENTS.ORDER_STATUS_UPDATED, {
          orderId,
          status: order.status,
          updatedAt: order.updatedAt,
        });
      }
    } catch (error) {
      logger.error(`Failed to update order ${orderId} to Preparing:`, error);
    }
  }, STATUS_PROGRESSION_DELAYS[ORDER_STATUS.ORDER_RECEIVED]);

  // Progress to "Out for Delivery" after 10 seconds total
  setTimeout(async () => {
    try {
      const order = await orderService.updateOrderStatus(orderId, ORDER_STATUS.OUT_FOR_DELIVERY);
      if (order) {
        const io = getSocketInstance();
        io.to(orderId).emit(SOCKET_EVENTS.ORDER_STATUS_UPDATED, {
          orderId,
          status: order.status,
          updatedAt: order.updatedAt,
        });
      }
    } catch (error) {
      logger.error(`Failed to update order ${orderId} to Out for Delivery:`, error);
    }
  }, STATUS_PROGRESSION_DELAYS[ORDER_STATUS.ORDER_RECEIVED] + STATUS_PROGRESSION_DELAYS[ORDER_STATUS.PREPARING]);

  // Progress to "Delivered" after 15 seconds total
  setTimeout(async () => {
    try {
      const order = await orderService.updateOrderStatus(orderId, ORDER_STATUS.DELIVERED);
      if (order) {
        const io = getSocketInstance();
        io.to(orderId).emit(SOCKET_EVENTS.ORDER_STATUS_UPDATED, {
          orderId,
          status: order.status,
          updatedAt: order.updatedAt,
        });
      }
    } catch (error) {
      logger.error(`Failed to update order ${orderId} to Delivered:`, error);
    }
  }, STATUS_PROGRESSION_DELAYS[ORDER_STATUS.ORDER_RECEIVED] + STATUS_PROGRESSION_DELAYS[ORDER_STATUS.PREPARING] + STATUS_PROGRESSION_DELAYS[ORDER_STATUS.OUT_FOR_DELIVERY]);
};