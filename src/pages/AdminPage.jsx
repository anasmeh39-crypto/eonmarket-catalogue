import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, ImagePlus, Lock, LogOut, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react'

const OWNER_PASSCODE = 'EON-2026'
const OWNER_SESSION_KEY = 'eonmarket-admin-owner'

const emptyForm = {
  imageUrl: '',
  secondImageUrl: '',
  nameAr: '',
  nameFr: '',
  descriptionAr: '',
  descriptionFr: '',
  price: '',
  oldPrice: '',
  category: 'Tech',
  badge: 'New',
  benefitAr1: '',
  benefitAr2: '',
  benefitAr3: '',
  benefitFr1: '',
  benefitFr2: '',
  benefitFr3: '',
  active: true,
  featured: false,
}

function productToForm(product) {
  return {
    imageUrl: product.imageUrl || '',
    secondImageUrl: product.secondImageUrl || '',
    nameAr: product.name?.ar || '',
    nameFr: product.name?.fr || '',
    descriptionAr: product.description?.ar || '',
    descriptionFr: product.description?.fr || '',
    price: product.price || '',
    oldPrice: product.oldPrice || '',
    category: product.category || 'Tech',
    badge: product.badge || 'New',
    benefitAr1: product.benefits?.ar?.[0] || '',
    benefitAr2: product.benefits?.ar?.[1] || '',
    benefitAr3: product.benefits?.ar?.[2] || '',
    benefitFr1: product.benefits?.fr?.[0] || '',
    benefitFr2: product.benefits?.fr?.[1] || '',
    benefitFr3: product.benefits?.fr?.[2] || '',
    active: Boolean(product.active),
    featured: Boolean(product.featured),
  }
}

function formToProduct(form, id) {
  return {
    id,
    imageUrl: form.imageUrl.trim(),
    secondImageUrl: form.secondImageUrl.trim(),
    name: { ar: form.nameAr.trim(), fr: form.nameFr.trim() },
    description: { ar: form.descriptionAr.trim(), fr: form.descriptionFr.trim() },
    benefits: {
      ar: [form.benefitAr1, form.benefitAr2, form.benefitAr3].map((item) => item.trim()),
      fr: [form.benefitFr1, form.benefitFr2, form.benefitFr3].map((item) => item.trim()),
    },
    price: Number(form.price) || 0,
    oldPrice: form.oldPrice ? Number(form.oldPrice) : '',
    category: form.category.trim() || 'Tech',
    badge: form.badge,
    active: form.active,
    featured: form.featured,
    availability: form.active && form.badge !== 'Out of stock',
  }
}

