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
    y: 20,
    size: "large",
    type: "main",
  },
  {
    id: "stats",
    name: "Stats Chamber",
    navName: "About",
    description: "Learn about the developer",
    x: 20,
    y: 40,
    size: "medium",
    type: "main",
  },
  {
    id: "inventory",
    name: "Inventory Hall",
    navName: "Projects",
    description: "View collected works",
    x: 80,
    y: 40,
    size: "medium",
    type: "main",
  },
  {
    id: "journey",
    name: "Journey Map",
    navName: "Journey",
    description: "The path traveled so far",
    x: 30,
    y: 70,
    size: "medium",
    type: "main",
  },
  {
    id: "puzzle",
    name: "Puzzle Chamber",
    navName: "Puzzles",
    description: "Mysteries await...",
    x: 70,
    y: 70,
    size: "medium",
    type: "puzzle",
  },
]

const floatingLorePositions = [
  { x: 45, y: 45, loreId: "lore_1" },
  { x: 55, y: 85, loreId: "lore_5" },
]

const secretLocations = [
  { x: 10, y: 90, secretId: "secret_corner" },
  { x: 90, y: 10, secretId: "secret_top" },
]

interface WorldMapProps {
  onNavigate: (section: string) => void
  currentSection: string
}

export function WorldMap({ onNavigate, currentSection }: WorldMapProps) {
  const { state, visitArea, discoverLore, incrementClick, findSecret } = useGame()
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  const handleLocationClick = (location: MapLocation) => {
    incrementClick()
    visitArea(location.id)
    onNavigate(location.id)
  }

  const handleLoreClick = (loreId: string) => {
    incrementClick()
    discoverLore(loreId)
  }

  const handleSecretClick = (secretId: string) => {
    incrementClick()
    findSecret(secretId)
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-7rem)] bg-secondary overflow-y-auto overflow-x-hidden">
      {/* Scrollable content wrapper */}
      <div className="relative w-full" style={{ minHeight: "800px" }}>
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
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: "800px" }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5F51C2" stopOpacity="0" />
              <stop offset="50%" stopColor="#5F51C2" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#5F51C2" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="50%" y1="20%" x2="20%" y2="40%" stroke="url(#lineGradient)" strokeWidth="2" />
          <line x1="50%" y1="20%" x2="80%" y2="40%" stroke="url(#lineGradient)" strokeWidth="2" />
          <line x1="20%" y1="40%" x2="30%" y2="70%" stroke="url(#lineGradient)" strokeWidth="2" />
          <line x1="80%" y1="40%" x2="70%" y2="70%" stroke="url(#lineGradient)" strokeWidth="2" />
          <line x1="30%" y1="70%" x2="70%" y2="70%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
        </svg>

        {secretLocations.map((secret) => {
          const isFound = state.secretsFound.includes(secret.secretId)
          if (isFound) return null
          return (
            <button
              key={secret.secretId}
              onClick={() => handleSecretClick(secret.secretId)}
              className="absolute w-8 h-8 opacity-0 hover:opacity-100 transition-opacity cursor-pointer z-30"
              style={{ left: `${secret.x}%`, top: `${secret.y}%` }}
              title="?"
            >
              <div className="w-full h-full border border-dashed border-accent/50 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-accent/50 text-xs">?</span>
              </div>
            </button>
          )
        })}

        {/* Floating Lore Fragments */}
        {floatingLorePositions.map((lorePos) => {
          const lore = state.loreFragments.find((l) => l.id === lorePos.loreId)
          if (!lore || lore.discovered) return null
          return (
            <button
              key={lorePos.loreId}
              onClick={() => handleLoreClick(lorePos.loreId)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
              style={{ left: `${lorePos.x}%`, top: `${lorePos.y}%` }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-accent/20 border-2 border-accent rotate-45 animate-bounce group-hover:scale-125 transition-transform hover-glow" />
                <div className="absolute inset-0 flex items-center justify-center text-accent text-lg font-bold">?</div>
              </div>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary border border-accent px-3 py-2 text-xs text-foreground whitespace-nowrap rounded">
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
            large: "w-28 h-28",
            medium: "w-24 h-24",
            small: "w-20 h-20",
          }

          return (
            <button
              key={location.id}
              onClick={() => handleLocationClick(location)}
              onMouseEnter={() => setHoveredLocation(location.id)}
              onMouseLeave={() => setHoveredLocation(null)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group
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
                transition-all duration-500
              `}
              >
                {/* Outer Ring */}
                <div
                  className={`absolute inset-0 border-2 
                  ${isCurrent ? "border-accent bg-accent/20" : "border-foreground/40"}
                  ${isVisited ? "border-accent/70" : ""}
                  ${location.type === "puzzle" ? "" : "rounded-full"}
                  transition-all duration-300
                  ${isHovered ? "shadow-lg shadow-accent/30" : ""}
                `}
                />

                {/* Inner Core */}
                <div
                  className={`w-3/4 h-3/4 flex items-center justify-center
                  ${isCurrent ? "bg-accent" : "bg-secondary"}
                  ${location.type === "puzzle" ? "" : "rounded-full"}
                  border-2 border-accent/50
                  transition-all duration-300
                `}
                >
                  <span
                    className={`text-sm font-bold text-center tracking-wide
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
                className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 text-center transition-all duration-300
                ${isHovered || isCurrent ? "opacity-100" : "opacity-70"}
              `}
              >
                <p className="text-foreground text-sm font-bold whitespace-nowrap tracking-wide">{location.name}</p>
                <p className="text-foreground/60 text-xs whitespace-nowrap mt-1">{location.description}</p>
                {isVisited && <span className="text-accent text-xs block mt-1">✓ Visited</span>}
              </div>
            </button>
          )
        })}

        {/* Map Legend - improved padding and styling */}
        <div className="absolute bottom-8 left-8 bg-secondary/90 border border-accent/30 p-6 rounded-lg backdrop-blur-sm">
          <h4 className="text-foreground text-sm font-bold mb-4 tracking-wide">LEGEND</h4>
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-foreground/40" />
              <span className="text-foreground/70">Unexplored</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-accent bg-accent/20" />
              <span className="text-foreground/70">Current Location</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rotate-45 border-2 border-accent/70" />
              <span className="text-foreground/70">Puzzle Room</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-accent rotate-45 flex items-center justify-center text-accent text-[10px] font-bold">
                ?
              </div>
              <span className="text-foreground/70">Lore Fragment</span>
            </div>
          </div>
        </div>

        {/* Mini Stats - improved styling */}
        <div className="absolute bottom-8 right-8 bg-secondary/90 border border-accent/30 p-6 rounded-lg text-right backdrop-blur-sm">
          <p className="text-foreground/60 text-xs tracking-wide">AREAS EXPLORED</p>
          <p className="text-accent text-3xl font-bold mt-1">
            {state.visitedAreas.length}
            <span className="text-foreground/40">/{locations.length}</span>
          </p>
          <p className="text-foreground/60 text-xs mt-4 tracking-wide">LORE FOUND</p>
          <p className="text-accent text-3xl font-bold mt-1">
            {state.loreFragments.filter((l) => l.discovered).length}
            <span className="text-foreground/40">/{state.loreFragments.length}</span>
          </p>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground/40 text-xs animate-bounce">
          ↓ Scroll to explore more ↓
        </div>
      </div>
    </div>
  )
}
