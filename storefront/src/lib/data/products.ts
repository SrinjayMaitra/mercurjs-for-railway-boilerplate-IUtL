"use server"

import { sdk } from "../config"
import { sortProducts } from "@/lib/helpers/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@/types/product"
import { getAuthHeaders } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { SellerProps } from "@/types/seller"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
  category_id,
  collection_id,
  forceCache = false,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams &
    HttpTypes.StoreProductParams & {
      handle?: string[]
    }
  category_id?: string
  collection_id?: string
  countryCode?: string
  regionId?: string
  forceCache?: boolean
}): Promise<{
  response: {
    products: (HttpTypes.StoreProduct & { seller?: SellerProps })[]
    count: number
  }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const useCached = forceCache || (limit <= 8 && !category_id && !collection_id)

  return sdk.client
    .fetch<{
      products: (HttpTypes.StoreProduct & { seller?: SellerProps })[]
      count: number
    }>(`/store/products`, {
      method: "GET",
      query: {
        country_code: countryCode,
        category_id,
        collection_id,
        limit,
        offset,
        region_id: region?.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products," +
          "*seller.reviews,*seller.reviews.customer,*seller.reviews.seller,*seller.products.variants,*attribute_values,*attribute_values.attribute",
        ...queryParams,
      },
      headers,
      next: useCached ? { revalidate: 60 } : undefined,
      cache: useCached ? "force-cache" : "no-cache",
    })
    .then(({ products: productsRaw, count }) => {
      // Filter out suspended sellers only
      const products = productsRaw.filter(
        (product) => product.seller?.store_status !== "SUSPENDED"
      )

      const nextPage = count > offset + limit ? pageParam + 1 : null

      // Debug: Log products without sellers (only in development)
      if (process.env.NODE_ENV === "development" && category_id) {
        const productsWithoutSellers = productsRaw.filter((prod) => !prod?.seller)
        if (productsWithoutSellers.length > 0) {
          console.log(
            `[DEBUG] Found ${productsWithoutSellers.length} products without sellers in category ${category_id}:`,
            productsWithoutSellers.map((p) => ({ id: p.id, title: p.title, handle: p.handle }))
          )
        }
      }

      const response = products.filter((prod) => {
        // @ts-ignore Property 'seller' exists but TypeScript doesn't recognize it
        const reviews = prod.seller?.reviews?.filter((item) => !!item) ?? []
        return (
          // @ts-ignore Property 'seller' exists but TypeScript doesn't recognize it
          prod?.seller && {
            ...prod,
            seller: {
              // @ts-ignore Property 'seller' exists but TypeScript doesn't recognize it
              ...prod.seller,
              reviews,
            },
          }
        )
      })

      // Adjust count to match filtered products (products without sellers are filtered out)
      const filteredCount = response.length

      return {
        response: {
          products: response,
          count: filteredCount,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
    .catch(() => {
      return {
        response: {
          products: [],
          count: 0,
        },
        nextPage: 0,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
  category_id,
  seller_id,
  collection_id,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
  category_id?: string
  seller_id?: string
  collection_id?: string
}): Promise<{
  response: {
    products: HttpTypes.StoreProduct[]
    count: number
  }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    category_id,
    collection_id,
    countryCode,
  })

  const filteredProducts = seller_id
    ? products.filter((product) => product.seller?.id === seller_id)
    : products

  const pricedProducts = filteredProducts.filter((prod) =>
    prod.variants?.some((variant) => variant.calculated_price !== null)
  )

  // Debug: Log products without prices (only in development)
  if (process.env.NODE_ENV === "development" && category_id) {
    const productsWithoutPrices = filteredProducts.filter(
      (prod) => !prod.variants?.some((variant) => variant.calculated_price !== null)
    )
    if (productsWithoutPrices.length > 0) {
      console.log(
        `[DEBUG] Found ${productsWithoutPrices.length} products without calculated prices in category ${category_id}:`,
        productsWithoutPrices.map((p) => ({ id: p.id, title: p.title, handle: p.handle }))
      )
    }
  }

  const sortedProducts = sortProducts(pricedProducts, sortBy)

  const pageParam = (page - 1) * limit

  // Adjust count to match filtered products (products without prices are filtered out)
  const filteredCount = sortedProducts.length
  const nextPage = filteredCount > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count: filteredCount,
    },
    nextPage,
    queryParams,
  }
}