function compressImageFile(file, maxSize = 1000, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Image non lisible'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('Format image non supporte'))
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
        const width = Math.round(image.width * scale)
        const height = Math.round(image.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      image.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function AdminPage({
  products,
  onProductsChange,
  saveError = '',
  heroSlides = ['', ''],
  onHeroSlidesChange = () => false,
  heroSaveError = '',
}) {
  const [isOwner, setIsOwner] = useState(() => sessionStorage.getItem(OWNER_SESSION_KEY) === 'true')
  const [passcode, setPasscode] = useState('')
  const [accessError, setAccessError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [query, setQuery] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [heroMessage, setHeroMessage] = useState('')

  const handleOwnerLogin = (event) => {
    event.preventDefault()
    if (passcode.trim() !== OWNER_PASSCODE) {
      setAccessError('Code incorrect.')
      return
    }

    sessionStorage.setItem(OWNER_SESSION_KEY, 'true')
    setIsOwner(true)
    setPasscode('')
    setAccessError('')
  }

  const handleOwnerLogout = () => {
    sessionStorage.removeItem(OWNER_SESSION_KEY)
    setIsOwner(false)
    resetForm()
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return products

    return products.filter((product) =>
      [product.name?.fr, product.name?.ar, product.category, product.badge]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery)),
    )
  }, [products, query])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleImageUpload = async (event, field = 'imageUrl') => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setFormMessage('Compression image en cours...')
      const compressedImage = await compressImageFile(file)
      updateField(field, compressedImage)
      setFormMessage('Image ajoutee. Cliquez sur Sauvegarder.')
    } catch {
      setFormMessage("Impossible de lire cette image. Essayez une image JPG ou PNG.")
    } finally {
      event.target.value = ''
    }
  }

  const handleHeroUpload = async (event, index) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setHeroMessage('Compression image hero en cours...')
      const compressedImage = await compressImageFile(file, 1600, 0.82)
      const nextSlides = [...heroSlides]
      nextSlides[index] = compressedImage
      const saved = onHeroSlidesChange(nextSlides)
      setHeroMessage(saved === false ? 'Image hero non sauvegardee. Essayez une image plus legere.' : 'Image hero sauvegardee.')
    } catch {
      setHeroMessage("Impossible de lire cette image hero. Essayez une image JPG ou PNG.")
    } finally {
      event.target.value = ''
    }
  }

  const updateHeroUrl = (index, value) => {
    const nextSlides = [...heroSlides]
    nextSlides[index] = value
    const saved = onHeroSlidesChange(nextSlides)
    setHeroMessage(saved === false ? 'Image hero non sauvegardee.' : 'Hero mis a jour.')
  }

  const clearHeroImage = (index) => {
    const nextSlides = [...heroSlides]
    nextSlides[index] = ''
    const saved = onHeroSlidesChange(nextSlides)
    setHeroMessage(saved === false ? 'Image hero non sauvegardee.' : 'Image hero supprimee.')
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setFormMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const id = editingId || `product-${Date.now()}`
    const nextProduct = formToProduct(form, id)
    const nextProducts = editingId
      ? products.map((product) => (product.id === editingId ? nextProduct : product))
      : [nextProduct, ...products]
    const saved = onProductsChange(nextProducts)

    if (saved === false) {
      setFormMessage("Produit non sauvegarde. Reduisez l'image ou supprimez une image lourde.")
      return
    }

    setFormMessage('Produit sauvegarde.')
    resetForm()
  }

  const editProduct = (product) => {
    setEditingId(product.id)
    setForm(productToForm(product))
    setFormMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteProduct = (id) => {
    onProductsChange(products.filter((product) => product.id !== id))
    if (editingId === id) resetForm()
  }

  const toggleProduct = (id, field) => {
    onProductsChange(products.map((product) => (product.id === id ? { ...product, [field]: !product[field] } : product)))
  }

  if (!isOwner) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-900">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-black text-blue-700">
            <ArrowLeft size={17} />
            Retour catalogue
          </Link>

          <div className="mt-6 grid gap-3 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-3xl bg-blue-50 text-blue-700">
              <Lock size={24} />
            </span>
            <h1 className="text-2xl font-black text-slate-950">Accès propriétaire</h1>
            <p className="text-sm font-semibold leading-6 text-slate-500">
              Cette page admin est réservée au propriétaire Eonmarket.
            </p>
          </div>

          <form onSubmit={handleOwnerLogin} className="mt-6 grid gap-3">
            <label className="grid gap-1.5">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Code admin</span>
              <input
                type="password"
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-center text-lg font-black outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="••••••••"
                autoFocus
              />
            </label>

            {accessError && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">{accessError}</div>}

            <button
              type="submit"
              className="h-12 rounded-full bg-blue-600 px-5 text-base font-black text-white shadow-sm transition hover:bg-blue-700"
            >
              Entrer
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-black text-blue-700">
              <ArrowLeft size={17} />
              Retour catalogue
            </Link>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Admin Eonmarket</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">Catalogue frontend avec sauvegarde localStorage.</p>
          </div>
          <div className="rounded-3xl bg-blue-50 px-5 py-3 text-sm font-black text-blue-800">
            {products.length} produits
          </div>
          <button
            type="button"
            onClick={handleOwnerLogout}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            <LogOut size={16} />
            Verrouiller
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[420px_1fr]">
        <section className="h-fit rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-slate-950">
              {editingId ? 'Modifier produit' : 'Ajouter produit'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                aria-label="Annuler modification"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {(formMessage || saveError) && (
              <div className={`rounded-2xl px-4 py-3 text-sm font-black ${saveError ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'}`}>
                {saveError || formMessage}
              </div>
            )}
            <ImageUploader
              title="Image principale"
              helper="Photo produit visible dans le catalogue."
              imageUrl={form.imageUrl}
              onUpload={(event) => handleImageUpload(event, 'imageUrl')}
              onClear={() => updateField('imageUrl', '')}
            />
            <Field label="Image URL" value={form.imageUrl} onChange={(value) => updateField('imageUrl', value)} />
            <ImageUploader
              title="Image 2 / utilisation"
              helper="Optionnel: montre comment utiliser le produit."
              imageUrl={form.secondImageUrl}
              onUpload={(event) => handleImageUpload(event, 'secondImageUrl')}
              onClear={() => updateField('secondImageUrl', '')}
            />
            <Field label="Image 2 URL" value={form.secondImageUrl} onChange={(value) => updateField('secondImageUrl', value)} />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Field label="Nom arabe" value={form.nameAr} onChange={(value) => updateField('nameAr', value)} required />
              <Field label="Nom français" value={form.nameFr} onChange={(value) => updateField('nameFr', value)} required />
            </div>
            <TextArea label="Description arabe" value={form.descriptionAr} onChange={(value) => updateField('descriptionAr', value)} required />
            <TextArea label="Description français" value={form.descriptionFr} onChange={(value) => updateField('descriptionFr', value)} required />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Prix" type="number" value={form.price} onChange={(value) => updateField('price', value)} required />
              <Field label="Ancien prix" type="number" value={form.oldPrice} onChange={(value) => updateField('oldPrice', value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Catégorie" value={form.category} onChange={(value) => updateField('category', value)} required />
              <Select
                label="Badge"
                value={form.badge}
                onChange={(value) => updateField('badge', value)}
                options={['New', 'Promo', 'Best Seller', 'Out of stock']}
              />
            </div>

            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="mb-3 text-sm font-black text-slate-700">3 benefits Arabic</p>
              <div className="grid gap-2">
                <Field label="Benefit AR 1" value={form.benefitAr1} onChange={(value) => updateField('benefitAr1', value)} required />
                <Field label="Benefit AR 2" value={form.benefitAr2} onChange={(value) => updateField('benefitAr2', value)} required />
                <Field label="Benefit AR 3" value={form.benefitAr3} onChange={(value) => updateField('benefitAr3', value)} required />
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="mb-3 text-sm font-black text-slate-700">3 benefits Français</p>
              <div className="grid gap-2">
                <Field label="Benefit FR 1" value={form.benefitFr1} onChange={(value) => updateField('benefitFr1', value)} required />
                <Field label="Benefit FR 2" value={form.benefitFr2} onChange={(value) => updateField('benefitFr2', value)} required />
                <Field label="Benefit FR 3" value={form.benefitFr3} onChange={(value) => updateField('benefitFr3', value)} required />
              </div>
            </div>

            <div className="grid gap-2 rounded-3xl border border-slate-200 p-4">
              <Toggle label="Produit actif" checked={form.active} onChange={(value) => updateField('active', value)} />
              <Toggle label="Produit en vedette" checked={form.featured} onChange={(value) => updateField('featured', value)} />
            </div>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-base font-black text-white shadow-sm transition hover:bg-blue-700"
            >
              {editingId ? <Save size={18} /> : <Plus size={18} />}
              Sauvegarder
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-black text-slate-950">Images hero accueil</h2>
              <p className="text-sm font-semibold text-slate-500">
                Recommande: 1600 x 900 px, format JPG/PNG, zone importante au centre.
              </p>
            </div>

            {(heroMessage || heroSaveError) && (
              <div className={`mt-4 rounded-2xl px-4 py-3 text-sm font-black ${heroSaveError ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'}`}>
                {heroSaveError || heroMessage}
              </div>
            )}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[0, 1].map((index) => (
                <HeroImageEditor
                  key={index}
                  title={`Hero image ${index + 1}`}
                  imageUrl={heroSlides[index] || ''}
                  onUpload={(event) => handleHeroUpload(event, index)}
                  onClear={() => clearHeroImage(index)}
                  onUrlChange={(value) => updateHeroUrl(index, value)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-black text-slate-950">Tous les produits</h2>
              <label className="relative block sm:w-80">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher..."
                  className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-3">
            {filteredProducts.map((product) => (
              <article key={product.id} className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
                <div className="grid gap-3 sm:grid-cols-[96px_1fr_auto] sm:items-center">
                  <div className="aspect-square overflow-hidden rounded-3xl bg-slate-100">
                    {product.imageUrl && <img src={product.imageUrl} alt={product.name?.fr} className="h-full w-full object-cover" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-slate-950">{product.name?.fr}</h3>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">{product.category}</span>
                      <Status active={product.active} />
                      {product.featured && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">Vedette</span>}
                      {product.secondImageUrl && <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-black text-violet-700">2 images</span>}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-500">{product.description?.fr}</p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-lg font-black text-slate-950">{product.price} MAD</span>
                      {product.oldPrice && <span className="text-sm font-bold text-slate-400 line-through">{product.oldPrice} MAD</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:w-48">
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="inline-flex h-10 items-center justify-center gap-1 rounded-full bg-slate-100 px-3 text-sm font-black text-slate-700 hover:bg-slate-200"
                    >
                      <Pencil size={15} />
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      className="inline-flex h-10 items-center justify-center gap-1 rounded-full bg-rose-50 px-3 text-sm font-black text-rose-700 hover:bg-rose-100"
                    >
                      <Trash2 size={15} />
                      Supprimer
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleProduct(product.id, 'active')}
                      className="h-10 rounded-full border border-slate-200 text-sm font-black text-slate-700 hover:bg-slate-50"
                    >
                      {product.active ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleProduct(product.id, 'featured')}
                      className="h-10 rounded-full border border-slate-200 text-sm font-black text-slate-700 hover:bg-slate-50"
                    >
                      {product.featured ? 'Retirer' : 'Vedette'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  const isNumber = type === 'number'

  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type={isNumber ? 'text' : type}
        inputMode={isNumber ? 'decimal' : undefined}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  )
}

function ImageUploader({ title, helper, imageUrl, onUpload, onClear }) {
  return (
    <div className="grid gap-3 rounded-3xl border border-dashed border-blue-200 bg-blue-50/40 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-800">{title}</p>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">{helper} Depuis votre Mac, sauvegarde localStorage.</p>
        </div>
        <span className="grid size-10 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm">
          <ImagePlus size={19} />
        </span>
      </div>

      {imageUrl ? (
        <div className="grid gap-3">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white">
            <img src={imageUrl} alt="Apercu produit" className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            onClick={onClear}
            className="h-10 rounded-full bg-white text-sm font-black text-rose-700 shadow-sm hover:bg-rose-50"
          >
            Supprimer image
          </button>
        </div>
      ) : (
        <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-2xl bg-white text-center text-sm font-black text-blue-700 shadow-sm hover:bg-blue-50">
          <ImagePlus size={22} />
          <span className="mt-2">Choisir une image</span>
          <input type="file" accept="image/*" onChange={onUpload} className="sr-only" />
        </label>
      )}

      {imageUrl && (
        <label className="flex h-10 cursor-pointer items-center justify-center rounded-full border border-blue-100 bg-white text-sm font-black text-blue-700 hover:bg-blue-50">
          Changer image
          <input type="file" accept="image/*" onChange={onUpload} className="sr-only" />
        </label>
      )}
    </div>
  )
}

function HeroImageEditor({ title, imageUrl, onUpload, onClear, onUrlChange }) {
  return (
    <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-800">{title}</p>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">Desktop + mobile, image de campagne accueil.</p>
        </div>
        <span className="grid size-10 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm">
          <ImagePlus size={19} />
        </span>
      </div>

      <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-white">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-blue-50 to-violet-50 text-sm font-black text-blue-700">
            Fallback automatique
          </div>
        )}
      </div>

      <label className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white shadow-sm hover:bg-blue-700">
        Upload depuis Mac
        <input type="file" accept="image/*" onChange={onUpload} className="sr-only" />
      </label>

      <label className="grid gap-1.5">
        <span className="text-xs font-black uppercase tracking-wide text-slate-500">Image URL</span>
        <input
          value={imageUrl}
          onChange={(event) => onUrlChange(event.target.value)}
          className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="https://..."
        />
      </label>

      {imageUrl && (
        <button
          type="button"
          onClick={onClear}
          className="h-10 rounded-full bg-white text-sm font-black text-rose-700 shadow-sm hover:bg-rose-50"
        >
          Supprimer image hero
        </button>
      )}
    </div>
  )
}

function TextArea({ label, value, onChange, required = false }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <textarea
        value={value}
        required={required}
        rows="3"
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 grid size-6 place-items-center rounded-full bg-white text-blue-600 shadow-sm transition ${
            checked ? 'left-7' : 'left-1'
          }`}
        >
          {checked && <Check size={14} />}
        </span>
      </button>
    </label>
  )
}

function Status({ active }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-black ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      {active ? 'Actif' : 'Inactif'}
    </span>
  )
}
