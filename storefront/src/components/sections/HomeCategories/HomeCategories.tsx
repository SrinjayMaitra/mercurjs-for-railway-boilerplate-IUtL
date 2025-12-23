"use client"
import { Carousel } from "@/components/cells"
import { CategoryCard } from "@/components/organisms"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import { RevealText } from "@/components/animations/RevealText"

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
    <section className="bg-primary py-8 w-full">
      <div className="mb-6">
        <RevealText
          text={heading}
          el="h2"
          className="heading-lg text-primary uppercase"
        />
      </div>
      <StaggerContainer>
        <Carousel
          items={categories?.map((category) => (
            <StaggerItem key={category.id} variant="scale-up" className="h-full">
              <CategoryCard category={category} />
            </StaggerItem>
          ))}
        />
      </StaggerContainer>
    </section>
  )
}
