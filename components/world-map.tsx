"use client"

import { useGame } from "@/lib/game-context"
import { useState, useEffect } from "react"

interface MapLocation {
  id: string
  name: string
  navName: string
  description: string
  x: number
  y: number
  size: "large" | "medium" | "small"
  type: "main" | "secret" | "puzzle"
  loreId?: string
}

const locations: MapLocation[] = [
  {
    id: "spawn",
    name: "Initial Spawn",
    navName: "Home",
    description: "Where every journey begins",
    x: 50,
    y: 50,
    size: "large",
    type: "main",
  },
  {
    id: "stats",
    name: "Stats Chamber",
    navName: "About",
    description: "Learn about the developer",
    x: 25,
    y: 30,
    size: "medium",
    type: "main",
  },
  {
    id: "inventory",
    name: "Inventory Hall",
    navName: "Projects",
    description: "View collected works",
    x: 75,
    y: 25,
    size: "medium",
    type: "main",
  },
  {
    id: "journey",
    name: "Journey Map",
    navName: "Journey",
    description: "The path traveled so far",
    x: 20,
    y: 70,
    size: "medium",
    type: "main",
  },
  {
    id: "puzzle",
    name: "Puzzle Chamber",
    navName: "Puzzles",
    description: "Mysteries await...",
    x: 80,
    y: 75,
    size: "medium",
    type: "puzzle",
  },
]

const floatingLorePositions = [
  { x: 40, y: 20, loreId: "lore_1" },
  { x: 60, y: 80, loreId: "lore_5" },
]

interface WorldMapProps {
  onNavigate: (section: string) => void
  currentSection: string
}

export function WorldMap({ onNavigate, currentSection }: WorldMapProps) {
  const { state, visitArea, discoverLore } = useGame()
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  const handleLocationClick = (location: MapLocation) => {
    visitArea(location.id)
    onNavigate(location.id)
  }

  const handleLoreClick = (loreId: string) => {
    discoverLore(loreId)
  }

  return (
    <div className="relative w-full h-screen bg-secondary overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #5F51C2 1px, transparent 1px),
            linear-gradient(to bottom, #5F51C2 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-accent/30 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5F51C2" stopOpacity="0" />
            <stop offset="50%" stopColor="#5F51C2" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#5F51C2" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Lines connecting locations */}
        <line x1="50%" y1="50%" x2="25%" y2="30%" stroke="url(#lineGradient)" strokeWidth="2" />
        <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="url(#lineGradient)" strokeWidth="2" />
        <line x1="50%" y1="50%" x2="20%" y2="70%" stroke="url(#lineGradient)" strokeWidth="2" />
        <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
      </svg>

      {/* Floating Lore Fragments */}
      {floatingLorePositions.map((lorePos) => {
        const lore = state.loreFragments.find((l) => l.id === lorePos.loreId)
        if (!lore || lore.discovered) return null
        return (
          <button
            key={lorePos.loreId}
            onClick={() => handleLoreClick(lorePos.loreId)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${lorePos.x}%`, top: `${lorePos.y}%` }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-accent/20 border border-accent rotate-45 animate-pulse group-hover:scale-125 transition-transform" />
              <div className="absolute inset-0 flex items-center justify-center text-accent text-lg">?</div>
            </div>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary border border-accent px-2 py-1 text-xs text-foreground whitespace-nowrap">
              Mysterious Fragment
            </div>
          </button>
        )
      })}

      {/* Map Locations */}
      {locations.map((location) => {
        const isVisited = state.visitedAreas.includes(location.id)
        const isCurrent = currentSection === location.id
        const isHovered = hoveredLocation === location.id

        const sizeClasses = {
          large: "w-24 h-24",
          medium: "w-20 h-20",
          small: "w-16 h-16",
        }

        return (
          <button
            key={location.id}
            onClick={() => handleLocationClick(location)}
            onMouseEnter={() => setHoveredLocation(location.id)}
            onMouseLeave={() => setHoveredLocation(null)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group
              ${isCurrent ? "scale-110 z-20" : "z-10"}
              ${isHovered ? "scale-125 z-30" : ""}
            `}
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
          >
            {/* Location Node */}
            <div
              className={`
              ${sizeClasses[location.size]}
              relative flex items-center justify-center
              ${location.type === "puzzle" ? "rotate-45" : ""}
              transition-all duration-300
            `}
            >
              {/* Outer Ring */}
              <div
                className={`absolute inset-0 border-2 
                ${isCurrent ? "border-accent bg-accent/20" : "border-foreground/30"}
                ${isVisited ? "border-accent/70" : ""}
                ${location.type === "puzzle" ? "" : "rounded-full"}
                transition-colors
              `}
              />

              {/* Inner Core */}
              <div
                className={`w-3/4 h-3/4 flex items-center justify-center
                ${isCurrent ? "bg-accent" : "bg-secondary"}
                ${location.type === "puzzle" ? "" : "rounded-full"}
                border border-accent/50
                transition-colors
              `}
              >
                <span
                  className={`text-xs font-bold text-center
                  ${isCurrent ? "text-secondary" : "text-foreground"}
                  ${location.type === "puzzle" ? "-rotate-45" : ""}
                `}
                >
                  {location.navName.substring(0, 3).toUpperCase()}
                </span>
              </div>

              {/* Pulse Effect for Current */}
              {isCurrent && (
                <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-50" />
              )}
            </div>

            {/* Location Label */}
            <div
              className={`absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center transition-all duration-300
              ${isHovered || isCurrent ? "opacity-100" : "opacity-70"}
            `}
            >
              <p className="text-foreground text-sm font-bold whitespace-nowrap">{location.name}</p>
              <p className="text-foreground/50 text-xs whitespace-nowrap">{location.description}</p>
              {isVisited && <span className="text-accent text-xs">✓ Visited</span>}
            </div>
          </button>
        )
      })}

      {/* Map Legend */}
      <div className="absolute bottom-8 left-8 bg-secondary/80 border border-accent/30 p-4 rounded">
        <h4 className="text-foreground text-sm font-bold mb-2">Legend</h4>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-foreground/30" />
            <span className="text-foreground/60">Unexplored</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-accent bg-accent/20" />
            <span className="text-foreground/60">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rotate-45 border border-accent/70" />
            <span className="text-foreground/60">Puzzle Room</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-accent rotate-45 flex items-center justify-center text-accent text-[8px]">
              ?
            </div>
            <span className="text-foreground/60">Lore Fragment</span>
          </div>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="absolute bottom-8 right-8 bg-secondary/80 border border-accent/30 p-4 rounded text-right">
        <p className="text-foreground/60 text-xs">Areas Explored</p>
        <p className="text-accent text-2xl font-bold">
          {state.visitedAreas.length}/{locations.length}
        </p>
        <p className="text-foreground/60 text-xs mt-2">Lore Found</p>
        <p className="text-accent text-2xl font-bold">
          {state.loreFragments.filter((l) => l.discovered).length}/{state.loreFragments.length}
        </p>
      </div>
    </div>
  )
}
