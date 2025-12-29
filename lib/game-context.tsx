"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

export interface Achievement {
  id: string
  title: string
  description: string
  points: number
  unlocked: boolean
  icon: string
}

export interface LoreFragment {
  id: string
  title: string
  content: string
  discovered: boolean
  location: string
}

export interface GameState {
  playerName: string
  level: number
  experience: number
  totalPoints: number
  achievements: Achievement[]
  loreFragments: LoreFragment[]
  visitedAreas: string[]
  puzzlesSolved: string[]
  gameStarted: boolean
}

const initialAchievements: Achievement[] = [
  {
    id: "first_spawn",
    title: "First Spawn",
    description: "Enter the world for the first time",
    points: 10,
    unlocked: false,
    icon: "⚔",
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Visit all areas on the map",
    points: 50,
    unlocked: false,
    icon: "🗺",
  },
  {
    id: "lore_hunter",
    title: "Lore Hunter",
    description: "Discover 3 lore fragments",
    points: 30,
    unlocked: false,
    icon: "📜",
  },
  {
    id: "puzzle_master",
    title: "Puzzle Master",
    description: "Solve your first puzzle",
    points: 25,
    unlocked: false,
    icon: "🧩",
  },
  {
    id: "story_seeker",
    title: "Story Seeker",
    description: "Read the developer's story",
    points: 15,
    unlocked: false,
    icon: "📖",
  },
  {
    id: "project_viewer",
    title: "Project Viewer",
    description: "View a project in the inventory",
    points: 20,
    unlocked: false,
    icon: "🎮",
  },
  {
    id: "completionist",
    title: "Completionist",
    description: "Unlock all other achievements",
    points: 100,
    unlocked: false,
    icon: "👑",
  },
]

const initialLoreFragments: LoreFragment[] = [
  {
    id: "lore_1",
    title: "The Beginning",
    content: "Every great developer starts with a simple 'Hello World'...",
    discovered: false,
    location: "map",
  },
  {
    id: "lore_2",
    title: "The First Bug",
    content: "It was 3 AM when the bug was found. Coffee was the only ally...",
    discovered: false,
    location: "puzzle",
  },
  {
    id: "lore_3",
    title: "The Revelation",
    content: "Games aren't just played. They're experienced, lived, remembered...",
    discovered: false,
    location: "story",
  },
  {
    id: "lore_4",
    title: "The Code",
    content: "Behind every pixel lies a thousand lines of passion...",
    discovered: false,
    location: "projects",
  },
  {
    id: "lore_5",
    title: "The Dream",
    content: "To create worlds where others can escape, even for a moment...",
    discovered: false,
    location: "map",
  },
]

const initialState: GameState = {
  playerName: "Adventurer",
  level: 1,
  experience: 0,
  totalPoints: 0,
  achievements: initialAchievements,
  loreFragments: initialLoreFragments,
  visitedAreas: [],
  puzzlesSolved: [],
  gameStarted: false,
}

type GameAction =
  | { type: "START_GAME"; playerName: string }
  | { type: "VISIT_AREA"; area: string }
  | { type: "UNLOCK_ACHIEVEMENT"; id: string }
  | { type: "DISCOVER_LORE"; id: string }
  | { type: "SOLVE_PUZZLE"; id: string }
  | { type: "ADD_EXPERIENCE"; amount: number }
  | { type: "LOAD_STATE"; state: GameState }
  | { type: "RESET_GAME" }

