"use client"

import { useGame } from "@/lib/game-context"
import { useEffect } from "react"

export function SpawnSection() {
  const { state, visitArea } = useGame()

  useEffect(() => {
    if (state.gameStarted) {
      visitArea("spawn")
    }
  }, [state.gameStarted, visitArea])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #5F51C2 1px, transparent 1px),
            linear-gradient(to bottom, #5F51C2 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 px-4">
        {/* Main Title */}
        <div className="mb-8">
          <p className="text-accent text-sm tracking-[0.3em] mb-4 animate-pulse">WELCOME TO</p>
          <h1 className="text-6xl md:text-8xl text-foreground mb-4 tracking-wider">GoStark</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-accent/50" />
            <p className="text-foreground/60 text-lg tracking-widest">GAME DEVELOPER</p>
            <div className="h-px w-16 bg-accent/50" />
          </div>
        </div>

        {/* Character Frame Placeholder */}
        <div className="relative mx-auto w-48 h-48 mb-8">
          <div className="absolute inset-0 border-2 border-accent/30 rotate-45 transform scale-75" />
          <div className="absolute inset-4 border border-accent/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-secondary border-2 border-accent/50 flex items-center justify-center">
              <span className="text-foreground/30 text-xs text-center px-2">[ Character Placeholder ]</span>
            </div>
          </div>
          {/* Corner Accents */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-accent" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-accent" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-accent" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-accent" />
        </div>

        {/* Tagline */}
        <p className="text-foreground/70 text-sm max-w-md mx-auto leading-relaxed">
          Crafting immersive gaming experiences through code.
          <br />
          Explore the map to discover my journey, projects, and secrets.
        </p>

        {/* Scroll Indicator */}
        <div className="mt-12 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent/50 rounded-full mx-auto flex justify-center pt-2">
            <div className="w-1 h-3 bg-accent rounded-full animate-pulse" />
          </div>
          <p className="text-foreground/40 text-xs mt-2">Scroll to explore</p>
        </div>
      </div>
    </div>
  )
}
