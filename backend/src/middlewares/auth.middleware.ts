import { Request, Response, NextFunction } from 'express';
import { IAuthRepository } from '../repositories/interfaces.js';
import { UnauthorizedError } from '../errors/appError.js';

export const createAuthMiddleware = (authRepository: IAuthRepository) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authorization header missing or format must be Bearer <token>');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedError('Bearer token is empty');
      }

      // Validates token against auth provider (throws 503 if provider unconfigured)
      const user = await authRepository.validateToken(token);
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
