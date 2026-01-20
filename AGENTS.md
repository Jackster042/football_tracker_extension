# AGENTS.md - Football Tracker

## Build/Lint/Test Commands

### Root (monorepo)
```bash
pnpm install                    # Install all dependencies
pnpm build                      # Build all apps
pnpm typecheck                  # Type check all packages
pnpm clean                      # Clean build artifacts
```

### Chrome Extension
```bash
pnpm dev:extension              # Vite dev server
pnpm build:extension            # Build with typecheck + Vite
pnpm --filter @football-tracker/extension typecheck
```

### Mobile App
```bash
pnpm dev:mobile                 # Expo start
pnpm --filter @football-tracker/mobile typecheck
```

### Backend
```bash
pnpm dev:backend                # Wrangler dev
pnpm --filter @football-tracker/backend typecheck
```

### Shared Package
```bash
pnpm --filter @football-tracker/shared typecheck
```

**Note**: No test framework currently configured. Type checking serves as basic validation.

## Code Style Guidelines

### TypeScript
- Strict mode enabled in all `tsconfig.json` files
- Compiler flags: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Use Zod for runtime validation of external data
- Infer types from Zod schemas: `type Foo = z.infer<typeof FooSchema>`

### Imports
- Use path aliases: `@/` for app src, `@football-tracker/shared` for shared types
- Create barrel exports (`index.ts`) for component folders
- Import grouping order: React → external packages → internal aliases → relative paths

### React Components
- Functional components with explicit typing: `export const Foo: React.FC<Props> = (...)`
- Props interface naming: `FooProps`
- Use theme system for all styling values (colors, spacing, typography)
- React Native: `StyleSheet.create({...})` for component styles

### Naming Conventions
- Components: PascalCase (`MatchCard`, `HomeScreen`, `TopAppBar`)
- Component files: PascalCase matching component name
- Utility files: camelCase (`mockMatches.ts`, `utils.ts`)
- Types/Interfaces: PascalCase (`Match`, `Team`, `League`)
- Variables/functions: camelCase (`handleMatchPress`, `isExpanded`)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_PREFERENCES`, `SPORTS_LIST`)

### Theme System
- Access via `theme.colors.*`, `theme.spacing.*`, `theme.typography.*`
- Animation values: `theme.animation.duration.fast/normal/slow`
- See `apps/mobile/src/theme/` for design tokens (colors.ts, typography.ts, spacing.ts, radius.ts, shadows.ts)

### Shared Types & Schemas
- Define Zod schemas in `packages/shared/src/schemas.ts`
- Export inferred types from `packages/shared/src/types.ts`
- All apps must import domain types from `@football-tracker/shared`
- Schema pattern: Define Zod schema first, export type via `z.infer`

### Error Handling
- User actions use `console.log('Action: ', value)` for debugging
- Zod `.parse()` throws on invalid data (use try/catch for external API responses)
- No error boundaries currently implemented

### Architecture
- Single source of truth: `packages/shared/` for all domain types
- Workspace protocol: `"@football-tracker/shared": "workspace:*"` in package.json
- Chrome Extension: Manifest V3 with CRXJS Vite plugin
- Mobile App: Expo SDK 50, React Native 0.73, uses path mapping in tsconfig
- Backend: Cloudflare Workers with Wrangler CLI
- Path aliases configured in Vite and tsconfig.json

### Component Patterns
- Component props interfaces define optional/required clearly
- Default prop values in destructuring: `prop = defaultValue`
- Touchable components use `activeOpacity={0.7}`
- Status values: `'FT' | 'HT' | 'LIVE' | 'SCHEDULED'` for matches

## CI/CD

### GitHub Actions Workflows

#### CI Pipeline (`.github/workflows/ci.yml`)
- **Triggers**: Push/PR to `main` or `develop` branches
- **Jobs**:
  - `install`: Installs dependencies with pnpm caching
  - `typecheck-shared`: Validates shared package types
  - `typecheck-extension`: Validates extension types
  - `typecheck-mobile`: Validates mobile app types
  - `typecheck-backend`: Validates backend types
  - `build-extension`: Builds extension and uploads artifact (7-day retention)
- **All jobs must pass** before merge

#### Backend Deployment (`.github/workflows/deploy-backend.yml`)
- **Triggers**: Push to `main` affecting `apps/backend/` or `packages/shared/`
- **Job**: `deploy` - Deploys to Cloudflare Workers via Wrangler
- **Requires Secrets** (add via GitHub repository Settings → Secrets):
  - `CLOUDFLARE_API_TOKEN`: API token with Workers write permissions
  - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID

#### Extension Build (`.github/workflows/build-extension.yml`)
- **Triggers**:
  - Push version tags (`v*`) - auto-attaches ZIP to release
  - Manual trigger via GitHub Actions UI
- **Artifacts**:
  - `extension-build-*`: Raw dist folder (90-day retention)
  - `extension-zip-*`: ZIP file for manual Chrome Web Store upload

### Secrets Configuration

Add these secrets in GitHub repository settings when ready:

| Secret | Value | Purpose |
|--------|-------|---------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | Backend deployment |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Backend deployment |

**Note**: Backend deployment will fail gracefully until secrets are added.

### Branch Protection

Enable these settings in GitHub repository Settings → Branch Protection Rules:

1. **Protect `main` branch**
2. **Require pull request reviews** (1 approval)
3. **Require status checks to pass**:
   - `typecheck-shared`
   - `typecheck-extension`
   - `typecheck-mobile`
   - `typecheck-backend`
   - `build-extension`
