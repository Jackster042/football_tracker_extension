// =============================================================================
// TypeScript Types for Football Match Tracker
// Inferred from Zod schemas for type safety
// =============================================================================

import { z } from "zod";
import {
  TeamSchema,
  ScoreSchema,
  MatchStatusSchema,
  MatchSchema,
  PreferencesSchema,
  LocalStorageDataSchema,
  GoalEventSchema,
  StatusEventSchema,
  MatchEventSchema,
} from "./schemas";

// =============================================================================
// Core Domain Types
// =============================================================================

export type Team = z.infer<typeof TeamSchema>;
export type Score = z.infer<typeof ScoreSchema>;
export type MatchStatus = z.infer<typeof MatchStatusSchema>;
export type Match = z.infer<typeof MatchSchema>;

// =============================================================================
// User Preferences & Storage Types
// =============================================================================

export type Preferences = z.infer<typeof PreferencesSchema>;
export type LocalStorageData = z.infer<typeof LocalStorageDataSchema>;

// =============================================================================
// Event Types
// =============================================================================

export type GoalEvent = z.infer<typeof GoalEventSchema>;
export type StatusEvent = z.infer<typeof StatusEventSchema>;
export type MatchEvent = z.infer<typeof MatchEventSchema>;

// =============================================================================
// API Provider Interface
// =============================================================================

export interface MatchDataProvider {
  fetchMatchesByLeague(
    leagueShortcut: string,
    seasonYear: number
  ): Promise<Match[]>;
  fetchMatchById(matchId: number): Promise<Match>;
  fetchMatchesByIds(matchIds: number[]): Promise<Match[]>;
}

// =============================================================================
// Utility Functions
// =============================================================================

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
  seasonYear: 2025,
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
