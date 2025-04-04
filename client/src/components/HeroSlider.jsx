"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import images from "../assets/image" 


const slides = [
  {
    id: 1,
    image: images.slider1,
    title: "EXPERIENCE THE JOY OF FASHION",
    subtitle: "Shop the Latest Arrivals for Men and Women",
  },
  {
    id: 2,
    image: images.slider2,
    title: "PREMIUM QUALITY CLOTHING",
    subtitle: "Discover Our Exclusive Collection",
  },
  {
    id: 3,
    image: images.slider3,
    title: "STYLE THAT SPEAKS",
    subtitle: "Express Yourself With Our Latest Designs",
  },
]

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  // }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hero-slider relative bg-gray-100">
      <div className="relative h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="object-cover w-1024 h-full" />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-4 md:px-10">
                <div className="max-w-xl">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{slide.title}</h1>
                  <p className="text-xl text-white mb-6">{slide.subtitle}</p>
                  <Link
                    to="/category/all"
                    className="inline-block bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
                  >
                    MORE INFO
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="slider-controls">
        <button onClick={prevSlide} aria-label="Previous slide">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} aria-label="Next slide">
          <ChevronRight size={24} />
        </button>
      </div> */}
    </div>
  )
}

export default HeroSlider

