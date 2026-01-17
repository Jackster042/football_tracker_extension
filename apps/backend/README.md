# Football Tracker - Backend

This is a Cloudflare Worker that serves as the backend for the Football Tracker application.

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev:backend

# Or directly
cd apps/backend
pnpm dev
```

## Deploy

```bash
pnpm deploy
```

## Features (Planned)

- **API Proxy**: Proxy requests to football data APIs with caching
- **Data Aggregation**: Combine data from multiple sources
- **Scheduled Jobs**: Run cron jobs to update match data
- **WebSocket Support**: Real-time match updates via Durable Objects
- **Rate Limiting**: Protect against excessive API calls
- **Authentication**: Secure API endpoints

## Endpoints

- `GET /health` - Health check
- `GET /api/matches` - Fetch matches (example)
- `POST /api/validate` - Validate match data with Zod

## Shared Types

This worker consumes types and Zod schemas from `@football-tracker/shared` package, ensuring type safety and runtime validation across the entire monorepo.

## Cloudflare Features

This worker can leverage:
- **KV**: Key-value storage for caching
- **D1**: SQL database for persistent data
- **Durable Objects**: Stateful WebSocket connections
- **Cron Triggers**: Scheduled jobs
- **Workers AI**: AI-powered features
