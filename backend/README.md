# Dev Secrets Backend

Local secret management API for development.

## API Endpoints

### Apps

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apps` | List all apps |
| POST | `/api/apps` | Create new app |
| GET | `/api/apps/:id` | Get app by ID |
| DELETE | `/api/apps/:id` | Delete app |

#### Create App Request
```json
{
  "id": "my-app",
  "name": "My Application"
}
```

### Secrets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apps/:appId/secrets` | List all secrets |
| POST | `/api/apps/:appId/secrets` | Add/update secret |
| GET | `/api/apps/:appId/secrets/:key` | Get secret by key |
| DELETE | `/api/apps/:appId/secrets/:key` | Delete secret |

#### Add Secret Request
```json
{
  "key": "API_KEY",
  "value": "secret-value-here"
}
```

## Response Format

```json
{
  "success": true,
  "data": { ... }
}
```

```json
{
  "success": false,
  "error": "Error message"
}
```

## Development

```bash
npm install
npm run dev
```

## Docker

```bash
docker-compose up -d
```
