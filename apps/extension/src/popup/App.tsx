import React, { useState, useEffect, useCallback } from "react";
import {
  Match,
  Preferences,
  DEFAULT_PREFERENCES,
  formatSeasonYear,
} from "@football-tracker/shared";
import { getPreferences, getWatchlist } from "../shared/services/storage";
import { fetchMatchesByLeague } from "../shared/api/openLigaDbClient";
import MatchList from "./components/MatchList";

type LoadingState = "loading" | "loaded" | "error";

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [preferences, setPreferences] =
    useState<Preferences>(DEFAULT_PREFERENCES);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Filter matches to show only current/next matchday
   * When live matches exist: show current + next matchday
   * When no live matches: show next upcoming matchday only
   */
  const filterMatchesByMatchday = useCallback((matches: Match[]): Match[] => {
    const liveMatches = matches.filter(
      (m) => m.status === "in_play" || m.status === "halftime"
    );
    const scheduledMatches = matches.filter((m) => m.status === "scheduled");

    if (liveMatches.length > 0) {
      // Get current matchday from live matches
      const currentMatchDay = liveMatches[0].matchDay;
      const nextMatchDay = currentMatchDay + 1;

      // Return all matches from current round + next round
      return matches.filter(
        (m) => m.matchDay === currentMatchDay || m.matchDay === nextMatchDay
      );
    } else {
      // No live matches - find next upcoming matchday by date
      const now = new Date();
      const upcomingMatches = scheduledMatches
        .filter((m) => new Date(m.matchDateTime) > now)
        .sort(
          (a, b) =>
            new Date(a.matchDateTime).getTime() -
            new Date(b.matchDateTime).getTime()
        );

      if (upcomingMatches.length === 0) {
        return matches; // No upcoming matches, return all
      }

      // Get the matchday of the next match
      const nextMatchDay = upcomingMatches[0].matchDay;

      // Return only matches from that matchday
      return matches.filter((m) => m.matchDay === nextMatchDay);
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoadingState("loading");
      setError(null);

      const [prefs, watchedIds] = await Promise.all([
        getPreferences(),
        getWatchlist(),
      ]);

      setPreferences(prefs);
      setWatchlist(watchedIds);

      const matchData = await fetchMatchesByLeague(
        prefs.leagueShortcut,
        prefs.seasonYear
      );

      // Filter to show only current/next matchday
      const filteredMatches = filterMatchesByMatchday(matchData);

      // Sort matches: in-play first, then by date
      const sortedMatches = [...filteredMatches].sort((a, b) => {
        const statusOrder: Record<string, number> = {
          in_play: 0,
          halftime: 1,
          scheduled: 2,
          finished: 3,
          postponed: 4,
          cancelled: 5,
        };
        const statusDiff =
          (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
        if (statusDiff !== 0) return statusDiff;

        return (
          new Date(a.matchDateTime).getTime() -
          new Date(b.matchDateTime).getTime()
        );
      });

      setMatches(sortedMatches);
      setLoadingState("loaded");
    } catch (err) {
      console.error("Failed to load matches:", err);
      setError(err instanceof Error ? err.message : "Failed to load matches");
      setLoadingState("error");
    }
  }, [filterMatchesByMatchday]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Trigger background refresh
      await chrome.runtime.sendMessage({ type: "REFRESH_NOW" });
      // Reload UI data
      await loadData();
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleWatchlistChange = (newWatchlist: number[]) => {
    setWatchlist(newWatchlist);
    // Update badge
    chrome.runtime.sendMessage({ type: "UPDATE_BADGE" });
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="popup-container">
      <header className="popup-header">
        <div className="header-title">
          <span className="icon">⚽</span>
          <h1>Football Tracker</h1>
        </div>
        <div className="header-actions">
          <button
            className="icon-button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh"
          >
            <span className={isRefreshing ? "spin" : ""}>🔄</span>
          </button>
          <button
            className="icon-button"
            onClick={openOptions}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      <div className="league-info">
        <span className="league-badge">
          {preferences.leagueShortcut.toUpperCase()}
        </span>
          <img 
            src="/icons/germany.png" 
            alt="Germany" 
            className="league-flag" 
  />
        <span className="season-badge">{formatSeasonYear(preferences.seasonYear)}</span>
        <span className="watch-count">{watchlist.length} watching</span>
      </div>

      <main className="popup-content">
        {loadingState === "loading" && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading matches...</p>
          </div>
        )}

        {loadingState === "error" && (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={loadData} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {loadingState === "loaded" && (
          <MatchList
            matches={matches}
            watchlist={watchlist}
            onWatchlistChange={handleWatchlistChange}
          />
        )}
      </main>

      <footer className="popup-footer">
        <span className="data-source">Data: OpenLigaDB</span>
      </footer>
    </div>
  );
};

export default App;
