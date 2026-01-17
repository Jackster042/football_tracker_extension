# Football Tracker - Monorepo

A high-integrity pnpm monorepo for tracking live football match results across multiple platforms.

## 📁 Project Structure

```
football-tracker/
├── apps/
│   ├── extension/          # Chrome Extension (Manifest V3)
│   ├── mobile/             # React Native / Expo App
│   └── backend/            # Cloudflare Worker API
├── packages/
│   └── shared/             # Shared types & Zod schemas
├── pnpm-workspace.yaml     # Workspace configuration
└── package.json            # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0

Install pnpm if you haven't already:

```bash
npm install -g pnpm
```

### Installation

```bash
# Install all dependencies for the monorepo
pnpm install
```

## 📦 Apps & Packages

### Chrome Extension (`apps/extension`)

Live football match tracker as a Chrome Extension.

```bash
# Development mode
pnpm dev:extension

# Build for production
pnpm build:extension
```

See [apps/extension/README.md](./apps/extension/README.md) for details.

### Mobile App (`apps/mobile`)

React Native / Expo mobile application (placeholder).

```bash
# Start Expo development server
pnpm dev:mobile
```

See [apps/mobile/README.md](./apps/mobile/README.md) for details.

### Backend (`apps/backend`)

Cloudflare Worker for API proxy and data aggregation (placeholder).

```bash
# Start local development server
pnpm dev:backend

# Deploy to Cloudflare
cd apps/backend
pnpm deploy
```

See [apps/backend/README.md](./apps/backend/README.md) for details.

### Shared Package (`packages/shared`)

Shared TypeScript types and Zod schemas consumed by all apps.

- **Location**: `@football-tracker/shared`
- **Exports**: Types, Zod schemas, utility functions
- **Usage**: All apps import from `@football-tracker/shared`

## 🔧 Workspace Commands

```bash
# Run dev for all apps (not recommended, use individual commands)
pnpm -r dev

# Build all apps
pnpm build

# Type check all packages
pnpm typecheck

# Clean all build artifacts
pnpm clean
```

## 🎯 Key Principles

### 1. Shared Types

All domain types (`Match`, `Team`, `Score`, etc.) live in `packages/shared` and are consumed via `@football-tracker/shared`. This ensures:

- **Single source of truth** for data models
- **Type safety** across all apps
- **Runtime validation** with Zod schemas

### 2. Minimalist Approach

Only essential dependencies. No unnecessary "bloat" packages.

### 3. Functionality First

The extension remains fully functional after the monorepo refactor. All original features work as expected.

## 📝 Type Safety

The shared package uses Zod for runtime validation and TypeScript for compile-time type safety:

```typescript
import { Match, MatchSchema } from '@football-tracker/shared';

// TypeScript type
const match: Match = { /* ... */ };

// Runtime validation
const validated = MatchSchema.parse(unknownData);
```

## 🔗 Workspace Protocol

Apps reference the shared package using pnpm's workspace protocol:

```json
{
  "dependencies": {
    "@football-tracker/shared": "workspace:*"
  }
}
```

## 📚 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  @football-tracker/shared               │
│  (Types, Zod Schemas, Domain Logic, Utilities)          │
└─────────────────────────────────────────────────────────┘
         ▲                    ▲                    ▲
         │                    │                    │
    ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
    │Extension│         │ Mobile  │         │ Backend │
    │(Chrome) │         │ (Expo)  │         │(CF Wrkr)│
    └─────────┘         └─────────┘         └─────────┘
```

## 🛠️ Development Workflow

1. **Make changes to shared types**:
   - Edit files in `packages/shared/src/`
   - All apps automatically get the updates

2. **Work on an app**:
   ```bash
   cd apps/extension
   pnpm dev
   ```

3. **Type check everything**:
   ```bash
   pnpm typecheck
   ```

## 📖 Documentation

- [Extension Documentation](./apps/extension/README.md)
- [Mobile App Documentation](./apps/mobile/README.md)
- [Backend Documentation](./apps/backend/README.md)

## 🧪 Testing

```bash
# Type check (serves as basic validation)
pnpm typecheck

# Build all apps (ensures no broken imports)
pnpm build
```

## 🚢 Deployment

### Chrome Extension
Build and upload to Chrome Web Store:
```bash
pnpm build:extension
# Upload dist/ folder to Chrome Web Store
```

### Mobile App
Build and deploy via Expo:
```bash
cd apps/mobile
pnpm build
eas build
```

### Backend
Deploy to Cloudflare:
```bash
cd apps/backend
pnpm deploy
```

## 📄 License

MIT
