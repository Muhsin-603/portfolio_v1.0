"use client"

import { useGame } from "@/lib/game-context"
import { useEffect, useState, useCallback } from "react"

interface PuzzlePiece {
  id: number
  correctPosition: number
  currentPosition: number
  content: string
}

interface FloatingLore {
  id: string
  x: number
  y: number
  content: string
  discovered: boolean
}

const initialPuzzle: PuzzlePiece[] = [
  { id: 1, correctPosition: 0, currentPosition: 2, content: "CREATE" },
  { id: 2, correctPosition: 1, currentPosition: 0, content: "PLAY" },
  { id: 3, correctPosition: 2, currentPosition: 3, content: "INSPIRE" },
  { id: 4, correctPosition: 3, currentPosition: 1, content: "REPEAT" },
]

const floatingLoreData: FloatingLore[] = [
  {
    id: "puzzle_lore_1",
    x: 15,
    y: 25,
    content: "In the realm of code, bugs are not errors—they are puzzles waiting to be solved.",
    discovered: false,
  },
  {
    id: "puzzle_lore_2",
    x: 80,
    y: 35,
    content: "The greatest games are born from the simplest ideas, nurtured with persistence.",
    discovered: false,
  },
  {
    id: "puzzle_lore_3",
    x: 25,
    y: 70,
    content: "Every pixel placed with intention. Every line of code a brushstroke on the digital canvas.",
    discovered: false,
  },
]

