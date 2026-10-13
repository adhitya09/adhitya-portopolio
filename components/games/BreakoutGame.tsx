"use client"
import React, { useEffect, useRef, useState, useCallback } from "react"
import { sfx } from "./soundEffects"

interface BreakoutGameProps {
  isDark: boolean
  onClose?: () => void
}

interface Brick {
  x: number
  y: number
  w: number
  h: number
  alive: boolean
  color: string
  points: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string
  size: number
}

export default function BreakoutGame({ isDark }: BreakoutGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameState, setGameState] = useState<"ready" | "playing" | "over" | "win">("ready")

  const stateRef = useRef({
    gameState: "ready" as "ready" | "playing" | "over" | "win",
    score: 0,
    lives: 3,
    paddle: { x: 200, y: 380, w: 84, h: 12, speed: 8 },
    ball: { x: 240, y: 368, r: 6, vx: 3.5, vy: -3.5, trail: [] as { x: number; y: number }[] },
    bricks: [] as Brick[],
    particles: [] as Particle[],
    keys: { left: false, right: false },
    isDark: true,
  })

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("breakout_highscore")
    if (saved) setHighScore(parseInt(saved, 10))
  }, [])

  // Keep stateRef synced with isDark
  useEffect(() => {
    stateRef.current.isDark = isDark
  }, [isDark])

  const initGame = useCallback(() => {
    const W = 480
    const H = 420
    const rows = 5
    const cols = 8
    const brickW = 50
    const brickH = 16
    const pad = 6
    const topOffset = 50
    const leftOffset = (W - (cols * brickW + (cols - 1) * pad)) / 2

    const darkColors = ["#f43f5e", "#fb923c", "#facc15", "#4ade80", "#38bdf8"]
    const lightColors = ["#e11d48", "#ea580c", "#ca8a04", "#16a34a", "#0284c7"]
    const colors = isDark ? darkColors : lightColors

    const bricks: Brick[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: leftOffset + c * (brickW + pad),
          y: topOffset + r * (brickH + pad),
          w: brickW,
          h: brickH,
          alive: true,
          color: colors[r % colors.length],
          points: (rows - r) * 10,
        })
      }
    }

    stateRef.current.bricks = bricks
    stateRef.current.particles = []
    stateRef.current.paddle.x = W / 2 - stateRef.current.paddle.w / 2
    stateRef.current.paddle.y = H - 28
    stateRef.current.ball.x = W / 2
    stateRef.current.ball.y = stateRef.current.paddle.y - 12
    stateRef.current.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3.5
    stateRef.current.ball.vy = -3.5
    stateRef.current.ball.trail = []
    stateRef.current.score = 0
    stateRef.current.lives = 3
    stateRef.current.gameState = "ready"

    setScore(0)
    setLives(3)
    setGameState("ready")
  }, [isDark])

  const spawnParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 3 + 1
      stateRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size: Math.random() * 3 + 2,
      })
    }
  }

  const startPlay = () => {
    if (stateRef.current.gameState === "ready") {
      stateRef.current.gameState = "playing"
      setGameState("playing")
      sfx.jump()
    } else if (stateRef.current.gameState === "over" || stateRef.current.gameState === "win") {
      initGame()
      stateRef.current.gameState = "playing"
      setGameState("playing")
      sfx.jump()
    }
  }

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        stateRef.current.keys.left = true
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        stateRef.current.keys.right = true
      }
      if (e.code === "Space") {
        e.preventDefault()
        startPlay()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        stateRef.current.keys.left = false
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        stateRef.current.keys.right = false
      }
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  // Canvas Mouse & Touch controls
  const handlePointerMove = (clientX: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const relativeX = (clientX - rect.left) * scaleX
    const { paddle } = stateRef.current
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, relativeX - paddle.w / 2))
  }

  // Animation Loop
  useEffect(() => {
    initGame()
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    const loop = () => {
      const { paddle, ball, bricks, particles, keys } = stateRef.current
      const currentDark = stateRef.current.isDark

      // Update paddle by keys
      if (keys.left) paddle.x -= paddle.speed
      if (keys.right) paddle.x += paddle.speed
      paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x))

      if (stateRef.current.gameState === "ready") {
        ball.x = paddle.x + paddle.w / 2
        ball.y = paddle.y - ball.r - 2
      } else if (stateRef.current.gameState === "playing") {
        // Record trail
        ball.trail.push({ x: ball.x, y: ball.y })
        if (ball.trail.length > 6) ball.trail.shift()

        ball.x += ball.vx
        ball.y += ball.vy

        // Walls
        if (ball.x - ball.r <= 0) {
          ball.x = ball.r
          ball.vx = Math.abs(ball.vx)
          sfx.bounce()
        } else if (ball.x + ball.r >= W) {
          ball.x = W - ball.r
          ball.vx = -Math.abs(ball.vx)
          sfx.bounce()
        }

        if (ball.y - ball.r <= 0) {
          ball.y = ball.r
          ball.vy = Math.abs(ball.vy)
          sfx.bounce()
        }

        // Paddle Collision
        if (
          ball.y + ball.r >= paddle.y &&
          ball.y - ball.r <= paddle.y + paddle.h &&
          ball.x >= paddle.x &&
          ball.x <= paddle.x + paddle.w &&
          ball.vy > 0
        ) {
          ball.vy = -Math.abs(ball.vy)
          const hitPos = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2)
          ball.vx = hitPos * 4.5
          sfx.hit()
        }

        // Bricks Collision
        let hitBrick = false
        for (const b of bricks) {
          if (!b.alive) continue
          if (
            ball.x + ball.r > b.x &&
            ball.x - ball.r < b.x + b.w &&
            ball.y + ball.r > b.y &&
            ball.y - ball.r < b.y + b.h
          ) {
            b.alive = false
            spawnParticles(b.x + b.w / 2, b.y + b.h / 2, b.color)
            hitBrick = true

            // Reverse velocity based on collision edge
            const prevX = ball.x - ball.vx
            if (prevX + ball.r <= b.x || prevX - ball.r >= b.x + b.w) {
              ball.vx = -ball.vx
            } else {
              ball.vy = -ball.vy
            }

            stateRef.current.score += b.points
            setScore(stateRef.current.score)
            sfx.hit()
            break
          }
        }

        // Check Win
        if (bricks.every(b => !b.alive)) {
          stateRef.current.gameState = "win"
          setGameState("win")
          sfx.win()
          if (stateRef.current.score > highScore) {
            setHighScore(stateRef.current.score)
            localStorage.setItem("breakout_highscore", stateRef.current.score.toString())
          }
        }

        // Ball fell down
        if (ball.y - ball.r > H) {
          stateRef.current.lives--
          setLives(stateRef.current.lives)
          if (stateRef.current.lives <= 0) {
            stateRef.current.gameState = "over"
            setGameState("over")
            sfx.lose()
            if (stateRef.current.score > highScore) {
              setHighScore(stateRef.current.score)
              localStorage.setItem("breakout_highscore", stateRef.current.score.toString())
            }
          } else {
            sfx.lose()
            ball.x = paddle.x + paddle.w / 2
            ball.y = paddle.y - ball.r - 2
            ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3.5
            ball.vy = -3.5
            ball.trail = []
            stateRef.current.gameState = "ready"
            setGameState("ready")
          }
        }
      }

      // Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.03
        if (p.alpha <= 0) particles.splice(i, 1)
      }

      // --- RENDERING ---
      // Clear background
      ctx.fillStyle = currentDark ? "#090d16" : "#f8fafc"
      ctx.fillRect(0, 0, W, H)

      // Subtle cyber grid
      ctx.strokeStyle = currentDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.stroke()
      }
      for (let y = 0; y < H; y += 30) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }

      // Draw Bricks
      for (const b of bricks) {
        if (!b.alive) continue
        ctx.fillStyle = b.color
        // Rounded rect for brick
        ctx.beginPath()
        const r = 3
        ctx.roundRect ? ctx.roundRect(b.x, b.y, b.w, b.h, r) : ctx.rect(b.x, b.y, b.w, b.h)
        ctx.fill()

        // Highlight line
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)"
        ctx.fillRect(b.x + 2, b.y + 1, b.w - 4, 2)
      }

      // Draw Particles
      for (const p of particles) {
        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Draw Ball Trail
      for (let i = 0; i < ball.trail.length; i++) {
        const t = ball.trail[i]
        const alpha = ((i + 1) / ball.trail.length) * 0.35
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = currentDark ? "#38bdf8" : "#0284c7"
        ctx.beginPath()
        ctx.arc(t.x, t.y, ball.r * ((i + 1) / ball.trail.length), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Draw Ball
      ctx.save()
      if (currentDark) {
        ctx.shadowColor = "#38bdf8"
        ctx.shadowBlur = 10
      }
      ctx.fillStyle = currentDark ? "#ffffff" : "#0f172a"
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Draw Paddle
      ctx.save()
      if (currentDark) {
        ctx.shadowColor = "#818cf8"
        ctx.shadowBlur = 8
      }
      const grad = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x + paddle.w, paddle.y)
      if (currentDark) {
        grad.addColorStop(0, "#38bdf8")
        grad.addColorStop(1, "#818cf8")
      } else {
        grad.addColorStop(0, "#2563eb")
        grad.addColorStop(1, "#4f46e5")
      }
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.roundRect ? ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6) : ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
      ctx.fill()
      ctx.restore()

      // Draw Overlay Text for state
      if (stateRef.current.gameState === "ready") {
        ctx.fillStyle = currentDark ? "#ffffff" : "#0f172a"
        ctx.font = "bold 15px system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Klik atau Tekan Spasi untuk Meluncur", W / 2, H / 2 + 30)
      } else if (stateRef.current.gameState === "over") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = "#ef4444"
        ctx.font = "900 28px system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("GAME OVER", W / 2, H / 2 - 10)
        ctx.fillStyle = "#f8fafc"
        ctx.font = "bold 14px system-ui, sans-serif"
        ctx.fillText("Klik Layar untuk Main Ulang", W / 2, H / 2 + 25)
      } else if (stateRef.current.gameState === "win") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = "#10b981"
        ctx.font = "900 28px system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("KAMU MENANG! 🎉", W / 2, H / 2 - 10)
        ctx.fillStyle = "#f8fafc"
        ctx.font = "bold 14px system-ui, sans-serif"
        ctx.fillText("Semua bata berhasil dihancurkan!", W / 2, H / 2 + 25)
      }

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [initGame, highScore])

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* Top Stats Bar */}
      <div className="flex items-center justify-between w-full max-w-[480px] px-4 py-2.5 mb-2 rounded-xl bg-thirdary/40 border border-text-secondary/15 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Skor:</span>
          <span className="text-text-primary font-mono text-sm font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-text-secondary mr-1">Nyawa:</span>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-sm transition-opacity ${i < lives ? "opacity-100" : "opacity-20"}`}>
              ❤️
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Terbaik:</span>
          <span className="text-text-primary font-mono text-sm font-bold">{highScore}</span>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div
        className="relative w-full max-w-[480px] aspect-[480/420] rounded-2xl overflow-hidden border border-text-secondary/20 shadow-lg cursor-crosshair touch-none"
        onClick={startPlay}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onTouchMove={(e) => {
          if (e.touches[0]) handlePointerMove(e.touches[0].clientX)
        }}
      >
        <canvas
          ref={canvasRef}
          width={480}
          height={420}
          className="w-full h-full block"
        />
      </div>

      {/* Control Buttons & Hints */}
      <div className="flex items-center justify-between w-full max-w-[480px] mt-3 px-1 text-[11px] text-text-secondary">
        <span>🎮 Geser mouse / jari atau panah ⬅️ ➡️</span>
        <button
          onClick={initGame}
          className="px-3 py-1 rounded-lg bg-thirdary hover:bg-button-hover text-text-primary font-medium border border-text-secondary/20 transition-all text-xs cursor-pointer"
        >
          Reset Game
        </button>
      </div>
    </div>
  )
}
