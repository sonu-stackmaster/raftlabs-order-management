import { Router } from 'express';
import { MenuController } from '@/controllers/menu.controller';
import { validateObjectId } from '@/middleware/validation.middleware';

const router = Router();
const menuController = new MenuController();

router.get('/', menuController.getMenuItems);
router.get('/:id', validateObjectId, menuController.getMenuItemById);
router.post('/', menuController.createMenuItem);

export { router as menuRoutes };