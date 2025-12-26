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

  // Find Fashion category and all its children
  const { categories } = await listCategories({})
  const fashionCategory = categories.find(
    (cat) => cat.name?.toLowerCase() === "fashion"
  )

  // Get all child categories of Fashion
  const childCategories = categories.filter(
    (cat) => cat.parent_category_id === fashionCategory?.id
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

      <div className="flex gap-8">
        {/* Sidebar with subcategories */}
        {childCategories.length > 0 && (
          <aside className="hidden lg:block w-48 flex-shrink-0">
            <nav className="sticky top-24">
              <h3 className="font-semibold text-primary mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/fashion"
                    className="text-primary font-medium hover:text-[#35b9e9] transition-colors"
                  >
                    All Fashion
                  </a>
                </li>
                {childCategories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`/fashion/${cat.handle}`}
                      className="text-secondary hover:text-[#35b9e9] transition-colors"
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        {/* Products */}
        <div className="flex-1">
          <Suspense fallback={<ProductListingSkeleton />}>
            <FashionProductListing
              locale={locale}
              fashionCategoryId={fashionCategory?.id}
              childCategoryIds={childCategories.map((c) => c.id)}
            />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

async function FashionProductListing({
  locale,
  fashionCategoryId,
  childCategoryIds,
}: {
  locale: string
  fashionCategoryId?: string
  childCategoryIds: string[]
}) {
  // Fetch products from Fashion and all child categories
  let allProducts: any[] = []
  const existingIds = new Set<string>()

  // Fetch Fashion products
  if (fashionCategoryId) {
    const { response } = await listProducts({
      countryCode: locale,
      category_id: fashionCategoryId,
      queryParams: {
        limit: 100,
        order: "created_at",
      },
    })
    response.products.forEach((p: any) => {
      if (!existingIds.has(p.id)) {
        existingIds.add(p.id)
        allProducts.push(p)
      }
    })
  }

  // Fetch products from all child categories
  for (const categoryId of childCategoryIds) {
    const { response } = await listProducts({
      countryCode: locale,
      category_id: categoryId,
      queryParams: {
        limit: 100,
        order: "created_at",
      },
    })
    response.products.forEach((p: any) => {
      if (!existingIds.has(p.id)) {
        existingIds.add(p.id)
        allProducts.push(p)
      }
    })
  }

  const count = allProducts.length

  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary">
          {count} {count === 1 ? "listing" : "listings"}
        </h2>
      </div>
      {allProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          <ProductsList products={allProducts} />
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

