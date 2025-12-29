"use client"

import { useState, useEffect } from "react"
import { GameStart } from "@/components/game-start"
import { GameHUD } from "@/components/game-hud"
import { GameNavigation } from "@/components/game-navigation"
import { NotificationToast } from "@/components/notification-toast"
import { SpawnSection } from "@/components/spawn-section"
import { StatsSection } from "@/components/stats-section"
import { InventorySection } from "@/components/inventory-section"
import { JourneySection } from "@/components/journey-section"
import { PuzzleRoom } from "@/components/puzzle-room"
import { WorldMap } from "@/components/world-map"
import { useGame } from "@/lib/game-context"

function GameContent() {
  const { state, incrementClick } = useGame()
  const [currentSection, setCurrentSection] = useState("spawn")
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "m" || e.key === "M") {
        if (state.gameStarted) {
          setShowMap((prev) => !prev)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [state.gameStarted])

  const handleNavigate = (section: string) => {
    incrementClick()
    setCurrentSection(section)
    setShowMap(false)
  }

  const renderSection = () => {
    switch (currentSection) {
      case "spawn":
        return <SpawnSection />
      case "stats":
        return <StatsSection />
      case "inventory":
        return <InventorySection />
      case "journey":
        return <JourneySection />
      case "puzzle":
        return <PuzzleRoom />
      default:
        return <SpawnSection />
    }
  }

  return (
    <main className="bg-background min-h-screen">
      <GameStart />
      <GameHUD />
      <GameNavigation currentSection={currentSection} onNavigate={handleNavigate} />
      <NotificationToast />

      {state.gameStarted && (
        <>
          {/* Map Toggle Button - improved styling */}
          <button
            onClick={() => {
              incrementClick()
              setShowMap(!showMap)
            }}
            className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-accent border-2 border-foreground/20 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg shadow-accent/30 hover-glow group"
          >
            <span className="text-secondary text-2xl font-bold">{showMap ? "×" : "M"}</span>
            <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/70 text-xs whitespace-nowrap bg-secondary px-2 py-1 rounded">
              Press M
            </span>
          </button>

          {/* World Map Overlay - fixed z-index and scroll */}
          {showMap && (
            <div className="fixed inset-0 z-30 pt-20 bg-secondary overflow-y-auto">
              <WorldMap currentSection={currentSection} onNavigate={handleNavigate} />
            </div>
          )}

          {/* Section Content */}
          <div className={`pt-20 ${showMap ? "hidden" : ""}`}>{renderSection()}</div>
        </>
      )}
    </main>
  )
}

export default function Home() {
  return <GameContent />
}
