import { Router } from 'express';
import { OrderController } from '@/controllers/order.controller';
import { validateRequest, createOrderSchema, validateObjectId } from '@/middleware/validation.middleware';

const router = Router();
const orderController = new OrderController();

router.post('/', validateRequest(createOrderSchema), orderController.createOrder);
router.get('/:id', validateObjectId, orderController.getOrderById);
router.get('/', orderController.getAllOrders);

export { router as orderRoutes };