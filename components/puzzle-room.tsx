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

const puzzles = {
  word: {
    id: "word_puzzle",
    pieces: [
      { id: 1, correctPosition: 0, currentPosition: 2, content: "CREATE" },
      { id: 2, correctPosition: 1, currentPosition: 0, content: "PLAY" },
      { id: 3, correctPosition: 2, currentPosition: 3, content: "INSPIRE" },
      { id: 4, correctPosition: 3, currentPosition: 1, content: "REPEAT" },
    ],
  },
  sequence: {
    id: "sequence_puzzle",
    sequence: [1, 2, 3, 4],
  },
  memory: {
    id: "memory_puzzle",
    pairs: ["A", "B", "C", "D"],
  },
}

const floatingLoreData: FloatingLore[] = [
  {
    id: "puzzle_lore_1",
    x: 10,
    y: 20,
    content: "In the realm of code, bugs are not errors—they are puzzles waiting to be solved.",
    discovered: false,
  },
  {
    id: "puzzle_lore_2",
    x: 85,
    y: 30,
    content: "The greatest games are born from the simplest ideas, nurtured with persistence.",
    discovered: false,
  },
  {
    id: "puzzle_lore_3",
    x: 15,
    y: 75,
    content: "Every pixel placed with intention. Every line of code a brushstroke on the digital canvas.",
    discovered: false,
  },
]

