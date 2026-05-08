import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import logoUrl from '../assets/eonmarket-logo-header.png'

const whatsappUrl = `https://wa.me/212704132226?text=${encodeURIComponent(
  'Salam, bghit n commande men catalogue إيون ماركت',
)}`

export default function Header({ language = 'ar', onLanguageChange = () => {} }) {
  const [logoLoaded, setLogoLoaded] = useState(true)

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-1.5 sm:gap-3 sm:px-6 sm:py-3">
        <Link to="/" className="flex items-center gap-2" aria-label="Eonmarket accueil">
          {logoLoaded ? (
            <span className="flex h-12 w-48 items-center overflow-hidden sm:h-16 sm:w-60">
              <img
                src={logoUrl}
                alt="Eonmarket"
                className="h-full w-full object-contain object-left"
                onError={() => setLogoLoaded(false)}
              />
            </span>
          ) : (
            <span>
              <span className="block text-lg font-black leading-5 tracking-tight text-slate-950">
                {language === 'ar' ? 'إيون ماركت' : 'Eonmarket'}
              </span>
              <span className="block text-xs font-semibold text-slate-500">Catalogue Maroc</span>
            </span>
          )}
        </Link>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="flex rounded-full border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-black sm:p-1 sm:text-xs">
            <button
              type="button"
              onClick={() => onLanguageChange('ar')}
              className={`rounded-full px-2 py-1.5 transition sm:px-3 ${
                language === 'ar' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('fr')}
              className={`rounded-full px-2 py-1.5 transition sm:px-3 ${
                language === 'fr' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              Français
            </button>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden h-10 items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600 sm:inline-flex"
          >
            <MessageCircle size={17} />
            {language === 'ar' ? 'واتساب' : 'WhatsApp'}
          </a>
        </div>
      </div>
    </header>
  )
}
