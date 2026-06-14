# Project Architecture & State

This document describes the current architecture and state of the gamified portfolio application. It serves as a comprehensive guide for agents to understand the project structure, state management, and room configurations.

---

## 1. Project Overview
The project is a gamified developer portfolio designed as a single-player web-based RPG experience. Instead of reading a standard document, users enter their name, explore rooms (Spawn, Stats, Projects/Inventory, Journey, and Puzzles), solve interactive mini-games, search for secrets, discover lore fragments, and earn experience points (XP) to level up.

---

## 2. Technology Stack
* **Framework**: Next.js (utilizing the App Router under the `app` directory)
* **Language**: TypeScript (`.ts`, `.tsx`)
* **Styling**: Tailwind CSS
* **Core Libraries**:
  * Radix UI primitives for accessible layout controls
  * Lucide React for consistent iconography
  * React hooks (`useReducer`, `useEffect`, `useState`, `useContext`) for state and DOM handling
  * Local Storage for client-side persistence

---

## 3. Directory Layout
Below is the workspace file structure:
* `app/`: Next.js pages and configurations.
  * `app/layout.tsx`: Wraps the application inside the global state provider.
  * `app/page.tsx`: Entry component that renders individual rooms based on navigation.
  * `app/globals.css`: Tailwind configuration and custom utility classes.
* `lib/`: Base state, utility helpers, and configurations.
  * `lib/game-context.tsx`: Houses the state definitions, initial data, reducer actions, and state provider.
  * `lib/utils.ts`: Small utility file containing Tailwind-merge configuration.
* `components/`: Modular React components.
  * **Core Game Elements**:
    * `game-start.tsx`: Interactive character name prompt and initial screen.
    * `game-hud.tsx`: Persistent HUD displaying XP, Levels, Points, and Achievements.
    * `game-navigation.tsx`: Controller for transitioning between rooms.
    * `notification-toast.tsx`: Toast triggers displaying unlocked achievements and lore discoveries.
  * **Room Views**:
    * `spawn-section.tsx`: The starting screen containing developer basics and portrait.
    * `stats-section.tsx`: Displays developer backstory, skills progress bar, and equipment list.
    * `inventory-section.tsx`: Shows project cards matching specific rarities and categories.
    * `journey-section.tsx`: Timeline path showcasing career and personal milestones.
    * `puzzle-room.tsx`: Playground containing Word, Sequence, and Memory puzzles.
    * `world-map.tsx`: Overall map showing node paths, secrets, and floating lore.
  * **Unused/Legacy Components**:
    * `about-section.tsx`, `hero-section.tsx`, `navigation.tsx`, `projects-section.tsx`: Retained from the previous static page layout.

---

## 4. State Management (`lib/game-context.tsx`)

The global game state is managed via a single `useReducer` inside `GameProvider`.

### GameState Schema
The game state stores:
* `playerName`: string
* `level`: number (derived from current experience)
* `experience`: number (total XP earned)
* `totalPoints`: number (total score)
* `achievements`: List of `Achievement` objects (id, title, description, points, unlocked, icon)
* `loreFragments`: List of `LoreFragment` objects (id, title, content, discovered, location)
* `visitedAreas`: List of section IDs visited by the player
* `puzzlesSolved`: List of solved puzzle IDs
* `gameStarted`: boolean flag
* `clickCount`: number of clicks on interactive components
* `timeSpent`: timestamp tracks duration of active gameplay
* `secretsFound`: List of discovered secret IDs

### Leveling Formula
Experience points (XP) map to character level using:
```typescript
function calculateLevel(experience: number): number {
  return Math.floor(experience / 100) + 1
}
```

### Action Types
* `START_GAME`: Sets name and marks `gameStarted` true. Grants "First Spawn" achievement.
* `VISIT_AREA`: Adds a room ID to `visitedAreas`. Triggers "Explorer" (if 5 unique areas visited) and check for "Speed Runner" (all areas visited in under 60 seconds).
* `INCREMENT_CLICK`: Increases count. Triggers "Curious One" at 50 clicks.
* `FIND_SECRET`: Adds secret ID. Unlocks "Secret Finder" achievement.
* `UNLOCK_ACHIEVEMENT`: Unlocks a specific achievement by ID. Triggers "Completionist" when all other achievements are unlocked.
* `DISCOVER_LORE`: Discovers a lore fragment. Triggers "Lore Hunter" (at 3 fragments) and "Lore Master" (when all fragments are discovered).
* `SOLVE_PUZZLE`: Marks a puzzle as solved. Triggers "Puzzle Master" (first puzzle) and "Puzzle Solver" (all 3 puzzles solved).
* `ADD_EXPERIENCE`: Directly increases experience.
* `LOAD_STATE`: Restores state from local storage.
* `RESET_GAME`: Destroys local storage state and resets state variables.

---

## 5. Room State Detail

### Spawn Chamber (`components/spawn-section.tsx`)
* Tracks: First entrance area.
* Interactive elements: Portrait visual hover effect and spawn lore discovery triggers.

### Stats Chamber (`components/stats-section.tsx`)
* Tracks: Character attributes.
* Interactive elements: Visual hover on portrait avatar, list of tech equipment/tools, and custom traits layout.

### Inventory Hall (`components/inventory-section.tsx`)
* Tracks: List of 5 portfolio projects (Travel Tribe, Gyro Aid, Techy Pookalam, Lullaby Down Below, Code Sanitizer).
* Interactive elements: Rarity filter tabs (all, completed, in-progress). Clicking a project opens a detailed presentation modal.

### Journey Map (`components/journey-section.tsx`)
* Tracks: Milestones (Stride Makethon, Lullaby Down Below).
* Interactive elements: Sequential loading animation for cards and SVG path overlay.

### Puzzle Chamber (`components/puzzle-room.tsx`)
* Tracks: Completion status of three games.
* Games:
  1. *Word Puzzle*: Click-to-swap letter ordering puzzle.
  2. *Sequence Puzzle*: Keypress/Click sequence tracking.
  3. *Memory Puzzle*: 4-pair grid matching game.
* Interactive elements: Floating question marks that reveal lore fragments when clicked.

### World Map (`components/world-map.tsx`)
* Tracks: Exploration status of the whole app.
* Interactive elements: Clickable node icons representing different rooms, floating question marks for map lore, and small hidden question marks in the corners representing hidden secrets.
