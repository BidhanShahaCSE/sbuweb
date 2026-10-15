import { Request, Response, NextFunction } from 'express';
import { ClientProfileService } from '../services/clientProfile.service.js';
import { UnauthorizedError } from '../errors/appError.js';

export class ClientProfileController {
  constructor(private readonly clientProfileService: ClientProfileService) {}

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const profile = await this.clientProfileService.getProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: {
          user: req.user,
          profile,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const updated = await this.clientProfileService.updateProfile(req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Client profile updated successfully',
        data: {
          user: req.user,
          profile: updated,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
