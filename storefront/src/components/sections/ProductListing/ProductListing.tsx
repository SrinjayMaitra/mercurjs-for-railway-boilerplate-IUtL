import {
  ProductListingActiveFilters,
  ProductListingHeader,
  ProductSidebar,
  ProductsList,
  ProductsPagination,
} from "@/components/organisms"
import { PRODUCT_LIMIT } from "@/const"
import { listProductsWithSort } from "@/lib/data/products"

export const ProductListing = async ({
  category_id,
  collection_id,
  seller_id,
  showSidebar = false,
  locale = process.env.NEXT_PUBLIC_DEFAULT_REGION || "pl",
}: {
  category_id?: string
  collection_id?: string
  seller_id?: string
  showSidebar?: boolean
  locale?: string
}) => {
  const { response } = await listProductsWithSort({
    seller_id,
    category_id,
    collection_id,
    countryCode: locale,
    sortBy: "created_at",
    queryParams: {
      limit: PRODUCT_LIMIT,
    },
  })

  const { products } = await response

  const count = products.length

  const pages = Math.ceil(count / PRODUCT_LIMIT) || 1

  return (
    <div className="py-6">
      <ProductListingHeader total={count} />
      <div className="hidden md:block mt-4">
        <ProductListingActiveFilters />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 mt-8 gap-8">
        {showSidebar && (
          <aside className="lg:col-span-1">
            <ProductSidebar />
          </aside>
        )}
        <section className={showSidebar ? "lg:col-span-3" : "col-span-4"}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductsList products={products} />
          </div>
          <ProductsPagination pages={pages} />
        </section>
      </div>
    </div>
  )
}
