"use client"
import React, { useEffect, useRef, useState, useCallback } from "react"
import { sfx } from "./soundEffects"

interface PongGameProps {
  isDark: boolean
  onClose?: () => void
}

export default function PongGame({ isDark }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [winner, setWinner] = useState<string | null>(null)
  const [gameState, setGameState] = useState<"ready" | "playing" | "ended">("ready")

  const targetScore = 5

  const stateRef = useRef({
    gameState: "ready" as "ready" | "playing" | "ended",
    playerScore: 0,
    aiScore: 0,
    paddleH: 72,
    paddleW: 10,
    player: { x: 14, y: 144, vy: 0 },
    ai: { x: 516, y: 144, vy: 0, speed: 3.8 },
    ball: { x: 270, y: 180, r: 7, vx: 4.5, vy: 2.5, trail: [] as { x: number; y: number }[] },
    keys: { up: false, down: false },
    isDark: true,
  })

  useEffect(() => {
    stateRef.current.isDark = isDark
  }, [isDark])

  const resetBall = (direction: number) => {
    const s = stateRef.current
    s.ball.x = 270
    s.ball.y = 180
    s.ball.vx = direction * 4.5
    s.ball.vy = (Math.random() * 4 - 2) * 1.5
    s.ball.trail = []
  }

  const startMatch = useCallback(() => {
    const s = stateRef.current
    s.playerScore = 0
    s.aiScore = 0
    s.player.y = 144
    s.ai.y = 144
    resetBall(Math.random() > 0.5 ? 1 : -1)
    s.gameState = "playing"
    setPlayerScore(0)
    setAiScore(0)
    setWinner(null)
    setGameState("playing")
    sfx.jump()
  }, [])

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        stateRef.current.keys.up = true
      }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        stateRef.current.keys.down = true
      }
      if (e.code === "Space" && stateRef.current.gameState !== "playing") {
        startMatch()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        stateRef.current.keys.up = false
      }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        stateRef.current.keys.down = false
      }
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [startMatch])

  // Mouse & Touch tracking for Player paddle
  const handlePointerMove = (clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleY = canvas.height / rect.height
    const relativeY = (clientY - rect.top) * scaleY
    const s = stateRef.current
    s.player.y = Math.max(0, Math.min(canvas.height - s.paddleH, relativeY - s.paddleH / 2))
  }

  // Animation Loop
  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    const loop = () => {
      const s = stateRef.current
      const currentDark = s.isDark

      if (s.gameState === "playing") {
        // Player keyboard move
        if (s.keys.up) s.player.y -= 6
        if (s.keys.down) s.player.y += 6
        s.player.y = Math.max(0, Math.min(H - s.paddleH, s.player.y))

        // AI smooth tracking
        const aiCenter = s.ai.y + s.paddleH / 2
        const targetY = s.ball.y
        if (Math.abs(aiCenter - targetY) > 8) {
          if (aiCenter < targetY) {
            s.ai.y += Math.min(s.ai.speed, targetY - aiCenter)
          } else {
            s.ai.y -= Math.min(s.ai.speed, aiCenter - targetY)
          }
        }
        s.ai.y = Math.max(0, Math.min(H - s.paddleH, s.ai.y))

        // Ball movement
        s.ball.trail.push({ x: s.ball.x, y: s.ball.y })
        if (s.ball.trail.length > 5) s.ball.trail.shift()

        s.ball.x += s.ball.vx
        s.ball.y += s.ball.vy

        // Top & Bottom boundary collision
        if (s.ball.y - s.ball.r <= 0) {
          s.ball.y = s.ball.r
          s.ball.vy = Math.abs(s.ball.vy)
          sfx.bounce()
        } else if (s.ball.y + s.ball.r >= H) {
          s.ball.y = H - s.ball.r
          s.ball.vy = -Math.abs(s.ball.vy)
          sfx.bounce()
        }

        // Left Paddle (Player) collision
        if (
          s.ball.x - s.ball.r <= s.player.x + s.paddleW &&
          s.ball.x + s.ball.r >= s.player.x &&
          s.ball.y >= s.player.y &&
          s.ball.y <= s.player.y + s.paddleH &&
          s.ball.vx < 0
        ) {
          s.ball.vx = Math.abs(s.ball.vx) * 1.05
          const hitDelta = (s.ball.y - (s.player.y + s.paddleH / 2)) / (s.paddleH / 2)
          s.ball.vy = hitDelta * 4.5
          sfx.hit()
        }

        // Right Paddle (AI) collision
        if (
          s.ball.x + s.ball.r >= s.ai.x &&
          s.ball.x - s.ball.r <= s.ai.x + s.paddleW &&
          s.ball.y >= s.ai.y &&
          s.ball.y <= s.ai.y + s.paddleH &&
          s.ball.vx > 0
        ) {
          s.ball.vx = -Math.abs(s.ball.vx) * 1.05
          const hitDelta = (s.ball.y - (s.ai.y + s.paddleH / 2)) / (s.paddleH / 2)
          s.ball.vy = hitDelta * 4.5
          sfx.hit()
        }

        // Goal Check
        if (s.ball.x < 0) {
          // AI Scored
          s.aiScore++
          setAiScore(s.aiScore)
          sfx.lose()
          if (s.aiScore >= targetScore) {
            s.gameState = "ended"
            setWinner("Komputer Menang!")
            setGameState("ended")
          } else {
            resetBall(1)
          }
        } else if (s.ball.x > W) {
          // Player Scored
          s.playerScore++
          setPlayerScore(s.playerScore)
          sfx.score()
          if (s.playerScore >= targetScore) {
            s.gameState = "ended"
            setWinner("Kamu Menang! 🏆")
            setGameState("ended")
            sfx.win()
          } else {
            resetBall(-1)
          }
        }
      }

      // --- RENDERING ---
      // Field Background
      ctx.fillStyle = currentDark ? "#090d16" : "#f8fafc"
      ctx.fillRect(0, 0, W, H)

      // Center dashed net line
      ctx.strokeStyle = currentDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"
      ctx.lineWidth = 2
      ctx.setLineDash([8, 8])
      ctx.beginPath()
      ctx.moveTo(W / 2, 0)
      ctx.lineTo(W / 2, H)
      ctx.stroke()
      ctx.setLineDash([])

      // Center court circle
      ctx.strokeStyle = currentDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(W / 2, H / 2, 45, 0, Math.PI * 2)
      ctx.stroke()

      // Ball Trail
      for (let i = 0; i < s.ball.trail.length; i++) {
        const t = s.ball.trail[i]
        const alpha = ((i + 1) / s.ball.trail.length) * 0.35
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = currentDark ? "#38bdf8" : "#2563eb"
        ctx.beginPath()
        ctx.arc(t.x, t.y, s.ball.r * ((i + 1) / s.ball.trail.length), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Ball
      ctx.save()
      if (currentDark) {
        ctx.shadowColor = "#38bdf8"
        ctx.shadowBlur = 10
      }
      ctx.fillStyle = currentDark ? "#ffffff" : "#0f172a"
      ctx.beginPath()
      ctx.arc(s.ball.x, s.ball.y, s.ball.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Player Paddle (Left - Cyan/Blue)
      ctx.save()
      if (currentDark) {
        ctx.shadowColor = "#38bdf8"
        ctx.shadowBlur = 10
        ctx.fillStyle = "#38bdf8"
      } else {
        ctx.fillStyle = "#2563eb"
      }
      ctx.beginPath()
      ctx.roundRect ? ctx.roundRect(s.player.x, s.player.y, s.paddleW, s.paddleH, 4) : ctx.rect(s.player.x, s.player.y, s.paddleW, s.paddleH)
      ctx.fill()
      ctx.restore()

      // AI Paddle (Right - Fuchsia/Crimson)
      ctx.save()
      if (currentDark) {
        ctx.shadowColor = "#f43f5e"
        ctx.shadowBlur = 10
        ctx.fillStyle = "#f43f5e"
      } else {
        ctx.fillStyle = "#e11d48"
      }
      ctx.beginPath()
      ctx.roundRect ? ctx.roundRect(s.ai.x, s.ai.y, s.paddleW, s.paddleH, 4) : ctx.rect(s.ai.x, s.ai.y, s.paddleW, s.paddleH)
      ctx.fill()
      ctx.restore()

      // Large scoreboard numbers on field
      ctx.fillStyle = currentDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"
      ctx.font = "900 64px monospace"
      ctx.textAlign = "center"
      ctx.fillText(s.playerScore.toString(), W / 4, H / 2 + 22)
      ctx.fillText(s.aiScore.toString(), (3 * W) / 4, H / 2 + 22)

      // State Overlays
      if (s.gameState === "ready") {
        ctx.fillStyle = currentDark ? "#ffffff" : "#0f172a"
        ctx.font = "bold 16px system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Klik Layar atau Tekan Spasi untuk Mulai Duel", W / 2, H / 2 + 55)
      } else if (s.gameState === "ended") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, W, H)

        ctx.fillStyle = s.playerScore >= targetScore ? "#10b981" : "#ef4444"
        ctx.font = "900 28px system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(s.playerScore >= targetScore ? "KAMU MENANG! 🏆" : "KOMPUTER MENANG!", W / 2, H / 2 - 20)

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 15px system-ui, sans-serif"
        ctx.fillText(`Skor Akhir: ${s.playerScore} - ${s.aiScore}`, W / 2, H / 2 + 15)

        ctx.fillStyle = "#38bdf8"
        ctx.font = "bold 13px system-ui, sans-serif"
        ctx.fillText("Klik untuk Main Ulang", W / 2, H / 2 + 45)
      }

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [targetScore])

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* Top Match Stats */}
      <div className="flex items-center justify-between w-full max-w-[540px] px-4 py-2.5 mb-2 rounded-xl bg-thirdary/40 border border-text-secondary/15 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-text-primary font-bold">Kamu (Player)</span>
          <span className="font-mono text-base font-black text-cyan-400 ml-1">{playerScore}</span>
        </div>
        <div className="px-2.5 py-0.5 rounded-full bg-thirdary text-text-secondary font-mono text-[11px]">
          Target: {targetScore} Poin
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-black text-rose-400 mr-1">{aiScore}</span>
          <span className="text-text-primary font-bold">Komputer (AI)</span>
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
        </div>
      </div>

      {/* Game Canvas Container */}
      <div
        className="relative w-full max-w-[540px] aspect-[540/360] rounded-2xl overflow-hidden border border-text-secondary/20 shadow-lg cursor-crosshair touch-none"
        onClick={() => {
          if (gameState !== "playing") startMatch()
        }}
        onMouseMove={(e) => handlePointerMove(e.clientY)}
        onTouchMove={(e) => {
          if (e.touches[0]) handlePointerMove(e.touches[0].clientY)
        }}
      >
        <canvas
          ref={canvasRef}
          width={540}
          height={360}
          className="w-full h-full block"
        />
      </div>

      {/* Controls & Hints */}
      <div className="flex items-center justify-between w-full max-w-[540px] mt-3 px-1 text-[11px] text-text-secondary">
        <span>🏓 Gerakkan mouse / sentuh paddle kiri atau W/S / Panah</span>
        <button
          onClick={startMatch}
          className="px-3 py-1 rounded-lg bg-thirdary hover:bg-button-hover text-text-primary font-medium border border-text-secondary/20 transition-all text-xs cursor-pointer shadow-sm hover:scale-105"
        >
          {gameState === "ended" ? "Main Lagi" : "Mulai Duel"}
        </button>
      </div>
    </div>
  )
}
