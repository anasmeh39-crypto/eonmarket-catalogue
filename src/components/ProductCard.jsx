import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { badgeLabels, categoryLabels } from '../data/products.js'
import { getWhatsAppLink } from '../utils/whatsapp.js'

export default function ProductCard({ product, onDetails, language = 'ar' }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const name = product.name?.[language] || product.name?.fr || ''
  const benefit = product.benefits?.[language]?.[0] || ''
  const detailsLabel = language === 'ar' ? 'عرض التفاصيل' : 'Voir détails'
  const orderLabel = language === 'ar' ? 'طلب عبر واتساب' : 'Commander sur WhatsApp'
  const outOfStockLabel = language === 'ar' ? 'غير متوفر حاليا' : 'Rupture de stock'
  const isOutOfStock = product.badge === 'Out of stock'
  const imageLabels = language === 'ar' ? ['المنتج', 'طريقة الاستعمال'] : ['Produit', 'Utilisation']
  const productImages = useMemo(
    () => [product.imageUrl, product.secondImageUrl].filter(Boolean),
    [product.imageUrl, product.secondImageUrl],
  )
  const activeImage = productImages[activeImageIndex] || productImages[0]
  const hasSlider = productImages.length > 1
  const showPreviousImage = () => setActiveImageIndex((current) => (current === 0 ? productImages.length - 1 : current - 1))
  const showNextImage = () => setActiveImageIndex((current) => (current === productImages.length - 1 ? 0 : current + 1))

  return (
    <article className="grid grid-cols-[112px_1fr] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:block sm:rounded-3xl">
      <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-blue-100 sm:aspect-[4/3]">
        <div className={`absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:text-xs ${
          isOutOfStock ? 'text-rose-700' : 'text-blue-700'
        }`}>
          {badgeLabels[language][product.badge] || product.badge}
        </div>
        {activeImage ? (
          <img src={activeImage} alt={`${name} - ${imageLabels[activeImageIndex] || ''}`} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <div className="grid size-28 place-items-center rounded-[2rem] bg-white/75 text-center text-sm font-black text-slate-500 shadow-inner">
              Image
            </div>
          </div>
        )}

        {hasSlider && (
          <>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-white/90 px-2 py-1 shadow-sm">
              {productImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`size-1.5 rounded-full transition sm:size-2 ${
                    index === activeImageIndex ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  aria-label={imageLabels[index]}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-1 top-1/2 hidden size-7 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white sm:grid"
              aria-label={language === 'ar' ? 'الصورة السابقة' : 'Image precedente'}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-1 top-1/2 hidden size-7 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white sm:grid"
              aria-label={language === 'ar' ? 'الصورة التالية' : 'Image suivante'}
            >
              <ChevronRight size={16} />
            </button>

            <button
              type="button"
              onClick={showNextImage}
              className="absolute bottom-1 right-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black text-blue-700 shadow-sm sm:hidden"
            >
              {activeImageIndex + 1}/2
            </button>
          </>
        )}
      </div>

      <div className="space-y-2 p-3 sm:space-y-3 sm:p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            {categoryLabels[language][product.category] || product.category}
          </p>
          <h3 className="mt-0.5 text-sm font-black leading-5 text-slate-950 sm:mt-1 sm:min-h-12 sm:text-base sm:leading-6">{name}</h3>
          <p className="line-clamp-2 mt-0.5 text-xs font-semibold leading-4 text-slate-500 sm:mt-1 sm:min-h-10 sm:text-sm sm:font-normal sm:leading-5">{benefit}</p>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-lg font-black text-slate-950 sm:text-xl">{product.price} MAD</span>
          {product.oldPrice && <span className="pb-0.5 text-xs font-bold text-slate-400 line-through sm:text-sm">{product.oldPrice} MAD</span>}
        </div>

        <div className="grid gap-2">
          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className="inline-flex h-10 w-full cursor-not-allowed items-center justify-center rounded-full bg-slate-200 px-3 text-sm font-black text-slate-500 sm:h-11"
            >
              {outOfStockLabel}
            </button>
          ) : (
            <a
              href={getWhatsAppLink(product, language)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600 sm:h-11"
            >
              <MessageCircle size={16} />
              {orderLabel}
            </a>
          )}
          <button
            type="button"
            onClick={() => onDetails(product)}
            className="h-9 w-full rounded-full border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:h-10 sm:text-sm"
          >
            {detailsLabel}
          </button>
        </div>
      </div>
    </article>
  )
}
