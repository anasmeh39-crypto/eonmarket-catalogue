import { categoryLabels } from '../data/products.js'

export function getWhatsAppLink(product, language = 'ar') {
  const phone = '212704132226'
  const productName = product.name?.[language] || product.name?.fr || product.name?.ar || product.name
  const category = categoryLabels[language]?.[product.category] || product.category
  const imageUrl = product.imageUrl || ''
  const secondImageUrl = product.secondImageUrl || ''
  const price = product.price || 0
  const message =
    language === 'fr'
      ? `Bonjour, je veux commander ce produit:\nProduit: ${productName}\nPrix: ${price} DH\nCatégorie: ${category}\nImage: ${imageUrl}${secondImageUrl ? `\nImage utilisation: ${secondImageUrl}` : ''}`
      : `Salam, bghit n commande had produit:\nالمنتج: ${productName}\nالثمن: ${price} DH\nالتصنيف: ${category}\nالصورة: ${imageUrl}${secondImageUrl ? `\nصورة طريقة الاستعمال: ${secondImageUrl}` : ''}`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
