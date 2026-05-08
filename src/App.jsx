import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CataloguePage from './pages/CataloguePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { loadHeroSlides, loadProducts, saveHeroSlides, saveProducts } from './utils/storage.js'

export default function App() {
  const [language, setLanguage] = useState('ar')
  const [products, setProducts] = useState(() => loadProducts())
  const [heroSlides, setHeroSlides] = useState(() => loadHeroSlides())
  const [saveError, setSaveError] = useState('')
  const [heroSaveError, setHeroSaveError] = useState('')

  const handleProductsChange = (nextProducts) => {
    const saved = saveProducts(nextProducts)
    if (!saved) {
      setSaveError("Impossible de sauvegarder. L'image est peut-être trop grande pour le navigateur.")
      return false
    }

    setSaveError('')
    setProducts(nextProducts)
    return true
  }

  const handleHeroSlidesChange = (nextSlides) => {
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
              saveError={saveError}
              heroSlides={heroSlides}
              onHeroSlidesChange={handleHeroSlidesChange}
              heroSaveError={heroSaveError}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
