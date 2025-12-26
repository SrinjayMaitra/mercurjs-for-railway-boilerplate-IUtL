"use client"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"

export const CategoryNavbar = ({
  categories,
  onClose,
}: {
  categories: HttpTypes.StoreProductCategory[]
  onClose?: (state: boolean) => void
}) => {
  const { category } = useParams()

  // Filter to only show root categories (no parent)
  const rootCategories = categories?.filter(
    (c) => c.parent_category_id == null
  ) || []

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
      {rootCategories.map(({ id, handle, name }) => (
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
        </LocalizedClientLink>
      ))}
    </nav>
  )
}
