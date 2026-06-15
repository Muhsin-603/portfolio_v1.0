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
  const previousAchievementsReference = useRef<string[]>([])
  const previousLoreReference = useRef<string[]>([])
  const initializedReference = useRef(false)

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const notificationIdentifier = Math.random().toString(36)
    setNotifications((previousNotifications) => [...previousNotifications, { ...notification, id: notificationIdentifier }])
    setTimeout(() => {
      setNotifications((previousNotifications) => previousNotifications.filter((existingNotification) => existingNotification.id !== notificationIdentifier))
    }, 3000)
  }, [])

  useEffect(() => {
    if (!initializedReference.current) {
      previousAchievementsReference.current = state.achievements.filter((achievement) => achievement.unlocked).map((achievement) => achievement.id)
      previousLoreReference.current = state.loreFragments.filter((fragment) => fragment.discovered).map((fragment) => fragment.id)
      initializedReference.current = true
    }
  }, [state.achievements, state.loreFragments])

  useEffect(() => {
    if (!initializedReference.current) return

    const currentUnlocked = state.achievements.filter((achievement) => achievement.unlocked).map((achievement) => achievement.id)
    const newAchievements = currentUnlocked.filter((id) => !previousAchievementsReference.current.includes(id))

    newAchievements.forEach((id) => {
      const achievement = state.achievements.find((existingAchievement) => existingAchievement.id === id)
      if (achievement) {
        addNotification({
          type: "achievement",
          title: "Achievement Unlocked!",
          message: achievement.title,
          points: achievement.points,
        })
      }
    })

    previousAchievementsReference.current = currentUnlocked
  }, [state.achievements, addNotification])

  useEffect(() => {
    if (!initializedReference.current) return

    const currentDiscovered = state.loreFragments.filter((fragment) => fragment.discovered).map((fragment) => fragment.id)
    const newLore = currentDiscovered.filter((id) => !previousLoreReference.current.includes(id))

    newLore.forEach((id) => {
      const lore = state.loreFragments.find((fragment) => fragment.id === id)
      if (lore) {
        addNotification({
          type: "lore",
          title: "Lore Discovered!",
          message: lore.title,
          points: 10,
        })
      }
    })

    previousLoreReference.current = currentDiscovered
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
