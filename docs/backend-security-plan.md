# Backend Security Implementation Plan

**Document Version:** 1.0  
**Created:** January 20, 2026  
**Status:** Approved for Implementation  
**Duration:** 11 days (5 phases)

---

## Executive Summary

Transform the `apps/backend` Cloudflare Worker from a placeholder into a secure API proxy layer that centralizes API key management, input validation, rate limiting, and abuse prevention for all client applications (Chrome Extension, Mobile App, future clients).

### Key Decisions

| Aspect | Decision |
|--------|----------|
| **External APIs** | SportMonks (primary) + OpenLigaDB (fallback) |
| **Authentication** | OAuth/JWT - Option A (simple JWT validation) |
| **Rate Limits** | 100 requests/minute per IP |
| **Cache TTL (matches)** | 60 seconds |
| **Logging Retention** | 30 days (TBD for future) |

---

## 1. Project Structure

```
docs/backend-security-plan.md    ← This plan
apps/backend/
├── src/
│   ├── index.ts                  # Main worker (router + middleware)
│   ├── routes/
│   │   ├── index.ts              # Route registration
│   │   ├── auth.ts               # POST /login, POST /refresh
│   │   ├── matches.ts            # GET /matches, GET /matches/:id
│   │   ├── leagues.ts            # GET /leagues
│   │   ├── teams.ts              # GET /teams
│   │   └── health.ts             # GET /health
│   ├── middleware/
│   │   ├── index.ts
│   │   ├── authenticate.ts       # JWT validation
│   │   ├── rateLimiter.ts        # Per-IP rate limiting
│   │   ├── logger.ts             # Request logging
│   │   ├── validator.ts          # Zod validation
│   │   └── cors.ts               # CORS headers
│   ├── services/
│   │   ├── index.ts
│   │   ├── sportmonks.ts         # Primary API client
│   │   ├── openligadb.ts         # Fallback API client
│   │   ├── cache.ts              # KV caching operations
│   │   └── jwt.ts                # JWT signing/verification
│   ├── types/
│   │   └── index.ts              # Backend types
│   └── utils/
│       └── index.ts              # Helper functions
├── wrangler.toml                 # Cloudflare config
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── README.md                     # Backend documentation
tests/
├── middleware/
│   ├── authenticate.test.ts
│   ├── rateLimiter.test.ts
│   └── validator.test.ts
└── integration/
    └── api.test.ts
```

---

## 2. Implementation Phases

### Phase 1: Foundation (Days 1-2)

| Task | Description | Files Created/Modified |
|------|-------------|------------------------|
| 1.1 | Create route handlers structure | `src/routes/*.ts` |
| 1.2 | Implement basic request routing | `src/index.ts` |
| 1.3 | Set up Zod validation middleware | `src/middleware/validator.ts` |
| 1.4 | Create API client interface | `src/services/*.ts` |
| 1.5 | Configure wrangler.toml with secrets | `wrangler.toml` |
| 1.6 | Implement basic JWT authentication | `src/routes/auth.ts`, `src/middleware/authenticate.ts` |

**Deliverable:** Basic working proxy with JWT authentication, one endpoint (`/api/matches`) behind validation.

---

### Phase 2: Security Core (Days 3-4)

| Task | Description | Files Created/Modified |
|------|-------------|------------------------|
| 2.1 | Implement rate limiting (per IP) | `src/middleware/rateLimiter.ts` |
| 2.2 | Add request logging | `src/middleware/logger.ts` |
| 2.3 | Configure CORS | `src/middleware/cors.ts` |
| 2.4 | Add environment variable handling | `wrangler.toml`, `src/types/index.ts` |
| 2.5 | Implement response filtering | `src/utils/index.ts` |

**Deliverable:** Rate-limited, logged API with CORS and filtered responses.

---

### Phase 3: External Integrations (Days 5-7)

| Task | Description | Files Created/Modified |
|------|-------------|------------------------|
| 3.1 | Implement SportMonks API client | `src/services/sportmonks.ts` |
| 3.2 | Implement OpenLigaDB fallback | `src/services/openligadb.ts` |
| 3.3 | Add KV caching layer | `src/services/cache.ts` |
| 3.4 | Implement cache-aside pattern | All service files |
| 3.5 | Configure KV namespace in wrangler | `wrangler.toml` |

**Deliverable:** Full API proxy with caching, multiple providers, and automatic failover.

---

### Phase 4: Monitoring & Alerts (Days 8-9)

