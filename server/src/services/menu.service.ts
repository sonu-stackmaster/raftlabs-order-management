import { MenuRepository } from '@/repositories/menu.repository';
import { IMenuItem } from '@/models/Menu';

export class MenuService {
  private menuRepository: MenuRepository;

  constructor() {
    this.menuRepository = new MenuRepository();
  }

  async getAllMenuItems(): Promise<IMenuItem[]> {
    return await this.menuRepository.findAll();
  }

  async getMenuItemById(id: string): Promise<IMenuItem | null> {
    return await this.menuRepository.findById(id);
  }

  async getMenuItemsByIds(ids: string[]): Promise<IMenuItem[]> {
    return await this.menuRepository.findByIds(ids);
  }

  async createMenuItem(menuData: Partial<IMenuItem>): Promise<IMenuItem> {
    return await this.menuRepository.create(menuData);
  }
}