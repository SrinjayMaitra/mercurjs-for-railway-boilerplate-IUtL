import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const fulfillmentModuleService = req.scope.resolve(Modules.FULFILLMENT)

  try {
    // Get all shipping options
    const shippingOptions = await fulfillmentModuleService.listShippingOptions({})

    const results: any[] = []

    for (const option of shippingOptions) {
      // Check if option already has enabled_in_store rule
      const hasEnabledRule = option.rules?.some(
        (rule: any) => rule.attribute === "enabled_in_store"
      )
      const hasReturnRule = option.rules?.some(
        (rule: any) => rule.attribute === "is_return"
      )

      if (!hasEnabledRule || !hasReturnRule) {
        // Update the shipping option with required rules
        const newRules = [...(option.rules || [])]

        if (!hasEnabledRule) {
          newRules.push({
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          })
        }

        if (!hasReturnRule) {
          newRules.push({
            attribute: "is_return",
            value: "false",
            operator: "eq",
          })
        }

        await fulfillmentModuleService.updateShippingOptions(option.id, {
          rules: newRules,
        })

        results.push({
          id: option.id,
          name: option.name,
          action: "added_rules",
          rules_added: newRules.filter(
            (r: any) =>
              !option.rules?.some((or: any) => or.attribute === r.attribute)
          ),
        })
      } else {
        results.push({
          id: option.id,
          name: option.name,
          action: "already_has_rules",
        })
      }
    }

    res.json({
      success: true,
      message: "Shipping options rules updated",
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
