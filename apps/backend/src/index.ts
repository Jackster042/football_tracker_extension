import { Match, MatchSchema } from '@football-tracker/shared';

/**
 * Cloudflare Worker - Football Tracker Backend
 * 
 * This worker can serve as:
 * - API proxy for match data
 * - Data aggregation layer
 * - Scheduled job runner for notifications
 * - WebSocket server for real-time updates
 */

export interface Env {
  // Add your Cloudflare bindings here
  // MATCHES: KVNamespace;
  // DB: D1Database;
  // API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Example: Fetch matches endpoint
    if (url.pathname === '/api/matches') {
      // This would fetch from your data source (KV, D1, external API)
      const exampleMatch: Match = {
        matchId: 1,
        homeTeam: { id: 1, name: 'Bayern Munich', shortName: 'FCB' },
        awayTeam: { id: 2, name: 'Borussia Dortmund', shortName: 'BVB' },
        score: { home: 2, away: 1 },
        status: 'finished',
        matchDateTime: new Date().toISOString(),
        matchMinute: null,
        leagueShortcut: 'bl1',
        seasonYear: 2024,
        matchDay: 1,
      };

      // Validate with Zod schema
      const validated = MatchSchema.parse(exampleMatch);

      return new Response(JSON.stringify([validated]), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Example: Validate incoming match data
    if (url.pathname === '/api/validate' && request.method === 'POST') {
      try {
        const body = await request.json();
        const validated = MatchSchema.parse(body);
        return new Response(JSON.stringify({ valid: true, data: validated }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ valid: false, error: String(error) }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Football Tracker Backend - Cloudflare Worker', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },

  // Scheduled handler for cron jobs
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // Example: Fetch and cache match data on a schedule
    console.log('Scheduled job running at:', new Date(event.scheduledTime).toISOString());
  },
};
