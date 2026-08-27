import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#0d0000] w-full border-t border-white/5">
      <div className="px-4 sm:px-6 md:px-12 py-3 border-b border-white/5 font-['Manrope'] text-[10px] uppercase tracking-[0.3em] text-gray-500 text-center sm:text-left">
        Seeing people go nowhere, made this.
      </div>
      <div className="flex flex-row justify-between items-center px-4 sm:px-6 md:px-12 py-4 gap-3 font-['Manrope'] text-[10px] uppercase tracking-[0.3em]">
        <div className="text-gray-500 whitespace-nowrap">JERS.WEB &copy; 2026</div>
        <div className="flex items-center gap-4 sm:gap-5 text-gray-500">
          <Link to="/legal" className="hover:text-white transition-colors">LEGAL</Link>
          {/* Replace with your support address */}
          <a href="mailto:support@yourdomain.com" aria-label="Email" title="support@yourdomain.com" className="hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 block">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </a>
          {/* Replace with your social link */}
          <a href="#" aria-label="Instagram" title="Instagram" className="hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 block">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
