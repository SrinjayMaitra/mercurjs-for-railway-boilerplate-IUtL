"use client"
import { SelectField } from "@/components/molecules"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

const selectOptions = [
  { label: "Newest", value: "created_at" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
]

export const ProductListingHeader = ({ total }: { total: number }) => {
  const router = useRouter()
  const pathname = usePathname()

  const selectOptionHandler = (value: string) => {
    router.push(`${pathname}?sortBy=${value}`)
  }

  return (
    <div className="flex justify-between w-full items-center py-2">
      <p className="text-secondary text-[15px]">
        <span className="font-medium text-primary">{total}</span> listings
      </p>
      <div className="hidden md:flex gap-2 items-center">
        <span className="text-secondary text-sm">Sort by:</span>
        <SelectField
          className="min-w-[180px]"
          options={selectOptions}
          selectOption={selectOptionHandler}
        />
      </div>
    </div>
  )
}
