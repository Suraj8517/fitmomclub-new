import React, { useEffect, useRef, useState } from 'react'
import bg from "../../assets/aboutus/bg.png"

export default function HowItWorks() {
  const containerRef = useRef(null)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Only compute while the section is anywhere near the viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        // How far the section has scrolled through the viewport, -1 to 1 roughly
        const progress = (rect.top - windowHeight) / (windowHeight + rect.height)
        setOffsetY(progress * 80) // 80 = parallax strength in px, tweak as needed
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden min-h-[420px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[440px] flex items-center justify-center"
    >
      <img
        src={bg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-0 right-0 h-full w-auto max-w-[70%] sm:max-w-[65%] md:max-w-[60%] lg:max-w-[65%] object-contain -z-10 will-change-transform"
        style={{ transform: `translateY(${offsetY}px)` }}
      />
  <img
        src={bg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-0 left-0 scale-x-[-1] h-full w-auto max-w-[70%] sm:max-w-[65%] md:max-w-[60%] lg:max-w-[65%] object-contain -z-10 will-change-transform"
        style={{ transform: `translateY(${offsetY}px)` }}
      />
      <div className="text-center max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto px-4">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-teal-700 leading-tight mb-3 sm:mb-4"
          style={{ letterSpacing: "-0.5px" }}
        >
          Who We Are
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-neutral-600 leading-relaxed">
          Created by women, for women, FitMom Club provides personalized fitness, nutrition, and wellness guidance, with expertise in prenatal and postnatal care.
        </p>
      </div>
    </div>
  )
}