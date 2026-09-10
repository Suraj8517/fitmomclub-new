import { useRef, useEffect } from "react";
import heroBg from "../../assets/our community/cta.webp";
import { Link } from "react-router-dom";
import handleConsultation from "../Helper/handleClick";

export default function CTASection() {
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
    <section className="relative w-full h-[70vh] md:h-[75vh] lg:h-screen overflow-hidden font-['Poppins',sans-serif]">

      {/* Background image — oversized so parallax shift stays filled */}
      <img
        ref={imgRef}
        src={heroBg}
        alt="Woman wearing a fitness tracker"
        className="absolute inset-0 w-full h-[130%] object-cover object-center will-change-transform -scale-x-100"
        style={{ top: "-15%" }}
      />

      {/* Dark gradient overlay — bottom-left only */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-6 pb-10 md:px-14 md:pb-16 lg:px-20 lg:pb-20 w-full max-w-3xl">

        <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight mb-3 sm:mb-6 drop-shadow-md">
          Achieve Your Fitness Goals by Joining FitMom Club Community
        </h1>

        <p className="text-white text-sm sm:text-xl leading-relaxed mb-5 sm:mb-6 max-w-prose">
Ready to Transform? Join the FitMom Club Community Today.

        </p>

        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <button
            onClick={handleConsultation}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors duration-200 shadow-md"
          >
Create Your Profile Now          </button>

          <Link
            to="blogs"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white/90 hover:bg-white text-[#2C2C2C] text-sm font-medium transition-colors duration-200 shadow-md"
          >
            Explore Our Latest Blog Posts
          </Link>
        </div>

      </div>
    </section>
  );
}