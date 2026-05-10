import { useEffect, useState } from 'react'
import heroOne from '../assets/hero-1.png'
import heroTwo from '../assets/hero-2.png'

const fallbackSlides = [heroOne, heroTwo]
const fallbackTones = ['from-blue-600 via-violet-600 to-slate-950', 'from-emerald-500 via-blue-600 to-violet-700']

export default function HeroSlider({ images = [] }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [failedImages, setFailedImages] = useState({})
  const slides = fallbackSlides.map((fallbackImage, index) => ({
    src: images[index] || fallbackImage,
    fallback: fallbackTones[index],
  }))

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-lg shadow-slate-900/10 ring-1 ring-slate-200 sm:rounded-[2rem]">
      <div className="relative h-[58vh] min-h-[390px] max-h-[620px] sm:h-[430px] sm:min-h-0 sm:max-h-none lg:h-[500px]">
        {slides.map((slide, index) => {
          const isActive = index === activeSlide
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden={!isActive}
            >
              {failedImages[index] ? (
                <div className={`h-full w-full bg-gradient-to-br ${slide.fallback}`} />
              ) : (
                <img
                  src={slide.src}
                  alt=""
                  className="h-full w-full object-cover object-center"
                  onError={() => setFailedImages((current) => ({ ...current, [index]: true }))}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActiveSlide(index)}
            className={`h-2 rounded-full transition ${index === activeSlide ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300'}`}
            aria-label={`Hero slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
