"use client"

import { useGame } from "@/lib/game-context"
import { useState } from "react"

export function GameHUD() {
  const { state } = useGame()
  const [showAchievements, setShowAchievements] = useState(false)

  if (!state.gameStarted) return null

  const expToNextLevel = state.level * 100 - state.experience
  const expProgress = ((state.experience % 100) / 100) * 100

  const unlockedAchievements = state.achievements.filter((a) => a.unlocked).length
  const totalAchievements = state.achievements.length

  return (
    <>
      {/* Top HUD Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 border-b-2 border-accent">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          {/* Player Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-foreground font-bold">
                {state.level}
              </div>
              <div>
                <p className="text-foreground text-sm font-bold">{state.playerName}</p>
                <p className="text-foreground/60 text-xs">Level {state.level}</p>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="flex-1 max-w-xs mx-4">
            <div className="flex justify-between text-xs text-foreground/60 mb-1">
              <span>EXP</span>
              <span>{expToNextLevel} to next level</span>
            </div>
            <div className="h-2 bg-secondary rounded-full border border-accent/50 overflow-hidden">
              <div className="h-full bg-accent transition-all duration-500" style={{ width: `${expProgress}%` }} />
            </div>
          </div>

          {/* Points & Achievements */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-accent font-bold">{state.totalPoints}</p>
              <p className="text-foreground/60 text-xs">Points</p>
            </div>
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="flex items-center gap-2 px-3 py-1 bg-accent/20 border border-accent rounded hover:bg-accent/30 transition-colors"
            >
              <span className="text-foreground/80">🏆</span>
              <span className="text-foreground text-sm">
                {unlockedAchievements}/{totalAchievements}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Achievement Panel */}
      {showAchievements && (
        <div className="fixed top-16 right-4 z-50 w-80 bg-secondary border-2 border-accent rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-accent/20 px-4 py-2 border-b border-accent">
            <h3 className="text-foreground font-bold">Achievements</h3>
          </div>
          <div className="max-h-96 overflow-y-auto p-2">
            {state.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded mb-2 transition-all ${
                  achievement.unlocked
                    ? "bg-accent/20 border border-accent"
                    : "bg-secondary/50 border border-foreground/10 opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="text-foreground font-bold text-sm">{achievement.title}</p>
                    <p className="text-foreground/60 text-xs">{achievement.description}</p>
                  </div>
                  <span className="text-accent text-sm font-bold">+{achievement.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
