import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import { createApiRouter } from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { NotFoundError } from './errors/appError.js';

export const createApp = (): Application => {
  const app = express();

  // 1. Security & utility middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: config.CLIENT_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  if (config.NODE_ENV !== 'test') {
    app.use(morgan(config.NODE_ENV === 'development' ? 'dev' : 'combined'));
  }

  // 2. Body parser
  app.use(express.json({ limit: '10kb' }));

  // 3. API Routes
  app.use('/api/v1', createApiRouter());

  // 4. Root ping
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      message: 'sbuweb Backend API is operational',
      version: 'v1',
      docs: '/api/v1/health',
    });
  });

  // 5. Handle unmatched 404 routes
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError(`Endpoint not found: ${req.method} ${req.originalUrl}`));
  });

  // 6. Global error handler
  app.use(errorHandler);

  return app;
};
