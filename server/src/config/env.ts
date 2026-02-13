import dotenv from 'dotenv';
import path from 'path';

// Load .env from server directory first, then root directory as fallback
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

export const validateEnv = () => {
  const required = ['MONGODB_URI'];
  
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
};