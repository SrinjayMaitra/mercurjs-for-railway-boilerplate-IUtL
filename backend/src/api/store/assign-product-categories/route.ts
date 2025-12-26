import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const productModuleService = req.scope.resolve(Modules.PRODUCT)

  try {
    // Get all products
    const products = await productModuleService.listProducts(
      {},
      { relations: ["categories"] }
    )

    // Get all categories
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: ["id", "name", "handle"],
    })

    res.json({
      success: true,
      products: products.map((p: any) => ({
        id: p.id,
        title: p.title,
        categories: p.categories?.map((c: any) => c.name) || [],
      })),
      categories: categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        handle: c.handle,
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
      fields: ["id", "name", "handle"],
    })

    // Get all products
    const products = await productModuleService.listProducts({})

    // Map category names to IDs
    const categoryMap: Record<string, string> = {}
    for (const cat of categories) {
      categoryMap[(cat as any).name.toLowerCase()] = (cat as any).id
      categoryMap[(cat as any).handle.toLowerCase()] = (cat as any).id
    }

    // Product to category mapping based on product title
    const productCategoryMapping: Record<string, string> = {
      "luxury tuxedo": "luxury",
      "vintage shirt": "vintage",
      "casual shoes": "casual",
      "streetwear pants": "streetwear",
      "y2k pants": "y2k",
    }

    const results: any[] = []

    for (const product of products) {
      const titleLower = product.title.toLowerCase()
      const targetCategoryKey = productCategoryMapping[titleLower]

      if (targetCategoryKey && categoryMap[targetCategoryKey]) {
        const categoryId = categoryMap[targetCategoryKey]

        try {
          // Update product with category using productModuleService
          await productModuleService.updateProducts(product.id, {
            categories: [{ id: categoryId }],
          })

          results.push({
            product: product.title,
            category: targetCategoryKey,
            categoryId: categoryId,
            action: "linked",
          })
        } catch (e: any) {
          results.push({
            product: product.title,
            category: targetCategoryKey,
            action: "error",
            error: e.message,
          })
        }
      } else {
        results.push({
          product: product.title,
          action: "skipped",
          reason: "no matching category",
        })
      }
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
