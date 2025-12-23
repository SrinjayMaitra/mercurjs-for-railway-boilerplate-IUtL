"use client"
import { RevealText } from "@/components/animations/RevealText"
import { StaggerContainer } from "@/components/animations/StaggerContainer"

export const HomeProductSectionClient = ({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) => {
  return (
    <>
      <div className="mb-6">
        <RevealText
          text={heading}
          el="h2"
          className="heading-lg font-bold tracking-tight uppercase"
        />
      </div>
      <StaggerContainer>
        {children}
      </StaggerContainer>
    </>
  )
}



