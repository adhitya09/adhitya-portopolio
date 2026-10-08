"use client"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"

export default function FadeDown({ children, delay = 0, duration = 0.8 }: { children: React.ReactNode, delay?: number, duration?: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <motion.div 
      ref={ref} 
      initial={{ opacity: 0, y: -24 }} 
      animate={inView ? { opacity: 1, y: 0 } : {}} 
      transition={{ duration: Math.min(duration, 0.6), delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
