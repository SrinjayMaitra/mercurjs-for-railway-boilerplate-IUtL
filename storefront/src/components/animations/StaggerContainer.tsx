"use client"
import { motion, useInView, useAnimation, Variant } from "framer-motion"
import { useEffect, useRef } from "react"

interface StaggerContainerProps {
    children: React.ReactNode
    delay?: number
    staggerDelay?: number
    className?: string
    width?: "fit-content" | "100%"
    triggerOnce?: boolean
}

export const StaggerContainer = ({
    children,
    delay = 0,
    staggerDelay = 0.1,
    className = "",
    width = "100%",
    triggerOnce = true
}: StaggerContainerProps) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: triggerOnce, margin: "-50px" })
    const controls = useAnimation()

    useEffect(() => {
        if (isInView) {
            controls.start("visible")
        }
    }, [isInView, controls])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: delay,
                staggerChildren: staggerDelay
            }
        }
    }

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className={className}
            style={{ width }}
        >
            {children}
        </motion.div>
    )
}

export const StaggerItem = ({ children, className = "", variant = "fade-up" }: { children: React.ReactNode, className?: string, variant?: "fade-up" | "scale-up" | "slide-right" }) => {
    const variants = {
        "fade-up": {
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
        },
        "scale-up": {
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } }
        },
        "slide-right": {
            hidden: { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
        }
    } as Record<string, { hidden: any; visible: any }>

    return (
        <motion.div variants={variants[variant]} className={className}>
            {children}
        </motion.div>
    )
}
