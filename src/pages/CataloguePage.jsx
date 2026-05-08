import { useMemo, useState } from 'react'
import { MessageCircle, Sparkles } from 'lucide-react'
import Header from '../components/Header.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import SearchBar from '../components/SearchBar.jsx'
import CategoryFilters from '../components/CategoryFilters.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductModal from '../components/ProductModal.jsx'
import PremiumBadges from '../components/PremiumBadges.jsx'
import { badgeLabels } from '../data/products.js'
import { getWhatsAppLink } from '../utils/whatsapp.js'

const copy = {
  ar: {
    eyebrow: 'عروض اليوم المختارة لك',
    featured: 'منتجات مطلوبة بزاف',
    categories: 'اختار التصنيف لي كيناسبك',
    products: 'كل المنتجات',
    count: 'منتج متوفر',
    emptyTitle: 'ما لقيناش منتج بهاد البحث، جرّب كلمة أخرى',
    emptyText: 'يمكن تبدّل الكلمة أو تختار تصنيف آخر.',
    footer: 'إيون ماركت — منتجات مختارة، طلب سهل، وتوصيل لجميع المدن',
    sticky: 'طلب عبر واتساب',
  },
  fr: {
    eyebrow: 'Offres spéciales du jour',
    featured: 'Produits les plus demandés',
    categories: 'Choisissez une catégorie',
    products: 'Tous les produits',
    count: 'produits disponibles',
    emptyTitle: 'Aucun produit trouvé, essayez un autre mot-clé',
    emptyText: 'Vous pouvez aussi choisir une autre catégorie.',
    footer: 'Eonmarket — Produits sélectionnés, commande simple, livraison partout au Maroc',
    sticky: 'Commander sur WhatsApp',
  },
}

export default function CataloguePage({ language, onLanguageChange, products, heroSlides }) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const text = copy[language]

  const visibleProducts = useMemo(() => products.filter((product) => product.active), [products])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return visibleProducts.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const searchFields = [
        product.name?.ar,
        product.name?.fr,
        product.description?.ar,
        product.description?.fr,
        product.category,
        product.badge,
      ]
      const matchesQuery =
        !normalizedQuery ||
        searchFields.filter(Boolean).some((value) => value.toLowerCase().includes(normalizedQuery))

      return matchesCategory && matchesQuery
    })
  }, [query, selectedCategory, visibleProducts])

  const featuredProducts = visibleProducts.filter((product) => product.featured)
  const firstProduct = visibleProducts[0]
  const filterCategories = useMemo(
    () => ['All', ...Array.from(new Set(visibleProducts.map((product) => product.category).filter(Boolean)))],
    [visibleProducts],
  )

  return (
    <div
      className={`min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 ${language === 'ar' ? 'font-ar' : 'font-fr'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Header language={language} onLanguageChange={onLanguageChange} />

      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-6xl space-y-4 px-3 pb-4 pt-3 sm:space-y-6 sm:px-6 sm:pb-8 sm:pt-8">
            <HeroSlider images={heroSlides} />

            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-50 to-blue-50 px-3 py-2 text-xs font-black text-blue-800 shadow-sm ring-1 ring-blue-100 sm:text-sm">
              <Sparkles size={16} className="text-amber-500" />
              {text.eyebrow}
            </div>

            <SearchBar value={query} onChange={setQuery} language={language} />
            <PremiumBadges />
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-5 px-3 py-4 sm:space-y-7 sm:px-6 sm:py-8">
          <section className="space-y-4">
            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{text.categories}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {filteredProducts.length} {text.count}
                </p>
              </div>
              <CategoryFilters
                categories={filterCategories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
                language={language}
              />
            </div>
          </section>

          {featuredProducts.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{text.featured}</h2>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700 shadow-sm">
                  {featuredProducts.length}
                </span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {featuredProducts.slice(0, 6).map((product) => {
                  const name = product.name?.[language] || product.name?.fr
                  return (
                    <button
                      type="button"
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="flex min-w-[220px] items-center gap-3 rounded-2xl bg-white p-2.5 text-start shadow-sm ring-1 ring-slate-200 transition hover:shadow-md sm:min-w-[260px] sm:rounded-3xl sm:p-3"
                    >
                      <span className="size-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                        {product.imageUrl && <img src={product.imageUrl} alt={name} className="h-full w-full object-cover" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-black text-slate-950">{name}</span>
                        <span className="block text-xs font-bold text-slate-500">{product.price} MAD</span>
                      </span>
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">
                        {badgeLabels[language][product.badge] || product.badge}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{text.products}</h2>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onDetails={setSelectedProduct}
                    language={language}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                <p className="font-black text-slate-900">{text.emptyTitle}</p>
                <p className="mt-2 text-sm font-medium text-slate-500">{text.emptyText}</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {firstProduct && (
        <a
          href={getWhatsAppLink(firstProduct, language)}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-4 left-4 right-4 z-20 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 text-base font-black text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-600 sm:left-auto sm:right-6 sm:w-auto"
        >
          <MessageCircle size={19} />
          {text.sticky}
        </a>
      )}

      <footer className="border-t border-slate-200 bg-white px-4 pb-24 pt-8 text-center sm:pb-10">
        <p className="text-lg font-black text-slate-950">{language === 'ar' ? 'إيون ماركت' : 'Eonmarket'}</p>
        <p className="mt-2 text-sm font-semibold text-slate-500">{text.footer}</p>
      </footer>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} language={language} />
    </div>
  )
}
