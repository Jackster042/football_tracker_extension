import React, { useState, useEffect, useCallback } from "react";
import {
  Match,
  Preferences,
  DEFAULT_PREFERENCES,
} from "../shared/types/domain";
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

      // Sort matches: in-play first, then by date
      const sortedMatches = [...matchData].sort((a, b) => {
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
  }, []);

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
        <span className="season-badge">{preferences.seasonYear}</span>
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
