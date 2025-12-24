import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/atoms"
import { headers } from "next/headers"
import { listProducts } from "@/lib/data/products"
import { listCategories } from "@/lib/data/categories"
import { ProductsList } from "@/components/organisms"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  const title = "Apparel"
  const description = `Browse our apparel collection - ${process.env.NEXT_PUBLIC_SITE_NAME || "Storefront"}`
  const canonical = `${baseUrl}/${locale}/apparel`

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} | ${process.env.NEXT_PUBLIC_SITE_NAME || "Storefront"}`,
      description,
      url: canonical,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Storefront",
      type: "website",
    },
  }
}

async function ApparelPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Find the Apparel category by name (case-insensitive)
  const { categories } = await listCategories({})
  const apparelCategory = categories.find(
    (cat) => cat.name?.toLowerCase() === "apparel"
  )

  const breadcrumbsItems = [
    {
      path: "/apparel",
      label: "Apparel",
    },
  ]

  return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="hidden md:block mb-4">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-semibold text-primary tracking-tight">
          Apparel
        </h1>
        <p className="text-secondary mt-2">
          Browse our apparel collection
        </p>
      </div>

      <Suspense fallback={<ProductListingSkeleton />}>
        <ApparelProductListing 
          locale={locale} 
          categoryId={apparelCategory?.id} 
        />
      </Suspense>
    </main>
  )
}

async function ApparelProductListing({
  locale,
  categoryId,
}: {
  locale: string
  categoryId?: string
}) {
  // Fetch products - try with categoryId first, then fallback to filtering by name
  let products = []
  let count = 0

  // Always use categoryId if available - this is the most reliable method
  if (categoryId) {
    const { response } = await listProducts({
      countryCode: locale,
      category_id: categoryId,
      queryParams: {
        limit: 100,
        order: "created_at",
      },
    })
    products = response.products
    count = response.count
  } else {
    // If no categoryId found, fetch all and show message
    // This shouldn't happen if Apparel category exists
    products = []
    count = 0
  }

  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary">
          {count} {count === 1 ? "listing" : "listings"}
        </h2>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          <ProductsList products={products} />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-secondary">No apparel products found.</p>
        </div>
      )}
    </div>
  )
}

export default ApparelPage

