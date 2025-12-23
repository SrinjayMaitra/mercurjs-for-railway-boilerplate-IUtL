"use client"

import Image from "next/image"
import clsx from "clsx"

type DummyProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string
  price: string
}

export const DummyProductCard = ({
  product,
}: {
  product: DummyProduct
}) => {
  return (
    <div className="block cursor-pointer">
      <div
        className={clsx(
          "relative group flex flex-col w-full",
          "transition-all duration-400 ease-out"
        )}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100">
          <Image
            src={product.thumbnail}
            alt={`${product.title} image`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <span className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
              Quick View
            </span>
          </div>

          {/* Demo Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
              Demo
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
              {product.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
