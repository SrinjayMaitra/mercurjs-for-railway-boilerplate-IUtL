"use client"
import { RevealText } from "@/components/animations/RevealText"
import { StaggerContainer } from "@/components/animations/StaggerContainer"
import { Reveal } from "@/components/animations/Reveal"
import Link from "next/link"
import { ArrowRightIcon } from "@/icons"

export const HomeProductSectionClient = ({
  heading,
  children,
  viewAllLink = "/categories",
}: {
  heading: string
  children: React.ReactNode
  viewAllLink?: string
}) => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <Reveal variant="fade-up" delay={0.1}>
            <span className="inline-block px-3 py-1 bg-[#d2ff1f]/10 text-[#0a0a0a] text-xs font-semibold rounded-full mb-3 border border-[#d2ff1f]/30">
              Featured
            </span>
          </Reveal>
          <RevealText
            text={heading}
            el="h2"
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
          />
        </div>
        <Reveal variant="fade-up" delay={0.2}>
          <Link
            href={viewAllLink}
            className="group hidden md:flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            View All
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
      <StaggerContainer>
        {children}
      </StaggerContainer>
      <Reveal variant="fade-up" delay={0.3}>
        <div className="mt-8 flex md:hidden justify-center">
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] text-white rounded-full text-sm font-medium hover:bg-[#d2ff1f] hover:text-black transition-all"
          >
            View All Products
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </Reveal>
    </div>
  )
}



