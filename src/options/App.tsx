import React, { useState, useEffect } from "react";
import { Preferences, DEFAULT_PREFERENCES } from "../shared/types/domain";
import { getPreferences, savePreferences } from "../shared/services/storage";
import { AVAILABLE_LEAGUES } from "../shared/constants";

type SaveState = "idle" | "saving" | "saved" | "error";

const App: React.FC = () => {
  const [preferences, setPreferences] =
    useState<Preferences>(DEFAULT_PREFERENCES);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error("Failed to load preferences:", error);
    }
  };

  const handleChange = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setSaveState("idle");
  };

  const handleNestedChange = <
    K extends keyof Preferences,
    NK extends keyof Preferences[K]
  >(
    parentKey: K,
    key: NK,
    value: Preferences[K][NK]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as object),
        [key]: value,
      },
    }));
    setHasChanges(true);
    setSaveState("idle");
  };

  const handleSave = async () => {
    try {
      setSaveState("saving");
      await savePreferences(preferences);

      // Notify background to reschedule polling with new settings
      await chrome.runtime.sendMessage({ type: "RESCHEDULE_POLL" });

      setSaveState("saved");
      setHasChanges(false);

      // Reset status after delay
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      setSaveState("error");
    }
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setHasChanges(true);
    setSaveState("idle");
  };

  // Generate season year options (current year +/- 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="options-container">
      <header className="options-header">
        <div className="header-content">
          <span className="icon">⚽</span>
          <h1>Football Tracker Settings</h1>
        </div>
      </header>

      <main className="options-content">
        {/* League & Season Section */}
        <section className="settings-section">
          <h2 className="section-title">
            <span className="section-icon">🏆</span>
            League & Season
          </h2>

          <div className="setting-group">
            <label htmlFor="league">League</label>
            <select
              id="league"
              value={preferences.leagueShortcut}
              onChange={(e) => handleChange("leagueShortcut", e.target.value)}
            >
              {AVAILABLE_LEAGUES.map((league) => (
                <option key={league.shortcut} value={league.shortcut}>
                  {league.name} ({league.shortcut})
                </option>
              ))}
            </select>
            <p className="setting-hint">
              Select the league to track matches from
            </p>
          </div>

          <div className="setting-group">
            <label htmlFor="season">Season Year</label>
            <select
              id="season"
              value={preferences.seasonYear}
              onChange={(e) =>
                handleChange("seasonYear", parseInt(e.target.value, 10))
              }
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}/{year + 1}
                </option>
              ))}
            </select>
            <p className="setting-hint">
              Select the season (e.g., 2025 = 2025/2026 season)
            </p>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="settings-section">
          <h2 className="section-title">
            <span className="section-icon">🔔</span>
            Notifications
          </h2>

          <div className="setting-group toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={preferences.notifications.goals}
                onChange={(e) =>
                  handleNestedChange("notifications", "goals", e.target.checked)
                }
              />
              <span className="toggle-text">Goal Notifications</span>
            </label>
            <p className="setting-hint">
              Get notified when a goal is scored in watched matches
            </p>
          </div>

          <div className="setting-group toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={preferences.notifications.matchEvents}
                onChange={(e) =>
                  handleNestedChange(
                    "notifications",
                    "matchEvents",
                    e.target.checked
                  )
                }
              />
              <span className="toggle-text">Match Event Notifications</span>
            </label>
            <p className="setting-hint">
              Get notified for kick-off, halftime, and full-time
            </p>
          </div>
        </section>

        {/* Polling Section */}
        <section className="settings-section">
          <h2 className="section-title">
            <span className="section-icon">⏱️</span>
            Polling Intervals
          </h2>

          <div className="setting-group">
            <label htmlFor="inPlayInterval">In-Play Interval (seconds)</label>
            <input
              type="number"
              id="inPlayInterval"
              min="30"
              max="300"
              step="10"
              value={preferences.polling.inPlayIntervalSeconds}
              onChange={(e) =>
                handleNestedChange(
                  "polling",
                  "inPlayIntervalSeconds",
                  Math.max(30, parseInt(e.target.value, 10) || 60)
                )
              }
            />
            <p className="setting-hint">
              How often to check for updates during live matches (min: 30s)
            </p>
          </div>

          <div className="setting-group">
            <label htmlFor="idleInterval">Idle Interval (seconds)</label>
            <input
              type="number"
              id="idleInterval"
              min="60"
              max="900"
              step="30"
              value={preferences.polling.idleIntervalSeconds}
              onChange={(e) =>
                handleNestedChange(
                  "polling",
                  "idleIntervalSeconds",
                  Math.max(60, parseInt(e.target.value, 10) || 300)
                )
              }
            />
            <p className="setting-hint">
              How often to check when no matches are live (min: 60s)
            </p>
          </div>
        </section>
      </main>

      <footer className="options-footer">
        <div className="footer-actions">
          <button
            className="button secondary"
            onClick={handleReset}
            disabled={saveState === "saving"}
          >
            Reset to Defaults
          </button>
          <button
            className="button primary"
            onClick={handleSave}
            disabled={!hasChanges || saveState === "saving"}
          >
            {saveState === "saving" && "Saving..."}
            {saveState === "saved" && "✓ Saved!"}
            {saveState === "error" && "✗ Error"}
            {saveState === "idle" && "Save Settings"}
          </button>
        </div>
        {hasChanges && saveState === "idle" && (
          <p className="unsaved-warning">You have unsaved changes</p>
        )}
      </footer>
    </div>
  );
};

export default App;
