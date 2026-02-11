import { Router, Request, Response } from 'express';
import { appManager } from '../services/appManager';
import { secretsManager } from '../services/secretsManager';
import { ApiResponse, App, AppInfo, Secret } from '../types';

const router = Router();

router.get('/', async (_req: Request, res: Response<ApiResponse<AppInfo[]>>) => {
  try {
    const apps = await appManager.getAllApps();
    res.json({ success: true, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post('/', async (req: Request, res: Response<ApiResponse<App>>) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      return res.status(400).json({ success: false, error: 'id and name are required' });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      return res.status(400).json({ success: false, error: 'id must contain only alphanumeric characters, underscores, and hyphens' });
    }

    const app = await appManager.createApp(id, name);
    res.status(201).json({ success: true, data: app });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/:id', async (req: Request, res: Response<ApiResponse<App>>) => {
  try {
    const app = await appManager.getApp(req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, error: 'App not found' });
    }
    res.json({ success: true, data: app });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.delete('/:id', async (req: Request, res: Response<ApiResponse<void>>) => {
  try {
    await appManager.deleteApp(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ success: false, error: (error as Error).message });
  }
});

router.get('/:id/secrets', async (req: Request, res: Response<ApiResponse<Secret[]>>) => {
  try {
    const secrets = await secretsManager.getSecrets(req.params.id);
    res.json({ success: true, data: secrets });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post('/:id/secrets', async (req: Request, res: Response<ApiResponse<Secret>>) => {
  try {
    const { key, value } = req.body;

    if (!key || !value) {
      return res.status(400).json({ success: false, error: 'key and value are required' });
    }

    const secret = await secretsManager.addSecret(req.params.id, key, value);
    res.status(201).json({ success: true, data: secret });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.delete('/:id/secrets/:key', async (req: Request, res: Response<ApiResponse<void>>) => {
  try {
    await secretsManager.deleteSecret(req.params.id, req.params.key);
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ success: false, error: (error as Error).message });
  }
});

export default router;
