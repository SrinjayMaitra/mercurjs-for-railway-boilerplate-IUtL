import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productModuleService = req.scope.resolve(Modules.PRODUCT)

  try {
    const products = await productModuleService.listProducts(
      {},
      { relations: ["tags"] }
    )

    res.json({
      success: true,
      products: products.map((p: any) => ({
        id: p.id,
        title: p.title,
        tags: p.tags?.map((t: any) => t.value) || [],
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
  const productModuleService = req.scope.resolve(Modules.PRODUCT)

  // Demo product handles to delete (seed data products)
  const demoHandles = [
    "shoe",
    "runningshoe",
    "jacket",
    "smart-watch",
    "hoodie",
    "silk-satin",
    "garden-gloves",
  ]

  try {
    // Get all products
    const products = await productModuleService.listProducts(
      {},
      { relations: ["tags"] }
    )

    // Find demo products by handle
    const demoProducts = products.filter((p: any) =>
      demoHandles.includes(p.handle)
    )

    const results: any[] = []

    // Delete each demo product
    for (const product of demoProducts) {
      try {
        await productModuleService.deleteProducts([product.id])
        results.push({
          id: product.id,
          title: product.title,
          action: "deleted",
        })
      } catch (e: any) {
        results.push({
          id: product.id,
          title: product.title,
          action: "error",
          error: e.message,
        })
      }
    }

    res.json({
      success: true,
      message: `Deleted ${results.filter(r => r.action === "deleted").length} demo products`,
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
