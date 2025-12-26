import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

// Products that were accidentally deleted - restoring them
const productsToRestore = [
  {
    title: "Canvas",
    handle: "shoe",
    description: "Classic canvas sneakers",
    status: "published",
    options: [{ title: "Size", values: ["38", "39", "40", "41", "42"] }],
    variants: [
      {
        title: "Canvas - 40",
        options: { Size: "40" },
        prices: [{ amount: 4999, currency_code: "eur" }],
        manage_inventory: false,
      },
    ],
    tags: ["men", "women"],
  },
  {
    title: "Running",
    handle: "runningshoe",
    description: "Performance running shoes",
    status: "published",
    options: [{ title: "Size", values: ["38", "39", "40", "41", "42"] }],
    variants: [
      {
        title: "Running - 41",
        options: { Size: "41" },
        prices: [{ amount: 8999, currency_code: "eur" }],
        manage_inventory: false,
      },
    ],
    tags: ["men", "sports", "women"],
  },
  {
    title: "Jacket",
    handle: "jacket",
    description: "Stylish jacket for all seasons",
    status: "published",
    options: [{ title: "Size", values: ["S", "M", "L", "XL"] }],
    variants: [
      {
        title: "Jacket - M",
        options: { Size: "M" },
        prices: [{ amount: 12999, currency_code: "eur" }],
        manage_inventory: false,
      },
    ],
    tags: ["men", "women"],
  },
  {
    title: "SmartWatch",
    handle: "smart-watch",
    description: "Smart watch with fitness tracking",
    status: "published",
    options: [{ title: "Color", values: ["Black", "Silver", "Gold"] }],
    variants: [
      {
        title: "SmartWatch - Black",
        options: { Color: "Black" },
        prices: [{ amount: 19999, currency_code: "eur" }],
        manage_inventory: false,
      },
    ],
    tags: ["men", "women", "sports"],
  },
  {
    title: "Hoodie",
    handle: "hoodie",
    description: "Comfortable cotton hoodie",
    status: "published",
    options: [{ title: "Size", values: ["S", "M", "L", "XL"] }],
    variants: [
      {
        title: "Hoodie - L",
        options: { Size: "L" },
        prices: [{ amount: 5999, currency_code: "eur" }],
        manage_inventory: false,
      },
    ],
    tags: ["men", "women"],
  },
  {
    title: "Silk Satin",
    handle: "silk-satin",
    description: "Luxurious silk satin fabric",
    status: "published",
    options: [{ title: "Color", values: ["Red", "Blue", "White"] }],
    variants: [
      {
        title: "Silk Satin - White",
        options: { Color: "White" },
        prices: [{ amount: 7999, currency_code: "eur" }],
        manage_inventory: false,
      },
    ],
    tags: ["women"],
  },
  {
    title: "Garden Gloves",
    handle: "garden-gloves",
    description: "Durable gardening gloves",
    status: "published",
    options: [{ title: "Size", values: ["S", "M", "L"] }],
    variants: [
      {
        title: "Garden Gloves - M",
        options: { Size: "M" },
        prices: [{ amount: 1999, currency_code: "eur" }],
        manage_inventory: false,
      },
    ],
    tags: ["men", "women"],
  },
]

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const productModuleService = req.scope.resolve(Modules.PRODUCT)

  try {
    const results: any[] = []

    for (const productData of productsToRestore) {
      try {
        // Check if product already exists
        const existing = await productModuleService.listProducts({
          handle: productData.handle,
        })

        if (existing.length > 0) {
          results.push({
            title: productData.title,
            action: "skipped",
            reason: "already exists",
          })
          continue
        }

        // Create the product
        const product = await productModuleService.createProducts({
          title: productData.title,
          handle: productData.handle,
          description: productData.description,
          status: productData.status as any,
          options: productData.options,
          variants: productData.variants,
        })

        // Add tags
        if (productData.tags && productData.tags.length > 0) {
          const tagValues = productData.tags.map((t) => ({ value: t }))
          await productModuleService.createProductTags(tagValues)
        }

        results.push({
          id: product.id,
          title: productData.title,
          action: "created",
        })
      } catch (e: any) {
        results.push({
          title: productData.title,
          action: "error",
          error: e.message,
        })
      }
    }

    res.json({
      success: true,
      message: `Restored ${results.filter((r) => r.action === "created").length} products`,
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

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({
    message: "POST to this endpoint to restore accidentally deleted products",
    products: productsToRestore.map((p) => p.title),
  })
}