| Task | Description | Files Created/Modified |
|------|-------------|------------------------|
| 4.1 | Add metrics collection | `src/middleware/logger.ts` |
| 4.2 | Implement error tracking | `src/middleware/logger.ts` |
| 4.3 | Add health check endpoint | `src/routes/health.ts` |
| 4.4 | Configure alerts (optional) | wrangler.toml vars |
| 4.5 | Document API with OpenAPI spec | `docs/api.md` |

**Deliverable:** Observable, monitorable API with health checks.

---

### Phase 5: Testing & Documentation (Days 10-11)

| Task | Description | Files Created/Modified |
|------|-------------|------------------------|
| 5.1 | Write unit tests for middleware | `tests/middleware/*.ts` |
| 5.2 | Write integration tests | `tests/integration/*.ts` |
| 5.3 | Update AGENTS.md | `AGENTS.md` |
| 5.4 | Create API documentation | `docs/api.md` |
| 5.5 | Add deployment guide | `apps/backend/README.md` |

**Deliverable:** Tested, documented, production-ready backend.

---

## 3. API Endpoints

### v1 Endpoints

| Method | Path | Description | Cache TTL | Auth Required |
|--------|------|-------------|-----------|---------------|
| POST | `/api/v1/auth/login` | Get JWT token | 0s | No |
| POST | `/api/v1/auth/refresh` | Refresh JWT token | 0s | No |
| GET | `/api/v1/matches` | List matches by league/date | 60s | Yes |
| GET | `/api/v1/matches/:id` | Get single match details | 120s | Yes |
| GET | `/api/v1/leagues` | List available leagues | 3600s (1hr) | Yes |
| GET | `/api/v1/teams` | List teams by league | 3600s (1hr) | Yes |
| GET | `/api/v1/health` | Health check | 0s | No |
| OPTIONS | `/*` | CORS preflight | 0s | No |

### Query Parameters

```
GET /api/v1/matches
  ?league=bl1          # Required: league shortcut
  &season=2025         # Optional: season year (default: current)
  &date=2025-01-20    # Optional: specific date
  &status=in_play     # Optional: filter by status
```

### Request Headers

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
Accept: application/json
```

### Response Formats

#### Success Response

```json
{
  "success": true,
  "data": { ... },
  "cached": false,
  "timestamp": "2026-01-20T12:00:00.000Z"
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "retryAfter": 60
  },
  "timestamp": "2026-01-20T12:00:00.000Z"
}
```

---

## 4. JWT Authentication (Option A)

### JWT Payload Structure

```typescript
interface JWTPayload {
  sub: string;      // User ID
  exp: number;      // Expiration timestamp
  iat: number;      // Issued at
  role: 'user' | 'admin';
}
```

### Token Settings

| Setting | Value |
|---------|-------|
| Algorithm | HS256 |
| Expiration | 24 hours |
| Secret | Set via Cloudflare secrets |

### Implementation

```typescript
// src/middleware/authenticate.ts
interface Env {
  JWT_SECRET: string;
}

interface JWTPayload {
  sub: string;
  exp: number;
  iat: number;
  role: 'user' | 'admin';
}

