import React, { useEffect, useRef, useState } from 'react'
import demo from "../../assets/aboutus/demo.webp"
import demo2 from "../../assets/aboutus/demo1.jpg"
import demo3 from "../../assets/aboutus/demo2.webp"
import HowItWorks from './AboutUsHowitWorksNew'
import bg from '../../assets/aboutus/bg.png'

/** Fires once the ref'd element scrolls into the viewport, resets on exit,
 *  so the reveal replays each time it comes back into view. */
function useInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let skippedInitial = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!skippedInitial) {
          skippedInitial = true
          return
        }
        setInView(entry.isIntersecting)
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}

export default function AboutUsSecondSection() {
  const [row1Ref, row1InView] = useInView()
  const [row2Ref, row2InView] = useInView()

  return (
    <div>
      <style>{`
        @keyframes aboutRiseLeft {
          from { opacity: 0; transform: translate3d(-36px, 0, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes aboutRiseRight {
          from { opacity: 0; transform: translate3d(36px, 0, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes aboutRiseUp {
          from { opacity: 0; transform: translate3d(0, 40px, 0) scale(0.97); }
          to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        .about-reveal {
          opacity: 0;
        }
        .about-reveal.is-in-view {
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .about-reveal-left.is-in-view  { animation-name: aboutRiseLeft;  animation-duration: 0.9s; }
        .about-reveal-right.is-in-view { animation-name: aboutRiseRight; animation-duration: 0.9s; }
        .about-reveal-up.is-in-view    { animation-name: aboutRiseUp;    animation-duration: 0.8s; }
        @media (prefers-reduced-motion: reduce) {
          .about-reveal { opacity: 1 !important; animation: none !important; transform: none !important; }
        }
      `}</style>

      <HowItWorks/>
        <section className="w-full px-2 md:px-12 lg:px-20 pb-12">

        <div className="max-w-7xl mx-auto px-8 md:pt-4">
          {/* ── Row 1: Text left, two stacked images right ── */}
          <div
            ref={row1Ref}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center mb-12 md:mb-24"
          >
            {/* Left — text */}
            <div
              className={`about-reveal about-reveal-left ${row1InView ? "is-in-view" : ""} flex flex-col gap-4`}
            >
                <h2
            className="text-center md:text-left text-teal-700 font-normal leading-[0.95] tracking-[-0.04em] pt-12 sm:pt-4 pb-4 md:pb-1"
            style={{
              fontSize: "clamp(2.6rem, 5vw, 3rem)",
            }}
          >
            Our Vision
          </h2>
              <p
                className="text-black leading-loose text-justify md:text-left"
                style={{
                  fontSize: "clamp(0.875rem, 1.5vw, 1.2rem)",
                }}
              >
Our vision is to empower women and mothers to prioritize their health, strength, and well-being at every stage of life through accessible and sustainable holistic wellness. We aspire to transform the lives of over 1 million people and help reduce lifestyle diseases caused by obesity through education, fitness, and healthy living.              </p>
              
            </div>

            {/* Right — two images side by side */}
            <div className="hidden md:flex gap-3 items-start">
              <div
                className={`about-reveal about-reveal-up ${row1InView ? "is-in-view" : ""} w-1/2 rounded-2xl overflow-hidden`}
                style={{ animationDelay: "0.1s" }}
              >
                <img
                  src={demo2}
                  alt="Platform demo"
                  className="w-full h-[320px] object-cover object-center transition-transform duration-500 ease-out hover:scale-105"
                  style={{ aspectRatio: "3/4" }}
                />
              </div>
              <div
                className={`about-reveal about-reveal-up ${row1InView ? "is-in-view" : ""} w-3/4 rounded-2xl overflow-hidden`}
                style={{ animationDelay: "0.25s" }}
              >
                <img
                  src={demo}
                  alt="Platform demo 2"
                  className="w-full h-[320px] object-cover transition-transform duration-500 ease-out hover:scale-105"
                  style={{ aspectRatio: "3/4" }}
                />
              </div>
            </div>
          </div>

          {/* ── Row 2: Large image left, text right ── */}
          <div
            ref={row2Ref}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-2 md:pt-16 mb-20"
          >
            {/* Left — large image */}
            <div
              className={`about-reveal about-reveal-left ${row2InView ? "is-in-view" : ""} rounded-2xl overflow-hidden`}
            >
              <img
                src={demo3}
                alt="Team collaborating"
                className="w-full h-[350px] object-cover transition-transform duration-500 ease-out hover:scale-105"
                style={{ aspectRatio: "4/3" }}
              />
            </div>

            {/* Right — text */}
            <div
              className={`about-reveal about-reveal-right ${row2InView ? "is-in-view" : ""} flex flex-col gap-6`}
              style={{ animationDelay: "0.12s" }}
            >
              <h2
            className="text-center md:text-left text-teal-700 font-normal leading-[0.95] tracking-[-0.04em] pb-4 md:pb-1"
            style={{
              fontSize: "clamp(2.6rem, 5vw, 3rem)",
            }}
          >
            Our Mission
          </h2>
              <p
                className="text-black leading-loose text-justify md:text-left"
                style={{
                  fontSize: "clamp(0.875rem, 1.5vw, 1.2rem)",
                }}
              >
Our mission is to empower healthier lifestyles through personalised fitness, nutrition, and wellness guidance. We help individuals achieve their health goals with expert support and sustainable habits.
</p>
 <p
                className="text-black leading-loose text-justify md:text-left"
                style={{
                  fontSize: "clamp(0.875rem, 1.5vw, 1.2rem)",
                }}
              >
We promote the idea of food as medicine and strive to raise awareness about the importance of balanced nutrition, physical fitness, and overall well-being.
</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}