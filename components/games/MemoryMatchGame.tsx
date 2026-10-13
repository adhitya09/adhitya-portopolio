"use client"
import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { sfx } from "./soundEffects"

interface MemoryMatchGameProps {
  isDark: boolean
  onClose?: () => void
}

interface TechCardItem {
  key: string
  name: string
  image: string
}

interface CardState {
  id: number
  key: string
  name: string
  image: string
  isFlipped: boolean
  isMatched: boolean
}

const TECH_CARDS: TechCardItem[] = [
  { key: "react", name: "React", image: "/icons/react.svg" },
  { key: "typescript", name: "TypeScript", image: "/icons/typescript.svg" },
  { key: "nextjs", name: "Next.js", image: "/icons/nextjs.svg" },
  { key: "nodejs", name: "Node.js", image: "/icons/nodejs.svg" },
  { key: "docker", name: "Docker", image: "/icons/docker.svg" },
  { key: "git", name: "Git", image: "/icons/git.svg" },
  { key: "tailwind", name: "Tailwind", image: "/icons/tailwindcss.svg" },
  { key: "postgresql", name: "PostgreSQL", image: "/icons/postgresql.svg" },
]

export default function MemoryMatchGame({ isDark }: MemoryMatchGameProps) {
  const [cards, setCards] = useState<CardState[]>([])
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
    const paired = [...TECH_CARDS, ...TECH_CARDS]
    // Fisher-Yates Shuffle
    for (let i = paired.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[paired[i], paired[j]] = [paired[j], paired[i]]
    }

    const initialCards: CardState[] = paired.map((item, idx) => ({
      id: idx,
      key: item.key,
      name: item.name,
      image: item.image,
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
    if (isTimerActive && matchedPairs < TECH_CARDS.length) {
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

    // Flip the clicked card immediately
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

      if (firstCard.key === secondCard.key) {
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
            if (nextP === TECH_CARDS.length) {
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
        }, 350)
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

  const isCompleted = matchedPairs === TECH_CARDS.length

  return (
    <div className="flex flex-col items-center w-full max-w-[480px] select-none">
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
            {matchedPairs} / {TECH_CARDS.length}
          </span>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="w-full text-center py-2.5 px-4 mb-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs sm:text-sm font-bold animate-bounce">
          🎉 Luar Biasa! Semua {TECH_CARDS.length} pasangan teknologi ditemukan dalam {moves} langkah ({formatTime(seconds)})!
        </div>
      )}

      {/* 4x4 Grid of 3D Cards */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full aspect-square p-2 sm:p-2.5 rounded-2xl bg-thirdary/20 border border-text-secondary/15">
        {cards.map((card, idx) => {
          const isCardFlipped = card.isFlipped || card.isMatched

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className="memory-card-container w-full h-full cursor-pointer group"
            >
              <div
                className={`memory-card-inner rounded-xl sm:rounded-2xl shadow-sm ${
                  isCardFlipped ? "flipped" : "hover:scale-[1.02]"
                }`}
                style={{
                  transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  WebkitTransform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Back Face (Shows User's Logo) */}
                <div
                  className={`memory-card-face memory-card-back flex flex-col items-center justify-center p-2 rounded-xl sm:rounded-2xl border transition-colors ${
                    isDark
                      ? "bg-thirdary/95 border-text-secondary/25 group-hover:border-text-primary/60"
                      : "bg-white border-slate-200 group-hover:border-slate-400 shadow-sm"
                  }`}
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <div className="w-9 h-9 sm:w-12 sm:h-12 relative flex items-center justify-center p-1 rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/logo.png"
                      alt="AH Logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                      priority
                    />
                  </div>
                </div>

                {/* Front Face (Revealed: Shows Tech Image + Name) */}
                <div
                  className={`memory-card-face memory-card-front flex flex-col items-center justify-center p-2 rounded-xl sm:rounded-2xl border transition-all ${
                    card.isMatched
                      ? "bg-emerald-500/20 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[0.98]"
                      : isDark
                      ? "bg-thirdary border-text-primary/40 shadow-lg"
                      : "bg-white border-sky-400 shadow-lg"
                  }`}
                  style={{
                    transform: "rotateY(180deg)",
                    WebkitTransform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 relative flex items-center justify-center p-1 rounded-lg bg-black/5 dark:bg-white/5 border border-text-secondary/15">
                    <Image
                      src={card.image}
                      alt={card.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-text-primary mt-1 tracking-tight text-center truncate max-w-full px-1">
                    {card.name}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Hints and Controls */}
      <div className="flex items-center justify-between w-full mt-3 px-1 text-[11px] text-text-secondary">
        <span>
          {bestMoves ? `🏆 Rekor Terbaik: ${bestMoves} langkah` : "Cocokkan 8 pasang logo teknologi"}
        </span>
        <button
          onClick={initGame}
          className="px-3.5 py-1.5 rounded-lg bg-thirdary hover:bg-button-hover text-text-primary font-bold border border-text-secondary/20 transition-all text-xs cursor-pointer shadow-sm hover:scale-105 active:scale-95"
        >
          Acak Ulang 🔄
        </button>
      </div>
    </div>
  )
}
