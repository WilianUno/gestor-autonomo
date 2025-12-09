import { Request, Response, NextFunction } from 'express';

export const logMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const route = req.originalUrl;
  
  console.log(`[${timestamp}] ${method} ${route}`);
  
  next();
};