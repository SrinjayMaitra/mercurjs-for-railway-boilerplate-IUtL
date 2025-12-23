"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

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
      className="w-full min-h-[90vh] lg:min-h-screen relative overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y, scale, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src={decodeURIComponent(image)}
          fill
          alt={`Hero banner - ${heading}`}
          className="object-cover"
          priority
          fetchPriority="high"
          quality={90}
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full min-h-[90vh] lg:min-h-screen flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-20 lg:py-32 w-full">
          <div className="max-w-2xl">
            {/* Accent Tag */}
            <Reveal variant="fade-up" delay={0.1}>
              <span className="inline-block px-4 py-2 bg-[#d2ff1f] text-black text-sm font-semibold rounded-full mb-6">
                New Collection 2025
              </span>
            </Reveal>

            {/* Heading */}
            <RevealText
              text={heading}
              el="h1"
              className="font-bold mb-6 uppercase text-white text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight"
            />

            {/* Paragraph */}
            <Reveal variant="fade-up" delay={0.4}>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-lg leading-relaxed">
                {paragraph}
              </p>
            </Reveal>

            {/* Buttons */}
            <Reveal variant="fade-up" delay={0.5}>
              <div className="flex flex-wrap gap-4">
                {buttons.map(({ label, path }, index) => (
                  <motion.div
                    key={path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1), duration: 0.5 }}
                  >
                    <Link
                      href={path}
                      className={`group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 ${
                        index === 0
                          ? "bg-[#d2ff1f] text-black hover:bg-[#c4f018] hover:scale-105"
                          : "bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-black"
                      }`}
                      aria-label={label}
                      title={label}
                    >
                      {label}
                      <ArrowRightIcon
                        className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${
                          index === 0 ? "text-black" : ""
                        }`}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal variant="fade-up" delay={0.7}>
              <div className="flex gap-8 mt-12 pt-8 border-t border-white/20">
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-[#d2ff1f]">10K+</p>
                  <p className="text-white/70 text-sm mt-1">Active Sellers</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-[#35b9e9]">50K+</p>
                  <p className="text-white/70 text-sm mt-1">Products Listed</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-white">98%</p>
                  <p className="text-white/70 text-sm mt-1">Happy Customers</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#d2ff1f] rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}

