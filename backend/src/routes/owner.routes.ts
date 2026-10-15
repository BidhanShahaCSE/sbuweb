import { Router } from 'express';
import { OwnerAuthController } from '../controllers/ownerAuth.controller.js';
import { RequestHandler } from 'express';

export const createOwnerRouter = (
  ownerAuthController: OwnerAuthController,
  authMiddleware: RequestHandler,
  ownerMiddleware: RequestHandler
): Router => {
  const router = Router();

  // Strict server-side verification: User must be authenticated AND verified as active owner
  router.get('/me', authMiddleware, ownerMiddleware, ownerAuthController.getMe);

  return router;
};
