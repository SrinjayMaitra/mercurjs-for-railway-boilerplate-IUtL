"use client"

import Image from "next/image"
import clsx from "clsx"

type DummyProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string
  price: string
  originalPrice?: string
}

export const DummyProductCard = ({
  product,
}: {
  product: DummyProduct
}) => {
  const hasDiscount = product.originalPrice && product.originalPrice !== product.price

  return (
    <div className="block cursor-pointer">
      <div
        className={clsx(
          "relative group flex flex-col w-full",
          "transition-all duration-400 ease-out"
        )}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100 shadow-sm group-hover:shadow-card transition-shadow duration-300">
          <Image
            src={product.thumbnail}
            alt={`${product.title} image`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
          />

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

          {/* Demo Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-black/80 text-white px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide uppercase">
              Demo
            </span>
          </div>
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
              {product.price}
            </p>
            {hasDiscount && (
              <p className="text-sm text-secondary line-through">
                {product.originalPrice}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
