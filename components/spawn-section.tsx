"use client"

import { useGame } from "@/lib/game-context"
import { useEffect, useState } from "react"
import Image from "next/image"

export function SpawnSection() {
  const { state, visitArea, incrementClick, discoverLore } = useGame()
  const [showLore, setShowLore] = useState(false)

  useEffect(() => {
    if (state.gameStarted) {
      visitArea("spawn")
    }
  }, [state.gameStarted, visitArea])

  const handleLoreClick = () => {
    incrementClick()
    const spawnLore = state.loreFragments.find((l) => l.location === "spawn" && !l.discovered)
    if (spawnLore) {
      discoverLore(spawnLore.id)
      setShowLore(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-6">
      {/* Animated Background Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #5F51C2 1px, transparent 1px),
            linear-gradient(to bottom, #6a5ec5ff 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 max-w-4xl mx-auto">
        {/* Main Title - improved typography */}
        <div className="mb-12">
          <p className="text-accent text-sm tracking-[0.5em] mb-6 animate-pulse font-medium">WELCOME TO</p>
          <h1 className="text-7xl md:text-9xl text-foreground mb-6 tracking-wider font-heading">Muhsin P</h1>
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-20 bg-accent/50" />
            <p className="text-foreground/80 text-xl tracking-[0.3em]">GAME DEVELOPER</p>
            <div className="h-px w-20 bg-accent/50" />
          </div>
        </div>

        {/* Character Frame - UPDATED */}
        <div className="relative mx-auto w-48 h-48 mb-8">
          {/* Decorative Frame Elements (Keep these!) */}
          <div className="absolute inset-0 border-2 border-accent/30 rotate-45 transform scale-75" />
          <div className="absolute inset-4 border border-accent/50 z-20" />

          {/* YOUR IMAGE GOES HERE */}
          <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden">
            <div className="w-32 h-32 relative">
              <Image
                src="/images/Potrait-1.jpeg"
                alt="Drac - Game Developer"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* Corner Accents (Keep these too!) */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-accent" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-accent" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-accent" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-accent" />
        </div>

        {/* Tagline - improved readability */}
        <p className="text-foreground/80 text-lg max-w-xl mx-auto leading-relaxed mb-8">
          Crafting immersive gaming experiences through code.
        </p>
        <p className="text-foreground/60 text-base max-w-md mx-auto leading-relaxed">
          Explore the map to discover my journey, projects, and secrets hidden throughout this portfolio.
        </p>

        {/* Scroll Indicator */}
        <div className="mt-16 animate-bounce">
          <div className="w-8 h-12 border-2 border-accent/50 rounded-full mx-auto flex justify-center pt-3">
            <div className="w-1.5 h-4 bg-accent rounded-full animate-pulse" />
          </div>
          <p className="text-foreground/50 text-sm mt-3 tracking-wide">Press M for Map</p>
        </div>
      </div>

      {showLore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-secondary/95">
          <div className="max-w-md w-full border-2 border-accent bg-secondary p-8 relative rounded-lg animate-in zoom-in duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent px-6 py-2 rounded">
              <span className="text-secondary text-xs font-bold tracking-wider">LORE DISCOVERED</span>
            </div>
            <div className="mt-6 mb-8">
              <p className="text-foreground text-center italic leading-relaxed text-lg">
                "{state.loreFragments.find((l) => l.location === "spawn")?.content}"
              </p>
            </div>
            <div className="text-center text-accent text-sm mb-6">+10 XP</div>
            <button
              onClick={() => setShowLore(false)}
              className="w-full py-3 bg-accent text-secondary font-bold hover:bg-accent/90 transition-colors rounded-lg"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
