import { useEffect, useMemo, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { categoryLabels } from '../data/products.js'
import { getWhatsAppLink } from '../utils/whatsapp.js'

export default function ProductModal({ product, onClose, language = 'ar' }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    setActiveImageIndex(0)
  }, [product?.id])

  const productImages = useMemo(
    () => [
      { url: product?.imageUrl, label: language === 'ar' ? 'الصورة الرئيسية' : 'Image principale' },
      { url: product?.secondImageUrl, label: language === 'ar' ? 'طريقة الاستعمال' : 'Utilisation' },
    ].filter((image) => image.url),
    [language, product?.imageUrl, product?.secondImageUrl],
  )

  if (!product) return null

  const name = product.name?.[language] || product.name?.fr || ''
  const description = product.description?.[language] || ''
  const benefits = product.benefits?.[language] || []
  const orderLabel = language === 'ar' ? 'طلب عبر واتساب' : 'Commander sur WhatsApp'
  const isOutOfStock = product.badge === 'Out of stock'
  const availabilityLabel = isOutOfStock
    ? language === 'ar'
      ? 'غير متوفر حاليا'
      : 'Rupture de stock'
    : language === 'ar'
      ? 'متوفر للطلب'
      : 'Disponible'
  const trustText =
    language === 'ar'
      ? 'الدفع عند الاستلام وتوصيل سريع داخل المغرب'
      : 'Paiement a la livraison et livraison rapide au Maroc'
  const activeImage = productImages[activeImageIndex] || productImages[0]

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              {categoryLabels[language][product.category] || product.category}
            </p>
            <h2 className="text-lg font-black text-slate-950">{name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 p-3 sm:grid-cols-[0.95fr_1.05fr] sm:gap-5 sm:p-6">
          <div className="space-y-3">
            <div className="grid h-[56vh] min-h-[380px] max-h-[560px] place-items-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-100 to-blue-100 sm:aspect-square sm:h-auto sm:min-h-0 sm:max-h-none">
              {activeImage?.url ? (
                <img src={activeImage.url} alt={`${name} - ${activeImage.label}`} className="h-full w-full object-contain p-1.5 sm:p-3" />
              ) : (
                <div className="grid size-40 place-items-center rounded-[2.25rem] bg-white/75 text-center text-base font-black text-slate-500 shadow-inner">
                  Image produit
                </div>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="grid grid-cols-2 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={image.label}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-10 rounded-full text-sm font-black shadow-sm transition hover:shadow-md ${
                      activeImageIndex === index
                        ? 'border border-blue-200 bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-blue-900/15'
                        : 'border border-blue-100 bg-gradient-to-r from-blue-50 to-violet-50 text-blue-800 hover:from-blue-100 hover:to-violet-100'
                    }`}
                  >
                    {image.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-950">{product.price} MAD</span>
              {product.oldPrice && <span className="pb-1 text-base font-bold text-slate-400 line-through">{product.oldPrice} MAD</span>}
            </div>

            <ul className="grid gap-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                  {benefit}
                </li>
              ))}
            </ul>

            <p className="text-sm leading-6 text-slate-600">{description}</p>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className={`rounded-2xl px-4 py-3 text-sm font-black ${
                isOutOfStock ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {availabilityLabel}
              </div>
              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-black text-blue-800">
                {trustText}
              </div>
            </div>

            {isOutOfStock ? (
              <button
                type="button"
                disabled
                className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-slate-200 px-5 text-base font-black text-slate-500"
              >
                {availabilityLabel}
              </button>
            ) : (
              <a
                href={getWhatsAppLink(product, language)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 text-base font-black text-white shadow-sm transition hover:bg-emerald-600"
              >
                <MessageCircle size={19} />
                {orderLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
