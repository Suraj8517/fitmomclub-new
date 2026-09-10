import { useRef, useState, useEffect } from "react";

export default function ShareYourStorySection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
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
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-5 py-20 sm:px-10 md:px-16 md:py-22 lg:px-20 xl:px-24 2xl:px-32 bg-[linear-gradient(180deg,#EBEAEA_0%,#F6F4F0_100%)]"
      style={{
        
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Poppins", sans-serif',
      }}
    >
     

      <div className="relative max-w-3xl mx-auto text-center">
        <p
          className={`text-[#6e6e73] text-sm md:text-base font-medium tracking-[0.01em] mb-4 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Share Your Story
        </p>

        <h2
          className={`text-[#1d1d1f] text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6 transition-all duration-700 ease-out delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Inspire others with
          <br />
          your journey.
        </h2>

        <p
          className={`text-[#6e6e73] text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10 font-normal transition-all duration-700 ease-out delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Have you had a fitness breakthrough or wellness transformation?
          Your story could be the reason another mom starts hers.
        </p>

        <a
          href="https://g.co/kgs/FMyK9MP"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#009e8a] px-7 py-3.5 text-white text-base font-medium transition-all duration-700 ease-out delay-300 hover:bg-[#008776] ${
            isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
          }`}
        >
          Share Your Story Now
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </section>
  );
}