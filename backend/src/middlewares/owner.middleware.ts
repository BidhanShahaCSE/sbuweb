import { Request, Response, NextFunction } from 'express';
import { IOwnerAccountRepository } from '../repositories/interfaces.js';
import { ForbiddenError, UnauthorizedError } from '../errors/appError.js';

export const createOwnerMiddleware = (ownerRepository: IOwnerAccountRepository) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required before checking owner permissions');
      }

      // Strict server-side verification: check owner_accounts table
      const isOwner = await ownerRepository.isUserActiveOwner(req.user.id);
      if (!isOwner) {
        throw new ForbiddenError('Access forbidden: verified owner status is required');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
