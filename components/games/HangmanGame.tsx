"use client"
import React, { useState, useEffect, useCallback } from "react"
import { sfx } from "./soundEffects"

interface HangmanGameProps {
  isDark: boolean
  onClose?: () => void
}

interface WordItem {
  word: string
  category: { id: string; en: string }
  hint?: { id: string; en: string }
}

const WORD_BANK: WordItem[] = [
  { word: "REACT", category: { id: "Teknologi", en: "Technology" }, hint: { id: "Framework UI populer dari Meta", en: "Popular UI library by Meta" } },
  { word: "PYTHON", category: { id: "Pemrograman", en: "Programming" }, hint: { id: "Bahasa populer untuk AI & Data Science", en: "Popular language for AI & Data" } },
  { word: "DATABASE", category: { id: "Teknologi", en: "Technology" }, hint: { id: "Tempat penyimpanan data terstruktur", en: "Structured data storage system" } },
  { word: "ALGORITMA", category: { id: "Komputer", en: "Computer" }, hint: { id: "Langkah logis pemecahan masalah", en: "Step-by-step logic solver" } },
  { word: "PORTFOLIO", category: { id: "Karier", en: "Career" }, hint: { id: "Kumpulan karya profesional seorang kreator", en: "Collection of professional works" } },
  { word: "DEVELOPER", category: { id: "Profesi", en: "Profession" }, hint: { id: "Pembuat aplikasi & kode perangkat lunak", en: "Software code builder" } },
  { word: "KECERDASAN", category: { id: "Teknologi", en: "Technology" }, hint: { id: "AI = ... Buatan", en: "Artificial ..." } },
  { word: "RESPONSIF", category: { id: "Desain Web", en: "Web Design" }, hint: { id: "Menyesuaikan layar ponsel & desktop", en: "Adapts to mobile & desktop" } },
  { word: "KOMPUTER", category: { id: "Perangkat", en: "Device" }, hint: { id: "Mesin pengolah data elektronik", en: "Electronic computation device" } },
  { word: "SAMUDRA", category: { id: "Alam", en: "Nature" }, hint: { id: "Lautan luas di bumi", en: "Vast ocean body on earth" } },
  { word: "GALAXY", category: { id: "Antariksa", en: "Space" }, hint: { id: "Kumpulan miliaran bintang", en: "System of billions of stars" } },
  { word: "INTERNET", category: { id: "Jaringan", en: "Network" }, hint: { id: "Jaringan global yang menghubungkan dunia", en: "Global interconnected network" } },
]

