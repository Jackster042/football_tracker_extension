// =============================================================================
// Chrome Storage Service
// Wraps chrome.storage.sync (preferences) and chrome.storage.local (data)
// =============================================================================

import {
  Preferences,
  LocalStorageData,
  Match,
  DEFAULT_PREFERENCES,
  DEFAULT_LOCAL_STORAGE,
} from "../types/domain";
import { MAX_PROCESSED_SIGNATURES } from "../constants";

// =============================================================================
// Preferences (chrome.storage.sync)
// =============================================================================

/**
 * Get user preferences from sync storage
 */
export async function getPreferences(): Promise<Preferences> {
  const result = await chrome.storage.sync.get("preferences");
  if (result.preferences) {
    // Merge with defaults to handle missing fields after updates
    return { ...DEFAULT_PREFERENCES, ...result.preferences };
  }
  return DEFAULT_PREFERENCES;
}

/**
 * Save user preferences to sync storage
 */
export async function savePreferences(preferences: Preferences): Promise<void> {
  await chrome.storage.sync.set({ preferences });
}

/**
 * Update specific preference fields
 */
export async function updatePreferences(
  updates: Partial<Preferences>
): Promise<Preferences> {
  const current = await getPreferences();
  const updated = { ...current, ...updates };
  await savePreferences(updated);
  return updated;
}

// =============================================================================
// Local Storage (chrome.storage.local)
// =============================================================================

/**
 * Get local storage data
 */
export async function getLocalStorage(): Promise<LocalStorageData> {
  const result = await chrome.storage.local.get("localData");
  if (result.localData) {
    return { ...DEFAULT_LOCAL_STORAGE, ...result.localData };
  }
  return DEFAULT_LOCAL_STORAGE;
}

/**
 * Save local storage data
 */
export async function saveLocalStorage(data: LocalStorageData): Promise<void> {
  await chrome.storage.local.set({ localData: data });
}

// =============================================================================
// Watchlist Operations
// =============================================================================

/**
 * Get the current watchlist
 */
export async function getWatchlist(): Promise<number[]> {
  const data = await getLocalStorage();
  return data.watchlist;
}

/**
 * Add a match to the watchlist
 */
export async function addToWatchlist(matchId: number): Promise<void> {
  const data = await getLocalStorage();
  if (!data.watchlist.includes(matchId)) {
    data.watchlist.push(matchId);
    await saveLocalStorage(data);
  }
}

/**
 * Remove a match from the watchlist
 */
export async function removeFromWatchlist(matchId: number): Promise<void> {
  const data = await getLocalStorage();
  data.watchlist = data.watchlist.filter((id) => id !== matchId);
  await saveLocalStorage(data);
}

/**
 * Toggle a match in the watchlist
 */
export async function toggleWatchlist(matchId: number): Promise<boolean> {
  const data = await getLocalStorage();
  const isWatched = data.watchlist.includes(matchId);

  if (isWatched) {
    data.watchlist = data.watchlist.filter((id) => id !== matchId);
  } else {
    data.watchlist.push(matchId);
  }

  await saveLocalStorage(data);
  return !isWatched;
}

/**
 * Check if a match is in the watchlist
 */
export async function isWatched(matchId: number): Promise<boolean> {
  const data = await getLocalStorage();
  return data.watchlist.includes(matchId);
}

// =============================================================================
// Match Snapshots Operations
// =============================================================================

/**
 * Get cached match snapshots
 */
export async function getMatchSnapshots(): Promise<Match[]> {
  const data = await getLocalStorage();
  return data.matchSnapshots;
}

/**
 * Save match snapshots
 */
export async function saveMatchSnapshots(matches: Match[]): Promise<void> {
  const data = await getLocalStorage();
  data.matchSnapshots = matches;
  await saveLocalStorage(data);
}

// =============================================================================
// Event Signature Tracking (Deduplication)
// =============================================================================

/**
 * Check if an event signature has been processed
 */
export async function isEventProcessed(signature: string): Promise<boolean> {
  const data = await getLocalStorage();
  return data.processedEventSignatures.includes(signature);
}

/**
 * Mark an event signature as processed
 */
export async function markEventProcessed(signature: string): Promise<void> {
  const data = await getLocalStorage();

  // Add signature
  data.processedEventSignatures.push(signature);

  // Trim if too many (keep most recent)
  if (data.processedEventSignatures.length > MAX_PROCESSED_SIGNATURES) {
    data.processedEventSignatures = data.processedEventSignatures.slice(
      -MAX_PROCESSED_SIGNATURES
    );
  }

  await saveLocalStorage(data);
}

/**
 * Clear all processed event signatures
 */
export async function clearProcessedEvents(): Promise<void> {
  const data = await getLocalStorage();
  data.processedEventSignatures = [];
  await saveLocalStorage(data);
}

// =============================================================================
// Polling State
// =============================================================================

/**
 * Get consecutive error count
 */
export async function getConsecutiveErrors(): Promise<number> {
  const data = await getLocalStorage();
  return data.consecutiveErrors;
}

/**
 * Increment consecutive error count
 */
export async function incrementErrors(): Promise<number> {
  const data = await getLocalStorage();
  data.consecutiveErrors += 1;
  await saveLocalStorage(data);
  return data.consecutiveErrors;
}

/**
 * Reset consecutive error count
 */
export async function resetErrors(): Promise<void> {
  const data = await getLocalStorage();
  data.consecutiveErrors = 0;
  await saveLocalStorage(data);
}

/**
 * Update last poll timestamp
 */
export async function updateLastPollTimestamp(): Promise<void> {
  const data = await getLocalStorage();
  data.lastPollTimestamp = Date.now();
  await saveLocalStorage(data);
}
