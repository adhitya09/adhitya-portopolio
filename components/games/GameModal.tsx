"use client"
import React, { useEffect, useState } from "react"
import { sfx } from "./soundEffects"
import BreakoutGame from "./BreakoutGame"
import FlappyBirdGame from "./FlappyBirdGame"
import HangmanGame from "./HangmanGame"
import MemoryMatchGame from "./MemoryMatchGame"
import PongGame from "./PongGame"
import TicTacToeGame from "./TicTacToeGame"
import WhackAMoleGame from "./WhackAMoleGame"

export interface GameInfo {
  id: string
  title: string
  titleEn: string
  icon: string
  tag: string
  tagEn: string
  description: string
  descriptionEn: string
}

interface GameModalProps {
  game: GameInfo | null
  onClose: () => void
  isDark: boolean
  language: "id" | "en"
}

export default function GameModal({ game, onClose, isDark, language }: GameModalProps) {
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    setIsMuted(sfx.isMuted())
  }, [])

  // Close on Escape key & block background scroll
  useEffect(() => {
    if (!game) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [game, onClose])

  if (!game) return null

  const toggleSound = () => {
    const muted = sfx.toggleMute()
    setIsMuted(muted)
  }

  const renderGameContent = () => {
    switch (game.id) {
      case "breakout":
        return <BreakoutGame isDark={isDark} onClose={onClose} />
      case "flappy":
        return <FlappyBirdGame isDark={isDark} onClose={onClose} />
      case "hangman":
        return <HangmanGame isDark={isDark} onClose={onClose} />
      case "memory":
        return <MemoryMatchGame isDark={isDark} onClose={onClose} />
      case "pong":
        return <PongGame isDark={isDark} onClose={onClose} />
      case "tictactoe":
        return <TicTacToeGame isDark={isDark} onClose={onClose} />
      case "whack":
        return <WhackAMoleGame isDark={isDark} onClose={onClose} />
      default:
        return null
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Standard Bounded Window (NOT full screen as requested by user) */}
      <div
        className="relative w-full max-w-xl sm:max-w-2xl max-h-[92vh] flex flex-col bg-background border border-text-secondary/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4 border-b border-text-secondary/15 bg-thirdary/30 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl filter drop-shadow-sm">{game.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-text-primary tracking-tight">
                  {language === "en" ? game.titleEn : game.title}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-text-secondary border border-text-secondary/15">
                  {language === "en" ? game.tagEn : game.tag}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-text-secondary line-clamp-1">
                {language === "en" ? game.descriptionEn : game.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Mute Toggle */}
            <button
              onClick={toggleSound}
              className="p-1.5 sm:p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-thirdary/60 transition-all cursor-pointer border border-transparent hover:border-text-secondary/20"
              title={isMuted ? "Aktifkan Suara" : "Bisukan Suara"}
              aria-label="Toggle Sound"
            >
              {isMuted ? (
                <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-thirdary/60 transition-all cursor-pointer border border-transparent hover:border-text-secondary/20"
              title="Tutup (Esc)"
              aria-label="Tutup Game"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Game Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
          {renderGameContent()}
        </div>
      </div>
    </div>
  )
}
