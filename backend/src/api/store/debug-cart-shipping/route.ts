import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { listShippingOptionsForCartWorkflow } from "@medusajs/medusa/core-flows"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cartId = req.query.cart_id as string

  if (!cartId) {
    return res.status(400).json({ error: "cart_id is required" })
  }

  const cartModuleService = req.scope.resolve(Modules.CART)
  const fulfillmentModuleService = req.scope.resolve(Modules.FULFILLMENT)
  const inventoryModuleService = req.scope.resolve(Modules.INVENTORY)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)

  try {
    // Get cart with all relations
    const cart = await cartModuleService.retrieveCart(cartId, {
      relations: ["items", "shipping_address"],
    })

    // Get all shipping options
    const shippingOptions = await fulfillmentModuleService.listShippingOptions(
      {},
      { relations: ["rules", "type"] }
    )

    // Get stock location to sales channel links AND fulfillment sets
    const { data: stockLocationLinks } = await query.graph({
      entity: "stock_location",
      fields: ["id", "name", "sales_channels.*", "fulfillment_sets.*"],
    })

    // Get fulfillment set links
    const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets(
      {},
      { relations: ["service_zones", "service_zones.geo_zones"] }
    )

    // Check product shipping profiles
    const itemProfiles = cart.items?.map((item: any) => ({
      product_id: item.product_id,
      product_title: item.product_title,
      variant_id: item.variant_id,
    }))

    // Get product shipping profile links
    const { data: productLinks } = await query.graph({
      entity: "product",
      fields: ["id", "title", "shipping_profile.*"],
      filters: {
        id: cart.items?.map((i: any) => i.product_id),
      },
    })

    // Get inventory items for cart items
    const variantIds = cart.items?.map((i: any) => i.variant_id) || []
    const { data: inventoryLinks } = await query.graph({
      entity: "product_variant",
      fields: ["id", "inventory_items.*", "inventory_items.inventory.location_levels.*"],
      filters: {
        id: variantIds,
      },
    })

    // Call the actual workflow to see what happens
    let workflowResult = null
    let workflowError = null
    try {
      const { result } = await listShippingOptionsForCartWorkflow(req.scope).run({
        input: {
          cart_id: cartId,
          is_return: false,
        },
      })
      workflowResult = result
    } catch (e: any) {
      workflowError = { message: e.message, stack: e.stack }
    }

    res.json({
      success: true,
      cart: {
        id: cart.id,
        region_id: cart.region_id,
        sales_channel_id: (cart as any).sales_channel_id,
        shipping_address: cart.shipping_address
          ? {
              country_code: cart.shipping_address.country_code,
              city: cart.shipping_address.city,
            }
          : null,
        items: itemProfiles,
      },
      product_shipping_profiles: productLinks,
      stock_locations: stockLocationLinks,
      fulfillment_sets: fulfillmentSets.map((fs) => ({
        id: fs.id,
        name: fs.name,
        type: fs.type,
        service_zones: fs.service_zones?.map((sz) => ({
          id: sz.id,
          name: sz.name,
          geo_zones: sz.geo_zones?.map((gz) => ({
            country_code: gz.country_code,
            type: gz.type,
          })),
        })),
      })),
      shipping_options: shippingOptions.map((opt) => ({
        id: opt.id,
        name: opt.name,
        shipping_profile_id: opt.shipping_profile_id,
        service_zone_id: opt.service_zone_id,
        rules: opt.rules?.map((r: any) => ({
          attribute: r.attribute,
          value: r.value,
        })),
      })),
      inventory_links: inventoryLinks,
      workflow_result: workflowResult,
      workflow_error: workflowError,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
