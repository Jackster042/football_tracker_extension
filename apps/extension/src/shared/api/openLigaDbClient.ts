// =============================================================================
// OpenLigaDB API Client
// This adapter can be swapped for a different API provider later.
// All API-specific logic is contained here.
// =============================================================================

import { Match, Team, Score, MatchStatus } from "@football-tracker/shared";
import {
  OPENLIGADB_BASE_URL,
  VALID_LEAGUE_SHORTCUTS,
  SEASON_YEAR_MIN,
  SEASON_YEAR_MAX,
} from "../constants";

// =============================================================================
// Input Validation
// =============================================================================

/**
 * Validate league shortcut against allowed values
 * Prevents URL injection attacks
 */
function validateLeagueShortcut(shortcut: string): void {
  if (
    !shortcut ||
    typeof shortcut !== "string" ||
    !VALID_LEAGUE_SHORTCUTS.includes(
      shortcut as (typeof VALID_LEAGUE_SHORTCUTS)[number]
    )
  ) {
    throw new Error(
      `Invalid league shortcut: ${shortcut}. Allowed: ${VALID_LEAGUE_SHORTCUTS.join(
        ", "
      )}`
    );
  }
}

/**
 * Validate season year is within reasonable bounds
 */
function validateSeasonYear(year: number): void {
  if (
    typeof year !== "number" ||
    !Number.isInteger(year) ||
    year < SEASON_YEAR_MIN ||
    year > SEASON_YEAR_MAX
  ) {
    throw new Error(
      `Invalid season year: ${year}. Must be between ${SEASON_YEAR_MIN} and ${SEASON_YEAR_MAX}`
    );
  }
}

/**
 * Validate match ID is a positive integer
 */
function validateMatchId(matchId: number): void {
  if (
    typeof matchId !== "number" ||
    !Number.isInteger(matchId) ||
    matchId <= 0
  ) {
    throw new Error(`Invalid match ID: ${matchId}. Must be a positive integer`);
  }
}

/**
 * Build API URL safely using URL API
 * Prevents URL injection and ensures proper encoding
 */
function buildApiUrl(...pathSegments: (string | number)[]): string {
  const baseUrl = new URL(OPENLIGADB_BASE_URL);
  const safePath = pathSegments
    .map((segment) => encodeURIComponent(String(segment)))
    .join("/");
  baseUrl.pathname = `${baseUrl.pathname}/${safePath}`;
  return baseUrl.toString();
}

// =============================================================================
// OpenLigaDB API Response Types (internal)
// =============================================================================

interface OpenLigaTeam {
  teamId: number;
  teamName: string;
  shortName: string;
  teamIconUrl?: string;
}

interface OpenLigaMatchResult {
  resultTypeID: number; // 1 = halftime, 2 = final
  resultOrderID: number;
  pointsTeam1: number;
  pointsTeam2: number;
  resultDescription: string;
}

interface OpenLigaMatch {
  matchID: number;
  matchDateTime: string;
  matchDateTimeUTC: string;
  team1: OpenLigaTeam;
  team2: OpenLigaTeam;
  matchResults: OpenLigaMatchResult[];
  matchIsFinished: boolean;
  leagueShortcut: string;
  leagueSeason: string;
  group?: {
    groupOrderID: number;
    groupName: string;
  };
}

// =============================================================================
// Type Mapping Functions
// =============================================================================

/**
 * Map OpenLigaDB team to domain Team
 */
function mapTeam(apiTeam: OpenLigaTeam): Team {
  return {
    id: apiTeam.teamId,
    name: apiTeam.teamName,
    shortName: apiTeam.shortName || apiTeam.teamName.substring(0, 3),
    iconUrl: apiTeam.teamIconUrl,
  };
}

/**
 * Determine match status from API data
 *
 * Logic:
 * - If matchIsFinished is true -> 'finished'
 * - If match has started (datetime in past) and not finished -> 'in_play'
 * - If halftime result exists but no final -> could be 'halftime'
 * - Otherwise -> 'scheduled'
 *
 * Note: OpenLigaDB doesn't provide real-time minute info or detailed status,
 * so we make reasonable inferences. A paid API would provide better data.
 */
function determineStatus(apiMatch: OpenLigaMatch): MatchStatus {
  if (apiMatch.matchIsFinished) {
    return "finished";
  }

  const matchTime = new Date(
    apiMatch.matchDateTimeUTC || apiMatch.matchDateTime
  );
  const now = new Date();

  if (matchTime > now) {
    return "scheduled";
  }

  // Match has started but not finished
  const hasHalftimeResult = apiMatch.matchResults.some(
    (r) => r.resultTypeID === 1
  );
  const hasFinalResult = apiMatch.matchResults.some(
    (r) => r.resultTypeID === 2
  );

  // If we have halftime but no final, and match started < 60 min ago,
  // we might be at halftime. This is an approximation.
  if (hasHalftimeResult && !hasFinalResult) {
    const minutesSinceStart =
      (now.getTime() - matchTime.getTime()) / (1000 * 60);
    if (minutesSinceStart >= 45 && minutesSinceStart <= 60) {
      return "halftime";
    }
  }

  return "in_play";
}

