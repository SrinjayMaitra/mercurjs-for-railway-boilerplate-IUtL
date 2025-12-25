"use client"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { CollapseIcon } from "@/icons"
import { useState } from "react"

export const CategoryNavbar = ({
  categories,
  onClose,
}: {
  categories: HttpTypes.StoreProductCategory[]
  onClose?: (state: boolean) => void
}) => {
  const { category } = useParams()
  const [showFashionDropdown, setShowFashionDropdown] = useState(false)

  return (
    <nav className="flex md:items-center flex-col md:flex-row">
      <LocalizedClientLink
        href="/categories"
        onClick={() => (onClose ? onClose(false) : null)}
        className={cn(
          "label-md uppercase px-4 my-3 md:my-0 flex items-center justify-between"
        )}
      >
        All Products
      </LocalizedClientLink>
      <LocalizedClientLink
        href="/apparel"
        onClick={() => (onClose ? onClose(false) : null)}
        className={cn(
          "label-md uppercase px-4 my-3 md:my-0 flex items-center justify-between",
          category === "apparel" && "md:border-b md:border-primary"
        )}
      >
        Apparel
        <CollapseIcon size={18} className="-rotate-90 md:hidden" />
      </LocalizedClientLink>

      {/* Fashion with Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setShowFashionDropdown(true)}
        onMouseLeave={() => setShowFashionDropdown(false)}
      >
        <LocalizedClientLink
          href="/fashion"
          onClick={() => (onClose ? onClose(false) : null)}
          className={cn(
            "label-md uppercase px-4 my-3 md:my-0 flex items-center justify-between",
            (category === "fashion" || category === "luxury") && "md:border-b md:border-primary"
          )}
        >
          Fashion
          <CollapseIcon size={18} className="-rotate-90 md:hidden" />
        </LocalizedClientLink>

        {/* Dropdown Menu - Simple with just Luxury */}
        <div
          className={cn(
            "absolute left-0 top-full pt-2 z-50 hidden md:block",
            "opacity-0 invisible translate-y-2 transition-all duration-200",
            showFashionDropdown && "opacity-100 visible translate-y-0"
          )}
        >
          <div className="bg-white shadow-xl rounded-lg border border-neutral-100 p-4 min-w-[180px]">
            <ul className="space-y-2">
              <li>
                <LocalizedClientLink
                  href="/fashion"
                  onClick={() => {
                    setShowFashionDropdown(false)
                    onClose?.(false)
                  }}
                  className="block px-3 py-2 text-base font-medium text-primary hover:text-[#35b9e9] hover:bg-neutral-50 rounded-md transition-colors"
                >
                  All Fashion
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/fashion/luxury"
                  onClick={() => {
                    setShowFashionDropdown(false)
                    onClose?.(false)
                  }}
                  className="block px-3 py-2 text-base font-medium text-primary hover:text-[#35b9e9] hover:bg-neutral-50 rounded-md transition-colors"
                >
                  Luxury
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <LocalizedClientLink
        href="/electronics"
        onClick={() => (onClose ? onClose(false) : null)}
        className={cn(
          "label-md uppercase px-4 my-3 md:my-0 flex items-center justify-between",
          category === "electronics" && "md:border-b md:border-primary"
        )}
      >
        Electronics
        <CollapseIcon size={18} className="-rotate-90 md:hidden" />
      </LocalizedClientLink>
      <LocalizedClientLink
        href="/home-and-garden"
        onClick={() => (onClose ? onClose(false) : null)}
        className={cn(
          "label-md uppercase px-4 my-3 md:my-0 flex items-center justify-between",
          category === "home-and-garden" && "md:border-b md:border-primary"
        )}
      >
        Home & Garden
        <CollapseIcon size={18} className="-rotate-90 md:hidden" />
      </LocalizedClientLink>
      {categories?.filter(({ name }) => {
        const catName = name?.toLowerCase() || ""
        return catName !== "apparel" && catName !== "fashion" && catName !== "electronics" && catName !== "home & garden" && catName !== "home and garden" && catName !== "luxury"
      }).map(({ id, handle, name }) => (
        <LocalizedClientLink
          key={id}
          href={`/categories/${handle}`}
          onClick={() => (onClose ? onClose(false) : null)}
          className={cn(
            "label-md uppercase px-4 my-3 md:my-0 flex items-center justify-between",
            handle === category && "md:border-b md:border-primary"
          )}
        >
          {name}
          <CollapseIcon size={18} className="-rotate-90 md:hidden" />
        </LocalizedClientLink>
      ))}
    </nav>
  )
}
