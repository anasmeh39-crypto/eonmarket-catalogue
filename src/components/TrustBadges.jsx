import { HandCoins, PackageCheck, Truck } from 'lucide-react'

const badges = {
  ar: [
    { text: 'الدفع عند الاستلام', icon: HandCoins },
    { text: 'توصيل سريع لجميع المدن المغربية', icon: Truck },
    { text: 'منتجات مختارة بعناية', icon: PackageCheck },
  ],
  fr: [
    { text: 'Paiement à la livraison', icon: HandCoins },
    { text: 'Livraison rapide partout au Maroc', icon: Truck },
    { text: 'Produits sélectionnés avec soin', icon: PackageCheck },
  ],
}

export default function TrustBadges({ language = 'ar' }) {
  return (
    <section
      className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:pb-0"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      aria-label="Garanties Eonmarket"
    >
      {badges[language].map(({ text, icon: Icon }) => (
        <div key={text} className="flex min-w-max items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm sm:min-w-0 sm:gap-3 sm:rounded-3xl sm:p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700 sm:size-11">
            <Icon size={19} />
          </span>
          <span className="text-xs font-black text-slate-800 sm:text-sm">{text}</span>
        </div>
      ))}
    </section>
  )
}
