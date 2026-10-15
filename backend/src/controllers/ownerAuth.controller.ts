import { Request, Response, NextFunction } from 'express';
import { OwnerAuthService } from '../services/ownerAuth.service.js';
import { UnauthorizedError } from '../errors/appError.js';

export class OwnerAuthController {
  constructor(private readonly ownerAuthService: OwnerAuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.ownerAuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Owner authenticated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const result = await this.ownerAuthService.getOwnerMe(req.user.id);
      res.status(200).json({
        success: true,
        data: {
          user: req.user,
          owner: result,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
