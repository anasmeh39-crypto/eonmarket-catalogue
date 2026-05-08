import { CheckCircle2, CreditCard, Flame, Star, Truck } from 'lucide-react'

const badges = [
  { text: 'الأكثر مبيعاً', icon: Star, tone: 'text-amber-600 bg-amber-50 border-amber-100' },
  { text: 'الأكثر طلباً', icon: Flame, tone: 'text-rose-600 bg-rose-50 border-rose-100' },
  { text: 'توصيل سريع', icon: Truck, tone: 'text-blue-600 bg-blue-50 border-blue-100' },
  { text: 'الدفع عند الاستلام', icon: CreditCard, tone: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { text: 'منتجات مختارة بعناية', icon: CheckCircle2, tone: 'text-violet-600 bg-violet-50 border-violet-100' },
]

export default function PremiumBadges() {
  return (
    <section className="rounded-3xl bg-white/80 p-2.5 shadow-sm ring-1 ring-slate-200 sm:rounded-[2rem] sm:p-3" dir="rtl" aria-label="Badges Eonmarket">
      <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3">
        {badges.map(({ text, icon: Icon, tone }) => (
          <div
            key={text}
            className={`flex min-w-max items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-extrabold shadow-sm sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${tone}`}
          >
            <Icon size={18} strokeWidth={2.5} />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
