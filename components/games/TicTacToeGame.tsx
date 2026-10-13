"use client"
import React, { useState, useEffect, useCallback } from "react"
import { sfx } from "./soundEffects"

interface TicTacToeGameProps {
  isDark: boolean
  onClose?: () => void
}

type CellValue = "X" | "O" | null

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export default function TicTacToeGame({ isDark }: TicTacToeGameProps) {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null))
  const [isAiTurn, setIsAiTurn] = useState(false)
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [stats, setStats] = useState({ player: 0, ai: 0, draw: 0 })
  const [difficulty, setDifficulty] = useState<"smart" | "casual">("smart")

  const checkWinner = (b: CellValue[]): { winner: "X" | "O" | null; line: number[] | null } => {
    for (const line of WIN_LINES) {
      const [a, c, d] = line
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return { winner: b[a] as "X" | "O", line }
      }
    }
    return { winner: null, line: null }
  }

  const isFull = (b: CellValue[]): boolean => {
    return b.every((cell) => cell !== null)
  }

  // Minimax algorithm for unbeatable AI
  const minimax = (b: CellValue[], isMax: boolean): number => {
    const { winner } = checkWinner(b)
    if (winner === "O") return 10
    if (winner === "X") return -10
    if (isFull(b)) return 0

    let best = isMax ? -Infinity : Infinity
    for (let i = 0; i < 9; i++) {
      if (b[i] === null) {
        b[i] = isMax ? "O" : "X"
        const score = minimax(b, !isMax)
        b[i] = null
        best = isMax ? Math.max(best, score) : Math.min(best, score)
      }
    }
    return best
  }

  const getBestMove = (b: CellValue[]): number => {
    // In casual mode, 35% chance to pick random
    if (difficulty === "casual" && Math.random() < 0.35) {
      const emptyIndices = b.map((val, idx) => (val === null ? idx : null)).filter((v) => v !== null) as number[]
      if (emptyIndices.length > 0) {
        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
      }
    }

    let bestScore = -Infinity
    let bestMove = -1
    for (let i = 0; i < 9; i++) {
      if (b[i] === null) {
        b[i] = "O"
        const score = minimax(b, false)
        b[i] = null
        if (score > bestScore) {
          bestScore = score
          bestMove = i
        }
      }
    }
    return bestMove
  }

  const handleCellClick = (index: number) => {
    if (board[index] !== null || winner !== null || isAiTurn) return

    sfx.hit()

    const newBoard = [...board]
    newBoard[index] = "X"
    setBoard(newBoard)

    const check = checkWinner(newBoard)
    if (check.winner === "X") {
      setWinner("X")
      setWinningLine(check.line)
      setStats((s) => ({ ...s, player: s.player + 1 }))
      sfx.win()
      return
    }

    if (isFull(newBoard)) {
      setWinner("draw")
      setStats((s) => ({ ...s, draw: s.draw + 1 }))
      sfx.bounce()
      return
    }

    // AI Turn
    setIsAiTurn(true)
    setTimeout(() => {
      const aiMove = getBestMove(newBoard)
      if (aiMove !== -1) {
        newBoard[aiMove] = "O"
        setBoard(newBoard)
        sfx.hit()

        const aiCheck = checkWinner(newBoard)
        if (aiCheck.winner === "O") {
          setWinner("O")
          setWinningLine(aiCheck.line)
          setStats((s) => ({ ...s, ai: s.ai + 1 }))
          sfx.lose()
        } else if (isFull(newBoard)) {
          setWinner("draw")
          setStats((s) => ({ ...s, draw: s.draw + 1 }))
          sfx.bounce()
        }
      }
      setIsAiTurn(false)
    }, 380)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    setWinningLine(null)
    setIsAiTurn(false)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[420px] select-none">
      {/* Top Stats Bar */}
      <div className="flex items-center justify-between w-full px-4 py-2.5 mb-3 rounded-xl bg-thirdary/40 border border-text-secondary/15 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="text-cyan-400 font-bold">Kamu (X):</span>
          <span className="font-mono text-sm font-bold text-text-primary">{stats.player}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary">Seri:</span>
          <span className="font-mono text-sm font-bold text-text-primary">{stats.draw}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-rose-400 font-bold">AI (O):</span>
          <span className="font-mono text-sm font-bold text-text-primary">{stats.ai}</span>
        </div>
      </div>

      {/* Difficulty Toggle */}
      <div className="flex items-center gap-2 mb-3 self-end text-xs">
        <span className="text-text-secondary text-[11px]">Tingkat Kesulitan:</span>
        <button
          onClick={() => setDifficulty("smart")}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            difficulty === "smart"
              ? "bg-cyan-500 text-white shadow-sm"
              : "bg-thirdary text-text-secondary hover:text-text-primary"
          }`}
        >
          Pintar (Minimax)
        </button>
        <button
          onClick={() => setDifficulty("casual")}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            difficulty === "casual"
              ? "bg-cyan-500 text-white shadow-sm"
              : "bg-thirdary text-text-secondary hover:text-text-primary"
          }`}
        >
          Santai
        </button>
      </div>

      {/* 3x3 Grid Board */}
      <div className="grid grid-cols-3 gap-3 w-full aspect-square p-3 rounded-3xl bg-thirdary/20 border border-text-secondary/15 relative">
        {board.map((cell, idx) => {
          const isWinningCell = winningLine?.includes(idx)
          return (
            <button
              key={idx}
              disabled={cell !== null || winner !== null || isAiTurn}
              onClick={() => handleCellClick(idx)}
              className={`w-full h-full rounded-2xl flex items-center justify-center font-sans font-black text-4xl sm:text-5xl transition-all duration-300 border cursor-pointer ${
                cell === null
                  ? "bg-thirdary/40 border-text-secondary/15 hover:bg-thirdary hover:border-text-primary/40 hover:scale-[1.03] active:scale-95"
                  : isWinningCell
                  ? cell === "X"
                    ? "bg-cyan-500/25 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-[1.04]"
                    : "bg-rose-500/25 border-rose-400 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-[1.04]"
                  : cell === "X"
                  ? "bg-thirdary/70 border-text-secondary/20 text-cyan-400"
                  : "bg-thirdary/70 border-text-secondary/20 text-rose-400"
              }`}
            >
              {cell === "X" ? (
                <span className="filter drop-shadow-sm">✕</span>
              ) : cell === "O" ? (
                <span className="filter drop-shadow-sm">○</span>
              ) : null}
            </button>
          )
        })}
      </div>

      {/* Match Status Feedback */}
      <div className="w-full text-center mt-3 h-8 flex items-center justify-center">
        {winner === "X" && (
          <span className="text-emerald-500 font-bold text-sm animate-bounce">
            🎉 Kamu menang melawan AI!
          </span>
        )}
        {winner === "O" && (
          <span className="text-rose-500 font-bold text-sm">
            🤖 AI berhasil memenangkan babak ini!
          </span>
        )}
        {winner === "draw" && (
          <span className="text-text-secondary font-bold text-sm">
            🤝 Hasil Seri! Pertarungan yang seimbang.
          </span>
        )}
        {!winner && isAiTurn && (
          <span className="text-text-secondary text-xs italic animate-pulse">
            Komputer sedang berpikir...
          </span>
        )}
        {!winner && !isAiTurn && (
          <span className="text-text-secondary text-xs">
            Giliranmu! Letakkan simbol <strong className="text-cyan-400">X</strong>
          </span>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between w-full mt-2 px-1 text-[11px] text-text-secondary">
        <span>Kamu = X | Komputer = O</span>
        <button
          onClick={resetGame}
          className="px-3 py-1 rounded-lg bg-thirdary hover:bg-button-hover text-text-primary font-medium border border-text-secondary/20 transition-all text-xs cursor-pointer shadow-sm hover:scale-105"
        >
          Main Ulang 🔄
        </button>
      </div>
    </div>
  )
}
