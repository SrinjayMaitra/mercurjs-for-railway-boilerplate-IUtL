import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const variantId = req.query.variant_id as string
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const inventoryModuleService = req.scope.resolve(Modules.INVENTORY)

  try {
    // Get inventory levels for all items
    const inventoryLevels = await inventoryModuleService.listInventoryLevels({})

    // Get all inventory items
    const inventoryItems = await inventoryModuleService.listInventoryItems({})

    // Get variant to inventory links
    const { data: variantInventory } = await query.graph({
      entity: "product_variant",
      fields: ["id", "title", "sku", "inventory_items.*"],
    })

    res.json({
      success: true,
      inventory_levels: inventoryLevels.map(level => ({
        id: level.id,
        inventory_item_id: level.inventory_item_id,
        location_id: level.location_id,
        stocked_quantity: level.stocked_quantity,
        reserved_quantity: level.reserved_quantity,
        available_quantity: level.available_quantity,
      })),
      inventory_items: inventoryItems.map(item => ({
        id: item.id,
        sku: item.sku,
        title: item.title,
      })),
      variant_inventory: variantInventory,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
