import { connectDB } from '@/config/db';
import { Menu } from '@/models/Menu';
import { logger } from '@/utils/logger';

const sampleMenuItems = [
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh tomatoes, mozzarella cheese, and basil',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
  },
  {
    name: 'Chicken Burger',
    description: 'Grilled chicken breast with lettuce, tomato, and mayo on a brioche bun',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese, croutons, and caesar dressing',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
  },
  {
    name: 'Beef Tacos',
    description: 'Three soft tacos with seasoned ground beef, lettuce, cheese, and salsa',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  },
  {
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon, eggs, parmesan cheese, and black pepper',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
  },
  {
    name: 'Fish & Chips',
    description: 'Beer-battered cod with crispy fries and tartar sauce',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&h=300&fit=crop',
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with chocolate frosting and fresh berries',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
  },
  {
    name: 'Chicken Wings',
    description: 'Spicy buffalo wings served with celery sticks and blue cheese dip',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop',
  },
];

const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();
    
    // Clear existing menu items
    await Menu.deleteMany({});
    logger.info('Cleared existing menu items');
    
    // Insert sample menu items
    const createdItems = await Menu.insertMany(sampleMenuItems);
    logger.info(`Created ${createdItems.length} menu items`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();