/**
 * Extract the best available score from match results
 *
 * Logic:
 * - Prefer "final" result (resultTypeID = 2) if match is finished
 * - Otherwise use the latest available result (highest resultOrderID)
 * - If no results, return null
 */
function extractScore(apiMatch: OpenLigaMatch): Score | null {
  if (apiMatch.matchResults.length === 0) {
    return null;
  }

  // If finished, look for final result
  if (apiMatch.matchIsFinished) {
    const finalResult = apiMatch.matchResults.find((r) => r.resultTypeID === 2);
    if (finalResult) {
      return {
        home: finalResult.pointsTeam1,
        away: finalResult.pointsTeam2,
      };
    }
  }

  // Otherwise, get the result with highest order (most recent)
  const sortedResults = [...apiMatch.matchResults].sort(
    (a, b) => b.resultOrderID - a.resultOrderID
  );

  const latestResult = sortedResults[0];
  return {
    home: latestResult.pointsTeam1,
    away: latestResult.pointsTeam2,
  };
}

/**
 * Estimate current match minute
 *
 * OpenLigaDB doesn't provide live minute data, so we estimate
 * based on time elapsed since match start.
 * Returns null if match hasn't started or is finished.
 */
function estimateMatchMinute(apiMatch: OpenLigaMatch): number | null {
  if (apiMatch.matchIsFinished) {
    return 90; // Display 90 for finished matches
  }

  const matchTime = new Date(
    apiMatch.matchDateTimeUTC || apiMatch.matchDateTime
  );
  const now = new Date();

  if (matchTime > now) {
    return null; // Not started
  }

  const minutesSinceStart = Math.floor(
    (now.getTime() - matchTime.getTime()) / (1000 * 60)
  );

  // Cap at 90+, accounting for halftime (~15 min break)
  if (minutesSinceStart > 105) {
    return 90; // Extra time or finished
  }

  if (minutesSinceStart > 45) {
    // Second half - subtract halftime break
    return Math.min(45 + (minutesSinceStart - 60), 90);
  }

  return Math.min(minutesSinceStart, 45);
}

/**
 * Map OpenLigaDB match to domain Match
 */
function mapMatch(apiMatch: OpenLigaMatch): Match {
  return {
    matchId: apiMatch.matchID,
    homeTeam: mapTeam(apiMatch.team1),
    awayTeam: mapTeam(apiMatch.team2),
    score: extractScore(apiMatch),
    status: determineStatus(apiMatch),
    matchDateTime: apiMatch.matchDateTimeUTC || apiMatch.matchDateTime,
    matchMinute: estimateMatchMinute(apiMatch),
    leagueShortcut: apiMatch.leagueShortcut,
    seasonYear: parseInt(apiMatch.leagueSeason, 10),
    matchDay: apiMatch.group?.groupOrderID || 0,
  };
}

// =============================================================================
// API Client Functions
// =============================================================================

/**
 * Fetch all matches for a league and season
 */
export async function fetchMatchesByLeague(
  leagueShortcut: string,
  seasonYear: number
): Promise<Match[]> {
  // Validate inputs before making request
  validateLeagueShortcut(leagueShortcut);
  validateSeasonYear(seasonYear);

  const url = buildApiUrl("getmatchdata", leagueShortcut, seasonYear);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `OpenLigaDB API error: ${response.status} ${response.statusText}`
    );
  }

  const apiMatches: OpenLigaMatch[] = await response.json();
  return apiMatches.map(mapMatch);
}

/**
 * Fetch a single match by ID
 */
export async function fetchMatchById(matchId: number): Promise<Match> {
  // Validate input before making request
  validateMatchId(matchId);

  const url = buildApiUrl("getmatchdata", matchId);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `OpenLigaDB API error: ${response.status} ${response.statusText}`
    );
  }

  const apiMatch: OpenLigaMatch = await response.json();
  return mapMatch(apiMatch);
}

/**
 * Fetch multiple matches by IDs
 * Makes parallel requests for efficiency
 */
export async function fetchMatchesByIds(matchIds: number[]): Promise<Match[]> {
  const promises = matchIds.map((id) => fetchMatchById(id));
  return Promise.all(promises);
}

// =============================================================================
// API Interface (for swapping providers)
// =============================================================================

/**
 * This interface defines the contract for any match data provider.
 * To swap OpenLigaDB for a paid API:
 * 1. Create a new file (e.g., paidApiClient.ts)
 * 2. Implement this interface
 * 3. Update imports in service-worker.ts and UI components
 */
export interface MatchDataProvider {
  fetchMatchesByLeague(
    leagueShortcut: string,
    seasonYear: number
  ): Promise<Match[]>;
  fetchMatchById(matchId: number): Promise<Match>;
  fetchMatchesByIds(matchIds: number[]): Promise<Match[]>;
}

/**
 * Default provider instance
 */
export const openLigaDbProvider: MatchDataProvider = {
  fetchMatchesByLeague,
  fetchMatchById,
  fetchMatchesByIds,
};
