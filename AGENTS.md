# Dev Secrets

## Stack
Express + TS + SQLite | React + Vite + TS

## Commands
```bash
# Docker
docker-compose up --build   # Build & start (ports 3000, 5173)
docker-compose down         # Stop

# Backend (cd backend)
npm run dev                 # ts-node-dev (port 3000)
npm run build && npm start  # Compile & run

# Frontend (cd frontend)
npm run dev                 # Vite (port 5173)
npm run build              # Production build
```

## Notes
- `data/` - SQLite DB (persists in docker volume)
- Frontend → `http://localhost:3000` via `VITE_API_URL`
