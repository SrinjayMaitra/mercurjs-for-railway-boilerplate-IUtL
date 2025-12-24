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

  const title = "Fashion"
  const description = `Browse our fashion collection - ${process.env.NEXT_PUBLIC_SITE_NAME || "Storefront"}`
  const canonical = `${baseUrl}/${locale}/fashion`

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

async function FashionPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Find the Fashion category by name (case-insensitive)
  const { categories } = await listCategories({})
  const fashionCategory = categories.find(
    (cat) => cat.name?.toLowerCase() === "fashion"
  )

  const breadcrumbsItems = [
    {
      path: "/fashion",
      label: "Fashion",
    },
  ]

  return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="hidden md:block mb-4">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-semibold text-primary tracking-tight">
          Fashion
        </h1>
        <p className="text-secondary mt-2">
          Discover the latest fashion trends and styles
        </p>
      </div>

      <Suspense fallback={<ProductListingSkeleton />}>
        <FashionProductListing
          locale={locale}
          categoryId={fashionCategory?.id}
        />
      </Suspense>
    </main>
  )
}

async function FashionProductListing({
  locale,
  categoryId,
}: {
  locale: string
  categoryId?: string
}) {
  // Fetch products - try with categoryId first, then fallback to filtering by name
  let products = []
  let count = 0

  if (categoryId) {
    // Use category_id if available
    const { response } = await listProducts({
      countryCode: locale,
      category_id: categoryId,
      queryParams: {
        limit: 100,
        order: "created_at",
        fields: "*categories", // Request categories field
      },
    })
    products = response.products
    count = response.count
  } else {
    // Fallback: fetch all products and filter by category name
    const { response } = await listProducts({
      countryCode: locale,
      queryParams: {
        limit: 100,
        order: "created_at",
        fields: "*categories", // Request categories field
      },
    })

    // Filter products that have "Fashion" category (case-insensitive)
    products = response.products.filter((product) => {
      // Check if product has categories array and one matches "fashion"
      if (product.categories && Array.isArray(product.categories)) {
        return product.categories.some(
          (cat) => cat.name?.toLowerCase() === "fashion"
        )
      }
      return false
    })
    count = products.length
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
          <p className="text-secondary">No fashion products found.</p>
        </div>
      )}
    </div>
  )
}

export default FashionPage

