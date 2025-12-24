"use client"
import { Carousel } from "@/components/cells"
import { CategoryCard } from "@/components/organisms"
import { RevealText } from "@/components/animations/RevealText"
import { Reveal } from "@/components/animations/Reveal"
import { ParallaxCategoryCard } from "./ParallaxCategoryCard"

export const categories: { id: number; name: string; handle: string }[] = [
  {
    id: 1,
    name: "Sneakers",
    handle: "sneakers",
  },
  {
    id: 2,
    name: "Sandals",
    handle: "sandals",
  },
  {
    id: 3,
    name: "Boots",
    handle: "boots",
  },
  {
    id: 4,
    name: "Sport",
    handle: "sport",
  },
  {
    id: 5,
    name: "Accessories",
    handle: "accessories",
  },
]

export const HomeCategories = ({ heading }: { heading: string }) => {
  return (
    <section className="bg-neutral-50 py-12 lg:py-16 w-full">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Reveal variant="fade-up" delay={0.1}>
              <span className="inline-block px-3 py-1 bg-[#35b9e9]/10 text-[#35b9e9] text-xs font-semibold rounded-full mb-3 border border-[#35b9e9]/30">
                Browse
              </span>
            </Reveal>
            <RevealText
              text={heading}
              el="h2"
              className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight uppercase"
            />
          </div>
          <Reveal variant="fade-up" delay={0.2}>
            <p className="text-secondary max-w-md">
              Find exactly what you need from our curated categories
            </p>
          </Reveal>
        </div>
        <Carousel
          autoScroll={true}
          autoScrollDelay={2500}
          items={categories?.map((category, index) => (
            <ParallaxCategoryCard key={category.id} index={index}>
              <CategoryCard category={category} />
            </ParallaxCategoryCard>
          ))}
        />
      </div>
    </section>
  )
}
