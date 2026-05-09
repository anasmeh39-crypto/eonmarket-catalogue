import { demoProducts } from '../data/products.js'

const PRODUCTS_KEY = 'eonmarket-products'
const HERO_SLIDES_KEY = 'eonmarket-hero-slides'

export function loadProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY)
    if (!saved) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(demoProducts))
      return demoProducts
    }

    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : demoProducts
  } catch {
    return demoProducts
  }
}

export function saveProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
    return true
  } catch (error) {
    console.error('Unable to save products to localStorage', error)
    return false
  }
}

export function clearSavedProducts() {
  localStorage.removeItem(PRODUCTS_KEY)
}

export function loadHeroSlides() {
  try {
    const saved = localStorage.getItem(HERO_SLIDES_KEY)
    if (!saved) return ['', '']

    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? [parsed[0] || '', parsed[1] || ''] : ['', '']
  } catch {
    return ['', '']
  }
}

export function saveHeroSlides(slides) {
  try {
    localStorage.setItem(HERO_SLIDES_KEY, JSON.stringify([slides[0] || '', slides[1] || '']))
    return true
  } catch (error) {
    console.error('Unable to save hero slides to localStorage', error)
    return false
  }
}
