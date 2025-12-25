import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)
  const fulfillmentModuleService = req.scope.resolve(Modules.FULFILLMENT)
  const pricingModuleService = req.scope.resolve(Modules.PRICING)

  try {
    // Get all sellers
    const { data: sellers } = await query.graph({
      entity: "seller",
      fields: ["id", "name"],
    })

    // Get existing seller-shipping-option links
    const { data: existingLinks } = await query.graph({
      entity: "seller_shipping_option",
      fields: ["seller_id", "shipping_option_id"],
    })

    // Find sellers without shipping options
    const sellersWithOptions = new Set(existingLinks.map((l: any) => l.seller_id))
    const sellersWithoutOptions = sellers.filter((s: any) => !sellersWithOptions.has(s.id))

    if (sellersWithoutOptions.length === 0) {
      return res.json({
        success: true,
        message: "All sellers already have shipping options",
        sellers_with_options: sellers.map((s: any) => s.name),
      })
    }

    // Get the reference shipping option (Standard Shipping) for configuration
    const existingOptions = await fulfillmentModuleService.listShippingOptions(
      { name: "Standard Shipping" },
      { relations: ["rules"] }
    )

    if (!existingOptions.length) {
      return res.status(400).json({
        success: false,
        error: "No reference shipping option found (Standard Shipping)",
      })
    }

    const referenceOption = existingOptions[0]
    const results: any[] = []

    // For each seller without options, create Standard and Express shipping options
    for (const seller of sellersWithoutOptions) {
      const optionsToCreate = [
        { name: `Standard Shipping`, amount: 10, code: "standard", label: "Standard", description: "Ship in 5-7 business days." },
        { name: `Express Shipping`, amount: 20, code: "express", label: "Express", description: "Ship in 2-3 business days." },
      ]

      for (const optConfig of optionsToCreate) {
        try {
          // Create the shipping option
          const newOption = await fulfillmentModuleService.createShippingOptions({
            name: optConfig.name,
            price_type: "flat",
            service_zone_id: referenceOption.service_zone_id,
            shipping_profile_id: referenceOption.shipping_profile_id,
            provider_id: referenceOption.provider_id,
            type: {
              code: optConfig.code,
              label: optConfig.label,
              description: optConfig.description,
            },
            rules: [
              { attribute: "enabled_in_store", value: "true", operator: "eq" },
              { attribute: "is_return", value: "false", operator: "eq" },
            ],
          })

          // Create price set and prices for the shipping option
          const priceSet = await pricingModuleService.createPriceSets({
            prices: [
              { amount: optConfig.amount, currency_code: "usd" },
              { amount: optConfig.amount, currency_code: "eur" },
            ],
          })

          // Link shipping option to price set
          await link.create({
            [Modules.FULFILLMENT]: { shipping_option_id: newOption.id },
            [Modules.PRICING]: { price_set_id: priceSet.id },
          })

          // Link shipping option to seller
          await link.create({
            seller: { seller_id: seller.id },
            [Modules.FULFILLMENT]: { shipping_option_id: newOption.id },
          })

          results.push({
            action: "created",
            seller_name: seller.name,
            shipping_option_name: optConfig.name,
            shipping_option_id: newOption.id,
            amount: optConfig.amount,
          })
        } catch (e: any) {
          results.push({
            action: "error",
            seller_name: seller.name,
            shipping_option_name: optConfig.name,
            error: e.message,
          })
        }
      }
    }

    res.json({
      success: true,
      message: "Shipping options created for sellers",
      sellers_processed: sellersWithoutOptions.map((s: any) => s.name),
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
