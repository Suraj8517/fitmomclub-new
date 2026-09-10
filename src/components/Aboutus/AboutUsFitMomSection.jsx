import React, { useEffect, useRef, useState } from "react";
import img from "../../assets/aboutus/pritika-son.jpeg"

const features = [
  {
    title: "Tailored Solutions for Every Stage of Life",
    description:
      "From prenatal care to postnatal recovery and everything in between, we offer plans that fit seamlessly into your life.",
  },
  {
    title: "Expert Guidance You Can Trust",
    description:
      "Our certified trainers, clinical dietitians, and wellness experts provide personalised, research-backed advice that delivers results.",
  },
  {
    title: "Flexible Programs for Your Schedule",
    description:
      "Busy schedules are a part of life. That’s why we offer online sessions, real-time progress tracking, and personalised plans that work around you.",
  },
  {
    title: "Results That Last",
    description:
      "Our goal is to help you achieve sustainable, long-term wellness, not just quick fixes. We focus on creating habits that support your well-being for life.",
  },
];

/** Fires whenever the ref'd element enters/exits the viewport,
 *  so the reveal animation replays each time it scrolls back into view. */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function FeatureItem({ title, description, inView, delay }) {
  return (
    <div
      className="why-reveal-up flex flex-col gap-3"
      data-inview={inView}
      style={{ animationDelay: delay }}
    >
      <div>
        <h4 className="2xl:text-[16px] text-[14px] font-medium text-[#111111] mb-3 font-poppins">
          {title}
        </h4>
        <div className="w-full h-px bg-gray-300" />
      </div>
      <p className="2xl:text-[13.5px] text-[12.5px] text-[#555555] leading-[1.2] font-normal font-poppins mt-2">
        {description}
      </p>
    </div>
  );
}

export default function WhyFitMomSection() {
  const [imgRef, imgInView] = useInView();
  const [headingRef, headingInView] = useInView();
  const [gridRef, gridInView] = useInView({ threshold: 0.1 });

  return (
    <section className="w-full min-h-screen flex flex-col md:flex-row items-center gap-12 md:gap-16 px-6 py-16 md:px-[72px] md:py-[64px] font-poppins">
      <style>{`
        @keyframes whyRiseLeft {
          from { opacity: 0; transform: translate3d(-40px, 0, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes whyRiseUp {
          from { opacity: 0; transform: translate3d(0, 28px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .why-reveal-left,
        .why-reveal-up {
          opacity: 0;
        }
        .why-reveal-left[data-inview="true"] {
          animation: whyRiseLeft 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .why-reveal-up[data-inview="true"] {
          animation: whyRiseUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .why-reveal-left, .why-reveal-up {
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Left: Image */}
      <div
        ref={imgRef}
        data-inview={imgInView}
        className="why-reveal-left w-full md:w-[44%] flex-shrink-0 rounded-2xl overflow-hidden sm:h-[90vh]"
      >
        <img
          src={img}
          alt="Powered by innovation"
          className="w-full h-full object-cover block min-h-[320px] md:min-h-[520px]"
        />
      </div>

      {/* Right: Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-8 max-w-4xl">
        {/* Heading block */}
        <div
          ref={headingRef}
          data-inview={headingInView}
          className="why-reveal-up flex flex-col gap-8"
        >
          <h2 className="text-[26px] md:text-[50px] font-normal text-[#111111] leading-tight tracking-tight font-poppins">
            Why FitMom Club?
          </h2>
          <p className="2xl:text-[20px] text-[16px] text-[#555555] leading-[1.2] max-w-4xl font-normal font-poppins mb-8">
            At FitMom Club, we combine personalized fitness, expert nutrition, and holistic wellness to help women build healthier, stronger, and more confident lives—through every stage of their journey.
          </p>
        </div>

        {/* Feature grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-9"
        >
          {features.map((feature, i) => (
            <FeatureItem
              key={i}
              title={feature.title}
              description={feature.description}
              inView={gridInView}
              delay={gridInView ? `${i * 0.12}s` : "0s"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}