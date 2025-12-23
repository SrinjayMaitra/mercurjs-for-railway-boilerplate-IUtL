"use client"

import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { BaseHit, Hit } from "instantsearch.js"
import clsx from "clsx"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { getProductPrice } from "@/lib/helpers/get-product-price"

export const ProductCard = ({
  product,
  api_product,
}: {
  product: Hit<HttpTypes.StoreProduct> | Partial<Hit<BaseHit>>
  api_product?: HttpTypes.StoreProduct | null
}) => {
  if (!api_product) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: api_product! as HttpTypes.StoreProduct,
  })

  const productName = String(product.title || "Product")

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      aria-label={`View ${productName}`}
      title={`View ${productName}`}
      className="block"
    >
      <div
        className={clsx(
          "relative group flex flex-col w-full",
          "transition-all duration-400 ease-out"
        )}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100">
          {product.thumbnail ? (
            <Image
              priority
              fetchPriority="high"
              src={decodeURIComponent(product.thumbnail)}
              alt={`${productName} image`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <Image
              priority
              fetchPriority="high"
              src="/images/placeholder.svg"
              alt={`${productName} image placeholder`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <span className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
              Quick View
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="pt-4 space-y-1">
          <h3 className="text-[15px] font-medium text-primary leading-tight line-clamp-2 group-hover:text-secondary transition-colors duration-200">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-semibold text-primary">
              {cheapestPrice?.calculated_price}
            </p>
            {cheapestPrice?.calculated_price !== cheapestPrice?.original_price && (
              <p className="text-sm text-secondary line-through">
                {cheapestPrice?.original_price}
              </p>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