export function PuzzleRoom() {
  const { state, visitArea, solvePuzzle, discoverLore, incrementClick } = useGame()
  const [puzzle, setPuzzle] = useState(puzzles.word.pieces)
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [isSolved, setIsSolved] = useState(false)
  const [localLore, setLocalLore] = useState(floatingLoreData)
  const [showLoreModal, setShowLoreModal] = useState<string | null>(null)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([])

  const [sequenceInput, setSequenceInput] = useState<number[]>([])
  const [sequenceSolved, setSequenceSolved] = useState(false)
  const [sequenceHint, setSequenceHint] = useState<number[]>([])
  const [showSequenceHint, setShowSequenceHint] = useState(false)

  const [memoryCards, setMemoryCards] = useState<
    Array<{ id: number; value: string; flipped: boolean; matched: boolean }>
  >([])
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([])
  const [memorySolved, setMemorySolved] = useState(false)

  useEffect(() => {
    if (state.gameStarted) {
      visitArea("puzzle")
    }
  }, [state.gameStarted, visitArea])

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }))
    setParticles(newParticles)

    // Initialize memory cards
    const pairs = [...puzzles.memory.pairs, ...puzzles.memory.pairs]
    const shuffled = pairs.sort(() => Math.random() - 0.5)
    setMemoryCards(shuffled.map((value, i) => ({ id: i, value, flipped: false, matched: false })))

    // Generate sequence hint
    setSequenceHint([...puzzles.sequence.sequence].sort(() => Math.random() - 0.5))
  }, [])

  // Check if word puzzle is already solved
  useEffect(() => {
    if (state.puzzlesSolved.includes("word_puzzle")) {
      setIsSolved(true)
    }
    if (state.puzzlesSolved.includes("sequence_puzzle")) {
      setSequenceSolved(true)
    }
    if (state.puzzlesSolved.includes("memory_puzzle")) {
      setMemorySolved(true)
    }
  }, [state.puzzlesSolved])

  const checkSolved = useCallback((currentPuzzle: PuzzlePiece[]) => {
    return currentPuzzle.every((piece) => piece.currentPosition === piece.correctPosition)
  }, [])

  const handlePieceClick = (pieceId: number) => {
    if (isSolved) return
    incrementClick()

    if (selectedPiece === null) {
      setSelectedPiece(pieceId)
    } else {
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

      if (checkSolved(newPuzzle)) {
        setIsSolved(true)
        solvePuzzle("word_puzzle")
        const puzzleLore = state.loreFragments.find((l) => l.location === "puzzle" && !l.discovered)
        if (puzzleLore) {
          discoverLore(puzzleLore.id)
        }
      }
    }
  }

  const handleSequenceClick = (num: number) => {
    if (sequenceSolved) return
    incrementClick()

    const newInput = [...sequenceInput, num]
    setSequenceInput(newInput)

    // Check if correct so far
    const isCorrect = newInput.every((n, i) => n === puzzles.sequence.sequence[i])

    if (!isCorrect) {
      setTimeout(() => setSequenceInput([]), 500)
      return
    }

    if (newInput.length === puzzles.sequence.sequence.length) {
      setSequenceSolved(true)
      solvePuzzle("sequence_puzzle")
    }
  }

  const handleMemoryClick = (cardId: number) => {
    if (memorySolved || memoryFlipped.length >= 2) return
    incrementClick()

    const card = memoryCards.find((c) => c.id === cardId)
    if (!card || card.flipped || card.matched) return

    const newCards = memoryCards.map((c) => (c.id === cardId ? { ...c, flipped: true } : c))
    setMemoryCards(newCards)
    const newFlipped = [...memoryFlipped, cardId]
    setMemoryFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped.map((id) => newCards.find((c) => c.id === id)!)

      if (first.value === second.value) {
        setMemoryCards((prev) =>
          prev.map((c) => (c.id === first.id || c.id === second.id ? { ...c, matched: true } : c)),
        )
        setMemoryFlipped([])

        // Check if all matched
        const allMatched = newCards.every((c) => c.matched || c.id === first.id || c.id === second.id)
        if (allMatched) {
          setMemorySolved(true)
          solvePuzzle("memory_puzzle")
        }
      } else {
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) => (c.id === first.id || c.id === second.id ? { ...c, flipped: false } : c)),
          )
          setMemoryFlipped([])
        }, 1000)
      }
    }
  }

  const handleLoreClick = (loreId: string) => {
    incrementClick()
    setLocalLore((prev) => prev.map((l) => (l.id === loreId ? { ...l, discovered: true } : l)))
    setShowLoreModal(loreId)
    const gameLore = state.loreFragments.find((l) => !l.discovered)
    if (gameLore) {
      discoverLore(gameLore.id)
    }
  }

  const sortedPuzzle = [...puzzle].sort((a, b) => a.currentPosition - b.currentPosition)

  return (
    <div className="min-h-screen py-24 px-6 relative overflow-x-hidden">
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
            className="absolute z-20 group cursor-pointer transform hover:scale-110 transition-all duration-300"
            style={{ left: `${lore.x}%`, top: `${lore.y}%` }}
          >
            <div className="relative">
              <div className="w-12 h-12 border-2 border-accent/60 rotate-45 bg-secondary/80 animate-bounce group-hover:border-accent group-hover:bg-accent/20 transition-colors hover-glow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-accent text-xl animate-pulse font-bold">?</span>
              </div>
            </div>
            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-secondary border border-accent px-3 py-2 text-sm text-foreground rounded">
              Click to reveal
            </div>
          </button>
        ) : null,
      )}

      {/* Section Header - improved typography */}
      <div className="max-w-5xl mx-auto mb-16 relative z-10">
        <div className="flex items-center gap-6 mb-6">
          <div className="h-px flex-1 bg-accent/30" />
          <h2 className="text-4xl text-foreground tracking-wider font-heading">PUZZLE CHAMBER</h2>
          <div className="h-px flex-1 bg-accent/30" />
        </div>
        <p className="text-center text-foreground/70 text-base">Uncover secrets and solve mysteries to earn rewards</p>
      </div>

      {/* Puzzles Grid - multiple puzzles */}
      <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-8">
        {/* Word Puzzle */}
        <div className="bg-secondary/80 border-2 border-accent/30 p-8 relative rounded-lg hover-glow transition-all duration-300">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-accent rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-accent rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent rounded-br-lg" />

          <h3 className="text-accent text-sm tracking-wider mb-4 text-center font-medium">WORD PUZZLE</h3>
          <p className="text-foreground/70 text-sm text-center mb-6">Arrange the words to reveal the creed</p>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {sortedPuzzle.map((piece) => {
              const isSelected = selectedPiece === piece.id
              const isCorrect = piece.currentPosition === piece.correctPosition

              return (
                <button
                  key={piece.id}
                  onClick={() => handlePieceClick(piece.id)}
                  disabled={isSolved}
                  className={`aspect-square flex items-center justify-center border-2 transition-all duration-300 rounded-lg
                    ${isSelected ? "border-accent bg-accent/30 scale-110" : "border-accent/30 bg-secondary/50"}
                    ${isCorrect && isSolved ? "border-green-400 bg-green-400/20" : ""}
                    ${!isSolved ? "hover:border-accent hover:scale-105 cursor-pointer" : ""}
                  `}
                >
                  <span className={`text-xs font-bold ${isCorrect && isSolved ? "text-green-400" : "text-foreground"}`}>
                    {piece.content}
                  </span>
                </button>
              )
            })}
          </div>

          {isSolved ? (
            <div className="text-center">
              <p className="text-green-400 text-lg font-bold mb-2">SOLVED!</p>
              <p className="text-accent text-sm">+40 XP</p>
            </div>
          ) : (
            <p className="text-center text-foreground/50 text-xs">
              {selectedPiece ? "Select another piece" : "Select a piece"}
            </p>
          )}
        </div>

        {/* Sequence Puzzle */}
        <div className="bg-secondary/80 border-2 border-accent/30 p-8 relative rounded-lg hover-glow transition-all duration-300">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-accent rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-accent rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent rounded-br-lg" />

          <h3 className="text-accent text-sm tracking-wider mb-4 text-center font-medium">SEQUENCE PUZZLE</h3>
          <p className="text-foreground/70 text-sm text-center mb-6">Enter the correct sequence: 1, 2, 3, 4</p>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => handleSequenceClick(num)}
                disabled={sequenceSolved}
                className={`aspect-square flex items-center justify-center border-2 rounded-lg transition-all duration-300
                  ${sequenceInput.includes(num) ? "border-accent bg-accent/30" : "border-accent/30 bg-secondary/50"}
                  ${sequenceSolved ? "border-green-400 bg-green-400/20" : ""}
                  ${!sequenceSolved ? "hover:border-accent hover:scale-105 cursor-pointer" : ""}
                `}
              >
                <span className={`text-2xl font-bold ${sequenceSolved ? "text-green-400" : "text-foreground"}`}>
                  {num}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center mb-4">
            <p className="text-foreground/50 text-sm">Progress: {sequenceInput.join(" → ") || "..."}</p>
          </div>

          {sequenceSolved ? (
            <div className="text-center">
              <p className="text-green-400 text-lg font-bold mb-2">SOLVED!</p>
              <p className="text-accent text-sm">+40 XP</p>
            </div>
          ) : (
            <button
              onClick={() => setShowSequenceHint(!showSequenceHint)}
              className="w-full py-2 text-foreground/50 text-xs hover:text-foreground/70 transition-colors"
            >
              {showSequenceHint ? `Hint: ${sequenceHint.join(", ")} (wrong order)` : "Show Hint"}
            </button>
          )}
        </div>

        {/* Memory Puzzle */}
        <div className="bg-secondary/80 border-2 border-accent/30 p-8 relative rounded-lg hover-glow transition-all duration-300 lg:col-span-2">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-accent rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-accent rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent rounded-br-lg" />

          <h3 className="text-accent text-sm tracking-wider mb-4 text-center font-medium">MEMORY PUZZLE</h3>
          <p className="text-foreground/70 text-sm text-center mb-6">Match the pairs to complete the puzzle</p>

          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
            {memoryCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleMemoryClick(card.id)}
                disabled={memorySolved || card.matched}
                className={`aspect-square flex items-center justify-center border-2 rounded-lg transition-all duration-300
                  ${card.flipped || card.matched ? "border-accent bg-accent/30" : "border-accent/30 bg-secondary/50"}
                  ${card.matched ? "border-green-400 bg-green-400/20" : ""}
                  ${!memorySolved && !card.matched ? "hover:border-accent hover:scale-105 cursor-pointer" : ""}
                `}
              >
                <span className={`text-2xl font-bold ${card.matched ? "text-green-400" : "text-foreground"}`}>
                  {card.flipped || card.matched ? card.value : "?"}
                </span>
              </button>
            ))}
          </div>

          {memorySolved && (
            <div className="text-center">
              <p className="text-green-400 text-lg font-bold mb-2">ALL PAIRS MATCHED!</p>
              <p className="text-accent text-sm">+40 XP</p>
            </div>
          )}
        </div>
      </div>

      {/* Lore Collection - improved styling */}
      <div className="max-w-4xl mx-auto mt-12 relative z-10">
        <div className="bg-secondary/80 border border-accent/30 p-8 rounded-lg">
          <h3 className="text-accent text-sm tracking-wider mb-6 font-medium">DISCOVERED FRAGMENTS</h3>
          <div className="space-y-4">
            {localLore.map((lore) => (
              <div
                key={lore.id}
                className={`p-4 border rounded-lg transition-all duration-300 ${
                  lore.discovered ? "border-accent/50 bg-accent/10" : "border-foreground/10 bg-secondary/30 opacity-50"
                }`}
              >
                {lore.discovered ? (
                  <p className="text-foreground/90 text-sm italic leading-relaxed">"{lore.content}"</p>
                ) : (
                  <p className="text-foreground/40 text-sm">[ Undiscovered Fragment ]</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-foreground/50 text-sm">
              {localLore.filter((l) => l.discovered).length}/{localLore.length} fragments collected
            </p>
          </div>
        </div>
      </div>

      {/* Lore Modal */}
      {showLoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-secondary/95">
          <div className="max-w-md w-full border-2 border-accent bg-secondary p-8 relative rounded-lg animate-in zoom-in duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent px-6 py-2 rounded">
              <span className="text-secondary text-xs font-bold tracking-wider">LORE DISCOVERED</span>
            </div>

            <div className="mt-6 mb-8">
              <p className="text-foreground text-center italic leading-relaxed text-lg">
                "{localLore.find((l) => l.id === showLoreModal)?.content}"
              </p>
            </div>

            <div className="text-center text-accent text-sm mb-6">+10 XP</div>

            <button
              onClick={() => setShowLoreModal(null)}
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
