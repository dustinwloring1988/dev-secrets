import { databaseService } from './database';
import { Secret } from '../types';

export const secretsManager = {
  async getSecrets(appId: string): Promise<Secret[]> {
    if (!databaseService.exists(appId)) {
      throw new Error(`App with id '${appId}' not found`);
    }

    const secrets = await databaseService.getSecrets(appId);
    return secrets.map(s => ({
      key: s.key,
      value: s.value,
      createdAt: s.created_at,
      updatedAt: s.updated_at
    }));
  },

  async getSecret(appId: string, key: string): Promise<Secret | null> {
    if (!databaseService.exists(appId)) {
      throw new Error(`App with id '${appId}' not found`);
    }

    const secret = await databaseService.getSecret(appId, key);
    if (!secret) return null;

    return {
      key: secret.key,
      value: secret.value,
      createdAt: secret.created_at,
      updatedAt: secret.updated_at
    };
  },

  async addSecret(appId: string, key: string, value: string): Promise<Secret> {
    if (!databaseService.exists(appId)) {
      throw new Error(`App with id '${appId}' not found`);
    }

    databaseService.addSecret(appId, key, value);

    const secret = await databaseService.getSecret(appId, key);
    if (!secret) {
      throw new Error('Failed to retrieve secret after insertion');
    }

    return {
      key: secret.key,
      value: secret.value,
      createdAt: secret.created_at,
      updatedAt: secret.updated_at
    };
  },

  async upsertSecret(appId: string, key: string, value: string): Promise<Secret> {
    if (!databaseService.exists(appId)) {
      throw new Error(`App with id '${appId}' not found`);
    }

    databaseService.upsertSecret(appId, key, value);

    const secret = await databaseService.getSecret(appId, key);
    if (!secret) {
      throw new Error('Failed to retrieve secret after upsert');
    }

    return {
      key: secret.key,
      value: secret.value,
      createdAt: secret.created_at,
      updatedAt: secret.updated_at
    };
  },

  async deleteSecret(appId: string, key: string): Promise<void> {
    if (!databaseService.exists(appId)) {
      throw new Error(`App with id '${appId}' not found`);
    }

    databaseService.deleteSecret(appId, key);
  }
};
