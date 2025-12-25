import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)
  const fulfillmentModuleService = req.scope.resolve(Modules.FULFILLMENT)

  try {
    // Get all sellers
    const { data: sellers } = await query.graph({
      entity: "seller",
      fields: ["id", "name"],
    })

    // Get all shipping options
    const shippingOptions = await fulfillmentModuleService.listShippingOptions({})

    // Get existing seller-shipping-option links
    let existingLinks: any[] = []
    try {
      const { data } = await query.graph({
        entity: "seller_shipping_option",
        fields: ["seller_id", "shipping_option_id"],
      })
      existingLinks = data
    } catch (e) {
      existingLinks = []
    }

    const results: any[] = []

    // For each seller, link all shipping options that aren't already linked
    for (const seller of sellers) {
      for (const shippingOption of shippingOptions) {
        const alreadyLinked = existingLinks.some(
          (l: any) => l.seller_id === seller.id && l.shipping_option_id === shippingOption.id
        )

        if (!alreadyLinked) {
          try {
            await link.create({
              seller: { seller_id: seller.id },
              [Modules.FULFILLMENT]: { shipping_option_id: shippingOption.id },
            })

            results.push({
              action: "linked",
              seller_name: seller.name,
              seller_id: seller.id,
              shipping_option_name: shippingOption.name,
              shipping_option_id: shippingOption.id,
            })
          } catch (e: any) {
            results.push({
              action: "error",
              seller_name: seller.name,
              shipping_option_name: shippingOption.name,
              error: e.message,
            })
          }
        } else {
          results.push({
            action: "already_linked",
            seller_name: seller.name,
            shipping_option_name: shippingOption.name,
          })
        }
      }
    }

    res.json({
      success: true,
      message: "Seller-shipping-option links created",
      sellers_count: sellers.length,
      shipping_options_count: shippingOptions.length,
      results,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
