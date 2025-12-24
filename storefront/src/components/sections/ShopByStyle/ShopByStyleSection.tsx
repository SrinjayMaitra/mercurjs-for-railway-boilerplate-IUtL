"use client"
import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ArrowRightIcon } from "@/icons"
import { Style } from "@/types/styles"
import { RevealText } from "@/components/animations/RevealText"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef } from "react"

export const styles: Style[] = [
  {
    id: 1,
    name: "LUXURY",
    href: "/collections/luxury",
  },
  {
    id: 2,
    name: "VINTAGE",
    href: "/collections/vintage",
  },
  {
    id: 3,
    name: "CASUAL",
    href: "/collections/casual",
  },
  {
    id: 4,
    name: "STREETWEAR",
    href: "/collections/streetwear",
  },
  {
    id: 5,
    name: "Y2K",
    href: "/collections/y2k",
  },
]

export function ShopByStyleSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Smooth spring physics for natural movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  })

  // Enhanced parallax zoom effects for the image
  const y = useTransform(smoothProgress, [0, 1], ["-15%", "15%"])
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1.15, 1, 1.1])
  const rotate = useTransform(smoothProgress, [0, 1], [-3, 3])

  return (
    <section ref={containerRef} className="bg-primary container">
      <RevealText
        text="SHOP BY STYLE"
        el="h2"
        className="heading-lg text-primary mb-12"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        <StaggerContainer className="py-[52px] px-[58px] h-full border rounded-sm flex flex-col justify-center">
          {styles.map((style) => (
            <StaggerItem key={style.id} variant="slide-right">
              <LocalizedClientLink
                href={style.href}
                className="group flex items-center gap-4 text-primary hover:text-action transition-colors border-b border-transparent hover:border-primary w-fit pb-2 mb-8"
              >
                <span className="heading-lg">{style.name}</span>
                <ArrowRightIcon className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </LocalizedClientLink>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div className="relative hidden lg:block overflow-hidden h-full rounded-sm">
          <motion.div
            style={{ y, scale, rotate }}
            className="h-full will-change-transform"
          >
            <Image
              loading="lazy"
              fetchPriority="high"
              src="/images/shop-by-styles/Image.jpg"
              alt="Models showcasing luxury fashion styles"
              width={700}
              height={600}
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
