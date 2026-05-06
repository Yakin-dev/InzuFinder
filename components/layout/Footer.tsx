import Link from 'next/link'
import { House, MapPin, ShieldCheck, TwitterLogo, LinkedinLogo, InstagramLogo } from '@phosphor-icons/react/dist/ssr'

export default function Footer() {
  return (
    <footer className="bg-[#0a1f13] text-gray-300 mt-20">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-[#16a34a] to-[#0d4f2e] rounded-xl flex items-center justify-center">
                <House size={20} weight="fill" className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Inzu<span className="text-[#16a34a]">Finder</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Rwanda&apos;s most trusted rental platform. Every listing is reviewed and approved by our team before going live. Find your next home in Kigali with confidence.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 text-xs text-[#16a34a] font-medium">
                <ShieldCheck size={14} weight="fill" />
                Admin-Verified Listings
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-600" />
              <div className="flex items-center gap-1.5 text-xs text-[#16a34a] font-medium">
                <ShieldCheck size={14} weight="fill" />
                Fraud Protection
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://twitter.com/inzufinder"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                aria-label="Twitter"
              >
                <TwitterLogo size={18} weight="regular" />
              </a>
              <a
                href="https://linkedin.com/company/inzufinder"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                aria-label="LinkedIn"
              >
                <LinkedinLogo size={18} weight="regular" />
              </a>
              <a
                href="https://instagram.com/inzufinder"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                aria-label="Instagram"
              >
                <InstagramLogo size={18} weight="regular" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Browse All Houses', href: '/houses' },
                { label: 'Houses in Gasabo', href: '/houses?district=Gasabo' },
                { label: 'Houses in Kicukiro', href: '/houses?district=Kicukiro' },
                { label: 'Houses in Nyarugenge', href: '/houses?district=Nyarugenge' },
                { label: 'Furnished Houses', href: '/houses?furnished=true' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-[#16a34a] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'List Your House', href: '/register' },
                { label: 'Landlord Dashboard', href: '/dashboard' },
                { label: 'Sign Up', href: '/register' },
                { label: 'Login', href: '/login' },
              ].map((item, i) => (
                <li key={`${item.href}-${i}`}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-[#16a34a] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-3 bg-white/5 rounded-xl text-xs text-gray-400">
              <p className="font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <MapPin size={14} weight="fill" className="text-[#16a34a]" />
                Kigali, Rwanda
              </p>
              <p>Serving all districts: Gasabo, Kicukiro, Nyarugenge</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} InzuFinder. Built in Rwanda 🇷🇼
          </p>
          <p className="text-xs text-gray-500">
            <span className="text-[#16a34a]">Inzu</span> means &quot;House&quot; in Kinyarwanda
          </p>
        </div>
      </div>
    </footer>
  )
}
