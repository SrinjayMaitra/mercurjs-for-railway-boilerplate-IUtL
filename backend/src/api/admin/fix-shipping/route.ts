import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
} from "@medusajs/medusa/core-flows"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const fulfillmentModuleService = req.scope.resolve(Modules.FULFILLMENT)
  const regionModuleService = req.scope.resolve(Modules.REGION)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)

  try {
    // Get all existing data
    const shippingOptions = await fulfillmentModuleService.listShippingOptions({})
    const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({})
    const serviceZones = await fulfillmentModuleService.listServiceZones({})
    const regions = await regionModuleService.listRegions({})

    // Get stock locations
    const { data: stockLocations } = await query.graph({
      entity: "stock_location",
      fields: ["id", "name"],
    })

    const results: any = {
      existing: {
        shipping_options: shippingOptions.length,
        fulfillment_sets: fulfillmentSets.length,
        service_zones: serviceZones.length,
        stock_locations: stockLocations.length,
        regions: regions.length,
      },
      actions: [],
    }

    // Check if we need to create a fulfillment set
    if (fulfillmentSets.length === 0 && stockLocations.length > 0) {
      const countries = ["us", "ca", "gb", "de", "fr", "es", "it"]

      const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
        name: "Store Shipping",
        type: "shipping",
        service_zones: [
          {
            name: "Global",
            geo_zones: countries.map(country_code => ({
              country_code,
              type: "country" as const,
            })),
          },
        ],
      })

      // Link to stock location
      await link.create({
        [Modules.STOCK_LOCATION]: {
          stock_location_id: stockLocations[0].id,
        },
        [Modules.FULFILLMENT]: {
          fulfillment_set_id: fulfillmentSet.id,
        },
      })

      results.actions.push(`Created fulfillment set: ${fulfillmentSet.name}`)
      results.fulfillment_set = fulfillmentSet
    }

    // Get or create shipping profile
    let shippingProfiles = await fulfillmentModuleService.listShippingProfiles({ type: "default" })
    let shippingProfile = shippingProfiles[0]

    if (!shippingProfile) {
      const { result: shippingProfileResult } = await createShippingProfilesWorkflow(req.scope).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      })
      shippingProfile = shippingProfileResult[0]
      results.actions.push(`Created shipping profile: ${shippingProfile.name}`)
    }

    // Check if we need to create shipping options
    const updatedServiceZones = await fulfillmentModuleService.listServiceZones({})

    if (shippingOptions.length === 0 && updatedServiceZones.length > 0) {
      const serviceZone = updatedServiceZones[0]

      await createShippingOptionsWorkflow(req.scope).run({
        input: [
          {
            name: "Standard Shipping",
            price_type: "flat",
            provider_id: "manual_manual",
            service_zone_id: serviceZone.id,
            shipping_profile_id: shippingProfile.id,
            type: {
              label: "Standard",
              description: "Ship in 5-7 business days.",
              code: "standard",
            },
            prices: [
              { currency_code: "usd", amount: 10 },
              { currency_code: "eur", amount: 10 },
              ...regions.map(region => ({ region_id: region.id, amount: 10 })),
            ],
            rules: [
              { attribute: "enabled_in_store", value: "true", operator: "eq" },
              { attribute: "is_return", value: "false", operator: "eq" },
            ],
          },
          {
            name: "Express Shipping",
            price_type: "flat",
            provider_id: "manual_manual",
            service_zone_id: serviceZone.id,
            shipping_profile_id: shippingProfile.id,
            type: {
              label: "Express",
              description: "Ship in 2-3 business days.",
              code: "express",
            },
            prices: [
              { currency_code: "usd", amount: 20 },
              { currency_code: "eur", amount: 20 },
              ...regions.map(region => ({ region_id: region.id, amount: 20 })),
            ],
            rules: [
              { attribute: "enabled_in_store", value: "true", operator: "eq" },
              { attribute: "is_return", value: "false", operator: "eq" },
            ],
          },
        ],
      })

      results.actions.push("Created Standard Shipping and Express Shipping options")
    }

    // If shipping options exist but may not be properly configured
    if (shippingOptions.length > 0 && updatedServiceZones.length > 0) {
      results.note = "Shipping options already exist. Check if they have the correct service_zone_id and rules."
      results.service_zone_ids = updatedServiceZones.map(sz => ({ id: sz.id, name: sz.name }))
      results.shipping_option_details = shippingOptions.map(opt => ({
        id: opt.id,
        name: opt.name,
        service_zone_id: opt.service_zone_id,
        has_rules: opt.rules?.length > 0,
      }))
    }

    res.json({
      success: true,
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
