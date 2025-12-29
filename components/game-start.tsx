"use client"

import { useState } from "react"
import { useGame } from "@/lib/game-context"

export function GameStart() {
  const { state, startGame, resetGame } = useGame()
  const [playerName, setPlayerName] = useState("")
  const [isStarting, setIsStarting] = useState(false)

  if (state.gameStarted) {
    return null
  }

  const handleStart = () => {
    if (playerName.trim()) {
      setIsStarting(true)
      setTimeout(() => {
        startGame(playerName.trim())
      }, 1000)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-secondary flex items-center justify-center">
      <div
        className={`text-center transition-all duration-1000 ${
          isStarting ? "opacity-0 scale-110" : "opacity-100 scale-100"
        }`}
      >
        {/* Game Logo */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl text-foreground mb-2 tracking-wider">GoStark</h1>
          <p className="text-accent text-xl tracking-widest">PORTFOLIO QUEST</p>
        </div>

        {/* Decorative Border */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="absolute -inset-1 bg-accent/30 blur" />
          <div className="relative bg-secondary border-2 border-accent p-8">
            <p className="text-foreground/80 mb-6 text-sm leading-relaxed">
              Welcome, traveler. You are about to embark on a journey through the realms of a game developer. Discover
              projects, uncover lore, solve puzzles, and earn achievements.
            </p>

            <div className="mb-6">
              <label className="block text-foreground/60 text-xs mb-2 text-left">ENTER YOUR NAME</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="Adventurer"
                className="w-full bg-secondary border-2 border-accent/50 focus:border-accent px-4 py-3 text-foreground placeholder:text-foreground/30 outline-none transition-colors"
                maxLength={20}
              />
            </div>

            <button
              onClick={handleStart}
              disabled={!playerName.trim()}
              className="w-full py-3 bg-accent text-foreground font-bold tracking-wider hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              BEGIN JOURNEY
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-accent animate-pulse" />
        <div className="absolute top-40 right-32 w-3 h-3 bg-foreground/20 animate-pulse delay-300" />
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-accent/50 animate-pulse delay-500" />
      </div>
    </div>
  )
}
