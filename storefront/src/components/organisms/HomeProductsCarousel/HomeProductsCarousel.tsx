import { Carousel } from "@/components/cells"
import { ProductCard } from "../ProductCard/ProductCard"
import { listProducts } from "@/lib/data/products"
import { Product } from "@/types/product"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import { StaggerItem } from "@/components/animations/StaggerContainer"
import { generateFakeRating } from "@/lib/helpers/generate-fake-rating"

export const HomeProductsCarousel = async ({
  locale,
  sellerProducts,
  home,
}: {
  locale: string
  sellerProducts: Product[]
  home: boolean
}) => {
  const {
    response: { products },
  } = await listProducts({
    countryCode: locale,
    queryParams: {
      limit: home ? 4 : undefined,
      order: "created_at",
      handle: home
        ? undefined
        : sellerProducts.map((product) => product.handle),
    },
    forceCache: !home,
  })

  if (!products.length && !sellerProducts.length) return null

  return (
    <div className="w-full">
      <Carousel
        align="start"
        autoScroll={true}
        autoScrollDelay={3000}
        items={(sellerProducts.length ? sellerProducts : products).map(
          (product) => {
            const apiProduct = home
              ? (product as HttpTypes.StoreProduct)
              : products.find((p) => {
                  const { cheapestPrice } = getProductPrice({
                    product: p,
                  })
                  return (
                    cheapestPrice &&
                    p.id === product.id &&
                    Boolean(cheapestPrice)
                  )
                })
            
            const { rating, reviewCount } = generateFakeRating(product.id || apiProduct?.id || "")
            
            return (
              <StaggerItem
                key={product.id}
                variant="fade-up"
                className="h-full w-full"
              >
                <ProductCard
                  product={product}
                  api_product={apiProduct}
                  rating={rating}
                  reviewCount={reviewCount}
                />
              </StaggerItem>
            )
          }
        )}
      />
    </div>
  )
}
