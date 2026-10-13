"use client"
import React, { useState, useEffect, useRef, useCallback } from "react"
import { sfx } from "./soundEffects"

interface WhackAMoleGameProps {
  isDark: boolean
  onClose?: () => void
}

interface MoleHole {
  id: number
  hasMole: boolean
  isGolden: boolean
  isWhacked: boolean
}

export default function WhackAMoleGame({ isDark }: WhackAMoleGameProps) {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [combo, setCombo] = useState(0)
  const [floatingScores, setFloatingScores] = useState<{ id: number; text: string; x: number; y: number }[]>([])

  const [holes, setHoles] = useState<MoleHole[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      hasMole: false,
      isGolden: false,
      isWhacked: false,
    }))
  )

  const activeHoleRef = useRef<number>(-1)
  const moleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const clockTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("whack_highscore")
    if (saved) setHighScore(parseInt(saved, 10))
  }, [])

  const stopGame = useCallback(() => {
    if (moleTimerRef.current) clearInterval(moleTimerRef.current)
    if (clockTimerRef.current) clearInterval(clockTimerRef.current)
    moleTimerRef.current = null
    clockTimerRef.current = null
    setIsPlaying(false)
    activeHoleRef.current = -1

    setHoles((prev) =>
      prev.map((h) => ({ ...h, hasMole: false, isGolden: false, isWhacked: false }))
    )
  }, [])

  const showNextMole = useCallback(() => {
    const nextHole = Math.floor(Math.random() * 9)
    activeHoleRef.current = nextHole
    const isGolden = Math.random() < 0.2 // 20% golden mole chance

    setHoles((prev) =>
      prev.map((h) => ({
        ...h,
        hasMole: h.id === nextHole,
        isGolden: h.id === nextHole ? isGolden : false,
        isWhacked: false,
      }))
    )
  }, [])

  const startGame = () => {
    stopGame()
    setScore(0)
    setTimeLeft(30)
    setCombo(0)
    setIsPlaying(true)
    sfx.jump()

    showNextMole()
    moleTimerRef.current = setInterval(showNextMole, 750)

    clockTimerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopGame()
          sfx.win()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  // Update high score when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("whack_highscore", score.toString())
    }
  }, [score, highScore])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (moleTimerRef.current) clearInterval(moleTimerRef.current)
      if (clockTimerRef.current) clearInterval(clockTimerRef.current)
    }
  }, [])

  const whack = (holeId: number, e: React.MouseEvent) => {
    if (!isPlaying) return
    const hole = holes[holeId]
    if (hole.hasMole && !hole.isWhacked) {
      sfx.whack()
      const pts = hole.isGolden ? 25 : 10
      const currentCombo = combo + 1
      const totalPts = pts + (currentCombo > 3 ? 5 : 0)

      setScore((s) => s + totalPts)
      setCombo(currentCombo)

      // Mark whacked
      setHoles((prev) =>
        prev.map((h) => (h.id === holeId ? { ...h, isWhacked: true } : h))
      )

      // Spawn floating score indicator
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const newFloating = {
        id: Date.now() + Math.random(),
        text: `+${totalPts}${currentCombo > 3 ? " 🔥" : ""}`,
        x: rect.width / 2,
        y: 10,
      }
      setFloatingScores((prev) => [...prev, newFloating])
      setTimeout(() => {
        setFloatingScores((prev) => prev.filter((f) => f.id !== newFloating.id))
      }, 700)

      // Move to next mole quickly
      setTimeout(() => {
        if (activeHoleRef.current === holeId) {
          showNextMole()
        }
      }, 200)
    } else {
      // Missed whack breaks combo
      setCombo(0)
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[440px] select-none">
      {/* Top Stats Bar */}
      <div className="flex items-center justify-between w-full px-4 py-2.5 mb-3 rounded-xl bg-thirdary/40 border border-text-secondary/15 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Waktu:</span>
          <span className={`font-mono text-sm font-bold ${timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-text-primary"}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Kombo:</span>
          <span className="font-mono text-sm font-bold text-amber-500">
            {combo > 1 ? `x${combo} 🔥` : combo}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Skor:</span>
          <span className="font-mono text-sm font-bold text-text-primary">{score}</span>
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full h-1.5 bg-thirdary rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-1000 ${
            timeLeft <= 5 ? "bg-red-500" : timeLeft <= 12 ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        />
      </div>

      {/* 3x3 Burrows Grid */}
      <div className="grid grid-cols-3 gap-3.5 sm:gap-4 w-full aspect-square p-4 rounded-3xl bg-thirdary/20 border border-text-secondary/15">
        {holes.map((hole) => (
          <div
            key={hole.id}
            onClick={(e) => whack(hole.id, e)}
            className="relative w-full h-full rounded-2xl flex items-center justify-center cursor-pointer group"
          >
            {/* Mound / Hole Visual */}
            <div
              className={`w-full h-full rounded-2xl border flex items-center justify-center transition-all overflow-hidden ${
                isDark
                  ? "bg-slate-900/80 border-slate-700/60 shadow-inner"
                  : "bg-slate-200/90 border-slate-300 shadow-inner"
              }`}
            >
              {/* Inner Hole Well */}
              <div
                className={`w-[85%] h-[85%] rounded-full flex items-center justify-center transition-all ${
                  isDark ? "bg-black/70 shadow-inner" : "bg-slate-400/30 shadow-inner"
                }`}
              >
                {/* Mole Character */}
                {hole.hasMole && (
                  <div
                    className={`transform transition-all duration-150 flex flex-col items-center justify-center ${
                      hole.isWhacked
                        ? "scale-90 opacity-80 rotate-12"
                        : "scale-110 -translate-y-1 hover:scale-125"
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl filter drop-shadow-md select-none">
                      {hole.isWhacked ? "💥" : hole.isGolden ? "👑🐹" : "🐹"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Score Animation on Whack */}
            {floatingScores.map((f) => (
              <span
                key={f.id}
                className="absolute top-2 pointer-events-none font-black text-emerald-400 text-sm animate-bounce filter drop-shadow"
              >
                {f.text}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Game Over Modal / Alert */}
      {!isPlaying && timeLeft === 0 && (
        <div className="w-full text-center py-2.5 px-4 mt-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-sm font-bold animate-bounce">
          🏆 Waktu Habis! Skor Akhirmu: <span className="underline font-black">{score}</span>
        </div>
      )}

      {/* Bottom Info & Action */}
      <div className="flex items-center justify-between w-full mt-3 px-1 text-[11px] text-text-secondary">
        <span>🏆 Rekor Tertinggi: {highScore} Poin</span>
        <button
          onClick={startGame}
          className="px-4 py-1.5 rounded-xl bg-primary text-button-hero hover:bg-button-hero-hover font-bold border border-text-secondary/20 transition-all text-xs cursor-pointer shadow-md hover:scale-105 active:scale-95"
        >
          {isPlaying ? "Ulangi 🔄" : timeLeft === 0 ? "Main Lagi 🎮" : "Mulai Main 🚀"}
        </button>
      </div>
    </div>
  )
}
