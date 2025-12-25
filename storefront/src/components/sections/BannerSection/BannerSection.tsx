"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"
import { ArrowRightIcon } from "@/icons"
import { useRef } from "react"

export const BannerSection = () => {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Slower, smoother spring for elegant animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 50,
    restDelta: 0.0001,
  })

  // Subtle parallax zoom effect for the image
  const imageScale = useTransform(smoothProgress, [0, 0.5, 1], [1.08, 1, 1.05])
  const imageY = useTransform(smoothProgress, [0, 1], ["-5%", "5%"])
  const imageRotate = useTransform(smoothProgress, [0, 1], [-0.8, 0.8])

  return (
    <section ref={sectionRef} className="py-12 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 bg-[#0a0a0a] rounded-3xl overflow-hidden">
          {/* Content Side */}
          <div className="p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 bg-[#d2ff1f] text-black text-xs font-bold rounded-full w-fit mb-6"
            >
              #COLLECTION
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
            >
              BOHO VIBES: WHERE{" "}
              <span className="text-[#d2ff1f]">COMFORT</span>{" "}
              MEETS{" "}
              <span className="text-[#35b9e9]">CREATIVITY</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/70 text-lg mb-8 max-w-lg"
            >
              Discover boho styles that inspire adventure and embrace the beauty
              of the unconventional.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <LocalizedClientLink
                href="/fashion"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#d2ff1f] text-black font-semibold rounded-full hover:bg-[#c4f018] hover:scale-105 transition-all duration-300"
              >
                EXPLORE COLLECTION
                <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </LocalizedClientLink>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-8 mt-10 pt-8 border-t border-white/10"
            >
              <div>
                <p className="text-2xl font-bold text-[#d2ff1f]">200+</p>
                <p className="text-white/50 text-sm">New Styles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#35b9e9]">Free</p>
                <p className="text-white/50 text-sm">Shipping</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24h</p>
                <p className="text-white/50 text-sm">Delivery</p>
              </div>
            </motion.div>
          </div>

          {/* Image Side with Parallax Zoom */}
          <div className="relative h-[400px] lg:h-auto overflow-hidden">
            <motion.div
              style={{
                scale: imageScale,
                y: imageY,
                rotate: imageRotate,
              }}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                loading="lazy"
                src="/images/banner-section/Image.jpg"
                alt="Boho fashion collection - Model wearing a floral dress with yellow boots"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </motion.div>
            {/* Gradient overlay for better text contrast if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/30 to-transparent lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  )
}
