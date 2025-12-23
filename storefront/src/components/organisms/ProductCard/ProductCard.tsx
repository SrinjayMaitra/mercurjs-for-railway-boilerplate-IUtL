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
  const hasDiscount = cheapestPrice?.calculated_price !== cheapestPrice?.original_price

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
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100 shadow-sm group-hover:shadow-card transition-shadow duration-300">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-5">
            <span className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:bg-black hover:text-white">
              Quick View
            </span>
          </div>

          {/* Sale Badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Sale
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="pt-4 space-y-1.5">
          <h3 className="text-[15px] font-medium text-primary leading-snug line-clamp-2 group-hover:text-secondary transition-colors duration-200">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <p className={clsx(
              "text-[15px] font-semibold",
              hasDiscount ? "text-red-600" : "text-primary"
            )}>
              {cheapestPrice?.calculated_price}
            </p>
            {hasDiscount && (
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
