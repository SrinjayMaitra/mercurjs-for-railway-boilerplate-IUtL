import { HomeProductsCarousel } from "@/components/organisms"
import { Product } from "@/types/product"
import { HomeProductSectionClient } from "./HomeProductSectionClient"

export const HomeProductSection = async ({
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
      <HomeProductSectionClient heading={heading}>
        <HomeProductsCarousel
          locale={locale}
          sellerProducts={products.slice(0, 4)}
          home={home}
        />
      </HomeProductSectionClient>
    </section>
  )
}
