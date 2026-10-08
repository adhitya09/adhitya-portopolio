"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function PageLoader() {
  const pathname = usePathname()
  const isDashboardOrCV = pathname?.startsWith("/admin") || pathname?.startsWith("/cv") || pathname?.startsWith("/studio-")
  
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== "undefined") {
      if (isDashboardOrCV || sessionStorage.getItem("visited_ah_portfolio")) {
        return false
      }
    }
    return !isDashboardOrCV
  })

  useEffect(() => {
    if (isDashboardOrCV) {
      setIsLoading(false)
      return
    }

    try {
      if (sessionStorage.getItem("visited_ah_portfolio")) {
        setIsLoading(false)
        return
      }
      sessionStorage.setItem("visited_ah_portfolio", "true")
    } catch (e) {}

    // Prevent scrolling briefly while loading
    document.body.style.overflow = "hidden"
    
    // Snappy, lightweight initial greeting (600ms)
    const timer = setTimeout(() => {
      setIsLoading(false)
      document.body.style.overflow = "unset"
    }, 600)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = "unset"
    }
  }, [isDashboardOrCV])

  if (isDashboardOrCV) {
    return null
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Aesthetic Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-text-primary/10 rounded-full blur-[100px]" />

          {/* Staggered Logo Animation */}
          <div className="relative overflow-hidden flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center p-2 rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md"
            >
              <Image
                src="/logo.png"
                alt="AH Logo"
                width={140}
                height={140}
                className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]"
                priority
              />
            </motion.div>
          </div>

          <div className="relative overflow-hidden h-8 mt-4 flex items-center justify-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="text-sm md:text-base font-black tracking-[0.3em] uppercase text-text-primary"
            >
              HI! Stranger.
            </motion.div>
          </div>

          {/* Progress Bar Animation */}
          <div className="mt-8 w-48 md:w-64 h-[2px] bg-text-secondary/20 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-y-0 left-0 w-full bg-text-primary rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
