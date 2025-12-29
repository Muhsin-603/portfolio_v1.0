"use client"

import { useGame } from "@/lib/game-context"
import { useEffect, useState } from "react"

interface Milestone {
  id: string
  year: string
  title: string
  description: string
  type: "education" | "work" | "achievement" | "personal"
}

const milestones: Milestone[] = [
  {
    id: "m1",
    year: "2025",
    title: "Stride Makethon",
    description: "It started as a simple product dev journey",
    type: "education",
  },
  {
    id: "m2",
    year: "2025",
    title: "Lullaby Down Below",
    description: "Simple Game Devolopment and my first almost completed game dev journey",
    type: "achievement",
  },
  // {
  //   id: "m3",
  //   year: "----",
  //   title: "[ First Project ]",
  //   description: "Your first significant project or creation.",
  //   type: "achievement",
  // },
  // {
  //   id: "m4",
  //   year: "----",
  //   title: "[ Career Start ]",
  //   description: "When you started working professionally.",
  //   type: "work",
  // },
  // {
  //   id: "m5",
  //   year: "----",
  //   title: "[ Current Chapter ]",
  //   description: "Where you are now and what you're working on.",
  //   type: "work",
  // },
]

const typeIcons = {
  education: "◈",
  work: "◆",
  achievement: "★",
  personal: "●",
}

const typeColors = {
  education: "border-blue-400 text-blue-400",
  work: "border-green-400 text-green-400",
  achievement: "border-yellow-400 text-yellow-400",
  personal: "border-accent text-accent",
}

export function JourneySection() {
  const { state, visitArea, discoverLore } = useGame()
  const [visibleMilestones, setVisibleMilestones] = useState<string[]>([])

  useEffect(() => {
    if (state.gameStarted) {
      visitArea("journey")
      // Discover story lore
      const storyLore = state.loreFragments.find((l) => l.location === "story" && !l.discovered)
      if (storyLore) {
        discoverLore(storyLore.id)
      }
    }
  }, [state.gameStarted, visitArea, discoverLore])

  useEffect(() => {
    // Animate milestones appearing one by one
    milestones.forEach((m, i) => {
      setTimeout(() => {
        setVisibleMilestones((prev) => [...prev, m.id])
      }, i * 300)
    })
  }, [])

  return (
    <div className="min-h-screen py-24 px-4 relative overflow-hidden">
      {/* Background Path Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
        <path
          d="M 0 200 Q 400 100 800 300 T 1600 200"
          stroke="#5F51C2"
          strokeWidth="2"
          fill="none"
          strokeDasharray="10,10"
        />
        <path
          d="M 0 400 Q 300 500 600 400 T 1200 500"
          stroke="#5F51C2"
          strokeWidth="1"
          fill="none"
          strokeDasharray="5,5"
        />
      </svg>

      {/* Section Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-accent/30" />
          <h2 className="text-3xl text-foreground tracking-wider">JOURNEY MAP</h2>
          <div className="h-px flex-1 bg-accent/30" />
        </div>
        <p className="text-center text-foreground/60 text-sm">The path traveled through time</p>
      </div>

      {/* Legend */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-center gap-6 flex-wrap">
        {Object.entries(typeIcons).map(([type, icon]) => (
          <div key={type} className="flex items-center gap-2">
            <span className={typeColors[type as keyof typeof typeColors]}>{icon}</span>
            <span className="text-foreground/60 text-xs capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto relative">
        {/* Central Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-accent/30 transform -translate-x-1/2" />

        <div className="space-y-12">
          {milestones.map((milestone, index) => {
            const isLeft = index % 2 === 0
            const isVisible = visibleMilestones.includes(milestone.id)

            return (
              <div
                key={milestone.id}
                className={`flex items-center gap-8 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${isLeft ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Content Card */}
                <div className={`flex-1 ${isLeft ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block bg-secondary/50 border ${typeColors[milestone.type]} p-4 max-w-sm
                      hover:scale-105 transition-transform duration-300`}
                  >
                    <div className={`flex items-center gap-2 mb-2 ${isLeft ? "justify-end" : "justify-start"}`}>
                      <span className={`text-xs ${typeColors[milestone.type]}`}>{milestone.year}</span>
                      <span className={typeColors[milestone.type]}>{typeIcons[milestone.type]}</span>
                    </div>
                    <h3 className="text-foreground font-bold mb-1">{milestone.title}</h3>
                    <p className="text-foreground/60 text-sm">{milestone.description}</p>
                  </div>
                </div>

                {/* Center Node */}
                <div className="relative z-10">
                  <div
                    className={`w-4 h-4 ${typeColors[milestone.type]} border-2 bg-secondary rotate-45
                      transform transition-all duration-300 hover:scale-150`}
                  />
                </div>

                {/* Spacer */}
                <div className="flex-1" />
              </div>
            )
          })}
        </div>

        {/* Future Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center">
            <div className="w-px h-12 bg-accent/30" />
            <div className="w-8 h-8 border border-dashed border-accent/30 rotate-45 flex items-center justify-center">
              <span className="text-accent/50 text-xs -rotate-45">?</span>
            </div>
            <p className="text-foreground/30 text-xs mt-4">To be continued...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
