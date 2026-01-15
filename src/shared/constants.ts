// =============================================================================
// Application Constants
// =============================================================================

/**
 * OpenLigaDB API base URL
 */
export const OPENLIGADB_BASE_URL = "https://www.openligadb.de/api";

/**
 * Chrome alarm names
 */
export const ALARM_NAMES = {
  POLL_MATCHES: "poll-matches",
} as const;

/**
 * Maximum number of consecutive errors before stopping polling
 */
export const MAX_CONSECUTIVE_ERRORS = 5;

/**
 * Base delay for exponential backoff (in seconds)
 */
export const BACKOFF_BASE_DELAY_SECONDS = 30;

/**
 * Maximum number of processed event signatures to keep
 * (to prevent memory bloat)
 */
export const MAX_PROCESSED_SIGNATURES = 500;

/**
 * Available leagues for selection
 */
export const AVAILABLE_LEAGUES = [
  { shortcut: "bl1", name: "Bundesliga" },
  { shortcut: "bl2", name: "2. Bundesliga" },
  { shortcut: "bl3", name: "3. Liga" },
  { shortcut: "dfb", name: "DFB-Pokal" },
] as const;

/**
 * Valid league shortcuts for input validation
 */
export const VALID_LEAGUE_SHORTCUTS = AVAILABLE_LEAGUES.map((l) => l.shortcut);

/**
 * Season year validation bounds
 */
export const SEASON_YEAR_MIN = 1963; // First Bundesliga season
export const SEASON_YEAR_MAX = 2100;

/**
 * OpenLigaDB website URL for notifications
 */
export const OPENLIGADB_WEBSITE = "https://www.openligadb.de/";
