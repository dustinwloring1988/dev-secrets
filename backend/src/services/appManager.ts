import { databaseService } from './database';
import { App, AppInfo } from '../types';

export const appManager = {
  async createApp(id: string, name: string): Promise<App> {
    if (databaseService.exists(id)) {
      throw new Error(`App with id '${id}' already exists`);
    }

    databaseService.createDatabase(id, name);

    return {
      id,
      name,
      createdAt: new Date().toISOString()
    };
  },

  async deleteApp(id: string): Promise<void> {
    if (!databaseService.exists(id)) {
      throw new Error(`App with id '${id}' not found`);
    }
    databaseService.deleteDatabase(id);
  },

  async getAllApps(): Promise<AppInfo[]> {
    const apps = await databaseService.getAllApps();
    const result: AppInfo[] = [];
    for (const app of apps) {
      const secretCount = await databaseService.getSecretCount(app.id);
      result.push({
        id: app.id,
        name: app.name,
        secretCount,
        createdAt: app.createdAt
      });
    }
    return result;
  },

  async getApp(id: string): Promise<App | null> {
    if (!databaseService.exists(id)) {
      return null;
    }

    return {
      id,
      name: id,
      createdAt: new Date().toISOString()
    };
  }
};
