import { OrderRepository } from '@/repositories/order.repository';
import { MenuService } from './menu.service';
import { IOrder, IOrderItem, ICustomer } from '@/models/Order';
import { ORDER_STATUS, OrderStatus } from '@/utils/constants';
import { logger } from '@/utils/logger';

export interface CreateOrderRequest {
  customer: ICustomer;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
}

export class OrderService {
  private orderRepository: OrderRepository;
  private menuService: MenuService;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.menuService = new MenuService();
  }

  async createOrder(orderData: CreateOrderRequest): Promise<IOrder> {
    // Fetch menu items to get current prices and names
    const menuItemIds = orderData.items.map(item => item.menuItemId);
    const menuItems = await this.menuService.getMenuItemsByIds(menuItemIds);

    if (menuItems.length !== menuItemIds.length) {
      throw new Error('Some menu items not found');
    }

    // Create order items with current menu data (snapshot)
    const orderItems: IOrderItem[] = orderData.items.map(item => {
      const menuItem = menuItems.find(m => m._id.toString() === item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }

      return {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      };
    });

    // Calculate total
    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = await this.orderRepository.create({
      customer: orderData.customer,
      items: orderItems,
      total,
      status: ORDER_STATUS.ORDER_RECEIVED,
    });

    logger.info(`Order created: ${order._id}`);
    return order;
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    return await this.orderRepository.findById(id);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<IOrder | null> {
    const order = await this.orderRepository.updateStatus(id, status);
    if (order) {
      logger.info(`Order ${id} status updated to: ${status}`);
    }
    return order;
  }

  async getAllOrders(): Promise<IOrder[]> {
    return await this.orderRepository.findAll();
  }

  async getOrdersByStatus(status: OrderStatus): Promise<IOrder[]> {
    return await this.orderRepository.findByStatus(status);
  }
}