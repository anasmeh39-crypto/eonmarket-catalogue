import { Search } from 'lucide-react'

const placeholders = {
  ar: 'قلب على منتج...',
  fr: 'Rechercher un produit...',
}

export default function SearchBar({ value, onChange, language = 'ar' }) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholders[language]}
        className="h-12 w-full rounded-full border border-slate-200 bg-white pl-12 pr-4 text-[15px] font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  )
}
