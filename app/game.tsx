"use client"
import React, { useState, useEffect } from "react"
import FadeDown from "@/components/animations/FadeDown"
import FadeUp from "@/components/animations/FadeUp"
import GlareHover from "@/components/GlareHover"
import { useLanguage } from "@/components/LanguageContext"
import GameModal, { GameInfo } from "@/components/games/GameModal"

export const GAMES_LIST: (GameInfo & { previewBg: string; accentColor: string })[] = [
  {
    id: "breakout",
    title: "Breakout Retro",
    titleEn: "Retro Breakout",
    icon: "🧱",
    tag: "Arkade Klasik",
    tagEn: "Classic Arcade",
    description: "Hancurkan semua balok neon retro dengan paddle dan pantulan bola berkecepatan tinggi.",
    descriptionEn: "Smash through vibrant neon brick rows with precision paddle ball deflections.",
    previewBg: "from-sky-500/20 via-indigo-500/10 to-purple-500/20",
    accentColor: "#38bdf8",
  },
  {
    id: "flappy",
    title: "Flappy Bird",
    titleEn: "Flappy Bird",
    icon: "🐦",
    tag: "Refleks & Aksi",
    tagEn: "Action Reflex",
    description: "Terbangkan burung melewati celah pipa-pipa rintangan dan raih rekor skor tertinggi.",
    descriptionEn: "Navigate the flying bird smoothly through challenging pipe obstacles.",
    previewBg: "from-amber-500/20 via-emerald-500/10 to-teal-500/20",
    accentColor: "#fbbf24",
  },
  {
    id: "hangman",
    title: "Tebak Kata",
    titleEn: "Word Hangman",
    icon: "🔤",
    tag: "Teka-teki Kata",
    tagEn: "Word Puzzle",
    description: "Tebak kosakata teknologi, sains, dan alam rahasia sebelum kesempatan habis.",
    descriptionEn: "Guess secret technology and science terms before your remaining lives expire.",
    previewBg: "from-violet-500/20 via-purple-500/10 to-pink-500/20",
    accentColor: "#a855f7",
  },
  {
    id: "memory",
    title: "Memory Match",
    titleEn: "Memory Match",
    icon: "🃏",
    tag: "Daya Ingat",
    tagEn: "Memory Brain",
    description: "Buka dan cocokkan pasangan kartu 3D secepat mungkin dengan langkah seminimal mungkin.",
    descriptionEn: "Flip and match 3D pairs of iconic cards with minimal moves and best timing.",
    previewBg: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    accentColor: "#10b981",
  },
  {
    id: "pong",
    title: "Cyber Pong",
    titleEn: "Cyber Pong",
    icon: "🏓",
    tag: "Duel vs AI",
    tagEn: "Duel vs AI",
    description: "Tenis meja retro futuristik neon berkecepatan tinggi melawan kecerdasan komputer.",
    descriptionEn: "High-speed futuristic cyber table tennis duel against a smart computer opponent.",
    previewBg: "from-cyan-500/20 via-blue-500/10 to-indigo-500/20",
    accentColor: "#06b6d4",
  },
  {
    id: "tictactoe",
    title: "Tic-Tac-Toe AI",
    titleEn: "Tic-Tac-Toe AI",
    icon: "❌⭕",
    tag: "Strategi Minimax",
    tagEn: "Minimax Strategy",
    description: "Tantang Minimax AI yang cerdas di papan grid 3x3 klasik dengan garis kemenangan neon.",
    descriptionEn: "Challenge an unbeatable Minimax algorithm in the timeless 3x3 strategic battle.",
    previewBg: "from-rose-500/20 via-pink-500/10 to-purple-500/20",
    accentColor: "#f43f5e",
  },
  {
    id: "whack",
    title: "Whack-a-Mole",
    titleEn: "Whack-a-Mole",
    icon: "🔨",
    tag: "Kecepatan Tangan",
    tagEn: "Speed Action",
    description: "Pukul tikus tanah dan golden mole yang muncul secepat mungkin dalam waktu 30 detik!",
    descriptionEn: "Whack regular and golden moles popping up within 30 seconds for mega combos!",
    previewBg: "from-orange-500/20 via-amber-500/10 to-yellow-500/20",
    accentColor: "#f97316",
  },
]

