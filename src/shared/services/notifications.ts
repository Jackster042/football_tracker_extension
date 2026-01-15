// =============================================================================
// Notification Manager
// Handles Chrome notifications for match events
// =============================================================================

import {
  MatchEvent,
  GoalEvent,
  StatusEvent,
  Preferences,
} from "../types/domain";
import { formatScore, formatStatus } from "./diff";
import { OPENLIGADB_WEBSITE } from "../constants";

/**
 * Show a notification for a match event
 * Returns the notification ID
 */
export async function showNotification(
  event: MatchEvent,
  preferences: Preferences
): Promise<string | null> {
  // Check if notifications are enabled for this event type
  if (event.type === "goal" && !preferences.notifications.goals) {
    return null;
  }

  if (event.type === "status" && !preferences.notifications.matchEvents) {
    return null;
  }

  const notificationId = `${event.type}-${event.matchId}-${event.timestamp}`;
  const { title, message, contextMessage } = formatNotification(event);

  await chrome.notifications.create(notificationId, {
    type: "basic",
    iconUrl: chrome.runtime.getURL("icons/icon128.png"),
    title,
    message,
    contextMessage,
    priority: event.type === "goal" ? 2 : 1,
    requireInteraction: false,
  });

  return notificationId;
}

/**
 * Format notification content based on event type
 */
function formatNotification(event: MatchEvent): {
  title: string;
  message: string;
  contextMessage?: string;
} {
  if (event.type === "goal") {
    return formatGoalNotification(event);
  }
  return formatStatusNotification(event);
}

/**
 * Format a goal notification
 */
function formatGoalNotification(event: GoalEvent): {
  title: string;
  message: string;
  contextMessage?: string;
} {
  const { homeTeam, awayTeam, oldScore, newScore } = event;

  // Determine who scored
  const homeScored = newScore.home > oldScore.home;
  const awayScored = newScore.away > oldScore.away;

  let scorer = "";
  if (homeScored && !awayScored) {
    scorer = homeTeam;
  } else if (awayScored && !homeScored) {
    scorer = awayTeam;
  }

  return {
    title: "⚽ Goal!",
    message: `${homeTeam} ${formatScore(newScore)} ${awayTeam}`,
    contextMessage: scorer ? `${scorer} scores!` : undefined,
  };
}

/**
 * Format a status change notification
 */
function formatStatusNotification(event: StatusEvent): {
  title: string;
  message: string;
  contextMessage?: string;
} {
  const { homeTeam, awayTeam, newStatus, score } = event;

  const statusTitles: Record<string, string> = {
    in_play: "🟢 Kick Off!",
    halftime: "⏸️ Halftime",
    finished: "🏁 Full Time",
    postponed: "⚠️ Match Postponed",
    cancelled: "❌ Match Cancelled",
  };

  const title = statusTitles[newStatus] || "📋 Match Update";
  const scoreText = score ? formatScore(score) : "";
  const message = scoreText
    ? `${homeTeam} ${scoreText} ${awayTeam}`
    : `${homeTeam} vs ${awayTeam}`;

  return {
    title,
    message,
    contextMessage: formatStatus(newStatus),
  };
}

/**
 * Handle notification click - opens relevant page
 */
export function setupNotificationClickHandler(): void {
  chrome.notifications.onClicked.addListener((notificationId: string) => {
    // Note: OpenLigaDB doesn't have individual match pages,
    // so we always open the main site. A paid API might provide direct
    // match URLs that could be extracted from the notificationId
    // Format: "{type}-{matchId}-{timestamp}"
    chrome.tabs.create({ url: OPENLIGADB_WEBSITE });

    // Clear the notification
    chrome.notifications.clear(notificationId);
  });
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications(): Promise<void> {
  // Chrome doesn't provide a "clear all" method, so we track our notifications
  // In a production app, we'd store notification IDs and clear them individually
}
