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

  // Much slower, smoother spring for elegant animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 50,
    restDelta: 0.0001,
  })

  // Create varied effects based on index for visual interest
  const isEven = index % 2 === 0
  const offset = (index % 6) * 3

  // Gentle scale: subtle zoom in/out effect while scrolling
  const scale = useTransform(
    smoothProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    isEven
      ? [0.92, 0.96, 1.0, 1.02, 0.99, 0.95]
      : [0.95, 0.98, 1.02, 1.0, 0.97, 0.93]
  )

  // Smooth Y movement: gentle float up/down
  const y = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    isEven
      ? [20 + offset, 8, -5, -12, 15 + offset]
      : [-15 - offset, -8, 5, 10, -18 - offset]
  )

  // Very subtle rotation for elegant dynamic feel
  const rotate = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    isEven
      ? [-0.8, 0.5, -1]
      : [0.8, -0.5, 1]
  )

  // Smooth opacity - always visible but gently fading at edges
  const opacity = useTransform(
    smoothProgress,
    [0, 0.1, 0.5, 0.9, 1],
    [0.7, 0.95, 1, 0.95, 0.7]
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
      transition={{ type: "spring", stiffness: 30, damping: 50 }}
    >
      {children}
    </motion.div>
  )
}
