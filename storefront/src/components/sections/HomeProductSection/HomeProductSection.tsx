"use client"
import { HomeProductsCarousel } from "@/components/organisms"
import { Product } from "@/types/product"
import { RevealText } from "@/components/animations/RevealText"
import { StaggerContainer } from "@/components/animations/StaggerContainer"

export const HomeProductSection = ({
  heading,
  locale = process.env.NEXT_PUBLIC_DEFAULT_REGION || "pl",
  products = [],
  home = false,
}: {
  heading: string
  locale?: string
  products?: Product[]
  home?: boolean
}) => {
  return (
    <section className="py-8 w-full">
      <div className="mb-6">
        <RevealText
          text={heading}
          el="h2"
          className="heading-lg font-bold tracking-tight uppercase"
        />
      </div>
      <StaggerContainer>
        <HomeProductsCarousel
          locale={locale}
          sellerProducts={products.slice(0, 4)}
          home={home}
        />
      </StaggerContainer>
    </section>
  )
}
