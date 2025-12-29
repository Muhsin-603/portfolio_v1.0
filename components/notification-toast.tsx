"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useGame } from "@/lib/game-context"

interface Notification {
  id: string
  type: "achievement" | "lore" | "points"
  title: string
  message: string
  points?: number
}

export function NotificationToast() {
  const { state } = useGame()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const prevAchievementsRef = useRef<string[]>([])
  const prevLoreRef = useRef<string[]>([])
  const initializedRef = useRef(false)

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36)
    setNotifications((prev) => [...prev, { ...notification, id }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }, [])

  useEffect(() => {
    if (!initializedRef.current) {
      prevAchievementsRef.current = state.achievements.filter((a) => a.unlocked).map((a) => a.id)
      prevLoreRef.current = state.loreFragments.filter((l) => l.discovered).map((l) => l.id)
      initializedRef.current = true
    }
  }, [state.achievements, state.loreFragments])

  useEffect(() => {
    if (!initializedRef.current) return

    const currentUnlocked = state.achievements.filter((a) => a.unlocked).map((a) => a.id)
    const newAchievements = currentUnlocked.filter((id) => !prevAchievementsRef.current.includes(id))

    newAchievements.forEach((id) => {
      const achievement = state.achievements.find((a) => a.id === id)
      if (achievement) {
        addNotification({
          type: "achievement",
          title: "Achievement Unlocked!",
          message: achievement.title,
          points: achievement.points,
        })
      }
    })
    prevAchievementsRef.current = currentUnlocked
  }, [state.achievements, addNotification])

  useEffect(() => {
    if (!initializedRef.current) return

    const currentDiscovered = state.loreFragments.filter((l) => l.discovered).map((l) => l.id)
    const newLore = currentDiscovered.filter((id) => !prevLoreRef.current.includes(id))

    newLore.forEach((id) => {
      const lore = state.loreFragments.find((l) => l.id === id)
      if (lore) {
        addNotification({
          type: "lore",
          title: "Lore Discovered!",
          message: lore.title,
          points: 10,
        })
      }
    })
    prevLoreRef.current = currentDiscovered
  }, [state.loreFragments, addNotification])

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-secondary border-2 border-accent p-4 rounded shadow-lg animate-in slide-in-from-right duration-300 min-w-72"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {notification.type === "achievement" && "🏆"}
              {notification.type === "lore" && "📜"}
              {notification.type === "points" && "⭐"}
            </div>
            <div className="flex-1">
              <p className="text-accent text-xs font-bold">{notification.title}</p>
              <p className="text-foreground text-sm">{notification.message}</p>
            </div>
            {notification.points && <span className="text-accent font-bold">+{notification.points}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
