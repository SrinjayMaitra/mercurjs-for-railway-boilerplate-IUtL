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

  // Much slower, smoother spring for elegant animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 25,
    damping: 45,
    restDelta: 0.0001,
  })

  // Create different effects based on index - more subtle and elegant
  const patterns = [
    { scaleRange: [0.94, 1.02, 0.96], yRange: [25, -8, 20], rotateRange: [-0.6, 0.4, -0.8] },
    { scaleRange: [0.96, 1.03, 0.94], yRange: [-18, 6, -15], rotateRange: [0.5, -0.3, 0.7] },
    { scaleRange: [0.93, 1.04, 0.95], yRange: [22, -10, 18], rotateRange: [-0.4, 0.6, -0.5] },
    { scaleRange: [0.95, 1.02, 0.97], yRange: [-20, 8, -16], rotateRange: [0.6, -0.4, 0.5] },
    { scaleRange: [0.94, 1.03, 0.96], yRange: [18, -6, 22], rotateRange: [-0.5, 0.5, -0.6] },
    { scaleRange: [0.96, 1.02, 0.94], yRange: [-15, 10, -18], rotateRange: [0.4, -0.5, 0.6] },
    { scaleRange: [0.93, 1.04, 0.95], yRange: [20, -8, 16], rotateRange: [-0.7, 0.3, -0.5] },
    { scaleRange: [0.95, 1.03, 0.96], yRange: [-22, 5, -20], rotateRange: [0.5, -0.4, 0.7] },
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
    [0, 0.15, 0.5, 0.85, 1],
    [0.75, 0.95, 1, 0.95, 0.75]
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
      transition={{ type: "spring", stiffness: 25, damping: 45 }}
    >
      {children}
    </motion.div>
  )
}
