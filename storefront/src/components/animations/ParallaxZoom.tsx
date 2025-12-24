"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef, ReactNode } from "react"

interface ParallaxZoomProps {
  children: ReactNode
  className?: string
  zoomIn?: boolean
  zoomOut?: boolean
  direction?: "up" | "down" | "left" | "right" | "none"
  speed?: number
  scale?: [number, number]
  rotate?: number
}

export const ParallaxZoom = ({
  children,
  className = "",
  zoomIn = false,
  zoomOut = false,
  direction = "none",
  speed = 50,
  scale = [0.8, 1.1],
  rotate = 0,
}: ParallaxZoomProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Smooth spring physics for more natural movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Scale transformations
  const scaleValue = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    zoomIn ? [scale[0], 1, scale[1]] : zoomOut ? [scale[1], 1, scale[0]] : [1, 1, 1]
  )

  // Movement transformations based on direction
  const yValue = useTransform(
    smoothProgress,
    [0, 1],
    direction === "up" ? [speed, -speed] : direction === "down" ? [-speed, speed] : [0, 0]
  )

  const xValue = useTransform(
    smoothProgress,
    [0, 1],
    direction === "left" ? [speed, -speed] : direction === "right" ? [-speed, speed] : [0, 0]
  )

  // Rotation
  const rotateValue = useTransform(
    smoothProgress,
    [0, 1],
    rotate ? [-rotate, rotate] : [0, 0]
  )

  // Opacity for fade effect
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleValue,
        y: yValue,
        x: xValue,
        rotate: rotateValue,
        opacity,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// A simpler parallax component for individual items
interface ParallaxItemProps {
  children: ReactNode
  className?: string
  index?: number
  variant?: "zoom-in" | "zoom-out" | "float" | "tilt"
}

export const ParallaxItem = ({
  children,
  className = "",
  index = 0,
  variant = "zoom-in",
}: ParallaxItemProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  })

  // Different transformations based on variant and index
  const offset = (index % 4) * 10

  const variants = {
    "zoom-in": {
      scale: useTransform(smoothProgress, [0, 0.5, 1], [0.85, 1.05, 0.95]),
      y: useTransform(smoothProgress, [0, 1], [30 + offset, -30 - offset]),
      rotate: useTransform(smoothProgress, [0, 1], [-2 + (index % 2), 2 - (index % 2)]),
    },
    "zoom-out": {
      scale: useTransform(smoothProgress, [0, 0.5, 1], [1.15, 0.95, 1.05]),
      y: useTransform(smoothProgress, [0, 1], [-20 - offset, 20 + offset]),
      rotate: useTransform(smoothProgress, [0, 1], [2 - (index % 2), -2 + (index % 2)]),
    },
    "float": {
      scale: useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1.02, 0.98]),
      y: useTransform(smoothProgress, [0, 0.5, 1], [40, -10, 40]),
      rotate: useTransform(smoothProgress, [0, 0.5, 1], [0, index % 2 ? 3 : -3, 0]),
    },
    "tilt": {
      scale: useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1.08, 0.92]),
      y: useTransform(smoothProgress, [0, 1], [50, -50]),
      rotate: useTransform(smoothProgress, [0, 0.5, 1], [-5, 0, 5]),
    },
  }

  const currentVariant = variants[variant]
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0.5, 1, 1, 0.5])

  return (
    <motion.div
      ref={ref}
      style={{
        scale: currentVariant.scale,
        y: currentVariant.y,
        rotate: currentVariant.rotate,
        opacity,
      }}
      className={`${className} will-change-transform`}
    >
      {children}
    </motion.div>
  )
}

// Grid container with staggered parallax effects
interface ParallaxGridProps {
  children: ReactNode[]
  className?: string
  variant?: "zoom-in" | "zoom-out" | "float" | "tilt" | "mixed"
}

export const ParallaxGrid = ({
  children,
  className = "",
  variant = "mixed",
}: ParallaxGridProps) => {
  const variants: ("zoom-in" | "zoom-out" | "float" | "tilt")[] = ["zoom-in", "zoom-out", "float", "tilt"]

  return (
    <div className={className}>
      {children.map((child, index) => (
        <ParallaxItem
          key={index}
          index={index}
          variant={variant === "mixed" ? variants[index % variants.length] : variant}
        >
          {child}
        </ParallaxItem>
      ))}
    </div>
  )
}
