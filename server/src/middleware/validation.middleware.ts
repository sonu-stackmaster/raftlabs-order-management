import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '@/utils/logger';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      logger.warn('Validation error:', error.details);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
      return;
    }
    
    next();
  };
};

export const createOrderSchema = Joi.object({
  customer: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    address: Joi.string().trim().min(1).max(500).required(),
    phone: Joi.string().trim().pattern(/^[\+]?[1-9][\d]{0,15}$/).required(),
  }).required(),
  items: Joi.array().items(
    Joi.object({
      menuItemId: Joi.string().hex().length(24).required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
});

export const validateObjectId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
    return;
  }
  
  next();
};