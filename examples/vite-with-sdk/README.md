# Vite with Dev Secrets SDK

This is an example React + Vite application that demonstrates how to use the `dev-secrets-sdk` package to interact with a local Dev Secrets server.

## Prerequisites

1. Dev Secrets server running locally (port 3000)
2. Node.js 18+

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. If running Dev Secrets with Docker, start it first:
   ```bash
   cd /path/to/dev-secrets
   docker-compose up -d
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Configuration

The SDK connects to `http://localhost:3000` by default. You can override this by creating a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

## Features

- List all apps
- Create new apps
- View secrets for a selected app
- Add new secrets
- Delete secrets

## SDK Usage

```typescript
import { DevSecretsClient } from 'dev-secrets-sdk';

const client = new DevSecretsClient({
  baseUrl: 'http://localhost:3000'
});

// List apps
const apps = await client.apps.list();

// Create an app
const app = await client.apps.create('my-app', 'My App');

// List secrets for an app
const secrets = await client.secrets.list('my-app');

// Add a secret
await client.secrets.add('my-app', 'API_KEY', 'secret-value');

// Delete a secret
await client.secrets.delete('my-app', 'API_KEY');
```
