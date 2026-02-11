import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import appsRouter from './routes/apps';
import secretsRouter from './routes/secrets';
import { ApiResponse } from './types';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/apps', appsRouter);
app.use('/api/apps/:appId/secrets', secretsRouter);

app.get('/health', (_req: Request, res: Response<ApiResponse<{ status: string }>>) => {
  res.json({ success: true, data: { status: 'healthy' } });
});

app.use((_req: Request, res: Response<ApiResponse<void>>, _next: NextFunction) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

app.use((err: Error, _req: Request, res: Response<ApiResponse<void>>, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
