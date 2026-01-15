// =============================================================================
// Diff Engine
// Compares match snapshots to detect events (goals, status changes)
// =============================================================================

import {
  Match,
  MatchEvent,
  GoalEvent,
  StatusEvent,
  Score,
} from "../types/domain";

/**
 * Compare two snapshots and return detected events
 *
 * @param previousMatches - Previous snapshot of matches
 * @param currentMatches - Current snapshot of matches
 * @returns Array of detected events (goals, status changes)
 */
export function diffMatches(
  previousMatches: Match[],
  currentMatches: Match[]
): MatchEvent[] {
  const events: MatchEvent[] = [];
  const now = Date.now();

  // Create a map of previous matches for quick lookup
  const previousMap = new Map<number, Match>();
  for (const match of previousMatches) {
    previousMap.set(match.matchId, match);
  }

  for (const currentMatch of currentMatches) {
    const previousMatch = previousMap.get(currentMatch.matchId);

    if (!previousMatch) {
      // New match - check if it just started (status change)
      if (currentMatch.status === "in_play") {
        events.push({
          type: "status",
          matchId: currentMatch.matchId,
          homeTeam: currentMatch.homeTeam.name,
          awayTeam: currentMatch.awayTeam.name,
          oldStatus: "scheduled",
          newStatus: "in_play",
          score: currentMatch.score,
          timestamp: now,
        } as StatusEvent);
      }
      continue;
    }

    // Check for score changes (goals)
    const scoreEvent = detectScoreChange(previousMatch, currentMatch, now);
    if (scoreEvent) {
      events.push(scoreEvent);
    }

    // Check for status changes
    const statusEvent = detectStatusChange(previousMatch, currentMatch, now);
    if (statusEvent) {
      events.push(statusEvent);
    }
  }

  return events;
}

/**
 * Detect if a goal was scored
 */
function detectScoreChange(
  previous: Match,
  current: Match,
  timestamp: number
): GoalEvent | null {
  const prevScore = previous.score;
  const currScore = current.score;

  // No change if both null
  if (!prevScore && !currScore) {
    return null;
  }

  // Match just got a score (kickoff with early goal or data delay)
  if (!prevScore && currScore) {
    // Only report if there's actually a goal
    if (currScore.home > 0 || currScore.away > 0) {
      return {
        type: "goal",
        matchId: current.matchId,
        homeTeam: current.homeTeam.name,
        awayTeam: current.awayTeam.name,
        oldScore: { home: 0, away: 0 },
        newScore: currScore,
        timestamp,
      };
    }
    return null;
  }

  // Compare scores
  if (prevScore && currScore) {
    if (
      prevScore.home !== currScore.home ||
      prevScore.away !== currScore.away
    ) {
      return {
        type: "goal",
        matchId: current.matchId,
        homeTeam: current.homeTeam.name,
        awayTeam: current.awayTeam.name,
        oldScore: prevScore,
        newScore: currScore,
        timestamp,
      };
    }
  }

  return null;
}

/**
 * Detect status changes (kickoff, halftime, fulltime, etc.)
 */
function detectStatusChange(
  previous: Match,
  current: Match,
  timestamp: number
): StatusEvent | null {
  if (previous.status === current.status) {
    return null;
  }

  // We care about these transitions:
  // - scheduled -> in_play (kickoff)
  // - in_play -> halftime
  // - halftime -> in_play (second half start)
  // - in_play -> finished (fulltime)
  // - any -> postponed/cancelled

  const significantTransitions = [
    { from: "scheduled", to: "in_play" },
    { from: "in_play", to: "halftime" },
    { from: "halftime", to: "in_play" },
    { from: "in_play", to: "finished" },
    { from: "halftime", to: "finished" },
  ];

  const isSignificant = significantTransitions.some(
    (t) => t.from === previous.status && t.to === current.status
  );

  // Also notify for cancellations/postponements
  const isCancellation =
    current.status === "postponed" || current.status === "cancelled";

  if (isSignificant || isCancellation) {
    return {
      type: "status",
      matchId: current.matchId,
      homeTeam: current.homeTeam.name,
      awayTeam: current.awayTeam.name,
      oldStatus: previous.status,
      newStatus: current.status,
      score: current.score,
      timestamp,
    };
  }

  return null;
}

/**
 * Get a human-readable description of a score
 */
export function formatScore(score: Score | null): string {
  if (!score) {
    return "- : -";
  }
  return `${score.home} : ${score.away}`;
}

/**
 * Get a human-readable description of a status
 */
export function formatStatus(status: string): string {
  const statusLabels: Record<string, string> = {
    scheduled: "Scheduled",
    in_play: "Live",
    halftime: "Halftime",
    finished: "Full Time",
    postponed: "Postponed",
    cancelled: "Cancelled",
  };
  return statusLabels[status] || status;
}
