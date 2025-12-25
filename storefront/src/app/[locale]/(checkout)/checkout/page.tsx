import PaymentWrapper from "@/components/organisms/PaymentContainer/PaymentWrapper"
import { CartAddressSection } from "@/components/sections/CartAddressSection/CartAddressSection"
import CartPaymentSection from "@/components/sections/CartPaymentSection/CartPaymentSection"
import CartReview from "@/components/sections/CartReview/CartReview"

import CartShippingMethodsSection from "@/components/sections/CartShippingMethodsSection/CartShippingMethodsSection"
import { retrieveCart } from "@/lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import { listCartShippingMethods } from "@/lib/data/fulfillment"
import { listCartPaymentMethods } from "@/lib/data/payment"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Checkout",
  description: "My cart page - Checkout",
}

export default async function CheckoutPage({}) {
  return (
    <Suspense
      fallback={
        <div className="container flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  )
}

async function CheckoutPageContent({}) {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const shippingMethods = await listCartShippingMethods(cart.id, false)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")
  const customer = await retrieveCustomer()

  // Debug: Log cart and shipping info
  console.log("[DEBUG] Checkout - Cart ID:", cart.id)
  console.log("[DEBUG] Checkout - Cart Region:", cart.region?.id, cart.region?.name)
  console.log("[DEBUG] Checkout - Cart Region Countries:", cart.region?.countries)
  console.log("[DEBUG] Checkout - Shipping Address:", JSON.stringify(cart.shipping_address))
  console.log("[DEBUG] Checkout - Shipping Methods Available:", shippingMethods?.length || 0)
  console.log("[DEBUG] Checkout - Shipping Methods:", JSON.stringify(shippingMethods))

  return (
    <PaymentWrapper cart={cart}>
      <main className="container">
        <div className="grid lg:grid-cols-11 gap-8">
          <div className="flex flex-col gap-4 lg:col-span-6">
            <CartAddressSection cart={cart} customer={customer} />
            <CartShippingMethodsSection
              cart={cart}
              availableShippingMethods={shippingMethods as any}
            />
            <CartPaymentSection
              cart={cart}
              availablePaymentMethods={paymentMethods}
            />
          </div>

          <div className="lg:col-span-5">
            <CartReview cart={cart} />
          </div>
        </div>
      </main>
    </PaymentWrapper>
  )
}