function calculateLevel(experience: number): number {
  return Math.floor(experience / 100) + 1
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const newState = {
        ...state,
        playerName: action.playerName,
        gameStarted: true,
      }
      // Auto-unlock first spawn achievement
      const achievements = newState.achievements.map((a) => (a.id === "first_spawn" ? { ...a, unlocked: true } : a))
      const points = achievements.find((a) => a.id === "first_spawn")?.points || 0
      return {
        ...newState,
        achievements,
        totalPoints: state.totalPoints + points,
        experience: state.experience + points,
        level: calculateLevel(state.experience + points),
      }
    }

    case "VISIT_AREA": {
      if (state.visitedAreas.includes(action.area)) return state
      const visitedAreas = [...state.visitedAreas, action.area]
      let achievements = [...state.achievements]
      let addedPoints = 5 // Base points for visiting

      // Check explorer achievement
      if (visitedAreas.length >= 4) {
        achievements = achievements.map((a) => (a.id === "explorer" && !a.unlocked ? { ...a, unlocked: true } : a))
        const explorerAchievement = achievements.find((a) => a.id === "explorer")
        if (explorerAchievement?.unlocked) addedPoints += explorerAchievement.points
      }

      return {
        ...state,
        visitedAreas,
        achievements,
        totalPoints: state.totalPoints + addedPoints,
        experience: state.experience + addedPoints,
        level: calculateLevel(state.experience + addedPoints),
      }
    }

    case "UNLOCK_ACHIEVEMENT": {
      const achievement = state.achievements.find((a) => a.id === action.id)
      if (!achievement || achievement.unlocked) return state

      const achievements = state.achievements.map((a) => (a.id === action.id ? { ...a, unlocked: true } : a))

      // Check completionist
      const unlockedCount = achievements.filter((a) => a.unlocked && a.id !== "completionist").length
      if (unlockedCount === achievements.length - 1) {
        const finalAchievements = achievements.map((a) => (a.id === "completionist" ? { ...a, unlocked: true } : a))
        const completionistPoints = finalAchievements.find((a) => a.id === "completionist")?.points || 0
        return {
          ...state,
          achievements: finalAchievements,
          totalPoints: state.totalPoints + achievement.points + completionistPoints,
          experience: state.experience + achievement.points + completionistPoints,
          level: calculateLevel(state.experience + achievement.points + completionistPoints),
        }
      }

      return {
        ...state,
        achievements,
        totalPoints: state.totalPoints + achievement.points,
        experience: state.experience + achievement.points,
        level: calculateLevel(state.experience + achievement.points),
      }
    }

    case "DISCOVER_LORE": {
      const lore = state.loreFragments.find((l) => l.id === action.id)
      if (!lore || lore.discovered) return state

      const loreFragments = state.loreFragments.map((l) => (l.id === action.id ? { ...l, discovered: true } : l))
      const discoveredCount = loreFragments.filter((l) => l.discovered).length
      let achievements = [...state.achievements]
      let addedPoints = 10

      // Check lore hunter achievement
      if (discoveredCount >= 3) {
        achievements = achievements.map((a) => (a.id === "lore_hunter" && !a.unlocked ? { ...a, unlocked: true } : a))
        const loreAchievement = achievements.find((a) => a.id === "lore_hunter")
        if (loreAchievement?.unlocked) addedPoints += loreAchievement.points
      }

      return {
        ...state,
        loreFragments,
        achievements,
        totalPoints: state.totalPoints + addedPoints,
        experience: state.experience + addedPoints,
        level: calculateLevel(state.experience + addedPoints),
      }
    }

    case "SOLVE_PUZZLE": {
      if (state.puzzlesSolved.includes(action.id)) return state
      const puzzlesSolved = [...state.puzzlesSolved, action.id]
      let achievements = [...state.achievements]
      let addedPoints = 15

      if (puzzlesSolved.length === 1) {
        achievements = achievements.map((a) => (a.id === "puzzle_master" && !a.unlocked ? { ...a, unlocked: true } : a))
        const puzzleAchievement = achievements.find((a) => a.id === "puzzle_master")
        if (puzzleAchievement?.unlocked) addedPoints += puzzleAchievement.points
      }

      return {
        ...state,
        puzzlesSolved,
        achievements,
        totalPoints: state.totalPoints + addedPoints,
        experience: state.experience + addedPoints,
        level: calculateLevel(state.experience + addedPoints),
      }
    }

    case "ADD_EXPERIENCE":
      return {
        ...state,
        experience: state.experience + action.amount,
        level: calculateLevel(state.experience + action.amount),
      }

    case "LOAD_STATE":
      return action.state

    case "RESET_GAME":
      return initialState

    default:
      return state
  }
}

interface GameContextType {
  state: GameState
  startGame: (name: string) => void
  visitArea: (area: string) => void
  unlockAchievement: (id: string) => void
  discoverLore: (id: string) => void
  solvePuzzle: (id: string) => void
  addExperience: (amount: number) => void
  resetGame: () => void
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-game-state")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        dispatch({ type: "LOAD_STATE", state: parsed })
      } catch (e) {
        console.error("Failed to load game state")
      }
    }
  }, [])

  // Save state on changes
  useEffect(() => {
    if (state.gameStarted) {
      localStorage.setItem("portfolio-game-state", JSON.stringify(state))
    }
  }, [state])

  const value: GameContextType = {
    state,
    startGame: (name) => dispatch({ type: "START_GAME", playerName: name }),
    visitArea: (area) => dispatch({ type: "VISIT_AREA", area }),
    unlockAchievement: (id) => dispatch({ type: "UNLOCK_ACHIEVEMENT", id }),
    discoverLore: (id) => dispatch({ type: "DISCOVER_LORE", id }),
    solvePuzzle: (id) => dispatch({ type: "SOLVE_PUZZLE", id }),
    addExperience: (amount) => dispatch({ type: "ADD_EXPERIENCE", amount }),
    resetGame: () => {
      localStorage.removeItem("portfolio-game-state")
      dispatch({ type: "RESET_GAME" })
    },
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
