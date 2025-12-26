import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: ["id", "name", "handle", "parent_category_id", "parent_category.name"],
    })

    res.json({
      success: true,
      categories: categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        handle: c.handle,
        parent_category_id: c.parent_category_id,
        parent_name: c.parent_category?.name || null,
      })),
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const productModuleService = req.scope.resolve(Modules.PRODUCT)

  try {
    // Get all categories
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: ["id", "name", "handle", "parent_category_id"],
    })

    // Find Fashion category (parent)
    const fashionCategory = categories.find((c: any) => c.name === "Fashion" || c.handle === "fashion")

    if (!fashionCategory) {
      return res.status(400).json({
        success: false,
        error: "Fashion category not found",
      })
    }

    // Categories to update (make them children of Fashion)
    const categoriesToUpdate = ["Luxury", "Vintage", "Casual", "Streetwear", "Y2K"]

    const results: any[] = []

    for (const catName of categoriesToUpdate) {
      const category = categories.find((c: any) => c.name === catName)

      if (category) {
        if (category.parent_category_id === fashionCategory.id) {
          results.push({
            name: catName,
            action: "already_child_of_fashion",
          })
        } else {
          await productModuleService.updateProductCategories(category.id, {
            parent_category_id: fashionCategory.id,
          })
          results.push({
            name: catName,
            action: "updated",
            new_parent: "Fashion",
          })
        }
      } else {
        results.push({
          name: catName,
          action: "not_found",
        })
      }
    }

    res.json({
      success: true,
      fashion_category_id: fashionCategory.id,
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
