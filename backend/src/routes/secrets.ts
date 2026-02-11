import { Router, Request, Response } from 'express';
import { secretsManager } from '../services/secretsManager';
import { ApiResponse, Secret } from '../types';

const router = Router({ mergeParams: true });

router.get('/', async (_req: Request, res: Response<ApiResponse<Secret[]>>) => {
  try {
    const secrets = await secretsManager.getSecrets(_req.params.appId);
    res.json({ success: true, data: secrets });
  } catch (error) {
    res.status(404).json({ success: false, error: (error as Error).message });
  }
});

router.get('/:key', async (req: Request, res: Response<ApiResponse<Secret | null>>) => {
  try {
    const secret = await secretsManager.getSecret(req.params.appId, req.params.key);
    if (!secret) {
      return res.status(404).json({ success: false, error: 'Secret not found' });
    }
    res.json({ success: true, data: secret });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post('/', async (req: Request, res: Response<ApiResponse<Secret>>) => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ success: false, error: 'key and value are required' });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
      return res.status(400).json({ success: false, error: 'key must contain only alphanumeric characters, underscores, and hyphens' });
    }

    const secret = await secretsManager.addSecret(req.params.appId, key, value);
    res.status(201).json({ success: true, data: secret });
  } catch (error) {
    res.status(404).json({ success: false, error: (error as Error).message });
  }
});

router.delete('/:key', async (_req: Request, res: Response<ApiResponse<void>>) => {
  try {
    await secretsManager.deleteSecret(_req.params.appId, _req.params.key);
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ success: false, error: (error as Error).message });
  }
});

export default router;
