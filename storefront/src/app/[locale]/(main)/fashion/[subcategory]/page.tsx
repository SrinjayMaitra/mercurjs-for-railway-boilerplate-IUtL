import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/atoms"
import { headers } from "next/headers"
import { listProducts } from "@/lib/data/products"
import { listCategories } from "@/lib/data/categories"
import { ProductsList } from "@/components/organisms"
import { notFound } from "next/navigation"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; subcategory: string }>
}): Promise<Metadata> {
  const { locale, subcategory } = await params
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  // Find category by handle
  const { categories } = await listCategories({})
  const category = categories.find((cat) => cat.handle === subcategory)

  const title = category?.name || subcategory
  const description = `Browse our ${title.toLowerCase()} collection - ${process.env.NEXT_PUBLIC_SITE_NAME || "Storefront"}`
  const canonical = `${baseUrl}/${locale}/fashion/${subcategory}`

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

async function FashionSubcategoryPage({
  params,
}: {
  params: Promise<{ locale: string; subcategory: string }>
}) {
  const { locale, subcategory } = await params

  // Find the category by handle
  const { categories } = await listCategories({})
  const category = categories.find((cat) => cat.handle === subcategory)

  if (!category) {
    notFound()
  }

  const breadcrumbsItems = [
    {
      path: "/fashion",
      label: "Fashion",
    },
    {
      path: `/fashion/${subcategory}`,
      label: category.name || subcategory,
    },
  ]

  return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="hidden md:block mb-4">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-semibold text-primary tracking-tight">
          {category.name}
        </h1>
        <p className="text-secondary mt-2">
          Discover our {category.name?.toLowerCase()} collection
        </p>
      </div>

      <Suspense fallback={<ProductListingSkeleton />}>
        <SubcategoryProductListing
          locale={locale}
          categoryId={category.id}
          categoryName={category.name || subcategory}
        />
      </Suspense>
    </main>
  )
}

async function SubcategoryProductListing({
  locale,
  categoryId,
  categoryName,
}: {
  locale: string
  categoryId: string
  categoryName: string
}) {
  const { response } = await listProducts({
    countryCode: locale,
    category_id: categoryId,
    queryParams: {
      limit: 100,
      order: "created_at",
    },
  })

  const products = response.products
  const count = response.count

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
          <p className="text-secondary">No {categoryName.toLowerCase()} products found.</p>
        </div>
      )}
    </div>
  )
}

export default FashionSubcategoryPage
