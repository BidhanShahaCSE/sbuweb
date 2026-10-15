import { Router } from 'express';
import { ClientAuthController } from '../controllers/clientAuth.controller.js';
import { OwnerAuthController } from '../controllers/ownerAuth.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import {
  clientRegisterSchema,
  clientLoginSchema,
  ownerLoginSchema,
} from '../schemas/auth.schemas.js';

export const createAuthRouter = (
  clientAuthController: ClientAuthController,
  ownerAuthController: OwnerAuthController
): Router => {
  const router = Router();

  // Client Authentication Routes
  router.post(
    '/client/register',
    validateBody(clientRegisterSchema),
    clientAuthController.register
  );

  router.post(
    '/client/login',
    validateBody(clientLoginSchema),
    clientAuthController.login
  );

  router.post(
    '/logout',
    clientAuthController.logout
  );

  // Owner Authentication Routes
  router.post(
    '/owner/login',
    validateBody(ownerLoginSchema),
    ownerAuthController.login
  );

  return router;
};
