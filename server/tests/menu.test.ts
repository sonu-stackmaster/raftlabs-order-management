import request from 'supertest';
import { app } from '../src/app';
import { connectDB } from '../src/config/db';
import { Menu } from '../src/models/Menu';
import mongoose from 'mongoose';

describe('Menu API', () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await Menu.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/menu', () => {
    it('should return empty array when no menu items exist', async () => {
      const response = await request(app)
        .get('/api/menu')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all menu items', async () => {
      await Menu.create([
        {
          name: 'Pizza',
          description: 'Delicious pizza',
          price: 15.99,
          image: 'pizza.jpg',
        },
        {
          name: 'Burger',
          description: 'Tasty burger',
          price: 12.99,
          image: 'burger.jpg',
        },
      ]);

      const response = await request(app)
        .get('/api/menu')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBeDefined();
      expect(response.body.data[0].price).toBeDefined();
    });
  });

  describe('GET /api/menu/:id', () => {
    it('should return menu item for valid ID', async () => {
      const menuItem = await Menu.create({
        name: 'Pizza',
        description: 'Delicious pizza',
        price: 15.99,
        image: 'pizza.jpg',
      });

      const response = await request(app)
        .get(`/api/menu/${menuItem._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Pizza');
      expect(response.body.data.price).toBe(15.99);
    });

    it('should return 404 for non-existent menu item', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/menu/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Menu item not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/menu/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid ID format');
    });
  });
});