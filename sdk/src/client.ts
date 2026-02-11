import { DevSecretsConfig } from './types';
import { AppsApi } from './apps';
import { SecretsApi } from './secrets';

export class DevSecretsClient {
  public apps: AppsApi;
  public secrets: SecretsApi;

  constructor(config: DevSecretsConfig = {}) {
    const baseUrl = config.baseUrl || 'http://localhost:3000';
    this.apps = new AppsApi(baseUrl);
    this.secrets = new SecretsApi(baseUrl);
  }
}
