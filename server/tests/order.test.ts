import request from 'supertest';
import { app } from '../src/app';
import { connectDB } from '../src/config/db';
import { Menu } from '../src/models/Menu';
import { Order } from '../src/models/Order';
import mongoose from 'mongoose';

describe('Order API', () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await Order.deleteMany({});
    await Menu.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/orders', () => {
    it('should create a new order successfully', async () => {
      // Create test menu items
      const menuItem1 = await Menu.create({
        name: 'Pizza',
        description: 'Delicious pizza',
        price: 15.99,
        image: 'pizza.jpg',
      });

      const menuItem2 = await Menu.create({
        name: 'Burger',
        description: 'Tasty burger',
        price: 12.99,
        image: 'burger.jpg',
      });

      const orderData = {
        customer: {
          name: 'John Doe',
          address: '123 Main St',
          phone: '+1234567890',
        },
        items: [
          {
            menuItemId: menuItem1._id.toString(),
            quantity: 2,
          },
          {
            menuItemId: menuItem2._id.toString(),
            quantity: 1,
          },
        ],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orderId).toBeDefined();
      expect(response.body.data.status).toBe('Order Received');
      expect(response.body.data.total).toBe(44.97); // (15.99 * 2) + 12.99
    });

    it('should return validation error for invalid order data', async () => {
      const invalidOrderData = {
        customer: {
          name: '',
          address: '123 Main St',
          phone: 'invalid-phone',
        },
        items: [],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrderData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors).toBeDefined();
    });

    it('should return error for non-existent menu items', async () => {
      const orderData = {
        customer: {
          name: 'John Doe',
          address: '123 Main St',
          phone: '+1234567890',
        },
        items: [
          {
            menuItemId: new mongoose.Types.ObjectId().toString(),
            quantity: 1,
          },
        ],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return order details for valid order ID', async () => {
      const menuItem = await Menu.create({
        name: 'Pizza',
        description: 'Delicious pizza',
        price: 15.99,
        image: 'pizza.jpg',
      });

      const order = await Order.create({
        customer: {
          name: 'John Doe',
          address: '123 Main St',
          phone: '+1234567890',
        },
        items: [
          {
            menuItemId: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ],
        total: 15.99,
        status: 'Order Received',
      });

      const response = await request(app)
        .get(`/api/orders/${order._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(order._id.toString());
      expect(response.body.data.customer.name).toBe('John Doe');
    });

    it('should return 404 for non-existent order', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/orders/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order not found');
    });

    it('should return 400 for invalid order ID format', async () => {
      const response = await request(app)
        .get('/api/orders/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid ID format');
    });
  });
});