# dev-secrets-sdk

TypeScript SDK for [Dev Secrets](https://github.com/yourusername/dev-secrets) - Local secret management for development.

## Installation

```bash
npm install dev-secrets-sdk
```

## Usage

### Initialize the client

```typescript
import { DevSecretsClient } from 'dev-secrets-sdk';

const client = new DevSecretsClient({
  baseUrl: 'http://localhost:3000' // optional, defaults to http://localhost:3000
});
```

### App Management

```typescript
// List all apps
const apps = await client.apps.list();
console.log(apps);

// Create a new app
const app = await client.apps.create('my-app', 'My Application');
console.log(app);

// Get app details
const appDetails = await client.apps.get('my-app');
console.log(appDetails);

// Delete an app
await client.apps.delete('my-app');
```

### Secret Management

```typescript
// List all secrets for an app
const secrets = await client.secrets.list('my-app');
console.log(secrets);

// Get a specific secret
const secret = await client.secrets.get('my-app', 'API_KEY');
console.log(secret); // { key: 'API_KEY', value: '...', createdAt: '...', updatedAt: '...' }

// Add a new secret
const newSecret = await client.secrets.add('my-app', 'DATABASE_URL', 'postgres://localhost:5432/mydb');
console.log(newSecret);

// Delete a secret
await client.secrets.delete('my-app', 'API_KEY');
```

## API Reference

### DevSecretsClient

#### Constructor

```typescript
new DevSecretsClient(config?: DevSecretsConfig)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `config.baseUrl` | `string` | `http://localhost:3000` | Base URL of the Dev Secrets API |

### Apps API

- `client.apps.list()` - Returns all apps
- `client.apps.create(id, name)` - Creates a new app
- `client.apps.get(id)` - Returns app details
- `client.apps.delete(id)` - Deletes an app

### Secrets API

- `client.secrets.list(appId)` - Returns all secrets for an app
- `client.secrets.get(appId, key)` - Returns a specific secret
- `client.secrets.add(appId, key, value)` - Adds a new secret
- `client.secrets.delete(appId, key)` - Deletes a secret

## Types

```typescript
interface App {
  id: string;
  name: string;
  createdAt: string;
}

interface AppInfo {
  id: string;
  name: string;
  secretCount: number;
  createdAt: string;
}

interface Secret {
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}
```

## Error Handling

The SDK throws `DevSecretsError` on failures:

```typescript
import { DevSecretsClient, DevSecretsError } from 'dev-secrets-sdk';

const client = new DevSecretsClient();

try {
  await client.apps.get('non-existent');
} catch (error) {
  if (error instanceof DevSecretsError) {
    console.error(`Error: ${error.message}, Status: ${error.statusCode}`);
  }
}
```

## License

MIT
