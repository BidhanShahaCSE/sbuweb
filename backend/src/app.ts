import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Minimal middleware setup
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', authRouter);

// Basic health check
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend server is running',
    authConnected: false,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export default app;
