import React, { useEffect, useRef, useState } from "react";

const stats = [
  {
    label: "Personalised Fitness Plans",
    value: "Tailored",
    description:
      "We understand that everyone's journey is different. That's why our programs are tailored specifically for each individual, focusing on fitness goals that fit your body's needs, whether you're navigating motherhood or looking to get stronger and healthier.",
  },
  {
    label: "Holistic Wellness Support",
    value: "Beyond",
    description:
      "Our approach goes beyond physical fitness. We address mental, emotional, and nutritional well-being to ensure you achieve balance in every aspect of your life. Whether it's mindfulness practices or dietary guidance, we have you covered.",
  },
  {
    label: "Community Engagement",
    value: "Together",
    description:
      "We believe that the power of a community can be transformative. At FitMom Club, you're never alone on your journey. Our community of like-minded individuals is here to motivate, support, and inspire you through every milestone.",
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

function StatCard({ label, value, description, inView, delay }) {
  return (
    <div
      className="approach-reveal-up flex-1 min-w-0 flex flex-col gap-4"
      data-inview={inView}
      style={{ animationDelay: delay }}
    >
      {/* Label + divider */}
      <div>
        <p className="text-[14px] text-[#333333] font-normal mb-3 font-poppins">
          {label}
        </p>
        <div className="w-full h-px bg-gray-300" />
      </div>

      {/* Big display value */}
      <h3 className="text-[40px] md:text-[56px] font-light text-[#1a1a1a] leading-none tracking-tight font-poppins">
        {value}
      </h3>

      {/* Description */}
      <p className="text-[13.5px] text-[#444444] leading-[1.75] font-normal font-poppins">
        {description}
      </p>
    </div>
  );
}

export default function OurApproachSection() {
  const [headerRef, headerInView] = useInView();
  const [cardsRef, cardsInView] = useInView({ threshold: 0.1 });

  return (
    <section className="w-full px-6 py-16 md:px-[72px] md:py-[72px] font-poppins">
      <style>{`
        @keyframes approachRiseUp {
          from { opacity: 0; transform: translate3d(0, 28px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .approach-reveal-up {
          opacity: 0;
        }
        .approach-reveal-up[data-inview="true"] {
          animation: approachRiseUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .approach-reveal-up {
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div
        ref={headerRef}
        data-inview={headerInView}
        className="approach-reveal-up mb-14"
      >
        <h2 className="text-[28px] md:text-[44px] font-light text-[#1a1a1a] leading-tight tracking-tight max-w-[560px] mb-4 font-poppins">
          Our Approach
        </h2>
        <p className="text-[13.5px] text-[#666666] font-normal font-poppins">
          Chronic conditions and lifestyle factors drive preventable spending:
        </p>
      </div>

      {/* Cards row */}
      <div ref={cardsRef} className="flex flex-col md:flex-row gap-10 md:gap-12 w-full">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            {...stat}
            inView={cardsInView}
            delay={cardsInView ? `${i * 0.15}s` : "0s"}
          />
        ))}
      </div>
    </section>
  );
}