export async function authenticate(
  request: Request,
  env: Env
): Promise<JWTPayload | null> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    // Simple JWT verification - Option A
    const payload = verifyJWT(token, env.JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

function verifyJWT(token: string, secret: string): JWTPayload {
  // Basic JWT signature verification and expiration check
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');

  const header = JSON.parse(atob(parts[0]));
  const payload = JSON.parse(atob(parts[1]));
  const signature = parts[2];

  // Verify signature (simplified - use proper crypto in production)
  const expectedSignature = btoa(
    createHmac('sha256', secret)
      .update(`${parts[0]}.${parts[1]}`)
      .digest('base64')
  );

  if (signature !== expectedSignature) {
    throw new Error('Invalid signature');
  }

  // Check expiration
  if (payload.exp && Date.now() > payload.exp * 1000) {
    throw new Error('Token expired');
  }

  return payload;
}
```

### Login Endpoint

```typescript
// src/routes/auth.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/v1/auth/login' && request.method === 'POST') {
      const { username, password } = await request.json();

      // Validate credentials (simplified - use proper auth in production)
      if (username === env.ADMIN_USER && password === env.ADMIN_PASS) {
        const payload: JWTPayload = {
          sub: username,
          exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
          iat: Math.floor(Date.now() / 1000),
          role: 'admin'
        };

        const token = createJWT(payload, env.JWT_SECRET);

        return new Response(JSON.stringify({
          success: true,
          data: {
            token,
            expiresIn: 86400,
            tokenType: 'Bearer'
          }
        }), { headers: { 'Content-Type': 'application/json' } });
      }

      return new Response(JSON.stringify({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response('Not Found', { status: 404 });
  }
};
```

---

## 5. Rate Limiting Strategy

### Tiered Limits

| Client Type | Requests/minute | Requests/day |
|-------------|-----------------|--------------|
| Anonymous IP | 60 | 1,000 |
| Authenticated User | 100 | 10,000 |
| Admin | 200 | 50,000 |

### Implementation

```typescript
// src/middleware/rateLimiter.ts
interface RateLimitConfig {
  windowMs: number;        // 60,000 (1 minute)
  maxRequests: number;     // 100 for authenticated
  keyPrefix: string;       // 'ratelimit'
}

interface Env {
  RATE_LIMIT_KV: KVNamespace;
}

export async function rateLimit(
  request: Request,
  env: Env,
  config: RateLimitConfig
): Promise<Response | null> {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `${config.keyPrefix}:${ip}`;
  const current = await env.RATE_LIMIT_KV.get(key);

  if (current && parseInt(current) >= config.maxRequests) {
    return new Response(JSON.stringify({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests',
        retryAfter: Math.ceil(config.windowMs / 1000)
      }
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil(config.windowMs / 1000).toString()
      }
    });
  }

  const count = (parseInt(current) || 0) + 1;
  await env.RATE_LIMIT_KV.put(key, count.toString(), {
    expirationTtl: Math.ceil(config.windowMs / 1000)
  });

  return null;
}
```

---

## 6. Caching Strategy

### Cache-Aside Pattern

```
Client Request → Check Cache → Cache Hit → Return Cached
                    ↓
              Cache Miss → Fetch External API → Store in Cache → Return Response
```

### TTL by Endpoint

| Endpoint | Cache TTL | Invalidation |
|----------|-----------|--------------|
| `/api/v1/matches` | 60 seconds | Match updates |
| `/api/v1/matches/:id` | 120 seconds | Score changes |
| `/api/v1/leagues` | 1 hour | Manual trigger |
| `/api/v1/teams` | 1 hour | Manual trigger |

### Implementation

```typescript
// src/services/cache.ts
interface CacheConfig {
  ttl: number;           // TTL in seconds
  prefix: string;        // Cache key prefix
}

export class CacheService {
  constructor(
    private kv: KVNamespace,
    private config: CacheConfig
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.kv.get(`${this.config.prefix}:${key}`);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.kv.put(
      `${this.config.prefix}:${key}`,
      JSON.stringify(value),
      { expirationTtl: this.config.ttl }
    );
  }

  async invalidate(pattern: string): Promise<void> {
    // Invalidation logic for pattern-based cache clearing
    // Note: Cloudflare KV doesn't support pattern deletion
    // Consider using a separate index or metadata approach
  }
}
```

### KV Namespace Structure

```
RATE_LIMIT_KV
└── ratelimit:<IP_ADDRESS>     # Rate limit counters

CACHE_KV
├── matches:bl1:2025
│   ├── 2025-01-20
│   │   ├── match:12345
│   │   └── list
│   └── ...
├── leagues
└── teams:bl1

LOGS_KV
└── logs:<TIMESTAMP>           # Request logs (30-day retention)
```

---

## 7. External API Integration

### Provider Fallback Logic

```typescript
// src/services/index.ts
import { SportMonksClient } from './sportmonks';
import { OpenLigaDbClient } from './openligadb';

export class ApiService {
  private sportmonks: SportMonksClient;
  private openligadb: OpenLigaDbClient;

  constructor(env: Env) {
    this.sportmonks = new SportMonksClient(env.SPORTMONKS_API_TOKEN);
    this.openligadb = new OpenLigaDbClient(env.OPENLIGADB_BASE_URL);
  }

  async getMatches(league: string, season: number): Promise<Match[]> {
    try {
      // Try SportMonks first (primary)
      return await this.sportmonks.getMatches(league, season);
    } catch (error) {
      console.warn('SportMonks failed, falling back to OpenLigaDB:', error);
      // Fallback to OpenLigaDB
      return await this.openligadb.getMatches(league, season);
    }
  }

  async getMatchById(matchId: number): Promise<Match> {
    try {
      return await this.sportmonks.getMatchById(matchId);
    } catch (error) {
      return await this.openligadb.getMatchById(matchId);
    }
  }
}
```

### SportMonks Client

```typescript
// src/services/sportmonks.ts
interface SportMonksConfig {
  baseUrl: string;
  apiToken: string;
  timeout: number;
}

export class SportMonksClient {
  private config: SportMonksConfig;

  constructor(apiToken: string, baseUrl: string = 'https://api.sportmonks.com') {
    this.config = {
      baseUrl,
      apiToken,
      timeout: 10000
    };
  }

  async getMatches(league: string, season: number): Promise<Match[]> {
    const url = `${this.config.baseUrl}/v3/football/matches/leagues/${league}/seasons/${season}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.config.apiToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`SportMonks API error: ${response.status}`);
    }

    const data = await response.json();
    return this.mapMatches(data.data);
  }

  async getMatchById(matchId: number): Promise<Match> {
    const url = `${this.config.baseUrl}/v3/football/matches/${matchId}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.config.apiToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`SportMonks API error: ${response.status}`);
    }

    const data = await response.json();
    return this.mapMatch(data.data);
  }

  private mapMatches(data: unknown[]): Match[] {
    // Map SportMonks response to domain Match type
    return data.map(this.mapMatch);
  }

  private mapMatch(data: unknown): Match {
    // Implementation of mapping logic
    // Uses shared MatchSchema for validation
    return {
      matchId: data.id,
      // ... map other fields
    };
  }
}
```

### OpenLigaDB Client (Fallback)

```typescript
// src/services/openligadb.ts
interface OpenLigaDbConfig {
  baseUrl: string;
}

