"use client"

import { useState, useEffect } from "react"
import { useGame } from "@/lib/game-context"

export function GameStart() {
  const { state, startGame } = useGame()
  const [playerName, setPlayerName] = useState("")
  const [isStarting, setIsStarting] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>(
    [],
  )

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

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
    <div className="fixed inset-0 z-[100] bg-secondary flex items-center justify-center overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-accent/20 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}

      <div
        className={`text-center transition-all duration-1000 ${
          isStarting ? "opacity-0 scale-110" : "opacity-100 scale-100"
        }`}
      >
        {/* Game Logo - improved typography */}
        <div className="mb-12">
          <h1 className="text-7xl md:text-9xl text-foreground mb-4 tracking-wider font-heading">GoStark</h1>
          <p className="text-accent text-2xl tracking-[0.5em] font-light">PORTFOLIO QUEST</p>
        </div>

        {/* Decorative Border - improved padding and contrast */}
        <div className="relative max-w-lg mx-auto mb-8">
          <div className="absolute -inset-1 bg-accent/30 blur-xl" />
          <div className="relative bg-secondary border-2 border-accent p-10 rounded-lg">
            <p className="text-foreground/90 mb-8 text-base leading-relaxed">
              Welcome, traveler. You are about to embark on a journey through the realms of a game developer. Discover
              projects, uncover lore, solve puzzles, and earn achievements.
            </p>

            <div className="mb-8">
              <label className="block text-foreground/70 text-sm mb-3 text-left tracking-wide">ENTER YOUR NAME</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="Adventurer"
                className="w-full bg-secondary border-2 border-accent/50 focus:border-accent px-5 py-4 text-foreground text-lg placeholder:text-foreground/30 outline-none transition-all duration-300 rounded-lg"
                maxLength={20}
              />
            </div>

            <button
              onClick={handleStart}
              disabled={!playerName.trim()}
              className="w-full py-4 bg-accent text-secondary text-lg font-bold tracking-wider hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-lg"
            >
              BEGIN JOURNEY
            </button>
          </div>
        </div>

        <p className="text-foreground/40 text-sm animate-pulse">Tip: Explore every corner to find hidden secrets!</p>
      </div>
    </div>
  )
}
