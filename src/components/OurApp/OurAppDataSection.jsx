import { useEffect, useRef, useState } from "react";
import { Activity, RefreshCw, Sparkles } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Comprehensive health tracking.",
    description:
      "Steps, activity, sleep, calories burned, and more captured automatically throughout your day.",
    link: "Learn more about tracking",
  },
  {
    icon: RefreshCw,
    title: "Real-time syncing.",
    description:
      "Your body's data updates dynamically in the app, so your plan reflects exactly where you are right now.",
    link: "Learn more about syncing",
  },
  {
    icon: Sparkles,
    title: "Personalized insights.",
    description:
      "Recommendations tailored to your unique health profile, refined continuously as your data evolves.",
    link: "Learn more about insights",
  },
];

/** Fires once the ref'd element enters the viewport and stays true afterward.
 *  Only triggers from an actual scroll intersection — no timer fallback.
 *  Never attach this ref to an element that's conditionally display:none —
 *  a hidden element has a zero-size bounding box and can never register
 *  as intersecting. */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

export default function OurAppDataSection() {
  const [headerRef, headerInView] = useInView();
  const [cardsRef, cardsInView] = useInView({ threshold: 0.1 });

  return (
    <section className="w-full bg-[#f6f5f1] py-16 sm:py-20 lg:py-28">
      <style>{`
        @keyframes oadsRiseUp {
          from { opacity: 0; transform: translate3d(0, 28px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes oadsCardIn {
          from { opacity: 0; transform: translate3d(0, 36px, 0) scale(0.96); }
          to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }

        .oads-header { opacity: 0; }
        .oads-header[data-inview="true"] {
          animation: oadsRiseUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .oads-card { opacity: 0; }
        .oads-cards[data-inview="true"] .oads-card {
          animation: oadsCardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .oads-cards[data-inview="true"] .oads-card:nth-child(1) { animation-delay: 0.05s; }
        .oads-cards[data-inview="true"] .oads-card:nth-child(2) { animation-delay: 0.18s; }
        .oads-cards[data-inview="true"] .oads-card:nth-child(3) { animation-delay: 0.31s; }

        @media (prefers-reduced-motion: reduce) {
          .oads-header, .oads-card {
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
      <div className="px-5 sm:px-8 md:px-14 lg:px-20 xl:px-24 max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div
          ref={headerRef}
          data-inview={headerInView}
          className="oads-header mb-10 md:mb-14 lg:mb-16 lg:max-w-3xl"
        >
          <p className="text-xs sm:text-sm font-semibold text-teal-600 mb-2 md:mb-3 tracking-wide">
            FMC App
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.1] mb-4 md:mb-5" 
          style={{ background: "linear-gradient(90deg, #A479C8 0%, #738AC7 50%, #64994F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",}}>
            Data-Driven Personalization.
          </h2>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl">
            The FMC App, combined with your FMC Band, offers seamless tracking
            of your daily health metrics, syncing your data to deliver
            personalized insights and wellness plans.
          </p>
        </div>

        {/* ── Cards ── */}
        <div
          ref={cardsRef}
          data-inview={cardsInView}
          className="oads-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-4"
        >
          {features.map(({ icon: Icon, title, description, link }, i) => (
            <div
              key={i}
              className="oads-card bg-white rounded-2xl p-10 md:p-10 flex flex-col gap-5 shadow-sm"
            >
              <div className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-slate-900" strokeWidth={1.75} />
              </div>

              <div className="flex flex-col gap-2.5">
                <h3 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
                  {title}
                </h3>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}