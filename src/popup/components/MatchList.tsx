import React from "react";
import { Match } from "../../shared/types/domain";
import MatchCard from "./MatchCard";

interface MatchListProps {
  matches: Match[];
  watchlist: number[];
  onWatchlistChange: (newWatchlist: number[]) => void;
}

const MatchList: React.FC<MatchListProps> = ({
  matches,
  watchlist,
  onWatchlistChange,
}) => {
  if (matches.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📋</span>
        <p>No matches found</p>
        <p className="empty-hint">
          Try changing the league or season in settings
        </p>
      </div>
    );
  }

  // Group matches by status for better organization
  const liveMatches = matches.filter(
    (m) => m.status === "in_play" || m.status === "halftime"
  );
  const scheduledMatches = matches.filter((m) => m.status === "scheduled");
  const finishedMatches = matches.filter((m) => m.status === "finished");
  const otherMatches = matches.filter(
    (m) => m.status === "postponed" || m.status === "cancelled"
  );

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

  const renderSection = (
    title: string,
    sectionMatches: Match[],
    className: string
  ) => {
    if (sectionMatches.length === 0) return null;

    return (
      <div className={`match-section ${className}`}>
        <h2 className="section-title">{title}</h2>
        <div className="match-cards">
          {sectionMatches.map((match) => (
            <MatchCard
              key={match.matchId}
              match={match}
              isWatched={watchlist.includes(match.matchId)}
              onToggleWatch={() => handleToggleWatch(match.matchId)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="match-list">
      {renderSection("🔴 Live", liveMatches, "live")}
      {renderSection("📅 Upcoming", scheduledMatches, "scheduled")}
      {renderSection("✅ Finished", finishedMatches, "finished")}
      {renderSection("⚠️ Other", otherMatches, "other")}
    </div>
  );
};

export default MatchList;
