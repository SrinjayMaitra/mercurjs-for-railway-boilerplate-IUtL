import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)
  const fulfillmentModuleService = req.scope.resolve(Modules.FULFILLMENT)

  try {
    // Get stock locations
    const { data: stockLocations } = await query.graph({
      entity: "stock_location",
      fields: ["id", "name", "fulfillment_sets.*", "sales_channels.*"],
    })

    // Get fulfillment sets
    const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets(
      {},
      { relations: ["service_zones"] }
    )

    const results: any[] = []

    // Find the Main Warehouse and link it to the shipping fulfillment set
    const mainWarehouse = stockLocations.find((sl: any) => sl.name === "Main Warehouse")
    const shippingFulfillmentSet = fulfillmentSets.find(
      (fs) => fs.name === "Main Warehouse delivery" && fs.type === "shipping"
    )

    if (mainWarehouse && shippingFulfillmentSet) {
      // Check if already linked
      const existingLink = mainWarehouse.fulfillment_sets?.find(
        (fs: any) => fs.id === shippingFulfillmentSet.id
      )

      if (!existingLink) {
        await link.create({
          [Modules.STOCK_LOCATION]: {
            stock_location_id: mainWarehouse.id,
          },
          [Modules.FULFILLMENT]: {
            fulfillment_set_id: shippingFulfillmentSet.id,
          },
        })

        results.push({
          action: "linked",
          stock_location: mainWarehouse.name,
          fulfillment_set: shippingFulfillmentSet.name,
        })
      } else {
        results.push({
          action: "already_linked",
          stock_location: mainWarehouse.name,
          fulfillment_set: shippingFulfillmentSet.name,
        })
      }
    }

    // Also try to link any other stock locations to their corresponding fulfillment sets
    for (const stockLocation of stockLocations) {
      const matchingShippingSet = fulfillmentSets.find(
        (fs) => fs.name.includes(stockLocation.name) && fs.type === "shipping"
      )

      if (matchingShippingSet) {
        const existingLink = stockLocation.fulfillment_sets?.find(
          (fs: any) => fs.id === matchingShippingSet.id
        )

        if (!existingLink) {
          await link.create({
            [Modules.STOCK_LOCATION]: {
              stock_location_id: stockLocation.id,
            },
            [Modules.FULFILLMENT]: {
              fulfillment_set_id: matchingShippingSet.id,
            },
          })

          results.push({
            action: "linked",
            stock_location: stockLocation.name,
            fulfillment_set: matchingShippingSet.name,
          })
        }
      }
    }

    res.json({
      success: true,
      message: "Stock location to fulfillment set links created",
      results,
      debug: {
        stock_locations: stockLocations.map((sl: any) => ({
          id: sl.id,
          name: sl.name,
          has_fulfillment_sets: !!sl.fulfillment_sets?.length,
        })),
        fulfillment_sets: fulfillmentSets.map((fs) => ({
          id: fs.id,
          name: fs.name,
          type: fs.type,
          has_service_zones: !!fs.service_zones?.length,
        })),
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
