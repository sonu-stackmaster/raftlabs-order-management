import { Request, Response } from 'express';
import { OrderService } from '@/services/order.service';
import { asyncHandler } from '@/middleware/error.middleware';
import { startOrderStatusProgression } from '@/jobs/orderStatus.job';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const order = await this.orderService.createOrder(req.body);
    
    // Start the status progression job
    startOrderStatusProgression(order._id.toString());
    
    return res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        status: order.status,
        total: order.total,
      },
    });
  });

  getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await this.orderService.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    
    return res.json({
      success: true,
      data: order,
    });
  });

  getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await this.orderService.getAllOrders();
    
    return res.json({
      success: true,
      data: orders,
    });
  });
}