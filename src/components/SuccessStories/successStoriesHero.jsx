import React, { useEffect, useRef, useState } from 'react'
import hero from "../../assets/success stories/success hero.png"
import SuccessStoriesStats from './successStoriesStats'
export default function SuccessStoriesHero() {
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node); // animate only once
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className='sm:min-h-screen w-full' style={{
            background: "linear-gradient(90deg, #E8E7E7 0%, #ebeaea 50%, #ebeaea 100%)",

    }}>
        <div ref={heroRef} className='flex justify-center overflow-hidden'>
            <img
              src={hero}
              className={`mt-18 sm:w-[80%] w-full transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.97]"
              }`}
            />
        </div>
        <SuccessStoriesStats/>
    </section>
  )
}