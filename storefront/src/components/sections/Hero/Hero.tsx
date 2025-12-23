"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

import tailwindConfig from "../../../../tailwind.config"
import { ArrowRightIcon } from "@/icons"
import Link from "next/link"
import { Reveal } from "@/components/animations/Reveal"

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

  // Parallax effect for the image
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.5])

  return (
    <section
      ref={ref}
      className="w-full flex container mt-5 flex-col lg:flex-row text-primary relative"
    >
      <div className="w-full order-2 lg:order-1 relative overflow-hidden rounded-sm">
        <motion.div style={{ y, opacity }} className="relative w-full h-full">
          <Image
            src={decodeURIComponent(image)}
            width={700}
            height={600}
            alt={`Hero banner - ${heading}`}
            className="w-full h-auto object-cover"
            priority
            fetchPriority="high"
            quality={80}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </motion.div>
      </div>

      <div className="w-full lg:order-2 flex flex-col gap-0 z-10">
        <div className="border rounded-sm w-full px-6 flex items-end min-h-[400px] lg:h-[calc(100%-144px)] bg-primary">
          <div className="py-8">
            <Reveal variant="fade-up" delay={0.2}>
              <h2 className="font-bold mb-6 uppercase display-md max-w-[652px] text-4xl md:text-5xl leading-tight">
                {heading}
              </h2>
            </Reveal>
            <Reveal variant="fade-up" delay={0.3}>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
              >
                <Link
                  href={path}
                  className="group flex border rounded-sm h-full w-full bg-content hover:bg-action hover:text-tertiary transition-all duration-300 p-6 justify-between items-end"
                  aria-label={label}
                  title={label}
                >
                  <span className="relative overflow-hidden">
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
                    className="group-hover:translate-x-1 transition-transform duration-300"
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

