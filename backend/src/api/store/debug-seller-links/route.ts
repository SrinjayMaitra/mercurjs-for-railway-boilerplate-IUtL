import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cartId = req.query.cart_id as string
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Get cart with items
    const { data: [cart] } = await query.graph({
      entity: "cart",
      fields: ["id", "items.product_id", "items.product_title"],
      filters: { id: cartId },
    })

    // Get seller-product links for products in cart
    const productIds = cart?.items?.map((i: any) => i.product_id) || []

    let sellerProductLinks: any[] = []
    try {
      const { data } = await query.graph({
        entity: "seller_product",
        fields: ["seller_id", "product_id", "seller.*"],
        filters: { product_id: productIds },
      })
      sellerProductLinks = data
    } catch (e: any) {
      sellerProductLinks = [{ error: e.message }]
    }

    // Get all seller-shipping-option links
    let sellerShippingOptionLinks: any[] = []
    try {
      const { data } = await query.graph({
        entity: "seller_shipping_option",
        fields: ["seller_id", "shipping_option_id", "seller.*"],
      })
      sellerShippingOptionLinks = data
    } catch (e: any) {
      sellerShippingOptionLinks = [{ error: e.message }]
    }

    // Get all sellers
    let sellers: any[] = []
    try {
      const { data } = await query.graph({
        entity: "seller",
        fields: ["id", "name", "handle"],
      })
      sellers = data
    } catch (e: any) {
      sellers = [{ error: e.message }]
    }

    res.json({
      success: true,
      cart: cart ? {
        id: cart.id,
        items: cart.items,
      } : null,
      seller_product_links: sellerProductLinks,
      seller_shipping_option_links: sellerShippingOptionLinks,
      sellers: sellers,
      analysis: {
        products_in_cart: productIds,
        sellers_in_cart: sellerProductLinks.filter((s: any) => !s.error).map((s: any) => s.seller_id),
        shipping_options_with_sellers: sellerShippingOptionLinks.filter((s: any) => !s.error).length,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
