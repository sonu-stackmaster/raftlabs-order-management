import { Request, Response } from 'express';
import { MenuService } from '@/services/menu.service';
import { asyncHandler } from '@/middleware/error.middleware';

export class MenuController {
  private menuService: MenuService;

  constructor() {
    this.menuService = new MenuService();
  }

  getMenuItems = asyncHandler(async (req: Request, res: Response) => {
    const menuItems = await this.menuService.getAllMenuItems();
    
    return res.json({
      success: true,
      data: menuItems,
    });
  });

  getMenuItemById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const menuItem = await this.menuService.getMenuItemById(id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }
    
    return res.json({
      success: true,
      data: menuItem,
    });
  });

  createMenuItem = asyncHandler(async (req: Request, res: Response) => {
    const menuItem = await this.menuService.createMenuItem(req.body);
    
    return res.status(201).json({
      success: true,
      data: menuItem,
    });
  });
}