export default function HangmanGame({ isDark }: HangmanGameProps) {
  const [currentWordItem, setCurrentWordItem] = useState<WordItem>(WORD_BANK[0])
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongCount, setWrongCount] = useState(0)
  const [score, setScore] = useState(0)
  const maxWrong = 6

  const word = currentWordItem.word.toUpperCase()

  const startNewGame = useCallback(() => {
    const random = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]
    setCurrentWordItem(random)
    setGuessedLetters(new Set())
    setWrongCount(0)
  }, [])

  useEffect(() => {
    startNewGame()
  }, [startNewGame])

  const isWon = word.length > 0 && word.split("").every((ch) => guessedLetters.has(ch))
  const isLost = wrongCount >= maxWrong
  const isGameOver = isWon || isLost

  const guessLetter = useCallback((ch: string) => {
    const letter = ch.toUpperCase()
    if (guessedLetters.has(letter) || isGameOver) return

    setGuessedLetters((prev) => {
      const next = new Set(prev)
      next.add(letter)
      return next
    })

    if (!word.includes(letter)) {
      setWrongCount((prev) => {
        const next = prev + 1
        sfx.lose()
        return next
      })
    } else {
      sfx.hit()
    }
  }, [guessedLetters, isGameOver, word])

  // Play win/lose sound when game ends
  useEffect(() => {
    if (isWon) {
      sfx.win()
      setScore((s) => s + 100)
    }
  }, [isWon])

  // Physical keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(e.key)) {
        guessLetter(e.key)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [guessLetter])

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ]

  return (
    <div className="flex flex-col items-center w-full max-w-[500px] select-none">
      {/* Header Info */}
      <div className="flex items-center justify-between w-full px-4 py-2 mb-3 rounded-xl bg-thirdary/40 border border-text-secondary/15 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary">Kategori:</span>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-text-primary text-[11px] font-bold">
            {currentWordItem.category.id}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Kesempatan:</span>
          <span className="font-mono text-sm font-bold text-red-500">
            {maxWrong - wrongCount} / {maxWrong}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Skor:</span>
          <span className="font-mono text-sm font-bold text-text-primary">{score}</span>
        </div>
      </div>

      {/* SVG Vector Gallows Illustration */}
      <div className="w-full flex justify-center py-2">
        <svg
          viewBox="0 0 200 170"
          className="w-48 h-36 filter drop-shadow-sm transition-all"
        >
          {/* Base Stand */}
          <line x1="20" y1="160" x2="100" y2="160" stroke={isDark ? "#475569" : "#94a3b8"} strokeWidth="5" strokeLinecap="round" />
          {/* Vertical Pole */}
          <line x1="50" y1="160" x2="50" y2="20" stroke={isDark ? "#475569" : "#94a3b8"} strokeWidth="5" strokeLinecap="round" />
          {/* Top Beam */}
          <line x1="50" y1="20" x2="140" y2="20" stroke={isDark ? "#475569" : "#94a3b8"} strokeWidth="5" strokeLinecap="round" />
          {/* Strut */}
          <line x1="50" y1="50" x2="80" y2="20" stroke={isDark ? "#475569" : "#94a3b8"} strokeWidth="4" />
          {/* Rope */}
          <line x1="140" y1="20" x2="140" y2="45" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 2" />

          {/* Hangman Person Parts depending on wrongCount */}
          {/* 1. Head */}
          {wrongCount >= 1 && (
            <circle
              cx="140"
              cy="58"
              r="13"
              fill={isDark ? "#1e293b" : "#f1f5f9"}
              stroke={wrongCount >= 6 ? "#ef4444" : isDark ? "#38bdf8" : "#2563eb"}
              strokeWidth="3.5"
            />
          )}
          {/* 2. Body */}
          {wrongCount >= 2 && (
            <line
              x1="140"
              y1="71"
              x2="140"
              y2="110"
              stroke={wrongCount >= 6 ? "#ef4444" : isDark ? "#38bdf8" : "#2563eb"}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
          {/* 3. Left Arm */}
          {wrongCount >= 3 && (
            <line
              x1="140"
              y1="82"
              x2="118"
              y2="100"
              stroke={wrongCount >= 6 ? "#ef4444" : isDark ? "#38bdf8" : "#2563eb"}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
          {/* 4. Right Arm */}
          {wrongCount >= 4 && (
            <line
              x1="140"
              y1="82"
              x2="162"
              y2="100"
              stroke={wrongCount >= 6 ? "#ef4444" : isDark ? "#38bdf8" : "#2563eb"}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
          {/* 5. Left Leg */}
          {wrongCount >= 5 && (
            <line
              x1="140"
              y1="110"
              x2="122"
              y2="138"
              stroke={wrongCount >= 6 ? "#ef4444" : isDark ? "#38bdf8" : "#2563eb"}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
          {/* 6. Right Leg */}
          {wrongCount >= 6 && (
            <line
              x1="140"
              y1="110"
              x2="158"
              y2="138"
              stroke="#ef4444"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      {/* Secret Word Tiles */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 my-3 px-2">
        {word.split("").map((ch, idx) => {
          const revealed = guessedLetters.has(ch) || isLost
          return (
            <div
              key={idx}
              className={`w-9 h-11 sm:w-11 sm:h-13 rounded-xl border flex items-center justify-center font-mono text-xl sm:text-2xl font-black transition-all ${
                revealed
                  ? isLost && !guessedLetters.has(ch)
                    ? "bg-red-500/10 border-red-500/50 text-red-500"
                    : "bg-thirdary/60 border-text-secondary/30 text-text-primary shadow-sm"
                  : "bg-thirdary/20 border-dashed border-text-secondary/30 text-transparent"
              }`}
            >
              {revealed ? ch : "_"}
            </div>
          )
        })}
      </div>

      {/* Clue Hint */}
      {currentWordItem.hint && (
        <p className="text-xs text-text-secondary italic text-center mb-3 px-4">
          💡 Petunjuk: {currentWordItem.hint.id}
        </p>
      )}

      {/* Status Alert if Won or Lost */}
      {isWon && (
        <div className="w-full text-center py-2 px-4 mb-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-sm font-bold animate-bounce">
          🎉 Luar Biasa! Kamu berhasil menebak kata: <span className="underline">{word}</span>
        </div>
      )}
      {isLost && (
        <div className="w-full text-center py-2 px-4 mb-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 text-sm font-bold">
          😢 Kesempatan habis! Kata yang benar adalah: <span className="underline">{word}</span>
        </div>
      )}

      {/* Virtual Keyboard */}
      <div className="w-full flex flex-col gap-1.5 mt-2">
        {keyboardRows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((letter) => {
              const isGuessed = guessedLetters.has(letter)
              const isCorrect = isGuessed && word.includes(letter)
              const isWrong = isGuessed && !word.includes(letter)

              return (
                <button
                  key={letter}
                  disabled={isGuessed || isGameOver}
                  onClick={() => guessLetter(letter)}
                  className={`w-8 h-10 sm:w-10 sm:h-11 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isCorrect
                      ? "bg-emerald-500 text-white border border-emerald-600 shadow-sm"
                      : isWrong
                      ? "bg-thirdary/30 text-text-secondary/30 border border-text-secondary/10 cursor-not-allowed"
                      : "bg-thirdary/80 hover:bg-button-hover text-text-primary border border-text-secondary/20 hover:scale-105 active:scale-95"
                  }`}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="flex items-center justify-between w-full mt-4 px-2">
        <span className="text-[11px] text-text-secondary">⌨️ Bisa mengetik keyboard fisik langsung</span>
        <button
          onClick={startNewGame}
          className="px-4 py-1.5 rounded-xl bg-thirdary hover:bg-button-hover text-text-primary text-xs font-bold border border-text-secondary/25 transition-all cursor-pointer shadow-sm hover:scale-105"
        >
          {isGameOver ? "Kata Baru 🔄" : "Ganti Kata 🎲"}
        </button>
      </div>
    </div>
  )
}