export default function GameSection() {
  const { language, t } = useLanguage()
  const [activeGame, setActiveGame] = useState<GameInfo | null>(null)
  const [isDark, setIsDark] = useState(false)

  // Track theme changes dynamically
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    checkDark()

    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section
        id="game"
        className="w-full max-w-7xl mx-auto py-20 sm:py-24 md:py-32 cursor-default bg-background relative overflow-hidden border-t border-text-secondary/10"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

        <FadeDown>
          <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 sm:mb-16 md:mb-20 w-full text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-thirdary/60 border border-text-secondary/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs font-bold tracking-[0.2em] text-text-secondary uppercase">
                {language === "en" ? "Interactive Arcade" : "Mini Games Santai"}
              </h2>
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">
              {language === "en" ? "Play Mini Games" : "Koleksi Game"}
            </h3>
            <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
              {language === "en"
                ? "Relax and enjoy these retro arcade games rebuilt with sleek modern aesthetics, crisp physics, and seamless dark & light theme adaptation."
                : "Nikmati koleksi game arkade santai yang dibuat dengan visual modern, kontrol responsif, efek suara retro, serta adaptasi tema gelap dan terang otomatis."}
            </p>
          </div>
        </FadeDown>

        {/* Game Cards Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 md:px-12 relative z-10">
          {GAMES_LIST.map((game, index) => (
            <FadeUp key={game.id}>
              <div
                onClick={() => setActiveGame(game)}
                className="group cursor-pointer h-full"
              >
                <GlareHover className="flex flex-col h-full bg-background border border-text-secondary/20 hover:border-text-primary/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                  {/* Card Visual Preview Banner */}
                  <div className={`relative w-full h-44 bg-gradient-to-br ${game.previewBg} p-6 flex flex-col items-center justify-center overflow-hidden border-b border-text-secondary/15 transition-all group-hover:scale-[1.02]`}>
                    {/* Background Grid Pattern */}
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: "20px 20px",
                      }}
                    />

                    {/* Central Icon Illustration */}
                    <div className="relative z-10 w-20 h-20 rounded-2xl bg-background/80 backdrop-blur-md border border-text-secondary/20 flex items-center justify-center text-4xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <span className="filter drop-shadow">{game.icon}</span>
                    </div>

                    {/* Corner Tag Pill */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md text-text-primary border border-text-secondary/20 shadow-sm">
                        {language === "en" ? game.tagEn : game.tag}
                      </span>
                    </div>

                    {/* Play Badge Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <span className="px-4 py-2 rounded-full bg-primary text-button-hero font-bold text-xs shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <span>▶</span>
                        <span>{language === "en" ? "Play Now" : "Mainkan"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-1 justify-between bg-thirdary/15">
                    <div>
                      <h4 className="text-lg font-black text-text-primary tracking-tight group-hover:text-primary transition-colors">
                        {language === "en" ? game.titleEn : game.title}
                      </h4>
                      <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {language === "en" ? game.descriptionEn : game.description}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-5 pt-3 border-t border-text-secondary/15 flex items-center justify-between text-xs font-bold text-text-primary">
                      <span className="text-text-secondary text-[11px] font-medium">
                        {language === "en" ? "Click to play" : "Klik untuk main"}
                      </span>
                      <span className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>{language === "en" ? "Launch" : "Buka"}</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </GlareHover>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Active Game Modal Container (Standard Non-Fullscreen Viewport) */}
      <GameModal
        game={activeGame}
        onClose={() => setActiveGame(null)}
        isDark={isDark}
        language={language}
      />
    </>
  )
}
