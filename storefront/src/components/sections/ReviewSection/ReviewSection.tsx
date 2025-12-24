"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"

interface Review {
  id: number
  name: string
  role: string
  avatar: string
  rating: number
  text: string
  date: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Verified Buyer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Absolutely love this marketplace! Found amazing vintage pieces I couldn't find anywhere else. The sellers are responsive and shipping was fast.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Top Seller",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Best platform for selling my curated collection. The interface is clean, fees are fair, and I've built a loyal customer base here.",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Verified Buyer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "The quality of products here is unmatched. Every purchase has exceeded my expectations. This is my go-to for unique fashion finds!",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Verified Buyer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Incredible selection and the customer service is top-notch. Had a small issue with sizing and it was resolved immediately.",
    date: "1 week ago",
  },
  {
    id: 5,
    name: "Olivia Garcia",
    role: "Top Seller",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Started selling here 6 months ago and it's been life-changing. The exposure and tools provided make running my business so much easier.",
    date: "2 months ago",
  },
  {
    id: 6,
    name: "David Park",
    role: "Verified Buyer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Found exactly what I was looking for at great prices. The authenticity guarantee gives me confidence in every purchase.",
    date: "4 weeks ago",
  },
]

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-4 h-4 ${filled ? "text-[#d2ff1f]" : "text-white/20"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const ReviewCard = ({ review, index }: { review: Review; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#d2ff1f]/30 transition-all duration-300 group"
  >
    {/* Stars */}
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} filled={i < review.rating} />
      ))}
    </div>

    {/* Review Text */}
    <p className="text-white/80 text-sm leading-relaxed mb-6 line-clamp-4">
      &ldquo;{review.text}&rdquo;
    </p>

    {/* Author */}
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-[#d2ff1f]/50 transition-all duration-300">
        <Image
          src={review.avatar}
          alt={review.name}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <p className="text-white font-medium text-sm">{review.name}</p>
        <p className="text-[#d2ff1f] text-xs">{review.role}</p>
      </div>
      <span className="ml-auto text-white/40 text-xs">{review.date}</span>
    </div>
  </motion.div>
)

export function ReviewSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-rotate featured review
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="bg-[#0a0a0a] py-16 lg:py-24 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 bg-[#d2ff1f]/10 text-[#d2ff1f] text-xs font-semibold rounded-full mb-4 border border-[#d2ff1f]/30"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Loved by <span className="text-[#d2ff1f]">thousands</span> of
            <br className="hidden sm:block" /> happy customers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto"
          >
            See what our community has to say about their experience shopping and selling on our platform.
          </motion.p>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-12 lg:mb-16"
        >
          <div className="text-center">
            <p className="text-4xl lg:text-5xl font-bold text-[#d2ff1f]">4.9</p>
            <div className="flex justify-center gap-1 my-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={true} />
              ))}
            </div>
            <p className="text-white/50 text-sm">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-4xl lg:text-5xl font-bold text-[#35b9e9]">15K+</p>
            <p className="text-white/50 text-sm mt-3">Happy Customers</p>
          </div>
          <div className="text-center">
            <p className="text-4xl lg:text-5xl font-bold text-white">98%</p>
            <p className="text-white/50 text-sm mt-3">Satisfaction Rate</p>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-white/60 mb-4">Join our growing community today</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/categories"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#d2ff1f] text-black font-semibold rounded-full hover:bg-[#c4f018] hover:scale-105 transition-all duration-300"
            >
              Start Shopping
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href={process.env.NEXT_PUBLIC_VENDOR_URL || "https://vendor.mercurjs.com"}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-white font-semibold rounded-full border border-white/20 hover:border-[#35b9e9] hover:text-[#35b9e9] transition-all duration-300"
            >
              Become a Seller
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
