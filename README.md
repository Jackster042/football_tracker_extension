# Football Match Tracker - Chrome Extension

A Chrome Extension (Manifest V3) that tracks live football match results using
OpenLigaDB as the data source. Built with React, TypeScript, and Vite.

## Features

- **Live Match Tracking**: View matches for Bundesliga and other German leagues
- **Watchlist**: Add matches to your watchlist for focused tracking
- **Notifications**: Get notified when goals are scored or match status changes
- **Smart Polling**: Faster updates during live matches, slower when idle
- **Badge Updates**: See the number of live watched matches in the extension badge

## Project Structure

```
football-tracker/
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite + CRXJS config
├── public/
│   └── icons/                # Extension icons (add your own)
├── src/
│   ├── manifest.ts           # MV3 manifest definition
│   ├── background/
│   │   └── service-worker.ts # Background polling & notifications
│   ├── popup/
│   │   ├── index.html        # Popup entry
│   │   ├── main.tsx          # Popup React mount
│   │   ├── App.tsx           # Popup main component
│   │   └── components/
│   │       ├── MatchCard.tsx # Individual match display
│   │       └── MatchList.tsx # Match list with sections
│   ├── options/
│   │   ├── index.html        # Options entry
│   │   ├── main.tsx          # Options React mount
│   │   └── App.tsx           # Options main component
│   ├── shared/
│   │   ├── types/
│   │   │   └── domain.ts     # TypeScript domain model
│   │   ├── api/
│   │   │   └── openLigaDbClient.ts  # API adapter (swappable)
│   │   ├── services/
│   │   │   ├── storage.ts    # Chrome storage wrapper
│   │   │   ├── diff.ts       # Match diff engine
│   │   │   └── notifications.ts     # Notification manager
│   │   └── constants.ts      # App constants
│   └── styles/
│       └── global.css        # Global styles
└── README.md
```

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- Google Chrome browser

### Development Setup

1. **Install dependencies:**

```bash
cd football-tracker
npm install
```

This will automatically run `npm run setup` to create placeholder icons.

2. **Build the extension:**

```bash
npm run build
```

This creates a `dist/` folder with the compiled extension.

3. **Load in Chrome:**

- Open Chrome and go to `chrome://extensions/`
- Enable "Developer mode" (toggle in top-right)
- Click "Load unpacked"
- Select the `dist/` folder
- The extension should now appear with its icon in the toolbar

### Development Mode

For active development with hot reload:

```bash
npm run dev
```

Then load the extension from the `dist/` folder. The extension will auto-reload
when you make changes (you may need to click the refresh icon in
`chrome://extensions/` for service worker changes).

## Usage

### Popup

1. Click the extension icon to open the popup
2. Browse matches for the configured league/season
3. Click the ☆ star icon to add matches to your watchlist
4. Click 🔄 to refresh match data
5. Click ⚙️ to open settings

### Settings

- **League**: Choose from Bundesliga, 2. Bundesliga, 3. Liga, or DFB-Pokal
- **Season**: Select the season year
- **Goal Notifications**: Toggle notifications for goals
- **Match Event Notifications**: Toggle notifications for kickoff/halftime/fulltime
- **In-Play Interval**: How often to poll during live matches (default: 60s)
- **Idle Interval**: How often to poll when no matches are live (default: 300s)

## API Adapter Pattern

The extension is designed to easily swap the data provider. The
`openLigaDbClient.ts` implements a `MatchDataProvider` interface:

```typescript
interface MatchDataProvider {
  fetchMatchesByLeague(
    leagueShortcut: string,
    seasonYear: number
  ): Promise<Match[]>;
  fetchMatchById(matchId: number): Promise<Match>;
  fetchMatchesByIds(matchIds: number[]): Promise<Match[]>;
}
```

### Swapping to a Paid API

1. Create a new file (e.g., `src/shared/api/paidApiClient.ts`)

2. Implement the same interface, mapping the paid API's response to the
   domain `Match` type:

```typescript
import { Match, MatchDataProvider } from "../types/domain";

export const paidApiProvider: MatchDataProvider = {
  async fetchMatchesByLeague(league, season) {
    // Call paid API and map response
    const response = await fetch(`https://paid-api.com/...`);
    const data = await response.json();
    return data.map(mapPaidApiToMatch);
  },
  // ... other methods
};
```

3. Update imports in:

   - `src/background/service-worker.ts`
   - `src/popup/App.tsx`

4. Add new host permissions to `src/manifest.ts` if needed

The domain model (`Match`, `Team`, `Score`, etc.) remains unchanged, so the
rest of the application (diff engine, notifications, UI) works without
modification.

## OpenLigaDB API Notes

The extension uses these OpenLigaDB endpoints:

- `GET /api/getmatchdata/{league}/{season}` - All matches for a league/season
- `GET /api/getmatchdata/{matchId}` - Single match by ID

**Limitations:**

- OpenLigaDB doesn't provide real-time minute data, so match minutes are
  estimated based on elapsed time
- Status detection (halftime, etc.) is inferred from available data
- Only German leagues are available

A paid API like football-data.org or API-Football would provide:

- Real-time match minutes
- More accurate status updates
- More leagues and competitions
- Player-level events (who scored)

## Technical Details

### MV3 Compliance

- Uses `chrome.alarms` for polling (no persistent background)
- Service worker properly handles startup/install events
- All storage uses `chrome.storage.sync` and `chrome.storage.local`

### Polling Logic

- In-play interval used when any watched match is live
- Idle interval used when no matches are live
- Exponential backoff on network errors (up to 5 retries)
- Automatic recovery when connection restores

### Notification Deduplication

Events are deduplicated using signatures:

- Goal: `goal:{matchId}:{home}-{away}`
- Status: `status:{matchId}:{status}`

Processed signatures are stored and trimmed to prevent memory growth.

## Troubleshooting

### Extension not loading

- Ensure all icon files exist in `public/icons/`
- Check for TypeScript errors: `npm run build`
- Look for errors in `chrome://extensions/`

### Notifications not showing

- Check notification permissions in Chrome settings
- Ensure notifications are enabled in extension options
- Check if matches are in your watchlist

### Data not updating

- Click the refresh button in popup
- Check browser console for API errors
- Verify network connection

## License

MIT
