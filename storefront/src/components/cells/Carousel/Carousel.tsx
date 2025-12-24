"use client"

import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

import { Indicator } from "@/components/atoms"
import { ArrowLeftIcon, ArrowRightIcon } from "@/icons"
import { useCallback, useEffect, useState, useRef } from "react"
import { EmblaCarouselType } from "embla-carousel"
import tailwindConfig from "../../../../tailwind.config"

export const CustomCarousel = ({
  variant = "light",
  items,
  align = "start",
  autoScroll = false,
  autoScrollDelay = 3000,
  showArrows = true,
}: {
  variant?: "light" | "dark"
  items: React.ReactNode[]
  align?: "center" | "start" | "end"
  autoScroll?: boolean
  autoScrollDelay?: number
  showArrows?: boolean
}) => {
  const autoplayPlugin = useRef(
    Autoplay({
      delay: autoScrollDelay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: autoScroll,
    })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align,
      dragFree: autoScroll,
    },
    autoScroll ? [autoplayPlugin.current] : []
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const maxStep = items.length

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect).on("select", onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const changeSlideHandler = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const arrowColor = {
    light: tailwindConfig.theme.extend.colors.primary,
    dark: tailwindConfig.theme.extend.colors.tertiary,
  }

  return (
    <div className="embla relative w-full group">
      {/* Left Arrow */}
      {showArrows && (
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-[#d2ff1f] hover:scale-110 transition-all duration-300 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
          aria-label="Previous slide"
        >
          <ArrowLeftIcon color={arrowColor[variant]} className="w-5 h-5" />
        </button>
      )}

      {/* Right Arrow */}
      {showArrows && (
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-[#d2ff1f] hover:scale-110 transition-all duration-300 translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
          aria-label="Next slide"
        >
          <ArrowRightIcon color={arrowColor[variant]} className="w-5 h-5" />
        </button>
      )}

      <div
        className="embla__viewport overflow-hidden rounded-xs w-full"
        ref={emblaRef}
      >
        <div className="embla__container flex gap-4">
          {items.map((slide, index) => (
            <div key={index} className="embla__slide min-w-0 flex-shrink-0 flex-[0_0_280px] sm:flex-[0_0_300px] md:flex-[0_0_320px] lg:flex-[0_0_340px]">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="flex justify-between items-center mt-4 sm:hidden">
        <div className="w-1/2">
          <Indicator
            variant={variant}
            maxStep={maxStep}
            step={selectedIndex + 1}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-[#d2ff1f] transition-colors"
          >
            <ArrowLeftIcon color={arrowColor[variant]} className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-[#d2ff1f] transition-colors"
          >
            <ArrowRightIcon color={arrowColor[variant]} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
