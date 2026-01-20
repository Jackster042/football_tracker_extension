import React from "react";
import { Match } from "@football-tracker/shared";

interface MatchCardProps {
  match: Match;
  isWatched: boolean;
  onToggleWatch: () => void;
  showLiveIndicator?: boolean; // New prop, defaults to true
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  isWatched,
  onToggleWatch,
  showLiveIndicator = true, // Default to true
}) => {
  const { homeTeam, awayTeam, score, status, matchMinute, matchDateTime } =
    match;

  const isLive = status === "in_play" || status === "halftime";
  const isFinished = status === "finished";

  // Format match time
  const formatMatchTime = () => {
    const date = new Date(matchDateTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (date.toDateString() === today.toDateString()) {
      return `Today ${timeStr}`;
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow ${timeStr}`;
    }

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge content
  const getStatusBadge = () => {
    if (isLive && matchMinute !== null) {
      return (
        <span className="status-badge live">
          <span className="live-dot"></span>
          {matchMinute}&apos;
        </span>
      );
    }
    if (status === "halftime") {
      return <span className="status-badge halftime">HT</span>;
    }
    if (isFinished) {
      return <span className="status-badge finished">FT</span>;
    }
    return <span className="status-badge scheduled">{formatMatchTime()}</span>;
  };

  return (
    <div
      className={`match-card ${isLive ? "live" : ""} ${
        isWatched ? "watched" : ""
      }`}
    >
      <button
        className={`watch-button ${isWatched ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleWatch();
        }}
        title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
      >
        {isWatched ? "★" : "☆"}
      </button>

      <div className="match-teams">
        <div className="team home">
          <span className="team-name">{homeTeam.shortName}</span>
          {score !== null && <span className="team-score">{score.home}</span>}
        </div>

        <div className="match-divider">
          {score !== null ? (
            <span className="score-separator">-</span>
          ) : (
            <span className="vs">vs</span>
          )}
        </div>

        <div className="team away">
          {score !== null && <span className="team-score">{score.away}</span>}
          <span className="team-name">{awayTeam.shortName}</span>
        </div>
      </div>

      <div className="match-status">{getStatusBadge()}</div>

      {showLiveIndicator && isLive && (
        <div className="live-indicator">
          <span className="pulse"></span>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
