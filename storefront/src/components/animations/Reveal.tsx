"use client"
import { motion, useInView, useAnimation, Variant } from "framer-motion"
import { useEffect, useRef } from "react"

interface RevealProps {
    children: React.ReactNode
    width?: "fit-content" | "100%"
    delay?: number
    variant?: "fade-up" | "fade-in" | "scale-up" | "slide-left" | "slide-right"
    className?: string
    fullWidth?: boolean
}

export const Reveal = ({
    children,
    width = "fit-content",
    delay = 0.25,
    variant = "fade-up",
    className = "",
    fullWidth = false
}: RevealProps) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const mainControls = useAnimation()

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible")
        }
    }, [isInView, mainControls])

    const variants: Record<string, { hidden: any, visible: any }> = {
        "fade-up": {
            hidden: { opacity: 0, y: 75 },
            visible: { opacity: 1, y: 0 },
        },
        "fade-in": {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        },
        "scale-up": {
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
        },
        "slide-left": {
            hidden: { opacity: 0, x: -75 },
            visible: { opacity: 1, x: 0 },
        },
        "slide-right": {
            hidden: { opacity: 0, x: 75 },
            visible: { opacity: 1, x: 0 },
        }
    }

    return (
        <div ref={ref} style={{ position: "relative", width: fullWidth ? "100%" : width }} className={className}>
            <motion.div
                variants={variants[variant]}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.6, delay: delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
                {children}
            </motion.div>
        </div>
    )
}
