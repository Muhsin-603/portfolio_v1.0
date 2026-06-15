"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { GameStart } from "@/components/game-start"
import { GameHUD } from "@/components/game-hud"
import { GameNavigation } from "@/components/game-navigation"
import { NotificationToast } from "@/components/notification-toast"
import { SpawnSection } from "@/components/spawn-section"
import { StatsSection } from "@/components/stats-section"
import { InventorySection } from "@/components/inventory-section"
import { JourneySection } from "@/components/journey-section"
import { PuzzleRoom } from "@/components/puzzle-room"
import { WorldMap } from "@/components/world-map"
import { useGame } from "@/lib/game-context"
import { useLenis } from "lenis/react"

function GameContent() {
  const { state, incrementClick } = useGame()
  const lenis = useLenis()
  const [currentSection, setCurrentSection] = useState("spawn")
  const [showMap, setShowMap] = useState(false)
  const [hideHud, setHideHud] = useState(false)
  const isHudHiddenRef = useRef(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "m" || event.key === "M") {
        if (state.gameStarted) {
          setShowMap((previousValue) => !previousValue)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [state.gameStarted])

  useEffect(() => {
    if (showMap) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [showMap])

  useEffect(() => {
    if (!state.gameStarted) {
      return
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      let nextHideHud = isHudHiddenRef.current

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        nextHideHud = true
      } else if (currentScrollY < lastScrollY.current) {
        nextHideHud = false
      }

      if (nextHideHud !== isHudHiddenRef.current) {
        isHudHiddenRef.current = nextHideHud
        setHideHud(nextHideHud)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [state.gameStarted])

  useEffect(() => {
    if (!state.gameStarted) {
      return
    }

    const sections = ["spawn", "stats", "inventory", "journey", "puzzle"]
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [state.gameStarted])

  const handleNavigate = (section: string) => {
    incrementClick()
    setCurrentSection(section)
    setShowMap(false)

    if (lenis) {
      lenis.scrollTo(`#${section}`, { offset: -80 })
    } else {
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const spawnSection = useMemo(() => <SpawnSection isActive={currentSection === "spawn"} />, [currentSection === "spawn"])
  const statsSection = useMemo(() => <StatsSection isActive={currentSection === "stats"} />, [currentSection === "stats"])
  const inventorySection = useMemo(() => <InventorySection isActive={currentSection === "inventory"} />, [currentSection === "inventory"])
  const journeySection = useMemo(() => <JourneySection isActive={currentSection === "journey"} />, [currentSection === "journey"])
  const puzzleSection = useMemo(() => <PuzzleRoom isActive={currentSection === "puzzle"} />, [currentSection === "puzzle"])

  return (
    <main className="bg-background min-h-screen">
      <GameStart />
      <GameHUD isHidden={hideHud} />
      <GameNavigation currentSection={currentSection} onNavigate={handleNavigate} isHudHidden={hideHud} />
      <NotificationToast />

      {state.gameStarted && (
        <>
          <button
            onClick={() => {
              incrementClick()
              setShowMap(!showMap)
            }}
            className="fixed bottom-20 md:bottom-8 right-6 md:right-8 z-40 w-16 h-16 bg-accent border-2 border-foreground/20 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg shadow-accent/30 hover-glow group"
          >
            <span className="text-secondary text-2xl font-bold">{showMap ? "×" : "M"}</span>
            <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/70 text-xs whitespace-nowrap bg-secondary px-2 py-1 rounded">
              Press M
            </span>
          </button>

          {showMap && (
            <div className="fixed inset-0 z-30 pt-28 md:pt-36 pb-20 md:pb-8 bg-secondary overflow-y-auto">
              <WorldMap currentSection={currentSection} onNavigate={handleNavigate} />
            </div>
          )}

          <div className="pt-28 md:pt-36 pb-20 md:pb-8">
            <section id="spawn" className="scroll-mt-24 md:scroll-mt-32">
              {spawnSection}
            </section>
            <section id="stats" className="scroll-mt-24 md:scroll-mt-32">
              {statsSection}
            </section>
            <section id="inventory" className="scroll-mt-24 md:scroll-mt-32">
              {inventorySection}
            </section>
            <section id="journey" className="scroll-mt-24 md:scroll-mt-32">
              {journeySection}
            </section>
            <section id="puzzle" className="scroll-mt-24 md:scroll-mt-32">
              {puzzleSection}
            </section>
          </div>
        </>
      )}
    </main>
  )
}

export default function Home() {
  return <GameContent />
}
