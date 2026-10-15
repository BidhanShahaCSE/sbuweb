import { createApp } from './app.js';
import { config } from './config/env.js';

const app = createApp();

const server = app.listen(config.PORT, () => {
  console.log(`=========================================`);
  console.log(`  sbuweb Backend Server Started`);
  console.log(`  Environment: ${config.NODE_ENV}`);
  console.log(`  Port:        ${config.PORT}`);
  console.log(`  URL:         http://localhost:${config.PORT}`);
  console.log(`  Supabase:    ${config.isSupabaseConfigured ? 'CONNECTED' : 'DISCONNECTED (Pending setup)'}`);
  console.log(`=========================================`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}. Gracefully shutting down...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