export class OpenLigaDbClient {
  private config: OpenLigaDbConfig;

  constructor(baseUrl: string = 'https://api.openligadb.de') {
    this.config = { baseUrl };
  }

  async getMatches(league: string, season: number): Promise<Match[]> {
    const url = `${this.config.baseUrl}/getmatchdata/${league}/${season}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OpenLigaDB API error: ${response.status}`);
    }

    const data = await response.json();
    return this.mapMatches(data);
  }

  async getMatchById(matchId: number): Promise<Match> {
    const url = `${this.config.baseUrl}/getmatchdata/${matchId}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OpenLigaDB API error: ${response.status}`);
    }

    const data = await response.json();
    return this.mapMatch(data);
  }

  private mapMatches(data: unknown[]): Match[] {
    return data.map(this.mapMatch);
  }

  private mapMatch(data: unknown): Match {
    // Uses shared MatchSchema for validation
    return {
      matchId: data.matchID,
      // ... map other fields
    };
  }
}
```

---

## 8. Environment Variables

### wrangler.toml Configuration

```toml
name = "football-tracker-backend"
main = "src/index.ts"
compatibility_date = "2024-01-01"
node_compat = true

[vars]
ENVIRONMENT = "production"
DEFAULT_LEAGUE = "bl1"
CACHE_TTL_MATCHES = 60
CACHE_TTL_LEAGUES = 3600
CACHE_TTL_TEAMS = 3600

# Uncomment to use KV namespace
# [[kv_namespaces]]
# binding = "RATE_LIMIT_KV"
# id = "your-kv-namespace-id"
# preview_id = "your-preview-namespace-id"

# [[kv_namespaces]]
# binding = "CACHE_KV"
# id = "your-kv-namespace-id"
# preview_id = "your-preview-namespace-id"

# [[kv_namespaces]]
# binding = "LOGS_KV"
# id = "your-kv-namespace-id"
# preview_id = "your-preview-namespace-id"

# Uncomment to use environment variables
# [vars]
# API_KEY = "your-api-key"
```

### Secrets (Set via CLI)

| Secret | Description | Set Via |
|--------|-------------|---------|
| `SPORTMONKS_API_TOKEN` | SportMonks API key | `wrangler secret put SPORTMONKS_API_TOKEN` |
| `JWT_SECRET` | JWT signing secret | `wrangler secret put JWT_SECRET` |
| `ADMIN_USER` | Admin username | `wrangler secret put ADMIN_USER` |
| `ADMIN_PASS` | Admin password | `wrangler secret put ADMIN_PASS` |

---

## 9. Error Handling

### HTTP Status Codes

| Status | Meaning | Examples |
|--------|---------|----------|
| 200 | Success | Valid request |
| 400 | Bad Request | Missing required parameters |
| 401 | Unauthorized | Missing/invalid JWT |
| 403 | Forbidden | Rate limit exceeded |
| 404 | Not Found | Unknown endpoint/resource |
| 429 | Too Many Requests | Rate limit |
| 500 | Internal Error | Upstream API failure |
| 502 | Bad Gateway | External API error |
| 503 | Service Unavailable | Maintenance/overload |

### Error Response Format

```typescript
interface ApiError {
  success: false;
  error: {
    code: string;        // e.g., 'RATE_LIMITED', 'VALIDATION_ERROR'
    message: string;     // Human-readable
    details?: unknown;   // Additional context
  };
  timestamp: string;
}
```

---

## 10. Dependencies

### package.json

```json
{
  "name": "@football-tracker/backend",
  "version": "1.0.0",
  "description": "Football Tracker Backend (Cloudflare Worker)",
  "main": "src/index.ts",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "clean": "rm -rf dist .wrangler",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "@football-tracker/shared": "workspace:*",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20231218.0",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.3",
    "wrangler": "^3.22.0",
    "vitest": "^1.0.0"
  },
  "private": true
}
```

---

## 11. CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'apps/backend/**'
      - 'packages/shared/**'
      - '.github/workflows/deploy-backend.yml'
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  deploy:
    name: Deploy to Cloudflare
    runs-on: ubuntu-latest
    if: github.event_name == 'push'

    permissions:
      contents: read
      id-token: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: '9'
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        working-directory: apps/backend

      - name: TypeCheck
        run: pnpm typecheck
        working-directory: apps/backend

      - name: Lint
        run: pnpm lint
        working-directory: apps/backend

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
          workingDirectory: apps/backend
```

