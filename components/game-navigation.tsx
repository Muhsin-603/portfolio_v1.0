"use client"

import { useGame } from "@/lib/game-context"

interface GameNavigationProps {
  currentSection: string
  onNavigate: (section: string) => void
}

const navigationItems = [
  { id: "spawn", label: "initial spawn", shortLabel: "HOME" },
  { id: "stats", label: "stats", shortLabel: "ABOUT" },
  { id: "inventory", label: "inventory", shortLabel: "PROJECTS" },
  { id: "journey", label: "map", shortLabel: "JOURNEY" },
  { id: "puzzle", label: "secrets", shortLabel: "PUZZLE" },
]

export function GameNavigation({ currentSection, onNavigate }: GameNavigationProps) {
  const { state, resetGame } = useGame()

  if (!state.gameStarted) return null

  return (
    <nav className="fixed bottom-0 md:top-16 md:bottom-auto left-0 right-0 z-40 px-4 py-2 bg-secondary/90 md:bg-secondary/80 border-t md:border-t-0 md:border-b border-accent/20 backdrop-blur-sm shadow-lg md:shadow-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <button onClick={() => onNavigate("spawn")} className="hidden md:flex items-center gap-2 group">
          <div className="text-foreground text-xl tracking-wider group-hover:text-accent transition-colors">
            GoStark
          </div>
        </button>

        <div className="flex items-center justify-between md:justify-center w-full md:w-auto gap-1 md:gap-4">
          {navigationItems.map((item) => {
            const isActive = currentSection === item.id
            const isVisited = state.visitedAreas.includes(item.id)

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-2 md:px-4 py-1 text-xs md:text-sm transition-all duration-300 relative
                  ${isActive ? "text-accent" : "text-foreground/60 hover:text-foreground"}
                `}
              >
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">{item.shortLabel}</span>
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
                {!isVisited && !isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent/50 rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        <button
          onClick={resetGame}
          className="hidden md:block text-xs text-foreground/40 hover:text-foreground/60 transition-colors px-2 py-1 border border-transparent hover:border-foreground/20"
        >
          Reset
        </button>
      </div>
    </nav>
  )
}
