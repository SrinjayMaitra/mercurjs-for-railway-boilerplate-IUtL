"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"

import { useParams, usePathname, useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import { updateRegionWithValidation } from "@/lib/data/cart"
import { toast } from "@/lib/helpers/toast"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ regions }: CountrySelectProps) => {
  const [current, setCurrent] = useState<
    | { country: string | undefined; region: string; label: string | undefined }
    | undefined
  >(undefined)
  const [isOpen, setIsOpen] = useState(false)

  const { locale: countryCode } = useParams()
  const router = useRouter()
  const currentPath = usePathname().split(`/${countryCode}`)[1]

  const options = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries?.map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        }))
      })
      .flat()
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o?.country === countryCode)
      setCurrent(option)
    }
  }, [options, countryCode])

  const handleChange = async (option: CountryOption) => {
    try {
      const result = await updateRegionWithValidation(option.country, currentPath)

      if (result.removedItems.length > 0) {
        const itemsList = result.removedItems.join(", ")
        toast.info({
          title: "Cart updated",
          description: `${itemsList} ${result.removedItems.length === 1 ? "is" : "are"} not available in ${option.label} and ${result.removedItems.length === 1 ? "was" : "were"} removed from your cart.`,
        })
      }

      // Navigate to new region
      router.push(result.newPath)
      router.refresh()
    } catch (error: any) {
      toast.error({
        title: "Error switching region",
        description: error?.message || "Failed to update region. Please try again.",
      })
    }
  }

  return (
    <div className="relative">
      <Listbox
        onChange={handleChange}
        defaultValue={
          countryCode
            ? options?.find((o) => o?.country === countryCode)
            : undefined
        }
      >
        {({ open }) => (
          <>
            <ListboxButton className="group relative flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-full hover:border-[#d2ff1f] hover:shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d2ff1f]/50">
              {current && (
                <>
                  {/* @ts-ignore */}
                  <ReactCountryFlag
                    alt={`${current.label} flag`}
                    svg
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                    }}
                    countryCode={current.country ?? ""}
                  />
                  <span className="text-sm font-medium text-primary hidden sm:inline">
                    {current.country?.toUpperCase()}
                  </span>
                  <svg
                    className={`w-4 h-4 text-secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </ListboxButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <ListboxOptions className="absolute right-0 z-50 mt-2 w-56 origin-top-right bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden focus:outline-none">
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-semibold text-secondary uppercase tracking-wider">
                    Select Country
                  </p>
                </div>
                <div className="max-h-64 overflow-auto">
                  {options?.map((o, index) => {
                    const isSelected = current?.country === o?.country
                    return (
                      <ListboxOption
                        key={index}
                        value={o}
                        className={({ active }) =>
                          `cursor-pointer select-none relative px-4 py-3 flex items-center gap-3 transition-colors ${
                            active ? "bg-[#d2ff1f]/10" : ""
                          } ${isSelected ? "bg-[#d2ff1f]/20" : ""}`
                        }
                      >
                        {/* @ts-ignore */}
                        <ReactCountryFlag
                          svg
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "4px",
                          }}
                          countryCode={o?.country ?? ""}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-primary">
                            {o?.label}
                          </p>
                          <p className="text-xs text-secondary">
                            {o?.country?.toUpperCase()}
                          </p>
                        </div>
                        {isSelected && (
                          <svg className="w-5 h-5 text-[#d2ff1f]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </ListboxOption>
                    )
                  })}
                </div>
              </ListboxOptions>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  )
}

export default CountrySelect
