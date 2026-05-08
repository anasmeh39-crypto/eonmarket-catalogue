import { categoryLabels } from '../data/products.js'

export default function CategoryFilters({ categories, selectedCategory, onSelect, language = 'ar' }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {categories.map((category) => {
        const isActive = category === selectedCategory
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
              isActive
                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700'
            }`}
          >
            {categoryLabels[language][category] || category}
          </button>
        )
      })}
    </div>
  )
}
