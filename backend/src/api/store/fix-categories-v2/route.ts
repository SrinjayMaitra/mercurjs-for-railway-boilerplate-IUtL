import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const productModuleService = req.scope.resolve(Modules.PRODUCT)

  try {
    // Get all categories
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: ["id", "name", "handle", "parent_category_id"],
    })

    // Find Luxury category
    const luxuryCategory = categories.find((c: any) => c.name === "Luxury" || c.handle === "luxury")

    if (!luxuryCategory) {
      return res.status(400).json({
        success: false,
        error: "Luxury category not found",
      })
    }

    // Move Luxury back to root (no parent)
    await productModuleService.updateProductCategories(luxuryCategory.id, {
      parent_category_id: null,
    })

    res.json({
      success: true,
      message: "Luxury category moved back to root level",
      luxury_id: luxuryCategory.id,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
