import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CataloguePage from './pages/CataloguePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { clearSavedProducts, loadHeroSlides, loadProducts, saveHeroSlides, saveProducts } from './utils/storage.js'
import {
  deleteProduct,
  fetchHeroSlides,
  fetchProducts,
  saveHeroSlide,
  saveProduct,
  saveProducts as saveSupabaseProducts,
} from './services/catalogueService.js'

export default function App() {
  const [language, setLanguage] = useState('ar')
  const [products, setProducts] = useState(() => loadProducts())
  const [heroSlides, setHeroSlides] = useState(() => loadHeroSlides())
  const [saveError, setSaveError] = useState('')
  const [heroSaveError, setHeroSaveError] = useState('')
  const [dataStatus, setDataStatus] = useState('Connexion au catalogue live...')
  const [isLiveMode, setIsLiveMode] = useState(false)

  const loadLiveData = async () => {
    try {
      const [liveProducts, liveHeroSlides] = await Promise.all([fetchProducts(), fetchHeroSlides()])
      setProducts(liveProducts.length ? liveProducts : loadProducts())
      setHeroSlides(liveHeroSlides)
      setIsLiveMode(true)
      setDataStatus('Catalogue live connecte')
    } catch (error) {
      console.error('Supabase unavailable, using local fallback', error)
      setIsLiveMode(false)
      setDataStatus('Mode local: lancez supabase-setup.sql pour activer le live')
    }
  }

  useEffect(() => {
    loadLiveData()
  }, [])

  const handleProductsChange = async (nextProducts) => {
    if (isLiveMode) {
      try {
        await saveSupabaseProducts(nextProducts)
        setSaveError('')
        setProducts(nextProducts)
        return true
      } catch (error) {
        console.error(error)
        setSaveError('Impossible de sauvegarder dans Supabase.')
        return false
      }
    }

    const saved = saveProducts(nextProducts)
    if (!saved) {
      setSaveError("Impossible de sauvegarder. L'image est peut-être trop grande pour le navigateur.")
      return false
    }
    setSaveError('')
    setProducts(nextProducts)
    return true
  }

  const handleProductSave = async (nextProduct, nextProducts) => {
    if (isLiveMode) {
      try {
        await saveProduct(nextProduct, nextProducts.findIndex((product) => product.id === nextProduct.id))
        setProducts(nextProducts)
        setSaveError('')
        return true
      } catch (error) {
        console.error(error)
        setSaveError('Impossible de sauvegarder ce produit dans Supabase.')
        return false
      }
    }

    return handleProductsChange(nextProducts)
  }

  const handleProductDelete = async (id, nextProducts) => {
    if (isLiveMode) {
      try {
        await deleteProduct(id)
        setProducts(nextProducts)
        return true
      } catch (error) {
        console.error(error)
        setSaveError('Impossible de supprimer ce produit dans Supabase.')
        return false
      }
    }

    return handleProductsChange(nextProducts)
  }

  const resetProductsToDefaults = () => {
    clearSavedProducts()
    const defaultProducts = loadProducts()
    setProducts(defaultProducts)
    setSaveError('')
    return defaultProducts
  }

  const handleHeroSlidesChange = async (nextSlides, changedIndex = null) => {
    if (isLiveMode && changedIndex !== null) {
      try {
        await saveHeroSlide(changedIndex, nextSlides[changedIndex])
        setHeroSlides(nextSlides)
        setHeroSaveError('')
        return true
      } catch (error) {
        console.error(error)
        setHeroSaveError('Impossible de sauvegarder le hero dans Supabase.')
        return false
      }
    }

    const saved = saveHeroSlides(nextSlides)
    if (!saved) {
      setHeroSaveError("Impossible de sauvegarder les images hero. L'image est peut-être trop grande.")
      return false
    }

    setHeroSaveError('')
    setHeroSlides(nextSlides)
    return true
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<CataloguePage language={language} onLanguageChange={setLanguage} products={products} heroSlides={heroSlides} />}
        />
        <Route
          path="/admin"
          element={
            <AdminPage
              products={products}
              onProductsChange={handleProductsChange}
              onProductSave={handleProductSave}
              onProductDelete={handleProductDelete}
              onResetProducts={resetProductsToDefaults}
              saveError={saveError}
              heroSlides={heroSlides}
              onHeroSlidesChange={handleHeroSlidesChange}
              heroSaveError={heroSaveError}
              isLiveMode={isLiveMode}
              dataStatus={dataStatus}
              onReloadLiveData={loadLiveData}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
