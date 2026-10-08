"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function PageLoader() {
  const pathname = usePathname()
  const isDashboardOrCV =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/cms") ||
    pathname?.startsWith("/cv") ||
    pathname?.startsWith("/studio-")

  const [isLoading, setIsLoading] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Never show on dashboard, studio, or ATS CV
    if (isDashboardOrCV) return

    // Check if user already saw the loader in this session
    try {
      if (sessionStorage.getItem("ah_loader_shown")) {
        // Already shown, do not display again on refresh!
        return
      }
      sessionStorage.setItem("ah_loader_shown", "1")
    } catch (e) {
      return
    }

    // Only on very first visit: Show snappy, ultra-smooth greeting
    setIsLoading(true)

    const exitTimer = setTimeout(() => {
      setIsExiting(true)
    }, 600)

    const removeTimer = setTimeout(() => {
      setIsLoading(false)
    }, 900)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [isDashboardOrCV])

  // If not loading, render null immediately: 0 DOM overhead, impossible to freeze!
  if (!isLoading) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#0a0a0c] flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ease-out ${
        isExiting ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
      style={{ willChange: "opacity, transform" }}
    >
      {/* Subtle, GPU-friendly ambient glow (no heavy CPU blur) */}
      <div
        className="absolute w-56 h-56 rounded-full bg-white/5 pointer-events-none"
        style={{
          transform: "translate3d(0, 0, 0)",
          boxShadow: "0 0 80px 20px rgba(255, 255, 255, 0.06)",
        }}
      />

      {/* Clean, Hardware-Accelerated Logo Display */}
      <div className="relative flex flex-col items-center justify-center z-10">
        <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center p-3 rounded-3xl bg-white/[0.04] border border-white/10 shadow-2xl animate-fade-in">
          <Image
            src="/logo.png"
            alt="AH Logo"
            width={120}
            height={120}
            className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]"
            priority
          />
        </div>

        {/* Clean Greeting Text */}
        <div className="mt-5 text-center">
          <p className="text-sm md:text-base font-black tracking-[0.3em] uppercase text-neutral-100 animate-slide-up">
            HI! Stranger.
          </p>
        </div>

        {/* Ultra-smooth CSS Progress Bar */}
        <div className="mt-6 w-44 md:w-52 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-neutral-400 via-white to-neutral-300 rounded-full animate-loader-progress"
            style={{ willChange: "transform" }}
          />
        </div>
      </div>
    </div>
  )
}