---

## 12. Estimated Timeline

| Phase | Duration | Effort |
|-------|----------|--------|
| Phase 1: Foundation | 2 days | Low |
| Phase 2: Security Core | 2 days | Medium |
| Phase 3: Integrations | 3 days | High |
| Phase 4: Monitoring | 2 days | Medium |
| Phase 5: Testing | 2 days | Medium |
| **Total** | **11 days** | - |

---

## 13. Security Checklist

- [ ] API keys never exposed to clients
- [ ] All inputs validated with Zod schemas
- [ ] Rate limiting enforced per IP
- [ ] Request logging for audit trail
- [ ] CORS restricted to known origins
- [ ] Response filtering removes sensitive data
- [ ] HTTPS/TLS termination (automatic with Cloudflare)
- [ ] Error messages don't leak internal details
- [ ] KV namespaces isolated for different purposes
- [ ] Secrets stored in Cloudflare, not in code
- [ ] JWT tokens have expiration
- [ ] JWT verification prevents tampering

---

## 14. Deployment Guide

### Prerequisites

```bash
# Install wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### Create KV Namespaces

```bash
# Rate limiting namespace
wrangler kv:namespace create "RATE_LIMIT_KV"
# Add binding to wrangler.toml

# Cache namespace
wrangler kv:namespace create "CACHE_KV"
# Add binding to wrangler.toml

# Logs namespace
wrangler kv:namespace create "LOGS_KV"
# Add binding to wrangler.toml
```

### Set Secrets

```bash
wrangler secret put SPORTMONKS_API_TOKEN
wrangler secret put JWT_SECRET
wrangler secret put ADMIN_USER
wrangler secret put ADMIN_PASS
```

### Deploy

```bash
# Development deployment
cd apps/backend
pnpm dev

# Production deployment
pnpm deploy
```

### Verify Deployment

```bash
# Check health endpoint
curl https://your-worker.your-subdomain.workers.dev/api/v1/health

# Expected response:
# {"status":"ok","timestamp":"2026-01-20T12:00:00.000Z"}
```

---

## 15. Monitoring & Maintenance

### Health Check

```bash
GET /api/v1/health
```

Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-01-20T12:00:00.000Z",
  "uptime": 86400
}
```

### Logs

View logs in Cloudflare Dashboard:
1. Workers & Pages → your-worker → Logs
2. Or use `wrangler tail`

### Metrics

Available metrics in Cloudflare Dashboard:
- Requests count
- CPU time
- Error rate
- Latency percentiles

---

## 16. Future Enhancements

Consider implementing in future phases:

- [ ] JWT refresh tokens
- [ ] Token revocation list (KV-based)
- [ ] OAuth 2.0 flow (Option B/C)
- [ ] User registration
- [ ] Per-user rate limits
- [ ] Analytics dashboard
- [ ] Webhook integrations
- [ ] GraphQL API
- [ ] Real-time WebSocket updates
- [ ] D1 database for user data

---

## 17. Troubleshooting

### Common Issues

#### 401 Unauthorized
- Check JWT token is valid and not expired
- Verify `Authorization` header format: `Bearer <token>`

#### 429 Too Many Requests
- Rate limit exceeded, wait and retry
- Check `Retry-After` header

#### 502 Bad Gateway
- External API unavailable
- Check logs for details

#### KV Namespace Not Found
- Ensure KV namespaces are created
- Check bindings in `wrangler.toml`

---

## 18. References

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [JWT.io](https://jwt.io/) - JWT debugging
- [SportMonks API](https://docs.sportmonks.com/)
- [OpenLigaDB API](https://www.openligadb.de/api)

---

**Document maintained by:** Football Tracker Development Team  
**Last updated:** January 20, 2026
