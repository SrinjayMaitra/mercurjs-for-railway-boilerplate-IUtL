"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef, ReactNode } from "react"

interface ParallaxProductCardProps {
  children: ReactNode
  index: number
}

export const ParallaxProductCard = ({
  children,
  index,
}: ParallaxProductCardProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Create varied effects based on index for visual interest
  const isEven = index % 2 === 0
  const offset = (index % 4) * 8

  // Scale: zoom in/out effect while scrolling
  const scale = useTransform(
    smoothProgress,
    [0, 0.3, 0.5, 0.7, 1],
    isEven
      ? [0.85, 0.95, 1.05, 0.98, 0.9]
      : [0.9, 1.02, 1.08, 1.0, 0.85]
  )

  // Y movement: float up/down
  const y = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    isEven
      ? [40 + offset, -15, 50 + offset]
      : [-30 - offset, 10, -40 - offset]
  )

  // Subtle rotation for dynamic feel
  const rotate = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    isEven
      ? [-2, 1, -3]
      : [2, -1, 3]
  )

  // Opacity for smooth fade
  const opacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.5, 0.85, 1],
    [0.4, 0.9, 1, 0.9, 0.4]
  )

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        y,
        rotate,
        opacity,
      }}
      className="h-full w-full will-change-transform"
    >
      {children}
    </motion.div>
  )
}
