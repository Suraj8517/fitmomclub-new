import { useRef, useEffect } from "react";
import heroBg from "../../assets/aboutus/bg.webp";

export default function HowItWorksSection() {
  const imgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imgRef.current) return;
      const section = imgRef.current.closest("section");
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only apply while section is visible
      if (rect.bottom < 0 || rect.top > viewportHeight) return;

      // How far the section has scrolled through the viewport (0 = entering bottom, 1 = leaving top)
      const progress = 1 - rect.bottom / (viewportHeight + rect.height);

      // Shift image between -15% (top) and +15% (bottom) relative to normal position
      const offset = (progress - 0.5) * 30; // range: -15 to +15
      imgRef.current.style.transform = `translateY(${offset}%)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full h-[100vh] md:h-[120vh]  overflow-hidden font-['Poppins',sans-serif]">

      {/* Background image — oversized so parallax shift stays filled */}
      <img
        ref={imgRef}
        src={heroBg}
        alt="Woman image"
        className="absolute inset-0 w-full h-[150%] object-cover sm:object-top  will-change-transform"
        style={{ top: "-5%" }}
      />

      {/* Dark gradient overlay — bottom-left only */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-6 pb-10 md:px-14 md:pb-16 lg:px-20 lg:pb-30 w-full max-w-3xl">

        <h1 className="text-teal-200 text-2xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight mb-3 sm:mb-6 drop-shadow-md">
          Empowering Wellness <br />for Every Stage of Your Journey
        </h1>

        <p className="text-white text-sm sm:text-2xl leading-relaxed mb-5 sm:mb-6 max-w-prose">
At FitMom Club, we combine fitness, nutrition, and expert guidance to help women build strength, confidence, and lifelong wellness at every stage of their journey. 
</p>
       

      </div>
    </section>
  );
}