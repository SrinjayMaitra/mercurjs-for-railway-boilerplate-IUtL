"use client"

const services = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path
          d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10 15.3 15.3 0 0 0 4-10 15.3 15.3 0 0 0-4-10z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M2 12h20M12 2v20"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    text: "Worldwide Support",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M9 18l6-6-6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 12h18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    text: "Free Return",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: "Secure Checkout",
  },
]

export const ScrollingBanner = () => {
  // Duplicate services multiple times for seamless loop (need at least 2 sets)
  const duplicatedServices = [...services, ...services, ...services]

  return (
    <div className="w-full overflow-hidden bg-[#d2ff1f] py-3 relative">
      <div className="flex items-center gap-8 whitespace-nowrap scroll-banner">
        {duplicatedServices.map((service, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-[#1a1a1a] font-medium text-sm md:text-base flex-shrink-0"
          >
            <div className="flex-shrink-0">{service.icon}</div>
            <span className="whitespace-nowrap">{service.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

