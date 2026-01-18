# Here are three design concepts to achieve the "Dro

1. The "Accordion Drawer" Approach (Cleanest)


Instead of a traditional select-box dropdown, use a wide action button that expands the list downwards.


- The UI: Below your Live matches, place a full-width button with a subtle glassmorphism effect.

- The Label: "Show Schedule (12 Matches)" with a chevron icon (v).

- The Interaction: When clicked, the extension window expands (if needed) and the Upcoming matches slide out using a smooth CSS transition.

- Why it works: It maintains the vertical flow of your current design without introducing new navigation patterns. It keeps the focus entirely on the live score until the user explicitly asks for more.

2. The "Filter Pill" Navigation


Since you already have league filters (BL1, 2025), you can integrate the "view" toggle right there.


- The UI: Add a secondary row of "Pills" or Tabs below the league selector.
	- [ Live (1) ]  [ Upcoming ] [ Finished ]


- The Interaction: By default, "Live" is selected. If the user clicks "Upcoming," the Live match card is replaced by the list of upcoming games.

- Why it works: It’s extremely "app-like." It prevents the window from becoming too long and keeps the user's eyes in the same focal area.

3. The "Floating Bottom Sheet" (Modern)


If you want a more modern, mobile-inspired feel, use a "Peek" menu at the bottom.


- The UI: At the very bottom of the extension, have a small handle bar or a button that says "Upcoming Games."

- The Interaction: Clicking it slides a "drawer" up from the bottom that covers the Live matches or pushes them up.

- Why it works: It’s great for one-handed use (if you ever port this to a mobile web wrapper) and separates "Real-time data" (Top) from "Static data" (Bottom).


---

UX/UI Refinements for your current cards:


To make the redesign feel "smoother," consider these styling tweaks:


1. Status Indicators: For the Live match, instead of a solid red box for the time (90'), use a pulsing red dot next to the time. It signals "Live" more intuitively than static text.

2. Visual Hierarchy:
	- Make the Team Names slightly larger or bolder than the "Upcoming" date.

	- Use a lower opacity for the "vs" or the date text to make the team names pop.


3. The "Empty State": If there are no live matches, don't just show a blank space. Show a friendly message: "No matches live right now. Next match starts in 2 hours." with a button to view the full schedule.

4. Glassmorphism: Your background is dark and nice. Using backdrop-filter: blur(10px); on your toggle button and card backgrounds will give it a premium "Windows 11/MacOS" feel.

Example CSS for a smooth Expandable section:

	.upcoming-container {
	  max-height: 0;
	  overflow: hidden;
	  transition: max-height 0.3s ease-out;
	}
	
	.upcoming-container.is-open {
	  max-height: 500px; /* Adjust based on content */
	  overflow-y: auto;
	}

Recommendation: I would go with Option 2 (Filter Pills). It is the most efficient use of space and allows users to quickly toggle between "What is happening now" and "What is happening later" without scrolling.
