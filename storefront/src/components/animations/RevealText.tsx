"use client"
import { motion, useInView, useAnimation } from "framer-motion"
import { useEffect, useRef } from "react"

interface RevealTextProps {
    text: string
    el?: React.ElementType
    className?: string
    delay?: number
    once?: boolean
}

export const RevealText = ({
    text,
    el: Wrapper = "p",
    className,
    delay = 0,
    once = true,
}: RevealTextProps) => {
    const controls = useAnimation()
    const ref = useRef(null)
    const isInView = useInView(ref, { amount: 0.5, once })

    useEffect(() => {
        if (isInView) {
            controls.start("visible")
        } else {
            controls.start("hidden")
        }
    }, [isInView, controls])

    const wordVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: delay + i * 0.05,
                duration: 0.5,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        }),
    } as { hidden: any; visible: any }

    const words = text.split(" ")

    return (
        <Wrapper className={className}>
            <span className="sr-only">{text}</span>
            <motion.span
                ref={ref}
                initial="hidden"
                animate={controls}
                aria-hidden
            >
                {words.map((word, i) => (
                    <span key={i} className="inline-block whitespace-nowrap">
                        <motion.span
                            custom={i}
                            variants={wordVariants}
                            className="inline-block"
                        >
                            {word}
                        </motion.span>
                        <span className="inline-block">&nbsp;</span>
                    </span>
                ))}
            </motion.span>
        </Wrapper>
    )
}
