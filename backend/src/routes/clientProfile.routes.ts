import { Router } from 'express';
import { ClientProfileController } from '../controllers/clientProfile.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { updateClientProfileSchema } from '../schemas/auth.schemas.js';
import { RequestHandler } from 'express';

export const createClientProfileRouter = (
  clientProfileController: ClientProfileController,
  authMiddleware: RequestHandler
): Router => {
  const router = Router();

  // Protect all client profile routes with authentication
  router.use(authMiddleware);

  router.get('/profile', clientProfileController.getProfile);
  router.patch(
    '/profile',
    validateBody(updateClientProfileSchema),
    clientProfileController.updateProfile
  );

  return router;
};
