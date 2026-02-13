import { Menu, IMenuItem } from '@/models/Menu';
import { logger } from '@/utils/logger';

export class MenuRepository {
  async findAll(): Promise<IMenuItem[]> {
    try {
      return await Menu.find().sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Error fetching menu items:', error);
      throw new Error('Failed to fetch menu items');
    }
  }

  async findById(id: string): Promise<IMenuItem | null> {
    try {
      return await Menu.findById(id);
    } catch (error) {
      logger.error(`Error fetching menu item ${id}:`, error);
      throw new Error('Failed to fetch menu item');
    }
  }

  async findByIds(ids: string[]): Promise<IMenuItem[]> {
    try {
      return await Menu.find({ _id: { $in: ids } });
    } catch (error) {
      logger.error('Error fetching menu items by IDs:', error);
      throw new Error('Failed to fetch menu items');
    }
  }

  async create(menuData: Partial<IMenuItem>): Promise<IMenuItem> {
    try {
      const menu = new Menu(menuData);
      return await menu.save();
    } catch (error) {
      logger.error('Error creating menu item:', error);
      throw new Error('Failed to create menu item');
    }
  }
}