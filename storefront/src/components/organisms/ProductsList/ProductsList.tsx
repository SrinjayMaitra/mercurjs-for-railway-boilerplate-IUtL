import { ProductCard } from "../ProductCard/ProductCard"
import { DummyProductCard } from "../ProductCard/DummyProductCard"
import { HttpTypes } from "@medusajs/types"

const DUMMY_PRODUCTS = [
  {
    id: "dummy-1",
    title: "Classic Leather Jacket",
    handle: "classic-leather-jacket",
    thumbnail: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    price: "$299.00",
  },
  {
    id: "dummy-2",
    title: "Premium Cotton T-Shirt",
    handle: "premium-cotton-tshirt",
    thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    price: "$49.00",
  },
  {
    id: "dummy-3",
    title: "Slim Fit Denim Jeans",
    handle: "slim-fit-denim-jeans",
    thumbnail: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    price: "$89.00",
  },
  {
    id: "dummy-4",
    title: "Wool Blend Overcoat",
    handle: "wool-blend-overcoat",
    thumbnail: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop",
    price: "$449.00",
  },
  {
    id: "dummy-5",
    title: "Canvas Sneakers",
    handle: "canvas-sneakers",
    thumbnail: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=500&fit=crop",
    price: "$79.00",
  },
  {
    id: "dummy-6",
    title: "Silk Blend Scarf",
    handle: "silk-blend-scarf",
    thumbnail: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop",
    price: "$65.00",
  },
  {
    id: "dummy-7",
    title: "Minimalist Watch",
    handle: "minimalist-watch",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop",
    price: "$199.00",
  },
  {
    id: "dummy-8",
    title: "Leather Crossbody Bag",
    handle: "leather-crossbody-bag",
    thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop",
    price: "$179.00",
  },
]

export const ProductsList = ({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) => {
  // If there are real products, show them
  if (products.length > 0) {
    return (
      <>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} api_product={product} />
        ))}
      </>
    )
  }

  // Otherwise show dummy products
  return (
    <>
      {DUMMY_PRODUCTS.map((product) => (
        <DummyProductCard key={product.id} product={product} />
      ))}
    </>
  )
}
