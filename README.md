
<img width="1220" height="565" alt="cover" src="https://github.com/user-attachments/assets/688edda9-8f10-446c-aafb-3c6a26e0048d" />

# Dev Secrets

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ed.svg)](https://www.docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Local secret management for development. Store API keys, environment variables, and other sensitive configuration data for your projects in a local SQLite database.

## Features

- **App-based organization** - Group secrets by application
- **Web UI** - Easy management through browser
- **TypeScript SDK** - Fetch secrets programmatically in your apps
- **Local storage** - All data stored in SQLite (no cloud, no external services)
- **Docker support** - Run everything with Docker Compose

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (optional)

### Option 1: Run with Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Option 2: Run locally

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev
```

Or run separately:

```bash
# Backend (port 3000)
npm run dev:backend

# Frontend (port 5173)
npm run dev:frontend
```

## Usage

1. Open http://localhost:5173
2. Create an app (e.g., `my-api`, "My API")
3. Add secrets (key-value pairs)
4. Click "Copy" to copy the value to clipboard

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apps` | List all apps |
| POST | `/api/apps` | Create new app |
| DELETE | `/api/apps/:id` | Delete app |
| GET | `/api/apps/:id/secrets` | List secrets for app |
| POST | `/api/apps/:id/secrets` | Add secret |
| DELETE | `/api/apps/:id/secrets/:key` | Delete secret |
| GET | `/health` | Health check |

## SDK Usage

Install the SDK:

```bash
npm install dev-secrets-sdk
```

```typescript
import { DevSecretsClient } from 'dev-secrets-sdk';

const client = new DevSecretsClient({ baseUrl: 'http://localhost:3000' });

// Get all apps
const apps = await client.apps.getAll();

// Get secrets for an app
const secrets = await client.secrets.getAll('my-app');

// Add a secret
await client.secrets.add('my-app', 'API_KEY', 'secret-value');

// Delete a secret
await client.secrets.delete('my-app', 'API_KEY');
```

See `/sdk` for more details.

## Project Structure

```
dev-secrets/
├── backend/          # Express API server
├── frontend/         # React + Vite UI
├── sdk/              # TypeScript SDK
├── examples/         # Example integrations
├── data/             # SQLite databases (created at runtime)
└── docker-compose.yml
```

## Tech Stack

- **Backend**: Express, TypeScript, SQLite3
- **Frontend**: React, Vite, TypeScript, Axios
- **SDK**: TypeScript
