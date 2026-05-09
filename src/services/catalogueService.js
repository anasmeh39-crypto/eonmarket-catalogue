import { demoProducts } from '../data/products.js'
import { supabase } from '../lib/supabase.js'

const PRODUCT_BUCKET = 'product-images'

function fromDbProduct(row) {
  return {
    id: row.id,
    imageUrl: row.image_url || '',
    secondImageUrl: row.second_image_url || '',
    name: { ar: row.name_ar || '', fr: row.name_fr || '' },
    description: { ar: row.description_ar || '', fr: row.description_fr || '' },
    benefits: {
      ar: Array.isArray(row.benefits_ar) ? row.benefits_ar : [],
      fr: Array.isArray(row.benefits_fr) ? row.benefits_fr : [],
    },
    price: Number(row.price) || 0,
    oldPrice: row.old_price === null ? '' : Number(row.old_price) || '',
    category: row.category || 'Tech',
    badge: row.badge || 'New',
    active: Boolean(row.active),
    featured: Boolean(row.featured),
    availability: Boolean(row.availability),
  }
}

function toDbProduct(product, index = 0) {
  return {
    id: String(product.id),
    image_url: product.imageUrl || '',
    second_image_url: product.secondImageUrl || '',
    name_ar: product.name?.ar || '',
    name_fr: product.name?.fr || '',
    description_ar: product.description?.ar || '',
    description_fr: product.description?.fr || '',
    benefits_ar: product.benefits?.ar || [],
    benefits_fr: product.benefits?.fr || [],
    price: Number(product.price) || 0,
    old_price: product.oldPrice ? Number(product.oldPrice) : null,
    category: product.category || 'Tech',
    badge: product.badge || 'New',
    active: Boolean(product.active),
    featured: Boolean(product.featured),
    availability: product.badge !== 'Out of stock' && Boolean(product.active),
    sort_order: index,
  }
}

export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return data.map(fromDbProduct)
}

export async function saveProduct(product, index = 0) {
  const { error } = await supabase.from('products').upsert(toDbProduct(product, index), { onConflict: 'id' })
  if (error) throw error
  return product
}

export async function saveProducts(products) {
  const payload = products.map(toDbProduct)
  const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' })
  if (error) throw error
  return products
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function seedProductsIfEmpty() {
  const { count, error } = await supabase.from('products').select('id', { count: 'exact', head: true })
  if (error) throw error
  if (count > 0) return false
  await saveProducts(demoProducts)
  return true
}

export async function fetchHeroSlides() {
  const { data, error } = await supabase.from('hero_slides').select('*').order('id', { ascending: true })
  if (error) throw error

  return [data?.[0]?.image_url || '', data?.[1]?.image_url || '']
}

export async function saveHeroSlide(index, imageUrl) {
  const { error } = await supabase
    .from('hero_slides')
    .upsert({ id: index + 1, image_url: imageUrl || '' }, { onConflict: 'id' })
  if (error) throw error
}

function dataUrlToFile(dataUrl, fileName) {
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/data:(.*);base64/)?.[1] || 'image/jpeg'
  const bytes = atob(base64)
  const array = new Uint8Array(bytes.length)
  for (let index = 0; index < bytes.length; index += 1) {
    array[index] = bytes.charCodeAt(index)
  }
  return new File([array], fileName, { type: mime })
}

export async function uploadImage(dataUrl, folder = 'products') {
  if (!dataUrl?.startsWith('data:image/')) return dataUrl || ''

  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
  const file = dataUrlToFile(dataUrl, fileName)
  const { error } = await supabase.storage.from(PRODUCT_BUCKET).upload(fileName, file, {
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(fileName)
  return data.publicUrl
}
