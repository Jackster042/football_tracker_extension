// =============================================================================
// Background Service Worker
// Handles polling, event detection, and notifications using MV3 patterns
// =============================================================================

import { Match, MatchEvent, getEventSignature } from "@football-tracker/shared";
import {
  getPreferences,
  getWatchlist,
  getMatchSnapshots,
  saveMatchSnapshots,
  isEventProcessed,
  markEventProcessed,
  incrementErrors,
  resetErrors,
  getConsecutiveErrors,
} from "../shared/services/storage";
import {
  fetchMatchesByLeague,
  fetchMatchesByIds,
} from "../shared/api/openLigaDbClient";
import { diffMatches } from "../shared/services/diff";
import {
  showNotification,
  setupNotificationClickHandler,
} from "../shared/services/notifications";
import {
  ALARM_NAMES,
  MAX_CONSECUTIVE_ERRORS,
  BACKOFF_BASE_DELAY_SECONDS,
} from "../shared/constants";

// =============================================================================
// Initialization
// =============================================================================

// Set up notification click handler
setupNotificationClickHandler();

// Initialize on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log("[FootballTracker] Extension installed");
  await scheduleNextPoll();
});

// Initialize on startup
chrome.runtime.onStartup.addListener(async () => {
  console.log("[FootballTracker] Extension started");
  await scheduleNextPoll();
});

// =============================================================================
// Alarm Handler
// =============================================================================

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAMES.POLL_MATCHES) {
    console.log("[FootballTracker] Poll alarm triggered");
    await pollMatches();
  }
});

// =============================================================================
// Polling Orchestrator
// =============================================================================

/**
 * Main polling function
 * Fetches match data, detects events, and triggers notifications
 */
async function pollMatches(): Promise<void> {
  try {
    const preferences = await getPreferences();
    const watchlist = await getWatchlist();

    // If no watched matches, still poll the full list for badge updates
    // but with longer interval
    let currentMatches: Match[];

    if (watchlist.length > 0) {
      // Fetch only watched matches for efficiency
      currentMatches = await fetchMatchesByIds(watchlist);
    } else {
      // Fetch all matches for the configured league/season
      currentMatches = await fetchMatchesByLeague(
        preferences.leagueShortcut,
        preferences.seasonYear
      );
      // Filter to only include matches we care about for notifications
      currentMatches = currentMatches.filter((m) =>
        watchlist.includes(m.matchId)
      );
    }

    // Get previous snapshots for comparison
    const previousSnapshots = await getMatchSnapshots();

    // Detect events
    const events = diffMatches(previousSnapshots, currentMatches);

    // Process events and send notifications
    await processEvents(events);

    // Save current state as new snapshot
    await saveMatchSnapshots(currentMatches);

    // Reset error count on success
    await resetErrors();

    // Update badge
    await updateBadge(watchlist);

    // Schedule next poll
    await scheduleNextPoll();
  } catch (error) {
    console.error("[FootballTracker] Polling error:", error);

    // Increment error count and apply backoff
    const errorCount = await incrementErrors();

    if (errorCount >= MAX_CONSECUTIVE_ERRORS) {
      console.error("[FootballTracker] Max errors reached, stopping polling");
      // Clear the alarm to stop polling
      await chrome.alarms.clear(ALARM_NAMES.POLL_MATCHES);
    } else {
      // Schedule with exponential backoff
      await scheduleNextPoll(true);
    }
  }
}

/**
 * Process detected events and send notifications
 */
async function processEvents(events: MatchEvent[]): Promise<void> {
  const preferences = await getPreferences();

  for (const event of events) {
    const signature = getEventSignature(event);

    // Check if we've already processed this event
    if (await isEventProcessed(signature)) {
      console.log("[FootballTracker] Event already processed:", signature);
      continue;
    }

    // Send notification
    const notificationId = await showNotification(event, preferences);

    if (notificationId) {
      console.log("[FootballTracker] Notification sent:", notificationId);
    }

    // Mark as processed to prevent duplicates
    await markEventProcessed(signature);
  }
}

/**
 * Schedule the next polling alarm
 */
async function scheduleNextPoll(useBackoff = false): Promise<void> {
  const preferences = await getPreferences();
  const watchlist = await getWatchlist();

  let intervalSeconds: number;

  if (useBackoff) {
    // Exponential backoff
    const errorCount = await getConsecutiveErrors();
    intervalSeconds = BACKOFF_BASE_DELAY_SECONDS * Math.pow(2, errorCount - 1);
    console.log(`[FootballTracker] Backoff: ${intervalSeconds}s`);
  } else {
    // Determine if any watched matches are in-play
    const snapshots = await getMatchSnapshots();
    const watchedSnapshots = snapshots.filter((m) =>
      watchlist.includes(m.matchId)
    );
    const hasInPlayMatches = watchedSnapshots.some(
      (m) => m.status === "in_play" || m.status === "halftime"
    );

    intervalSeconds = hasInPlayMatches
      ? preferences.polling.inPlayIntervalSeconds
      : preferences.polling.idleIntervalSeconds;
  }

  // Chrome alarms use minutes, but we want seconds precision
  // Minimum alarm period is 1 minute in production, but for testing
  // we'll use delayInMinutes with fractional values
  const delayInMinutes = Math.max(intervalSeconds / 60, 0.5);

  await chrome.alarms.create(ALARM_NAMES.POLL_MATCHES, {
    delayInMinutes,
  });

  console.log(
    `[FootballTracker] Next poll in ${intervalSeconds}s ` +
      `(${delayInMinutes.toFixed(2)} min)`
  );
}

/**
 * Update the extension badge with in-play match count
 */
async function updateBadge(watchlist: number[]): Promise<void> {
  if (watchlist.length === 0) {
    await chrome.action.setBadgeText({ text: "" });
    return;
  }

  const snapshots = await getMatchSnapshots();
  const inPlayCount = snapshots.filter(
    (m) =>
      watchlist.includes(m.matchId) &&
      (m.status === "in_play" || m.status === "halftime")
  ).length;

  if (inPlayCount > 0) {
    await chrome.action.setBadgeText({ text: inPlayCount.toString() });
    await chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
  } else {
    // Show total watched count with different color
    await chrome.action.setBadgeText({ text: watchlist.length.toString() });
    await chrome.action.setBadgeBackgroundColor({ color: "#607D8B" });
  }
}

// =============================================================================
// Message Handler (for UI communication)
// =============================================================================

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "REFRESH_NOW") {
    pollMatches()
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }

  if (message.type === "UPDATE_BADGE") {
    getWatchlist()
      .then((watchlist) => updateBadge(watchlist))
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (message.type === "RESCHEDULE_POLL") {
    scheduleNextPoll()
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  return false;
});

// =============================================================================
// Export for testing (optional)
// =============================================================================

export { pollMatches, scheduleNextPoll, updateBadge, processEvents };