export function PuzzleRoom() {
  const { state, visitArea, solvePuzzle, discoverLore } = useGame()
  const [puzzle, setPuzzle] = useState(initialPuzzle)
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [isSolved, setIsSolved] = useState(false)
  const [localLore, setLocalLore] = useState(floatingLoreData)
  const [showLoreModal, setShowLoreModal] = useState<string | null>(null)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([])

  useEffect(() => {
    if (state.gameStarted) {
      visitArea("puzzle")
    }
  }, [state.gameStarted, visitArea])

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }))
    setParticles(newParticles)
  }, [])

  const checkSolved = useCallback((currentPuzzle: PuzzlePiece[]) => {
    return currentPuzzle.every((piece) => piece.currentPosition === piece.correctPosition)
  }, [])

  const handlePieceClick = (pieceId: number) => {
    if (isSolved) return

    if (selectedPiece === null) {
      setSelectedPiece(pieceId)
    } else {
      // Swap pieces
      const newPuzzle = puzzle.map((piece) => {
        if (piece.id === selectedPiece) {
          const targetPiece = puzzle.find((p) => p.id === pieceId)
          return { ...piece, currentPosition: targetPiece!.currentPosition }
        }
        if (piece.id === pieceId) {
          const sourcePiece = puzzle.find((p) => p.id === selectedPiece)
          return { ...piece, currentPosition: sourcePiece!.currentPosition }
        }
        return piece
      })

      setPuzzle(newPuzzle)
      setSelectedPiece(null)

      // Check if solved
      if (checkSolved(newPuzzle)) {
        setIsSolved(true)
        solvePuzzle("word_puzzle")
        // Discover puzzle lore
        const puzzleLore = state.loreFragments.find((l) => l.location === "puzzle" && !l.discovered)
        if (puzzleLore) {
          discoverLore(puzzleLore.id)
        }
      }
    }
  }

  const handleLoreClick = (loreId: string) => {
    setLocalLore((prev) => prev.map((l) => (l.id === loreId ? { ...l, discovered: true } : l)))
    setShowLoreModal(loreId)
    // This triggers the game context lore discovery for map lore
    const gameLore = state.loreFragments.find((l) => !l.discovered)
    if (gameLore) {
      discoverLore(gameLore.id)
    }
  }

  const sortedPuzzle = [...puzzle].sort((a, b) => a.currentPosition - b.currentPosition)

  return (
    <div className="min-h-screen py-24 px-4 relative overflow-hidden">
      {/* Mystical Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary/95 to-secondary" />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-accent/20 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Floating Lore Fragments */}
      {localLore.map((lore) =>
        !lore.discovered ? (
          <button
            key={lore.id}
            onClick={() => handleLoreClick(lore.id)}
            className="absolute z-20 group cursor-pointer transform hover:scale-110 transition-transform"
            style={{ left: `${lore.x}%`, top: `${lore.y}%` }}
          >
            <div className="relative">
              <div className="w-10 h-10 border-2 border-accent/60 rotate-45 bg-secondary/80 animate-bounce group-hover:border-accent group-hover:bg-accent/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-accent text-lg animate-pulse">?</span>
              </div>
            </div>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-secondary border border-accent px-2 py-1 text-xs text-foreground">
              Click to reveal
            </div>
          </button>
        ) : null,
      )}

      {/* Section Header */}
      <div className="max-w-4xl mx-auto mb-12 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-accent/30" />
          <h2 className="text-3xl text-foreground tracking-wider">PUZZLE CHAMBER</h2>
          <div className="h-px flex-1 bg-accent/30" />
        </div>
        <p className="text-center text-foreground/60 text-sm">Uncover secrets and solve mysteries</p>
      </div>

      {/* Main Puzzle Area */}
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Word Puzzle */}
        <div className="bg-secondary/80 border-2 border-accent/30 p-8 mb-8 relative">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-accent" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent" />

          <h3 className="text-accent text-sm tracking-wider mb-6 text-center">// WORD PUZZLE</h3>
          <p className="text-foreground/60 text-sm text-center mb-6">
            Arrange the words to reveal the game developer's creed. Click two pieces to swap them.
          </p>

          {/* Puzzle Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {sortedPuzzle.map((piece) => {
              const isSelected = selectedPiece === piece.id
              const isCorrect = piece.currentPosition === piece.correctPosition

              return (
                <button
                  key={piece.id}
                  onClick={() => handlePieceClick(piece.id)}
                  disabled={isSolved}
                  className={`aspect-square flex items-center justify-center border-2 transition-all duration-300
                    ${isSelected ? "border-accent bg-accent/30 scale-110" : "border-accent/30 bg-secondary/50"}
                    ${isCorrect && isSolved ? "border-green-400 bg-green-400/20" : ""}
                    ${!isSolved ? "hover:border-accent hover:scale-105 cursor-pointer" : ""}
                  `}
                >
                  <span className={`text-sm font-bold ${isCorrect && isSolved ? "text-green-400" : "text-foreground"}`}>
                    {piece.content}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Solution Indicator */}
          {isSolved && (
            <div className="text-center animate-in fade-in duration-500">
              <p className="text-green-400 text-lg font-bold mb-2">PUZZLE SOLVED!</p>
              <p className="text-foreground/60 text-sm">Create. Play. Inspire. Repeat.</p>
              <p className="text-accent text-xs mt-2">+40 XP earned</p>
            </div>
          )}

          {!isSolved && (
            <p className="text-center text-foreground/40 text-xs">
              {selectedPiece ? "Select another piece to swap" : "Select a piece to begin"}
            </p>
          )}
        </div>

        {/* Lore Collection */}
        <div className="bg-secondary/80 border border-accent/30 p-6">
          <h3 className="text-accent text-sm tracking-wider mb-4">// DISCOVERED FRAGMENTS</h3>
          <div className="space-y-3">
            {localLore.map((lore) => (
              <div
                key={lore.id}
                className={`p-3 border transition-all ${
                  lore.discovered ? "border-accent/50 bg-accent/10" : "border-foreground/10 bg-secondary/30 opacity-50"
                }`}
              >
                {lore.discovered ? (
                  <p className="text-foreground/80 text-sm italic">"{lore.content}"</p>
                ) : (
                  <p className="text-foreground/30 text-sm">[ Undiscovered Fragment ]</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <p className="text-foreground/40 text-xs">
              {localLore.filter((l) => l.discovered).length}/{localLore.length} fragments collected
            </p>
          </div>
        </div>
      </div>

      {/* Lore Modal */}
      {showLoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/95">
          <div className="max-w-md w-full border-2 border-accent bg-secondary p-6 relative animate-in zoom-in duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent px-4 py-1">
              <span className="text-secondary text-xs font-bold tracking-wider">LORE DISCOVERED</span>
            </div>

            <div className="mt-4 mb-6">
              <p className="text-foreground text-center italic leading-relaxed">
                "{localLore.find((l) => l.id === showLoreModal)?.content}"
              </p>
            </div>

            <div className="text-center text-accent text-sm mb-4">+10 XP</div>

            <button
              onClick={() => setShowLoreModal(null)}
              className="w-full py-2 bg-accent text-secondary font-bold hover:bg-accent/80 transition-colors"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
