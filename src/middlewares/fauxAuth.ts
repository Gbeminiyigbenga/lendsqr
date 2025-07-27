import { Request, Response, NextFunction } from 'express';

export const fauxAuth = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ message: 'Missing faux token' });
  req.user = { id: parseInt(userId) };
  next();
};
