# Project Plan: Sports App Visual Design & User Flow

Overview


Goal: Develop a high-fidelity, premium dark-themed sports application focused on real-time scores, league tracking, and a media-rich content feed.

Phase 1: Design System & Foundation


Objective: Establish the "Premium Dark" aesthetic across the app.


-  Task 1.1: Color Palette & Theme Setup ✅ COMPLETED
	- Implement a dark theme using:
		- Background: Primary #000000 (True Black), Secondary #121212 (Charcoal).

		- Primary Accent: #4F70F0 (Vibrant Blue) for active states and buttons.

		- Text: #FFFFFF (High emphasis), #A0A0A0 (Medium emphasis/Subtitles).

		- Status: #E91E63 (Live/Hot indicator).

	✅ Complete theme system created in `src/theme/`:
		- colors.ts: Full color palette with backgrounds, primary, accent, text, border colors
		- typography.ts: Complete font system with presets for all text styles
		- spacing.ts: 4px-based spacing scale and layout patterns
		- radius.ts: Border radius system for all components
		- shadows.ts: Platform-specific shadow styles (iOS & Android)
		- README.md: Full documentation with usage examples



-  Task 1.2: Typography & Components
	- Set up a clean Sans-Serif font (e.g., Inter or Roboto).

	- Create reusable "Pill" components for filters (e.g., "Sort by Time", "Videos", "News").

	- Design the "League Header" component (Flag icon + League Name + Chevron).


Phase 2: Navigation Architecture


Objective: Build the skeleton of the app navigation.


-  Task 2.1: Main Bottom Navigation Bar ✅ COMPLETED
	- Create the 5-tab bar: Home, Favorites, Live, Leagues, Feed.

	- Implement the active state indicator (Blue icon + Text + Blue top-border/pill).

	- Note: Ensure the spelling is "Leagues" (not "Leauges").

	✅ Complete navigation system created:
		- BottomTabBar component with 5 tabs
		- TabButton component with active/inactive states
		- Custom TabIcon component for each tab type
		- Navigation types and configuration
		- All 5 screen placeholders (Home, Favorites, Live, Leagues, Feed)
		- Integrated into App.tsx with state management
		- Active state: Blue icon (#4F70F0), blue text, blue horizontal indicator (3px)
		- Inactive state: Gray icon (#A0A0A0), gray text
		- Documentation: PHASE_2_TASK_2.1_COMPLETE.md & NAVIGATION_IMPLEMENTATION.md


-  Task 2.2: Top App Bar & Filters ✅ COMPLETED
	- Implement the dynamic header with a Profile/Search icon (left/right).

	- Add the Horizontal Date Scroller (Wed Aug 30 ... Today ... Mon Sep 4) with the Calendar icon trigger.

	✅ Complete top bar and date scroller created:
		- TopAppBar component with profile icon (left) and action icons (right)
		- Custom icon components (Profile, Search, Settings, Calendar, Menu)
		- DateScroller component with horizontal scrolling dates
		- 7-day view (3 before, today, 3 after) with "TODAY" label
		- Active state highlighting with blue background
		- Calendar icon trigger for date picker modal
		- Integrated into HomeScreen with callback handlers
		- Documentation: PHASE_2_TASK_2.2_COMPLETE.md


Phase 3: Home Screen & Score Dashboard


Objective: Display dense sports data clearly.


-  Task 3.1: "Sort By" & Favorites List ✅ COMPLETED
	- Create the "Favourite Competitions" section with collapsible league rows.

	- Implement match result cards: [Home Logo] [Team Name] [Score/Time] [Away Logo].

	✅ Complete dashboard components created:
		- SortByHeader component with clock icon and match count (38/120)
		- LeagueHeader component with collapsible functionality
		- MatchCard component with team info, scores, and status (FT/HT/LIVE)
		- FavoriteSection component for section headers
		- Mock data with 8 leagues and 10 matches
		- Favorite leagues (Turkey, England, Spain) expanded by default
		- Other competitions section (Italy, Germany, France, Portugal, Netherlands)
		- State management for expand/collapse
		- Integrated into HomeScreen with full scrollable dashboard
		- Documentation: PHASE_3_TASK_3.1_COMPLETE.md


-  Task 3.2: Calendar Selection Modal ✅ COMPLETED
	- Build the "Select Date" bottom sheet/modal.

	- Implement the grid-style calendar view with "Star" indicators for match days.

	✅ Complete calendar modal created:
		- CalendarModal component as bottom sheet
		- Header with "TODAY" label and "Cancel" button
		- Month navigation with prev/next arrows
		- Grid-style calendar layout (7 columns x variable rows)
		- Weekday headers (S, M, T, W, T, F, S)
		- Date selection functionality
		- Gold star (★) indicators for match days
		- Today's date highlighted in blue
		- Selected date visual feedback
		- Slide animation from bottom
		- Backdrop overlay with touch to close
		- Integrated with HomeScreen calendar button
		- Mock match dates for September 2025
		- Documentation: PHASE_3_TASK_3.2_COMPLETE.md


Phase 4: Content Feed (Video & News)


Objective: Implement the social/media aspect of the app.


-  Task 4.1: "Video" Feed (Immersive Mode) ✅ COMPLETED
	- Create a vertical-scrolling full-screen video player UI.

	- Add overlay elements: Description (bottom left), Interaction buttons (Share, Like, Comment on bottom right).

	- Add the "Videos/News" toggle switch at the top.

	✅ Complete video feed created:
		- VideoCard component with full-screen layout
		- Play button overlay (centered 70px circle)
		- Description text at bottom left with timestamp
		- Action buttons (Share, Like, Comment) at bottom right
		- Like functionality with count updates
		- FeedHeader with "FEED" title and filter buttons
		- Country and Sport filter buttons (pill-shaped)
		- Videos/News toggle tabs (2-segment control)
		- CountrySelectionModal with 18 countries and flags
		- Vertical scrolling FlatList with snap-to-item
		- Mock video data (5 videos with Unsplash images)
		- Integrated into FeedScreen with state management
		- Gradient overlay for text readability
		- Text shadows for better contrast
		- Documentation: PHASE_4_TASK_4.1_COMPLETE.md


-  Task 4.2: "News" List & Article View
	- Build the News tab with image cards (Title, Author, Source, Time-ago).

	- Create the Article Detail view: High-res header image, author bio, and clean reading layout.


Phase 5: Interaction Modals & Filtering


Objective: Finalize user flow transitions.


-  Task 5.1: "Choose a Country" / "Choose a Sport" Bottom Sheets
	- Build the list-based selection modals with flags/icons.

	- Implement the "Search" functionality within these modals.


-  Task 5.2: User Flow Refinement
	- Ensure smooth transitions between the Feed filters (Country/Sport) and the content display.
