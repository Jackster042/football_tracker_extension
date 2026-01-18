import React, { useState, useEffect } from "react";
import { Match } from "@football-tracker/shared";
import MatchCard from "./MatchCard";

interface MatchListProps {
  matches: Match[];
  watchlist: number[];
  onWatchlistChange: (newWatchlist: number[]) => void;
}

type TabType = "live" | "upcoming" | "finished";

const MatchList: React.FC<MatchListProps> = ({
  matches,
  watchlist,
  onWatchlistChange,
}) => {
  // Group matches by status for better organization
  const liveMatches = matches.filter(
    (m) => m.status === "in_play" || m.status === "halftime"
  );
  const scheduledMatches = matches.filter((m) => m.status === "scheduled");
  const finishedMatches = matches.filter((m) => m.status === "finished");

  // Tab state - default to live if there are live matches, otherwise upcoming
  const [activeTab, setActiveTab] = useState<TabType>(
    liveMatches.length > 0 ? "live" : "upcoming"
  );

  // Update active tab when matches change (e.g., when live matches appear)
  useEffect(() => {
    if (liveMatches.length > 0 && activeTab === "upcoming") {
      setActiveTab("live");
    }
  }, [liveMatches.length]);

  // Check if all matches list is empty
  if (matches.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📋</span>
        <p>No matches found</p>
        <p className="empty-hint">
          Try changing the league in settings
        </p>
      </div>
    );
  }

  // Tab counts
  const liveCount = liveMatches.length;

  // Filter matches based on active tab
  const displayMatches =
    activeTab === "live"
      ? liveMatches
      : activeTab === "upcoming"
      ? scheduledMatches
      : finishedMatches;

  const handleToggleWatch = async (matchId: number) => {
    const isCurrentlyWatched = watchlist.includes(matchId);
    let newWatchlist: number[];

    if (isCurrentlyWatched) {
      newWatchlist = watchlist.filter((id) => id !== matchId);
    } else {
      newWatchlist = [...watchlist, matchId];
    }

    // Update storage
    await chrome.storage.local.get("localData").then(async (result) => {
      const data = result.localData || {};
      data.watchlist = newWatchlist;
      await chrome.storage.local.set({ localData: data });
    });

    onWatchlistChange(newWatchlist);
  };

  return (
    <div className="match-list">
      {/* Tab Navigation */}
      <div className="match-tabs">
        <button
          className={`tab ${activeTab === "live" ? "active" : ""}`}
          onClick={() => setActiveTab("live")}
        >
          <span className="tab-icon">📡</span>
          Live {liveCount > 0 && `(${liveCount})`}
        </button>
        <button
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          <span className="tab-icon">📅</span>
          Upcoming
        </button>
        <button
          className={`tab ${activeTab === "finished" ? "active" : ""}`}
          onClick={() => setActiveTab("finished")}
        >
          <span className="tab-icon">✅</span>
          Finished
        </button>
      </div>

      {/* Match Cards */}
      {displayMatches.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>No {activeTab} matches</p>
        </div>
      ) : (
        <div className="match-cards">
          {displayMatches.map((match) => (
            <MatchCard
              key={match.matchId}
              match={match}
              isWatched={watchlist.includes(match.matchId)}
              onToggleWatch={() => handleToggleWatch(match.matchId)}
              showLiveIndicator={activeTab !== "live"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchList;
