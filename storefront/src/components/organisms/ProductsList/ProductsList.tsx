import { ProductCard } from "../ProductCard/ProductCard"
import { DummyProductCard } from "../ProductCard/DummyProductCard"
import { HttpTypes } from "@medusajs/types"
import { generateFakeRating } from "@/lib/helpers/generate-fake-rating"

const DUMMY_PRODUCTS = [
  {
    id: "dummy-1",
    title: "Classic Leather Jacket",
    handle: "classic-leather-jacket",
    thumbnail: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    price: "$299.00",
    originalPrice: "$399.00",
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
    originalPrice: "$599.00",
  },
  {
    id: "dummy-5",
    title: "Canvas Low-Top Sneakers",
    handle: "canvas-sneakers",
    thumbnail: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=500&fit=crop",
    price: "$79.00",
  },
  {
    id: "dummy-6",
    title: "Cashmere Blend Scarf",
    handle: "silk-blend-scarf",
    thumbnail: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop",
    price: "$65.00",
  },
  {
    id: "dummy-7",
    title: "Minimalist Chronograph Watch",
    handle: "minimalist-watch",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop",
    price: "$199.00",
    originalPrice: "$249.00",
  },
  {
    id: "dummy-8",
    title: "Leather Crossbody Bag",
    handle: "leather-crossbody-bag",
    thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop",
    price: "$179.00",
  },
  {
    id: "dummy-9",
    title: "Vintage Denim Jacket",
    handle: "vintage-denim-jacket",
    thumbnail: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop",
    price: "$129.00",
  },
  {
    id: "dummy-10",
    title: "Athletic Running Shoes",
    handle: "athletic-running-shoes",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
    price: "$145.00",
    originalPrice: "$180.00",
  },
  {
    id: "dummy-11",
    title: "Oversized Knit Sweater",
    handle: "oversized-knit-sweater",
    thumbnail: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=500&fit=crop",
    price: "$89.00",
  },
  {
    id: "dummy-12",
    title: "Designer Sunglasses",
    handle: "designer-sunglasses",
    thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop",
    price: "$159.00",
  },
  {
    id: "dummy-13",
    title: "Premium Backpack",
    handle: "premium-backpack",
    thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
    price: "$129.00",
  },
  {
    id: "dummy-14",
    title: "Linen Summer Dress",
    handle: "linen-summer-dress",
    thumbnail: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    price: "$119.00",
    originalPrice: "$159.00",
  },
  {
    id: "dummy-15",
    title: "Suede Chelsea Boots",
    handle: "suede-chelsea-boots",
    thumbnail: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&h=500&fit=crop",
    price: "$189.00",
  },
  {
    id: "dummy-16",
    title: "Wireless Headphones",
    handle: "wireless-headphones",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop",
    price: "$249.00",
    originalPrice: "$299.00",
  },
  {
    id: "dummy-17",
    title: "Designer Blazer",
    handle: "designer-blazer",
    thumbnail: "https://images.unsplash.com/photo-1594938291221-94f18c0d0b7c?w=400&h=500&fit=crop",
    price: "$349.00",
    originalPrice: "$449.00",
  },
  {
    id: "dummy-18",
    title: "Silk Evening Dress",
    handle: "silk-evening-dress",
    thumbnail: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    price: "$279.00",
  },
  {
    id: "dummy-19",
    title: "High-Waisted Trousers",
    handle: "high-waisted-trousers",
    thumbnail: "https://images.unsplash.com/photo-1624378515194-6e8c0c687447?w=400&h=500&fit=crop",
    price: "$129.00",
  },
  {
    id: "dummy-20",
    title: "Oversized Blazer Coat",
    handle: "oversized-blazer-coat",
    thumbnail: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop",
    price: "$399.00",
    originalPrice: "$499.00",
  },
  {
    id: "dummy-21",
    title: "Chic Midi Skirt",
    handle: "chic-midi-skirt",
    thumbnail: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    price: "$89.00",
  },
  {
    id: "dummy-22",
    title: "Tailored Suit Set",
    handle: "tailored-suit-set",
    thumbnail: "https://images.unsplash.com/photo-1594938291221-94f18c0d0b7c?w=400&h=500&fit=crop",
    price: "$549.00",
    originalPrice: "$699.00",
  },
  {
    id: "dummy-23",
    title: "Floral Maxi Dress",
    handle: "floral-maxi-dress",
    thumbnail: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    price: "$159.00",
  },
  {
    id: "dummy-24",
    title: "Wide-Leg Palazzo Pants",
    handle: "wide-leg-palazzo-pants",
    thumbnail: "https://images.unsplash.com/photo-1624378515194-6e8c0c687447?w=400&h=500&fit=crop",
    price: "$119.00",
  },
  {
    id: "dummy-25",
    title: "Structured Shoulder Bag",
    handle: "structured-shoulder-bag",
    thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop",
    price: "$199.00",
    originalPrice: "$249.00",
  },
  {
    id: "dummy-26",
    title: "Cashmere Turtleneck",
    handle: "cashmere-turtleneck",
    thumbnail: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=500&fit=crop",
    price: "$149.00",
  },
  {
    id: "dummy-27",
    title: "Pleated A-Line Skirt",
    handle: "pleated-a-line-skirt",
    thumbnail: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    price: "$99.00",
  },
  {
    id: "dummy-28",
    title: "Double-Breasted Coat",
    handle: "double-breasted-coat",
    thumbnail: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop",
    price: "$429.00",
    originalPrice: "$549.00",
  },
  {
    id: "dummy-29",
    title: "Ribbed Knit Dress",
    handle: "ribbed-knit-dress",
    thumbnail: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    price: "$139.00",
  },
  {
    id: "dummy-30",
    title: "Cargo Pants",
    handle: "cargo-pants",
    thumbnail: "https://images.unsplash.com/photo-1624378515194-6e8c0c687447?w=400&h=500&fit=crop",
    price: "$109.00",
  },
]

// Minimum number of products to display
const MIN_PRODUCTS_TO_SHOW = 12

export const ProductsList = ({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) => {
  // Calculate how many dummy products we need to fill the grid
  const dummyCount = Math.max(0, MIN_PRODUCTS_TO_SHOW - products.length)
  const dummyProductsToShow = DUMMY_PRODUCTS.slice(0, dummyCount)

  return (
    <>
      {/* Show real products first */}
      {products.map((product) => {
        const { rating, reviewCount } = generateFakeRating(product.id)
        return (
          <ProductCard
            key={product.id}
            product={product}
            api_product={product}
            rating={rating}
            reviewCount={reviewCount}
          />
        )
      })}
      {/* Fill remaining space with dummy products */}
      {dummyProductsToShow.map((product) => (
        <DummyProductCard key={product.id} product={product} />
      ))}
    </>
  )
}
