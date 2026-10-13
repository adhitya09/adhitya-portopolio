"use client"
import React, { useState, useEffect, useCallback } from "react"
import { sfx } from "./soundEffects"

interface MemoryMatchGameProps {
  isDark: boolean
  onClose?: () => void
}

interface CardItem {
  id: number
  symbol: string
  name: string
  isFlipped: boolean
  isMatched: boolean
}

const SYMBOLS = [
  { symbol: "⚡", name: "Lightning" },
  { symbol: "🚀", name: "Rocket" },
  { symbol: "🎮", name: "Gaming" },
  { symbol: "💻", name: "Code" },
  { symbol: "💎", name: "Diamond" },
  { symbol: "🎯", name: "Target" },
  { symbol: "🔮", name: "Magic" },
  { symbol: "🎨", name: "Design" },
]

export default function MemoryMatchGame({ isDark }: MemoryMatchGameProps) {
  const [cards, setCards] = useState<CardItem[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [bestMoves, setBestMoves] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("memory_best_moves")
    if (saved) setBestMoves(parseInt(saved, 10))
  }, [])

  const initGame = useCallback(() => {
    const paired = [...SYMBOLS, ...SYMBOLS]
    // Shuffle Fisher-Yates
    for (let i = paired.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[paired[i], paired[j]] = [paired[j], paired[i]]
    }

    const initialCards: CardItem[] = paired.map((item, idx) => ({
      id: idx,
      symbol: item.symbol,
      name: item.name,
      isFlipped: false,
      isMatched: false,
    }))

    setCards(initialCards)
    setFlippedIndices([])
    setMoves(0)
    setMatchedPairs(0)
    setIsLocked(false)
    setSeconds(0)
    setIsTimerActive(false)
  }, [])

  useEffect(() => {
    initGame()
  }, [initGame])

  // Stopwatch timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isTimerActive && matchedPairs < SYMBOLS.length) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, matchedPairs])

  const handleCardClick = (index: number) => {
    if (isLocked) return
    const card = cards[index]
    if (card.isFlipped || card.isMatched) return

    // Start timer on first flip
    if (!isTimerActive) setIsTimerActive(true)

    sfx.hit()

    // Flip the clicked card
    const updatedCards = [...cards]
    updatedCards[index].isFlipped = true
    setCards(updatedCards)

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    if (newFlipped.length === 2) {
      setIsLocked(true)
      setMoves((m) => m + 1)
      const [firstIdx, secondIdx] = newFlipped
      const firstCard = cards[firstIdx]
      const secondCard = cards[secondIdx]

      if (firstCard.symbol === secondCard.symbol) {
        // Matched!
        setTimeout(() => {
          setCards((prev) => {
            const next = [...prev]
            next[firstIdx].isMatched = true
            next[secondIdx].isMatched = true
            return next
          })
          setMatchedPairs((p) => {
            const nextP = p + 1
            if (nextP === SYMBOLS.length) {
              sfx.win()
              setIsTimerActive(false)
              const curMoves = moves + 1
              if (!bestMoves || curMoves < bestMoves) {
                setBestMoves(curMoves)
                localStorage.setItem("memory_best_moves", curMoves.toString())
              }
            } else {
              sfx.score()
            }
            return nextP
          })
          setFlippedIndices([])
          setIsLocked(false)
        }, 400)
      } else {
        // Not matched - flip back
        setTimeout(() => {
          setCards((prev) => {
            const next = [...prev]
            next[firstIdx].isFlipped = false
            next[secondIdx].isFlipped = false
            return next
          })
          setFlippedIndices([])
          setIsLocked(false)
        }, 900)
      }
    }
  }

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const s = sec % 60
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const isCompleted = matchedPairs === SYMBOLS.length

  return (
    <div className="flex flex-col items-center w-full max-w-[460px] select-none">
      {/* Top Stats Bar */}
      <div className="flex items-center justify-between w-full px-4 py-2.5 mb-3 rounded-xl bg-thirdary/40 border border-text-secondary/15 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Waktu:</span>
          <span className="font-mono text-sm font-bold text-text-primary">{formatTime(seconds)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Langkah:</span>
          <span className="font-mono text-sm font-bold text-text-primary">{moves}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Pasangan:</span>
          <span className="font-mono text-sm font-bold text-emerald-500">
            {matchedPairs} / {SYMBOLS.length}
          </span>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="w-full text-center py-2.5 px-4 mb-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs sm:text-sm font-bold animate-bounce">
          🎉 Hebat! Kamu menyelesaikan semua pasangan dalam {moves} langkah ({formatTime(seconds)})!
        </div>
      )}

      {/* 4x4 Grid of 3D Cards */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full aspect-square p-2 rounded-2xl bg-thirdary/20 border border-text-secondary/15">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className="w-full h-full cursor-pointer perspective-1000"
          >
            <div
              className={`relative w-full h-full duration-500 rounded-xl sm:rounded-2xl shadow-sm transition-transform transform-style-3d ${
                card.isFlipped || card.isMatched ? "rotate-y-180" : "hover:scale-[1.03]"
              }`}
            >
              {/* Back Face (Hidden Card) */}
              <div
                className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border transition-colors ${
                  isDark
                    ? "bg-thirdary/90 border-text-secondary/25 hover:border-text-primary/60 text-text-secondary"
                    : "bg-white border-slate-200 hover:border-slate-400 text-slate-500 shadow-sm"
                }`}
              >
                <span className="text-xs font-mono font-bold tracking-widest opacity-60">AH</span>
                <span className="text-[10px] opacity-40 mt-0.5">✦</span>
              </div>

              {/* Front Face (Revealed Card) */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center rounded-xl sm:rounded-2xl border text-2xl sm:text-3xl transition-all ${
                  card.isMatched
                    ? "bg-emerald-500/20 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.25)] scale-[0.98]"
                    : isDark
                    ? "bg-thirdary border-text-primary/40 shadow-md"
                    : "bg-white border-blue-400 shadow-md"
                }`}
              >
                {card.symbol}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Hints and Controls */}
      <div className="flex items-center justify-between w-full mt-3 px-1 text-[11px] text-text-secondary">
        <span>
          {bestMoves ? `🏆 Rekor Terbaik: ${bestMoves} langkah` : "Temukan 8 pasangan kartu secepat mungkin"}
        </span>
        <button
          onClick={initGame}
          className="px-3 py-1 rounded-lg bg-thirdary hover:bg-button-hover text-text-primary font-medium border border-text-secondary/20 transition-all text-xs cursor-pointer shadow-sm hover:scale-105"
        >
          Acak Ulang 🔄
        </button>
      </div>
    </div>
  )
}
