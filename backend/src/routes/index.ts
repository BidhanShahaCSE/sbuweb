import { Router } from 'express';
import {
  UnconfiguredAuthRepository,
  UnconfiguredClientProfileRepository,
  UnconfiguredOwnerAccountRepository,
} from '../repositories/unconfiguredRepositories.js';
import { ClientAuthService } from '../services/clientAuth.service.js';
import { OwnerAuthService } from '../services/ownerAuth.service.js';
import { ClientProfileService } from '../services/clientProfile.service.js';
import { ClientAuthController } from '../controllers/clientAuth.controller.js';
import { OwnerAuthController } from '../controllers/ownerAuth.controller.js';
import { ClientProfileController } from '../controllers/clientProfile.controller.js';
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { createOwnerMiddleware } from '../middlewares/owner.middleware.js';
import { createAuthRouter } from './auth.routes.js';
import { createClientProfileRouter } from './clientProfile.routes.js';
import { createOwnerRouter } from './owner.routes.js';

export const createApiRouter = (): Router => {
  const router = Router();

  // 1. Initialize Repositories (Replaceable with Supabase implementations upon integration)
  const authRepository = new UnconfiguredAuthRepository();
  const profileRepository = new UnconfiguredClientProfileRepository();
  const ownerRepository = new UnconfiguredOwnerAccountRepository();

  // 2. Initialize Services
  const clientAuthService = new ClientAuthService(authRepository, profileRepository);
  const ownerAuthService = new OwnerAuthService(authRepository, ownerRepository);
  const clientProfileService = new ClientProfileService(profileRepository);

  // 3. Initialize Controllers
  const clientAuthController = new ClientAuthController(clientAuthService);
  const ownerAuthController = new OwnerAuthController(ownerAuthService);
  const clientProfileController = new ClientProfileController(clientProfileService);

  // 4. Initialize Middlewares
  const authMiddleware = createAuthMiddleware(authRepository);
  const ownerMiddleware = createOwnerMiddleware(ownerRepository);

  // 5. Mount Sub-routers under /api/v1
  router.use('/auth', createAuthRouter(clientAuthController, ownerAuthController));
  router.use('/client', createClientProfileRouter(clientProfileController, authMiddleware));
  router.use('/owner', createOwnerRouter(ownerAuthController, authMiddleware, ownerMiddleware));

  // Health check endpoint
  router.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'sbuweb-backend',
      timestamp: new Date().toISOString(),
      supabaseConfigured: false,
    });
  });

  return router;
};
