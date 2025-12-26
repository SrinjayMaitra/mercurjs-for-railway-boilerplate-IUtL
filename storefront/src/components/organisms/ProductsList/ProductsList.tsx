import { ProductCard } from "../ProductCard/ProductCard"
import { HttpTypes } from "@medusajs/types"
import { generateFakeRating } from "@/lib/helpers/generate-fake-rating"

export const ProductsList = ({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) => {
  return (
    <>
      {products.map((product) => {
        const { rating, reviewCount } = generateFakeRating(product.id)
        return (
          <ProductCard
            key={product.id}
            product={product}
            api_product={product}
            rating={rating}
            reviewCount={reviewCount}
          />
        )
      })}
    </>
  )
}
