"use client"

import { useGame } from "@/lib/game-context"
import { useState } from "react"

export function GameHUD() {
  const { state, resetGame } = useGame()
  const [showAchievements, setShowAchievements] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  if (!state.gameStarted) return null

  const experienceToNextLevel = state.level * 100 - (state.experience % 100)
  const experienceProgress = ((state.experience % 100) / 100) * 100

  const unlockedAchievements = state.achievements.filter((achievement) => achievement.unlocked).length
  const totalAchievements = state.achievements.length

  const handleReset = () => {
    resetGame()
    setShowResetConfirm(false)
    setShowAchievements(false)
    window.location.reload()
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-secondary/98 border-b-2 border-accent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-6">
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent flex items-center justify-center text-secondary text-base md:text-lg font-bold border-2 border-foreground/20">
                {state.level}
              </div>
              <div>
                <p className="text-foreground text-sm font-bold tracking-wide">{state.playerName}</p>
                <p className="text-foreground/60 text-xs">Level {state.level} Explorer</p>
              </div>
            </div>

            <div className="flex md:hidden items-center gap-4">
              <div className="text-right">
                <p className="text-accent font-bold text-lg">{state.totalPoints}</p>
                <p className="text-foreground/60 text-[10px]">Points</p>
              </div>
              <button
                onClick={() => setShowAchievements(!showAchievements)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 border border-accent rounded-lg"
              >
                <span className="text-base">🏆</span>
                <span className="text-foreground text-xs font-medium">
                  {unlockedAchievements}/{totalAchievements}
                </span>
              </button>
            </div>
          </div>

          <div className="w-full md:flex-1 md:max-w-sm">
            <div className="flex justify-between text-[10px] md:text-xs text-foreground/70 mb-0.5 md:mb-1">
              <span className="font-medium">EXP</span>
              <span>
                {experienceToNextLevel} to level {state.level + 1}
              </span>
            </div>
            <div className="h-2.5 md:h-3 bg-secondary rounded-full border-2 border-accent/50 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent/70 transition-all duration-500 rounded-full"
                style={{ width: `${experienceProgress}%` }}
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-accent font-bold text-xl">{state.totalPoints}</p>
              <p className="text-foreground/60 text-xs">Total Points</p>
            </div>
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="flex items-center gap-2 px-4 py-2 bg-accent/20 border-2 border-accent rounded-lg hover:bg-accent/30 transition-all duration-300 hover:scale-105"
            >
              <span className="text-xl">🏆</span>
              <span className="text-foreground text-sm font-medium">
                {unlockedAchievements}/{totalAchievements}
              </span>
            </button>
          </div>
        </div>
      </div>

      {showAchievements && (
        <div className="fixed top-28 md:top-20 right-4 left-4 sm:left-auto z-50 w-auto sm:w-96 bg-secondary border-2 border-accent rounded-xl shadow-2xl shadow-accent/20 overflow-hidden">
          <div className="bg-accent/20 px-6 py-4 border-b border-accent flex justify-between items-center">
            <h3 className="text-foreground font-bold text-lg tracking-wide">ACHIEVEMENTS</h3>
            <button
              onClick={() => setShowAchievements(false)}
              className="text-foreground/60 hover:text-foreground text-2xl transition-colors"
            >
              ×
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-4">
            {state.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg mb-3 transition-all duration-300 ${
                  achievement.unlocked
                    ? "bg-accent/20 border-2 border-accent hover-glow"
                    : "bg-secondary/50 border border-foreground/10 opacity-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="text-foreground font-bold">{achievement.title}</p>
                    <p className="text-foreground/60 text-sm mt-1">{achievement.description}</p>
                  </div>
                  <span className={`text-sm font-bold ${achievement.unlocked ? "text-accent" : "text-foreground/40"}`}>
                    +{achievement.points}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-accent/30">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2 text-sm text-foreground/60 hover:text-red-400 transition-colors"
              >
                Reset Progress
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded hover:bg-red-500/30 transition-colors text-sm font-medium"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 bg-foreground/10 border border-foreground/30 text-foreground/70 rounded hover:bg-foreground/20 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
