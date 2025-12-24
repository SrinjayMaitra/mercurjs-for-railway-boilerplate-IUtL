"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef, ReactNode } from "react"

interface ParallaxCategoryCardProps {
  children: ReactNode
  index: number
}

export const ParallaxCategoryCard = ({
  children,
  index,
}: ParallaxCategoryCardProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  })

  // Create different effects based on index
  const patterns = [
    { scaleRange: [0.8, 1.1, 0.9], yRange: [60, -20, 40], rotateRange: [-3, 2, -2] },
    { scaleRange: [0.9, 1.08, 0.85], yRange: [-40, 15, -30], rotateRange: [2, -1, 3] },
    { scaleRange: [0.85, 1.12, 0.88], yRange: [50, -25, 35], rotateRange: [-2, 3, -1] },
    { scaleRange: [0.88, 1.06, 0.92], yRange: [-35, 20, -25], rotateRange: [3, -2, 1] },
    { scaleRange: [0.82, 1.15, 0.87], yRange: [45, -15, 50], rotateRange: [-1, 2, -3] },
  ]

  const pattern = patterns[index % patterns.length]

  const scale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    pattern.scaleRange
  )

  const y = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    pattern.yRange
  )

  const rotate = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    pattern.rotateRange
  )

  const opacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [0.5, 1, 1, 0.5]
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
      className="h-full will-change-transform"
    >
      {children}
    </motion.div>
  )
}
