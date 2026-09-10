import { useEffect, useRef, useState } from "react";
import { Activity, Clock, Heart } from "lucide-react";
import img1 from "../../assets/our app/mockup-img.png"

const features = [
  {
    icon: Activity,
    title: "Personalized recommendations",
    description:
      "based on your FMC Band health data, adapting in real time as your progress evolves.",
  },
  {
    icon: Clock,
    title: "24/7 expert support",
    description:
      "and real-time feedback whenever you need it most, around the clock.",
  },
  {
    icon: Heart,
    title: "Pressure-free guidance",
    description:
      "that motivates and empowers you — no stress, just steady support at your own pace.",
  },
];

/** Fires once the ref'd element enters the viewport and stays true afterward.
 *  Only triggers from an actual scroll intersection — no timer fallback.
 *  Never attach this ref to an element that's conditionally display:none
 *  (e.g. "lg:hidden") — a hidden element has a zero-size bounding box and
 *  can never register as intersecting. */
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

export default function HealthCoachSection() {
  const [headerRef, headerInView] = useInView();
  // Single shared ref/state for the always-rendered outer wrapper that
  // contains BOTH the mobile and desktop layouts, so it works regardless
  // of which one is display:none at the current breakpoint.
  const [bodyRef, bodyInView] = useInView({ threshold: 0.1 });

  return (
    <section className="w-full bg-[#f6f5f1] overflow-hidden py-18 md:py-16 lg:py-30 mx-auto">
      <style>{`
        @keyframes hcsRiseUp {
          from { opacity: 0; transform: translate3d(0, 28px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes hcsImgFromLeft {
          from { opacity: 0; transform: translate3d(-60px, 0, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes hcsImgFromUp {
          from { opacity: 0; transform: translate3d(0, 40px, 0) scale(0.97); }
          to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes hcsFeatureIn {
          from { opacity: 0; transform: translate3d(24px, 0, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        .hcs-header { opacity: 0; }
        .hcs-header[data-inview="true"] {
          animation: hcsRiseUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .hcs-img-left { opacity: 0; }
        .hcs-body[data-inview="true"] .hcs-img-left {
          animation: hcsImgFromLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .hcs-img-up { opacity: 0; }
        .hcs-body[data-inview="true"] .hcs-img-up {
          animation: hcsImgFromUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .hcs-feature { opacity: 0; }
        .hcs-body[data-inview="true"] .hcs-feature {
          animation: hcsFeatureIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .hcs-body[data-inview="true"] .hcs-feature:nth-of-type(1) { animation-delay: 0.25s; }
        .hcs-body[data-inview="true"] .hcs-feature:nth-of-type(2) { animation-delay: 0.4s; }
        .hcs-body[data-inview="true"] .hcs-feature:nth-of-type(3) { animation-delay: 0.55s; }

        @media (prefers-reduced-motion: reduce) {
          .hcs-header, .hcs-img-left, .hcs-img-up, .hcs-feature {
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* ── Header ── */}
      <div
        ref={headerRef}
        data-inview={headerInView}
        className="hcs-header px-5 sm:px-8 md:p2-14 lg:pl-38 mb-10 md:mb-14 lg:mb-16 2xl:max-w-8xl mx-auto"
      >
        <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-2 md:mb-3 tracking-wide">
          Your FMC Personal Health Coach.
        </p>
        <h2
  className="inline-block text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-4 md:mb-6"
  style={{
    background: "linear-gradient(90deg, #A479C8 0%, #738AC7 50%, #64994F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }}
>
    Tailored Guidance<br/> at Every Step
  
</h2>
        <p className="font-semibold md:text-lg text-slate-500 leading-relaxed max-w-2xl">
          Your personal coach ensures that your plan evolves with you. Through
          regular check-ins and ongoing progress assessments, they'll adapt your
          strategy to meet your current needs, ensuring you stay on track.
        </p>
      </div>

      {/* Always-rendered wrapper carries the observer ref, so it works
          regardless of which internal layout (mobile/desktop) is visible */}
      <div ref={bodyRef} data-inview={bodyInView} className="hcs-body">

        {/* ── Mobile & Tablet: stacked layout ── */}
        <div className="lg:hidden">
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="hcs-img-up m-4 rounded-2xl sm:rounded-2xl sm:mx-5 md:mx-8 overflow-hidden">
              <img
                src={img1}
                alt="Personal health coach session"
                className="w-full object-cover h-56 sm:h-72 md:h-96"
              />
            </div>
          </div>

          {/* Features stacked below image */}
          <div className="px-5 sm:px-8 md:px-14 flex flex-col divide-y  divide-slate-100">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div key={i} className="hcs-feature flex items-start gap-4 py-5 first:pt-0">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-slate-400" strokeWidth={1.5} />
                </div>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-900">{title}.</span>{" "}
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop: side-by-side layout ── */}
        <div className="hidden lg:flex md:items-start 2xl:items-center">
          {/* Image — bleeds from left edge */}
         <div
    className="hcs-img-left w-[58%] rounded-r-3xl overflow-hidden md:-ml-2 2xl:ml-38 2xl:rounded-3xl 2xl:w-[50%]"
  >
            <img
              src={img1}
              alt="Personal health coach session"
              className="w-full object-cover md:h-[520px] 2xl:h-[600px]"
            />
          </div>

          {/* Features to the right */}
          <div className="flex-1 pl-12 xl:pl-16 pr-16 xl:pr-24 flex flex-col gap-9 max-w-lg">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div key={i} className="hcs-feature flex flex-col items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="w-6 h-6 text-teal-600" strokeWidth={3} />
                </div>
                <p className="text-md text-slate-500 leading-relaxed font-semibold">
                  <span className=" text-slate-900">{title}.</span>{" "}
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}