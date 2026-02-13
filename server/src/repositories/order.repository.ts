import { Order, IOrder } from '@/models/Order';
import { OrderStatus } from '@/utils/constants';
import { logger } from '@/utils/logger';

export class OrderRepository {
  async create(orderData: Partial<IOrder>): Promise<IOrder> {
    try {
      const order = new Order(orderData);
      return await order.save();
    } catch (error) {
      logger.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async findById(id: string): Promise<IOrder | null> {
    try {
      return await Order.findById(id);
    } catch (error) {
      logger.error(`Error fetching order ${id}:`, error);
      throw new Error('Failed to fetch order');
    }
  }

  async updateStatus(id: string, status: OrderStatus): Promise<IOrder | null> {
    try {
      return await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    } catch (error) {
      logger.error(`Error updating order ${id} status:`, error);
      throw new Error('Failed to update order status');
    }
  }

  async findByStatus(status: OrderStatus): Promise<IOrder[]> {
    try {
      return await Order.find({ status }).sort({ createdAt: -1 });
    } catch (error) {
      logger.error(`Error fetching orders with status ${status}:`, error);
      throw new Error('Failed to fetch orders');
    }
  }

  async findAll(): Promise<IOrder[]> {
    try {
      return await Order.find().sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Error fetching all orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }
}