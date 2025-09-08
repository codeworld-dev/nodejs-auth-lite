


import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '../logger';
import config from "../config";
interface UserPayload extends JwtPayload {
  username: string;  
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    logger.warn('Access Denied. No token provided.');
    res.status(401).json({ error: 'Access Denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, (config.jwtSecret, 'base64')) as UserPayload;

    req.user = decoded;
    logger.info(`Token decoded successfully: ${JSON.stringify(decoded)}`);
    next();
  } catch (error) {
    logger.error('Token verification error', error instanceof Error ? error.message : error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default verifyToken;
