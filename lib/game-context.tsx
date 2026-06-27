"use client"

import { createContext, useContext, useReducer, useEffect, useMemo, useCallback, useRef, type ReactNode } from "react"

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
  clickCount: number
  timeSpent: number
  secretsFound: string[]
  isStateLoaded?: boolean
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
    id: "speed_runner",
    title: "Speed Runner",
    description: "Visit all areas in under 60 seconds",
    points: 40,
    unlocked: false,
    icon: "⚡",
  },
  {
    id: "curious_one",
    title: "Curious One",
    description: "Click on 50 interactive elements",
    points: 25,
    unlocked: false,
    icon: "🔍",
  },
  {
    id: "lore_master",
    title: "Lore Master",
    description: "Discover all lore fragments",
    points: 75,
    unlocked: false,
    icon: "📚",
  },
  {
    id: "puzzle_solver",
    title: "All Puzzles Complete",
    description: "Solve all available puzzles",
    points: 60,
    unlocked: false,
    icon: "🏆",
  },
  {
    id: "secret_finder",
    title: "Secret Finder",
    description: "Discover a hidden secret",
    points: 35,
    unlocked: false,
    icon: "🔮",
  },
  {
    id: "dedicated",
    title: "Dedicated Explorer",
    description: "Spend 5 minutes exploring",
    points: 30,
    unlocked: false,
    icon: "⏰",
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
  {
    id: "lore_6",
    title: "The Journey",
    content: "Every game shipped is a battle won. Every bug fixed, a lesson learned.",
    discovered: false,
    location: "journey",
  },
  {
    id: "lore_7",
    title: "The Philosophy",
    content: "Code is poetry. Games are symphonies. Players are the audience that makes it real.",
    discovered: false,
    location: "spawn",
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
  clickCount: 0,
  timeSpent: 0,
  secretsFound: [],
  isStateLoaded: false,
}

type GameAction =
  | { type: "START_GAME"; playerName: string; timestamp: number }
  | { type: "VISIT_AREA"; area: string; timestamp: number }
  | { type: "UNLOCK_ACHIEVEMENT"; id: string }
  | { type: "DISCOVER_LORE"; id: string }
  | { type: "SOLVE_PUZZLE"; id: string }
  | { type: "ADD_EXPERIENCE"; amount: number }
  | { type: "LOAD_STATE"; state: GameState }
  | { type: "SET_STATE_LOADED" }
  | { type: "RESET_GAME" }
  | { type: "INCREMENT_CLICK" }
  | { type: "UPDATE_TIME"; time: number }
  | { type: "FIND_SECRET"; secretId: string }

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
        timeSpent: action.timestamp,
      }

      const achievements = newState.achievements.map((achievement) =>
        achievement.id === "first_spawn" ? { ...achievement, unlocked: true } : achievement
      )
      const points = achievements.find((achievement) => achievement.id === "first_spawn")?.points || 0

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
      let addedPoints = 5

      if (visitedAreas.length >= 5) {
        achievements = achievements.map((achievement) =>
          achievement.id === "explorer" && !achievement.unlocked ? { ...achievement, unlocked: true } : achievement
        )
        const explorerAchievement = achievements.find((achievement) => achievement.id === "explorer")
        if (explorerAchievement?.unlocked && !state.achievements.find((achievement) => achievement.id === "explorer")?.unlocked) {
          addedPoints += explorerAchievement.points
        }
      }

      if (visitedAreas.length >= 5 && state.timeSpent > 0) {
        const elapsed = (action.timestamp - state.timeSpent) / 1000
        if (elapsed < 60) {
          achievements = achievements.map((achievement) =>
            achievement.id === "speed_runner" && !achievement.unlocked ? { ...achievement, unlocked: true } : achievement,
          )
          const speedAchievement = achievements.find((achievement) => achievement.id === "speed_runner")
          if (speedAchievement?.unlocked && !state.achievements.find((achievement) => achievement.id === "speed_runner")?.unlocked) {
            addedPoints += speedAchievement.points
          }
        }
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

    case "INCREMENT_CLICK": {
      const newClickCount = state.clickCount + 1
      let achievements = [...state.achievements]
      let addedPoints = 0

      if (newClickCount >= 50) {
        achievements = achievements.map((achievement) =>
          achievement.id === "curious_one" && !achievement.unlocked ? { ...achievement, unlocked: true } : achievement
        )
        const curiousAchievement = achievements.find((achievement) => achievement.id === "curious_one")
        if (curiousAchievement?.unlocked && !state.achievements.find((achievement) => achievement.id === "curious_one")?.unlocked) {
          addedPoints += curiousAchievement.points
        }
      }

      return {
        ...state,
        clickCount: newClickCount,
        achievements,
        totalPoints: state.totalPoints + addedPoints,
        experience: state.experience + addedPoints,
        level: calculateLevel(state.experience + addedPoints),
      }
    }

    case "FIND_SECRET": {
      if (state.secretsFound.includes(action.secretId)) return state

      const secretsFound = [...state.secretsFound, action.secretId]
      let achievements = [...state.achievements]
      let addedPoints = 15

      achievements = achievements.map((achievement) =>
        achievement.id === "secret_finder" && !achievement.unlocked ? { ...achievement, unlocked: true } : achievement
      )
      const secretAchievement = achievements.find((achievement) => achievement.id === "secret_finder")
      if (secretAchievement?.unlocked && !state.achievements.find((achievement) => achievement.id === "secret_finder")?.unlocked) {
        addedPoints += secretAchievement.points
      }

      return {
        ...state,
        secretsFound,
        achievements,
        totalPoints: state.totalPoints + addedPoints,
        experience: state.experience + addedPoints,
        level: calculateLevel(state.experience + addedPoints),
      }
    }

    case "UNLOCK_ACHIEVEMENT": {
      const achievement = state.achievements.find((existingAchievement) => existingAchievement.id === action.id)
      if (!achievement || achievement.unlocked) return state

      const achievements = state.achievements.map((existingAchievement) =>
        existingAchievement.id === action.id ? { ...existingAchievement, unlocked: true } : existingAchievement
      )

      const unlockedCount = achievements.filter((existingAchievement) => existingAchievement.unlocked && existingAchievement.id !== "completionist").length
      if (unlockedCount === achievements.length - 1) {
        const finalAchievements = achievements.map((existingAchievement) =>
          existingAchievement.id === "completionist" ? { ...existingAchievement, unlocked: true } : existingAchievement
        )
        const completionistPoints = finalAchievements.find((existingAchievement) => existingAchievement.id === "completionist")?.points || 0
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
      const lore = state.loreFragments.find((fragment) => fragment.id === action.id)
      if (!lore || lore.discovered) return state

      const loreFragments = state.loreFragments.map((fragment) =>
        fragment.id === action.id ? { ...fragment, discovered: true } : fragment
      )
      const discoveredCount = loreFragments.filter((fragment) => fragment.discovered).length
      let achievements = [...state.achievements]
      let addedPoints = 10

      if (discoveredCount >= 3) {
        achievements = achievements.map((achievement) =>
          achievement.id === "lore_hunter" && !achievement.unlocked ? { ...achievement, unlocked: true } : achievement
        )
        const loreAchievement = achievements.find((achievement) => achievement.id === "lore_hunter")
        if (loreAchievement?.unlocked && !state.achievements.find((achievement) => achievement.id === "lore_hunter")?.unlocked) {
          addedPoints += loreAchievement.points
        }
      }

      if (discoveredCount === loreFragments.length) {
        achievements = achievements.map((achievement) =>
          achievement.id === "lore_master" && !achievement.unlocked ? { ...achievement, unlocked: true } : achievement
        )
        const loreMasterAchievement = achievements.find((achievement) => achievement.id === "lore_master")
        if (loreMasterAchievement?.unlocked && !state.achievements.find((achievement) => achievement.id === "lore_master")?.unlocked) {
          addedPoints += loreMasterAchievement.points
        }
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
        achievements = achievements.map((achievement) =>
          achievement.id === "puzzle_master" && !achievement.unlocked ? { ...achievement, unlocked: true } : achievement
        )
        const puzzleAchievement = achievements.find((achievement) => achievement.id === "puzzle_master")
        if (puzzleAchievement?.unlocked) addedPoints += puzzleAchievement.points
      }

      if (puzzlesSolved.length >= 3) {
        achievements = achievements.map((achievement) =>
          achievement.id === "puzzle_solver" && !achievement.unlocked ? { ...achievement, unlocked: true } : achievement
        )
        const allPuzzlesAchievement = achievements.find((achievement) => achievement.id === "puzzle_solver")
        if (allPuzzlesAchievement?.unlocked && !state.achievements.find((achievement) => achievement.id === "puzzle_solver")?.unlocked) {
          addedPoints += allPuzzlesAchievement.points
        }
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
      return { ...action.state, isStateLoaded: true }

    case "SET_STATE_LOADED":
      return { ...state, isStateLoaded: true }

    case "RESET_GAME":
      return { ...initialState }

    default:
      return state
  }
}

function isValidGameState(loadedState: any): loadedState is GameState {
  if (!loadedState || typeof loadedState !== "object") {
    return false
  }

  const hasPlayerName = typeof loadedState.playerName === "string"
  const hasLevel = typeof loadedState.level === "number"
  const hasExperience = typeof loadedState.experience === "number"
  const hasTotalPoints = typeof loadedState.totalPoints === "number"
  const hasAchievements = Array.isArray(loadedState.achievements)
  const hasLoreFragments = Array.isArray(loadedState.loreFragments)
  const hasVisitedAreas = Array.isArray(loadedState.visitedAreas)
  const hasPuzzlesSolved = Array.isArray(loadedState.puzzlesSolved)
  const hasGameStarted = typeof loadedState.gameStarted === "boolean"
  const hasClickCount = typeof loadedState.clickCount === "number"
  const hasTimeSpent = typeof loadedState.timeSpent === "number"
  const hasSecretsFound = Array.isArray(loadedState.secretsFound)

  return (
    hasPlayerName &&
    hasLevel &&
    hasExperience &&
    hasTotalPoints &&
    hasAchievements &&
    hasLoreFragments &&
    hasVisitedAreas &&
    hasPuzzlesSolved &&
    hasGameStarted &&
    hasClickCount &&
    hasTimeSpent &&
    hasSecretsFound
  )
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
  incrementClick: () => void
  findSecret: (secretId: string) => void
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const achievementsReference = useRef(state.achievements)

  useEffect(() => {
    achievementsReference.current = state.achievements
  }, [state.achievements])

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-game-state")

    if (saved) {
      try {
        const parsed = JSON.parse(saved)

        if (isValidGameState(parsed)) {
          dispatch({ type: "LOAD_STATE", state: parsed })
        } else {
          dispatch({ type: "SET_STATE_LOADED" })
        }
      } catch (error) {
        console.error("Failed to load game state")
        dispatch({ type: "SET_STATE_LOADED" })
      }
    } else {
      dispatch({ type: "SET_STATE_LOADED" })
    }
  }, [])

  useEffect(() => {
    if (!state.gameStarted) {
      return
    }

    const handler = setTimeout(() => {
      localStorage.setItem("portfolio-game-state", JSON.stringify(state))
    }, 1000)

    return () => clearTimeout(handler)
  }, [state])

  useEffect(() => {
    if (!state.gameStarted) {
      return
    }

    const interval = setInterval(() => {
      const elapsed = (Date.now() - state.timeSpent) / 1000
      const hasDedicatedUnlocked = achievementsReference.current.find((achievement) => achievement.id === "dedicated")?.unlocked

      if (elapsed >= 300 && !hasDedicatedUnlocked) {
        dispatch({ type: "UNLOCK_ACHIEVEMENT", id: "dedicated" })
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [state.gameStarted, state.timeSpent])

  const startGame = useCallback((name: string) => dispatch({ type: "START_GAME", playerName: name, timestamp: Date.now() }), [])
  const visitArea = useCallback((area: string) => dispatch({ type: "VISIT_AREA", area, timestamp: Date.now() }), [])
  const unlockAchievement = useCallback((id: string) => dispatch({ type: "UNLOCK_ACHIEVEMENT", id }), [])
  const discoverLore = useCallback((id: string) => dispatch({ type: "DISCOVER_LORE", id }), [])
  const solvePuzzle = useCallback((id: string) => dispatch({ type: "SOLVE_PUZZLE", id }), [])
  const addExperience = useCallback((amount: number) => dispatch({ type: "ADD_EXPERIENCE", amount }), [])
  const incrementClick = useCallback(() => dispatch({ type: "INCREMENT_CLICK" }), [])
  const findSecret = useCallback((secretId: string) => dispatch({ type: "FIND_SECRET", secretId }), [])
  const resetGame = useCallback(() => {
    localStorage.removeItem("portfolio-game-state")
    dispatch({ type: "RESET_GAME" })
  }, [])

  const value: GameContextType = useMemo(() => ({
    state,
    startGame,
    visitArea,
    unlockAchievement,
    discoverLore,
    solvePuzzle,
    addExperience,
    incrementClick,
    findSecret,
    resetGame,
  }), [
    state,
    startGame,
    visitArea,
    unlockAchievement,
    discoverLore,
    solvePuzzle,
    addExperience,
    incrementClick,
    findSecret,
    resetGame,
  ])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
