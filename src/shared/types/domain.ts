// =============================================================================
// Domain Model for Football Match Tracker
// =============================================================================

/**
 * Represents a football team
 */
export interface Team {
  id: number;
  name: string;
  shortName: string;
  iconUrl?: string;
}

/**
 * Represents the score of a match
 */
export interface Score {
  home: number;
  away: number;
}

/**
 * Possible match statuses
 * - scheduled: Match hasn't started yet
 * - in_play: Match is currently being played
 * - halftime: Match is at halftime break
 * - finished: Match has ended
 * - postponed: Match was postponed
 * - cancelled: Match was cancelled
 */
export type MatchStatus =
  | "scheduled"
  | "in_play"
  | "halftime"
  | "finished"
  | "postponed"
  | "cancelled";

/**
 * Represents a football match
 */
export interface Match {
  matchId: number;
  homeTeam: Team;
  awayTeam: Team;
  score: Score | null;
  status: MatchStatus;
  matchDateTime: string; // ISO date string
  matchMinute: number | null; // Current minute if in-play
  leagueShortcut: string;
  seasonYear: number;
  matchDay: number;
}

/**
 * User preferences stored in chrome.storage.sync
 */
export interface Preferences {
  leagueShortcut: string;
  seasonYear: number;
  notifications: {
    goals: boolean;
    matchEvents: boolean; // kickoff, halftime, fulltime
  };
  polling: {
    inPlayIntervalSeconds: number;
    idleIntervalSeconds: number;
  };
}

/**
 * Local storage data stored in chrome.storage.local
 */
export interface LocalStorageData {
  watchlist: number[]; // Array of matchIds
  matchSnapshots: Match[];
  processedEventSignatures: string[]; // For deduplication
  lastPollTimestamp: number | null;
  consecutiveErrors: number; // For exponential backoff
}

// =============================================================================
// Event Types for Diff Engine
// =============================================================================

export interface GoalEvent {
  type: "goal";
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  oldScore: Score;
  newScore: Score;
  timestamp: number;
}

export interface StatusEvent {
  type: "status";
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  oldStatus: MatchStatus;
  newStatus: MatchStatus;
  score: Score | null;
  timestamp: number;
}

export type MatchEvent = GoalEvent | StatusEvent;

/**
 * Generate a unique signature for an event to prevent duplicate notifications
 */
export function getEventSignature(event: MatchEvent): string {
  if (event.type === "goal") {
    return `goal:${event.matchId}:${event.newScore.home}-${event.newScore.away}`;
  }
  return `status:${event.matchId}:${event.newStatus}`;
}

// =============================================================================
// Default Values
// =============================================================================

export const DEFAULT_PREFERENCES: Preferences = {
  leagueShortcut: "bl1", // Bundesliga
  seasonYear: new Date().getFullYear(),
  notifications: {
    goals: true,
    matchEvents: true,
  },
  polling: {
    inPlayIntervalSeconds: 60,
    idleIntervalSeconds: 300,
  },
};

export const DEFAULT_LOCAL_STORAGE: LocalStorageData = {
  watchlist: [],
  matchSnapshots: [],
  processedEventSignatures: [],
  lastPollTimestamp: null,
  consecutiveErrors: 0,
};
