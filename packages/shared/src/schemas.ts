// =============================================================================
// Zod Schemas for Football Match Tracker
// Runtime validation schemas that generate TypeScript types
// =============================================================================

import { z } from "zod";

// =============================================================================
// Core Domain Schemas
// =============================================================================

export const TeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  shortName: z.string(),
  iconUrl: z.string().optional(),
});

export const ScoreSchema = z.object({
  home: z.number(),
  away: z.number(),
});

export const MatchStatusSchema = z.enum([
  "scheduled",
  "in_play",
  "halftime",
  "finished",
  "postponed",
  "cancelled",
]);

export const MatchSchema = z.object({
  matchId: z.number(),
  homeTeam: TeamSchema,
  awayTeam: TeamSchema,
  score: ScoreSchema.nullable(),
  status: MatchStatusSchema,
  matchDateTime: z.string(), // ISO date string
  matchMinute: z.number().nullable(),
  leagueShortcut: z.string(),
  seasonYear: z.number(),
  matchDay: z.number(),
});

// =============================================================================
// User Preferences & Storage Schemas
// =============================================================================

export const PreferencesSchema = z.object({
  leagueShortcut: z.string(),
  seasonYear: z.number(),
  notifications: z.object({
    goals: z.boolean(),
    matchEvents: z.boolean(),
  }),
  polling: z.object({
    inPlayIntervalSeconds: z.number(),
    idleIntervalSeconds: z.number(),
  }),
});

export const LocalStorageDataSchema = z.object({
  watchlist: z.array(z.number()),
  matchSnapshots: z.array(MatchSchema),
  processedEventSignatures: z.array(z.string()),
  lastPollTimestamp: z.number().nullable(),
  consecutiveErrors: z.number(),
});

// =============================================================================
// Event Schemas for Diff Engine
// =============================================================================

export const GoalEventSchema = z.object({
  type: z.literal("goal"),
  matchId: z.number(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  oldScore: ScoreSchema,
  newScore: ScoreSchema,
  timestamp: z.number(),
});

export const StatusEventSchema = z.object({
  type: z.literal("status"),
  matchId: z.number(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  oldStatus: MatchStatusSchema,
  newStatus: MatchStatusSchema,
  score: ScoreSchema.nullable(),
  timestamp: z.number(),
});

export const MatchEventSchema = z.union([GoalEventSchema, StatusEventSchema]);

// =============================================================================
// API Provider Interface Schema
// =============================================================================

export const MatchDataProviderSchema = z.object({
  fetchMatchesByLeague: z.function()
    .args(z.string(), z.number())
    .returns(z.promise(z.array(MatchSchema))),
  fetchMatchById: z.function()
    .args(z.number())
    .returns(z.promise(MatchSchema)),
  fetchMatchesByIds: z.function()
    .args(z.array(z.number()))
    .returns(z.promise(z.array(MatchSchema))),
});
