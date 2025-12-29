"use client"

import { useState } from "react"
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
  const { state } = useGame()
  const [currentSection, setCurrentSection] = useState("spawn")
  const [showMap, setShowMap] = useState(false)

  const handleNavigate = (section: string) => {
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
      {/* Game Start Screen */}
      <GameStart />

      {/* HUD - Top Bar with Stats */}
      <GameHUD />

      {/* Navigation */}
      <GameNavigation currentSection={currentSection} onNavigate={handleNavigate} />

      {/* Notification Toasts */}
      <NotificationToast />

      {/* Main Content */}
      {state.gameStarted && (
        <>
          {/* Map Toggle Button */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-accent border-2 border-foreground/20 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          >
            <span className="text-foreground text-xl">{showMap ? "×" : "M"}</span>
          </button>

          {/* World Map Overlay */}
          {showMap && (
            <div className="fixed inset-0 z-30 pt-28">
              <WorldMap currentSection={currentSection} onNavigate={handleNavigate} />
            </div>
          )}

          {/* Section Content */}
          <div className={`pt-28 ${showMap ? "hidden" : ""}`}>{renderSection()}</div>
        </>
      )}
    </main>
  )
}

export default function Home() {
  return <GameContent />
}
