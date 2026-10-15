import { Request, Response, NextFunction } from 'express';
import { ClientAuthService } from '../services/clientAuth.service.js';

export class ClientAuthController {
  constructor(private readonly clientAuthService: ClientAuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.clientAuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Client account registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.clientAuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Client logged in successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';
      await this.clientAuthService.logout(token || '');
      res.status(200).json({
        success: true,
        message: 'Successfully logged out',
      });
    } catch (error) {
      next(error);
    }
  };
}
