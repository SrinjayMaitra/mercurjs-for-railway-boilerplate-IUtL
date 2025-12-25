import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const fulfillmentModuleService = req.scope.resolve(Modules.FULFILLMENT)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Get all shipping options
    const shippingOptions = await fulfillmentModuleService.listShippingOptions({})

    // Get all fulfillment sets
    const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({})

    // Get all service zones
    const serviceZones = await fulfillmentModuleService.listServiceZones({})

    // Get all shipping profiles
    const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({})

    // Get stock locations with fulfillment
    const { data: stockLocations } = await query.graph({
      entity: "stock_location",
      fields: ["id", "name", "address.*"],
    })

    res.json({
      success: true,
      data: {
        shipping_options: shippingOptions.map(opt => ({
          id: opt.id,
          name: opt.name,
          price_type: opt.price_type,
          service_zone_id: opt.service_zone_id,
          shipping_profile_id: opt.shipping_profile_id,
          provider_id: opt.provider_id,
          rules: opt.rules,
        })),
        fulfillment_sets: fulfillmentSets.map(fs => ({
          id: fs.id,
          name: fs.name,
          type: fs.type,
          service_zones: fs.service_zones?.map(sz => ({
            id: sz.id,
            name: sz.name,
            geo_zones: sz.geo_zones,
          })),
        })),
        service_zones: serviceZones.map(sz => ({
          id: sz.id,
          name: sz.name,
          fulfillment_set_id: sz.fulfillment_set_id,
          geo_zones: sz.geo_zones,
        })),
        shipping_profiles: shippingProfiles.map(sp => ({
          id: sp.id,
          name: sp.name,
          type: sp.type,
        })),
        stock_locations: stockLocations,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
