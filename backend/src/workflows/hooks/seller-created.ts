import { createSellerWorkflow } from "@mercurjs/b2c-core/workflows"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// Hook into the sellerCreated hook from createSellerWorkflow
createSellerWorkflow.hooks.sellerCreated(
  async ({ sellerId }, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const link = container.resolve(ContainerRegistrationKeys.LINK)
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
    const pricingModuleService = container.resolve(Modules.PRICING)

    console.log(`[HOOK] Creating shipping options for new seller: ${sellerId}`)

    try {
      // Get the seller name
      const { data: [seller] } = await query.graph({
        entity: "seller",
        fields: ["id", "name"],
        filters: { id: sellerId },
      })

      if (!seller) {
        console.error(`[HOOK] Seller not found: ${sellerId}`)
        return
      }

      // Get a reference shipping option for configuration (service_zone_id, etc.)
      const existingOptions = await fulfillmentModuleService.listShippingOptions(
        {},
        { relations: ["rules"], take: 1 }
      )

      if (!existingOptions.length) {
        console.error(`[HOOK] No reference shipping option found`)
        return
      }

      const referenceOption = existingOptions[0]

      // Create Standard and Express shipping options for the new seller
      const optionsToCreate = [
        { name: "Standard Shipping", amount: 10, code: "standard", label: "Standard", description: "Ship in 5-7 business days." },
        { name: "Express Shipping", amount: 20, code: "express", label: "Express", description: "Ship in 2-3 business days." },
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
            seller: { seller_id: sellerId },
            [Modules.FULFILLMENT]: { shipping_option_id: newOption.id },
          })

          console.log(`[HOOK] Created ${optConfig.name} for seller ${seller.name}`)
        } catch (e: any) {
          console.error(`[HOOK] Error creating ${optConfig.name} for seller ${seller.name}:`, e.message)
        }
      }

      console.log(`[HOOK] Finished creating shipping options for seller: ${seller.name}`)
    } catch (error: any) {
      console.error(`[HOOK] Error in sellerCreated hook:`, error.message)
    }
  }
)
