import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import footerLinks from "@/data/footerLinks"

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-primary mb-4">Nivest</h2>
            <p className="text-secondary text-sm leading-relaxed mb-6">
              Premium fashion and lifestyle products curated for the modern individual.
            </p>
          </div>

          {/* Customer Services Column */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
              Customer Services
            </h3>
            <nav className="space-y-3" aria-label="Customer services navigation">
              {footerLinks.customerServices.map(({ label, path }) => (
                <LocalizedClientLink
                  key={label}
                  href={path}
                  className="block text-sm text-secondary hover:text-primary transition-colors duration-200"
                >
                  {label}
                </LocalizedClientLink>
              ))}
            </nav>
          </div>

          {/* About Column */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
              About
            </h3>
            <nav className="space-y-3" aria-label="About navigation">
              {footerLinks.about.map(({ label, path }) => (
                <LocalizedClientLink
                  key={label}
                  href={path}
                  className="block text-sm text-secondary hover:text-primary transition-colors duration-200"
                >
                  {label}
                </LocalizedClientLink>
              ))}
            </nav>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
              Connect
            </h3>
            <nav className="space-y-3" aria-label="Social media navigation">
              {footerLinks.connect.map(({ label, path }) => (
                <a
                  aria-label={`Go to ${label} page`}
                  title={`Go to ${label} page`}
                  key={label}
                  href={path}
                  className="block text-sm text-secondary hover:text-primary transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary">
              © {new Date().getFullYear()} Nivest. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-secondary hover:text-primary transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-secondary hover:text-primary transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
