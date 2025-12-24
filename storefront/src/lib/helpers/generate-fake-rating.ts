/**
 * Generate a consistent fake rating for a product based on its ID
 * This ensures the same product always gets the same rating
 */
export function generateFakeRating(productId: string): {
  rating: number
  reviewCount: number
} {
  // Use product ID to generate a consistent hash
  let hash = 0
  for (let i = 0; i < productId.length; i++) {
    const char = productId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Generate rating between 4.0 and 5.0 (good ratings) with more variation
  // Common ratings: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0
  const ratingOptions = [4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 4.1, 4.0]
  const rating = ratingOptions[Math.abs(hash) % ratingOptions.length]
  
  // Generate review count between 15 and 250
  const reviewCount = 15 + (Math.abs(hash * 7) % 236)

  return {
    rating: Math.round(rating * 10) / 10, // Round to 1 decimal
    reviewCount,
  }
}

