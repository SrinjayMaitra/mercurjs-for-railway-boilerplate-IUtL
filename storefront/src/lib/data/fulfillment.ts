"use server"

import { sdk } from "@/lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { StoreCardShippingMethod } from "@/components/sections/CartShippingMethodsSection/CartShippingMethodsSection"

export const listCartShippingMethods = async (
  cartId: string,
  is_return: boolean = false
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  return sdk.client
    .fetch<{ shipping_options: StoreCardShippingMethod[] | null }>(
      `/store/shipping-options`,
      {
        method: "GET",
        query: {
          cart_id: cartId,
          fields:
            "+service_zone.fulfillment_set.type,*service_zone.fulfillment_set.location.address,+seller_id,+seller_name,+price_type,+amount,+rules",
        },
        headers,
        next,
        cache: "no-cache",
      }
    )
    .then(({ shipping_options }) => {
      // Debug: Log shipping options
      console.log("[SHIPPING] Options received for cart", cartId, ":", shipping_options?.length || 0, "options")
      if (shipping_options?.length) {
        shipping_options.forEach((opt, i) => {
          console.log(`[SHIPPING] Option ${i + 1}:`, opt.id, opt.name, "seller:", opt.seller_id, "price_type:", opt.price_type, "amount:", opt.amount)
        })
      }
      return shipping_options
    })
    .catch((error) => {
      console.error("[SHIPPING ERROR] Failed to fetch shipping options for cart", cartId, ":", error?.message || error)
      return null
    })
}

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  const body = { cart_id: cartId, data }

  if (data) {
    body.data = data
  }

  return sdk.client
    .fetch<{ shipping_option: HttpTypes.StoreCartShippingOption }>(
      `/store/shipping-options/${optionId}/calculate`,
      {
        method: "POST",
        body,
        headers,
        next,
      }
    )
    .then(({ shipping_option }) => shipping_option)
    .catch((e) => {
      return null
    })
}
