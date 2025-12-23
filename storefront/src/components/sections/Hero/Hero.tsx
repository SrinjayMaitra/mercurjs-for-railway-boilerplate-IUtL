"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

import tailwindConfig from "../../../../tailwind.config"
import { ArrowRightIcon } from "@/icons"
import Link from "next/link"
import { Reveal } from "@/components/animations/Reveal"
import { RevealText } from "@/components/animations/RevealText"

type HeroProps = {
  image: string
  heading: string
  paragraph: string
  buttons: { label: string; path: string }[]
}

export const Hero = ({ image, heading, paragraph, buttons }: HeroProps) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Enhanced Parallax & Scale effect
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <section
      ref={ref}
      className="w-full flex container mt-5 flex-col lg:flex-row text-primary relative"
    >
      <div className="w-full order-2 lg:order-1 relative overflow-hidden rounded-sm">
        <motion.div style={{ y, scale, opacity }} className="relative w-full h-full origin-top">
          <Image
            src={decodeURIComponent(image)}
            width={700}
            height={600}
            alt={`Hero banner - ${heading}`}
            className="w-full h-auto object-cover"
            priority
            fetchPriority="high"
            quality={90}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </motion.div>
      </div>

      <div className="w-full lg:order-2 flex flex-col gap-0 z-10">
        <div className="border rounded-sm w-full px-6 flex items-end min-h-[400px] lg:h-[calc(100%-144px)] bg-primary">
          <div className="py-8">
            <RevealText
              text={heading}
              el="h2"
              className="font-bold mb-6 uppercase display-md max-w-[652px] text-4xl md:text-5xl leading-tight"
            />
            <Reveal variant="fade-up" delay={0.4}>
              <p className="text-lg mb-8 max-w-md">{paragraph}</p>
            </Reveal>
          </div>
        </div>
        {buttons.length && (
          <div className="h-[72px] lg:h-[144px] flex font-bold uppercase">
            {buttons.map(({ label, path }, index) => (
              <motion.div
                key={path}
                className="w-1/2 h-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <Link
                  href={path}
                  className="group flex border rounded-sm h-full w-full bg-content hover:bg-action hover:text-tertiary transition-all duration-300 p-6 justify-between items-end relative overflow-hidden"
                  aria-label={label}
                  title={label}
                >
                  <motion.div
                    className="absolute inset-0 bg-action z-0"
                    initial={{ scaleY: 0 }}
                    whileHover={{ scaleY: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ originY: 1 }}
                  />

                  <span className="relative z-10 overflow-hidden mix-blend-exclusion text-primary group-hover:text-tertiary">
                    <span className="block group-hover:-translate-y-[150%] transition-transform duration-300">
                      {label}
                    </span>
                    <span className="absolute top-0 left-0 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 block">
                      {label}
                    </span>
                  </span>

                  <ArrowRightIcon
                    color={tailwindConfig.theme.extend.backgroundColor.primary}
                    aria-hidden
                    className="group-hover:translate-x-1 transition-transform duration-300 relative z-10 group-hover:brightness-0 group-hover:invert"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

