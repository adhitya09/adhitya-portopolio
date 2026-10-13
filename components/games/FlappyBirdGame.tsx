"use client"
import React, { useEffect, useRef, useState, useCallback } from "react"
import { sfx } from "./soundEffects"

interface FlappyBirdGameProps {
  isDark: boolean
  onClose?: () => void
}

interface Pipe {
  x: number
  top: number
  bottomY: number
  passed: boolean
}

export default function FlappyBirdGame({ isDark }: FlappyBirdGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameState, setGameState] = useState<"ready" | "playing" | "over">("ready")

  const stateRef = useRef({
    gameState: "ready" as "ready" | "playing" | "over",
    score: 0,
    bird: { x: 80, y: 260, r: 14, vy: 0, rotation: 0 },
    pipes: [] as Pipe[],
    frame: 0,
    pipeGap: 140,
    pipeW: 56,
    pipeSpeed: 2.4,
    gravity: 0.38,
    jump: -7.2,
    isDark: true,
  })

  useEffect(() => {
    const saved = localStorage.getItem("flappy_highscore")
    if (saved) setHighScore(parseInt(saved, 10))
  }, [])

  useEffect(() => {
    stateRef.current.isDark = isDark
  }, [isDark])

  const flap = useCallback(() => {
    const s = stateRef.current
    if (s.gameState === "ready") {
      s.gameState = "playing"
      setGameState("playing")
      s.bird.vy = s.jump
      sfx.jump()
    } else if (s.gameState === "playing") {
      s.bird.vy = s.jump
      sfx.jump()
    } else if (s.gameState === "over") {
      // Reset
      s.bird.y = 260
      s.bird.vy = 0
      s.bird.rotation = 0
      s.pipes = []
      s.score = 0
      s.frame = 0
      s.gameState = "ready"
      setScore(0)
      setGameState("ready")
    }
  }, [])

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault()
        flap()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [flap])

  // Game Loop
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
        s.frame++
        s.bird.vy += s.gravity
        s.bird.y += s.bird.vy
        s.bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 5, s.bird.vy * 0.08))

        // Spawn pipes
        if (s.frame % 95 === 0) {
          const minH = 60
          const maxH = H - s.pipeGap - minH
          const top = Math.floor(Math.random() * (maxH - minH)) + minH
          s.pipes.push({
            x: W,
            top,
            bottomY: top + s.pipeGap,
            passed: false,
          })
        }

        // Update pipes
        for (let i = 0; i < s.pipes.length; i++) {
          const p = s.pipes[i]
          p.x -= s.pipeSpeed

          // Score pass
          if (!p.passed && p.x + s.pipeW < s.bird.x) {
            p.passed = true
            s.score++
            setScore(s.score)
            sfx.score()
          }

          // Hit detection
          const hitX = s.bird.x + s.bird.r > p.x && s.bird.x - s.bird.r < p.x + s.pipeW
          const hitY = s.bird.y - s.bird.r < p.top || s.bird.y + s.bird.r > p.bottomY

          if (hitX && hitY) {
            s.gameState = "over"
            setGameState("over")
            sfx.lose()
            if (s.score > highScore) {
              setHighScore(s.score)
              localStorage.setItem("flappy_highscore", s.score.toString())
            }
          }
        }

        // Cleanup pipes
        while (s.pipes.length && s.pipes[0].x + s.pipeW < -10) {
          s.pipes.shift()
        }

        // Bounds collision
        if (s.bird.y + s.bird.r >= H - 15 || s.bird.y - s.bird.r <= 0) {
          s.gameState = "over"
          setGameState("over")
          sfx.lose()
          if (s.score > highScore) {
            setHighScore(s.score)
            localStorage.setItem("flappy_highscore", s.score.toString())
          }
        }
      }

      // --- RENDERING ---
      // Sky background gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H)
      if (currentDark) {
        skyGrad.addColorStop(0, "#090d16")
        skyGrad.addColorStop(1, "#1e1b4b")
      } else {
        skyGrad.addColorStop(0, "#bae6fd")
        skyGrad.addColorStop(1, "#f0f9ff")
      }
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, W, H)

      // Stars or Clouds
      if (currentDark) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
        for (let i = 0; i < 20; i++) {
          const sx = (i * 37 + (s.frame * 0.2)) % W
          const sy = (i * 29) % (H / 2)
          ctx.fillRect(sx, sy, 1.5, 1.5)
        }
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)"
        for (let i = 0; i < 4; i++) {
          const cx = ((i * 120) - (s.frame * 0.3)) % (W + 80) - 40
          const cy = 40 + i * 35
          ctx.beginPath()
          ctx.arc(cx, cy, 25, 0, Math.PI * 2)
          ctx.arc(cx + 20, cy - 8, 20, 0, Math.PI * 2)
          ctx.arc(cx + 35, cy, 22, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Ground line
      ctx.fillStyle = currentDark ? "#0f172a" : "#cbd5e1"
      ctx.fillRect(0, H - 16, W, 16)
      ctx.fillStyle = currentDark ? "#38bdf8" : "#94a3b8"
      ctx.fillRect(0, H - 16, W, 2)

      // Draw Pipes
      for (const p of s.pipes) {
        const pipeColor = currentDark ? "#38bdf8" : "#10b981"
        const pipeBorder = currentDark ? "#818cf8" : "#059669"

        // Top Pipe
        ctx.fillStyle = pipeColor
        ctx.fillRect(p.x, 0, s.pipeW, p.top)
        ctx.strokeStyle = pipeBorder
        ctx.lineWidth = 2
        ctx.strokeRect(p.x, 0, s.pipeW, p.top)
        // Top Pipe Cap
        ctx.fillRect(p.x - 3, p.top - 20, s.pipeW + 6, 20)
        ctx.strokeRect(p.x - 3, p.top - 20, s.pipeW + 6, 20)

        // Bottom Pipe
        ctx.fillRect(p.x, p.bottomY, s.pipeW, H - p.bottomY)
        ctx.strokeRect(p.x, p.bottomY, s.pipeW, H - p.bottomY)
        // Bottom Pipe Cap
        ctx.fillRect(p.x - 3, p.bottomY, s.pipeW + 6, 20)
        ctx.strokeRect(p.x - 3, p.bottomY, s.pipeW + 6, 20)
      }

      // Draw Bird
      ctx.save()
      ctx.translate(s.bird.x, s.bird.y)
      ctx.rotate(s.bird.rotation)

      // Bird body
      ctx.fillStyle = currentDark ? "#fbbf24" : "#f59e0b"
      ctx.beginPath()
      ctx.arc(0, 0, s.bird.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = currentDark ? "#ffffff" : "#b45309"
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Wing
      const wingOffset = Math.sin(s.frame * 0.3) * 3
      ctx.fillStyle = currentDark ? "#f59e0b" : "#d97706"
      ctx.beginPath()
      ctx.ellipse(-4, wingOffset, 7, 5, 0, 0, Math.PI * 2)
      ctx.fill()

      // Eye
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(6, -4, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#000000"
      ctx.beginPath()
      ctx.arc(7.5, -4, 2, 0, Math.PI * 2)
      ctx.fill()

      // Beak
      ctx.fillStyle = "#f97316"
      ctx.beginPath()
      ctx.moveTo(11, -1)
      ctx.lineTo(19, 2)
      ctx.lineTo(11, 5)
      ctx.closePath()
      ctx.fill()

      ctx.restore()

      // In-Game Live Score Counter
      if (s.gameState === "playing") {
        ctx.fillStyle = currentDark ? "#ffffff" : "#0f172a"
        ctx.font = "900 36px monospace"
        ctx.textAlign = "center"
        ctx.fillText(s.score.toString(), W / 2, 60)
      }

      // State Overlays
      if (s.gameState === "ready") {
        ctx.fillStyle = currentDark ? "#ffffff" : "#0f172a"
        ctx.font = "bold 16px system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Ketuk atau Tekan Spasi untuk Terbang", W / 2, H / 2 + 50)
      } else if (s.gameState === "over") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)"
        ctx.fillRect(0, 0, W, H)

        ctx.fillStyle = "#ef4444"
        ctx.font = "900 30px system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("GAME OVER", W / 2, H / 2 - 35)

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 18px monospace"
        ctx.fillText(`Skor: ${s.score} | Rekor: ${highScore}`, W / 2, H / 2 + 5)

        ctx.fillStyle = "#38bdf8"
        ctx.font = "bold 14px system-ui, sans-serif"
        ctx.fillText("Ketuk untuk Main Lagi", W / 2, H / 2 + 45)
      }

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [highScore])

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* Top Stats Bar */}
      <div className="flex items-center justify-between w-full max-w-[400px] px-4 py-2.5 mb-2 rounded-xl bg-thirdary/40 border border-text-secondary/15 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Skor:</span>
          <span className="text-text-primary font-mono text-sm font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Rekor Terbaik:</span>
          <span className="text-text-primary font-mono text-sm font-bold">{highScore}</span>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div
        className="relative w-full max-w-[400px] aspect-[400/540] rounded-2xl overflow-hidden border border-text-secondary/20 shadow-lg cursor-pointer touch-none"
        onClick={flap}
        onTouchStart={(e) => {
          e.preventDefault()
          flap()
        }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={540}
          className="w-full h-full block"
        />
      </div>

      {/* Control Buttons & Hints */}
      <div className="flex items-center justify-between w-full max-w-[400px] mt-3 px-1 text-[11px] text-text-secondary">
        <span>🐦 Ketuk layar / Spasi / Panah Atas</span>
        <button
          onClick={flap}
          className="px-3 py-1 rounded-lg bg-thirdary hover:bg-button-hover text-text-primary font-medium border border-text-secondary/20 transition-all text-xs cursor-pointer"
        >
          {gameState === "over" ? "Main Lagi" : "Mulai"}
        </button>
      </div>
    </div>
  )
}
