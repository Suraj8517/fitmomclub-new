import { useState, useRef, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import img1 from '../../assets/our app/bg/bg1.jpg'
import img2 from '../../assets/our app/bg/bg2.png'
import img3 from '../../assets/our app/bg/expert.png'
import img4 from '../../assets/our app/bg/live.png'
import img5 from '../../assets/our app/bg/bg5.png'
import img6 from '../../assets/our app/bg/refer.png'
import img7 from '../../assets/our app/bg/step.png'
import img8 from '../../assets/our app/bg/program.png'
import img9 from '../../assets/our app/bg/emotional.png'
import TestimonialCard from "../Helper/TestimonialCard";
import { HashLink } from "react-router-hash-link";
import { color } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const cards = [
  {
    author: "Personalized Workouts",
    quote: "Tailored workouts,\nmade for you.",
    image: img1,
    bg: "#0d0d14",
    authorColor: "#A78BFA",
    highlightColor: "#A78BFA",
    quoteColor: "#E5E7EB",
    accentBorder: "rgba(139, 92, 246, 0.3)",
    link: "personalized-workouts",
  },
  {
    author: "Real-Time Progress Tracking",
    quote: "Track every step,\nin real time.",
    image: img2,
    bg: "#F4CDFF",
    authorColor: "#000000",
    highlightColor: "#A21CAF",
    quoteColor: "#000000",
    accentBorder: "rgba(217, 70, 239, 0.3)",
    link: "progress-tracking",
  },
  
  {
    author: "Expert Support",
    quote: "Expert guidance,\nwhenever needed.",
    image: img3,
    bg: "#0f0a1e",
    authorColor: "#C084FC",
    highlightColor: "#C084FC",
    quoteColor: "#E5E7EB",
    accentBorder: "rgba(168, 85, 247, 0.3)",
    link: "expert-support",
  },
  {
    author: "Nutrition Planning",
    quote: "Eat smarter,\nfeel stronger.",
    image: img5,
    bg: "#F4CDFF",
    authorColor: "#000000",
    highlightColor: "#A21CAF",
    quoteColor: "#000000",
    accentBorder: "rgba(217, 70, 239, 0.3)",
    link: "nutrition-planning",
  },
  {
    author: "On-Demand & Live Sessions",
    quote: "Live or anytime,\nyour choice.",
    image: img4,
    bg: "#DED4FC",
    authorColor: "#000000",
    highlightColor: "#594889",
    quoteColor: "#000000",
    accentBorder: "rgba(99, 102, 241, 0.3)",
    link: "live-sessions",
  },
  {
  author: "Refer & Earn",
  quote: "Share with friends,\nearn rewards.",
  image: img6,
  bg: "#DED4FC",
  authorColor: "#000000",
  highlightColor: "#594889",
  quoteColor: "#000000",
  accentBorder: "rgba(99, 102, 241, 0.3)",
  link: "refer-and-earn",
},
{
  author: "Step Counter",
  quote: "Count every step,\nstay active.",
  image: img7,
  bg: "#0d0d14",
  authorColor: "#A78BFA",
  highlightColor: "#A78BFA",
  quoteColor: "#E5E7EB",
  accentBorder: "rgba(139, 92, 246, 0.3)",
  link: "step-counter",
},
{
  author: "Programs",
  quote: "Programs for\nevery goal.",
  image: img8,
  bg: "#F4CDFF",
  authorColor: "#000000",
  highlightColor: "#A21CAF",
  quoteColor: "#000000",
  accentBorder: "rgba(217, 70, 239, 0.3)",
  link: "programs",
},
{
  author: "Emotional Well-Being",
  quote: "Support your mind,\nevery day.",
  image: img9,
  bg: "#0f0a1e",
  authorColor: "#C084FC",
  highlightColor: "#C084FC",
  quoteColor: "#E5E7EB",
  accentBorder: "rgba(168, 85, 247, 0.3)",
  link: "emotional-well-being",
}
];

// ─── Reveal-on-scroll hook ──────────────────────────────────────────────────
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
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

// Wraps a card's content so the entrance animation lives on a plain div
// instead of the .swiper-slide element itself (Swiper writes its own
// inline transforms to slides for layout — animating the slide directly
// fights with that and the animation never visibly plays).
function RevealCard({ inView, delay, children }) {
  return (
    <div
      style={{
        height: "100%",
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0,0,0) scale(1)" : "translate3d(0,40px,0) scale(0.94)",
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function CustomerSection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const [headerRef, headerInView] = useInView();
  // Single wrapper ref that always renders (contains both desktop & mobile
  // blocks), so the observer works regardless of which layout is display:none
  // at the current breakpoint.
  const [bodyRef, bodyInView] = useInView({ threshold: 0.02 });

  const setPrevRef = useCallback((node) => {
    prevRef.current = node;
    if (swiperRef.current && node) {
      swiperRef.current.params.navigation.prevEl = node;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  const setNextRef = useCallback((node) => {
    nextRef.current = node;
    if (swiperRef.current && node) {
      swiperRef.current.params.navigation.nextEl = node;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <section className="bg-[#F6F5F1] py-28 ">
      <style>{`
        .customers-swiper {
          cursor: grab;
          overflow: visible !important;
          will-change: transform;
          --swiper-transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .customers-swiper .swiper-wrapper { overflow: visible; }
        .customers-swiper.swiper-pointer-events { cursor: grabbing; }

        .cs-clip {
          overflow: hidden;
          margin-left: -9999px;
          padding-left: 9999px;
        }

        .customers-swiper-mobile .swiper-pagination {
          position: static;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .customers-swiper-mobile .swiper-pagination-bullet {
          width: 10px; 
          height: 10px;
          border-radius: 9999px;
          background: #35c6a9;
          opacity: 0.5; margin: 0 !important;
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1),
                      background 0.25s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.25s;
        }
        .customers-swiper-mobile .swiper-pagination-bullet-active {
          width: 24px;
          background: #1c8c77;
          opacity: 1;
        }

        @keyframes csRiseUp {
          from { opacity: 0; transform: translate3d(0, 26px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .cs-header { opacity: 0; }
        .cs-header[data-inview="true"] {
          animation: csRiseUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .cs-header {
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
        className="cs-header max-w-[75%] px-2 xl:px-4 2xl:px-16 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:mb-20 mb-12 mx-auto"
      >
        <div>
            
          <h2 className=" text-teal-700 leading-none font-[poppins] font-semibold text-[clamp(2.2rem,4.5vw,3.5rem)]">
            FMC App Features
          </h2>
        </div>
       
      </div>

      {/* Always-rendered wrapper carries the observer ref, so it works
          regardless of which internal layout (mobile/desktop) is visible */}
      <div ref={bodyRef}>

        {/* ── DESKTOP ── */}
        <div className="hidden lg:block">
          <div className="cs-clip">
            <div className="2xl:pl-76 pl-36">
              <Swiper
                modules={[Navigation, FreeMode, Mousewheel]}
                className="customers-swiper"
                freeMode={{ enabled: true, momentum: true, momentumRatio: 0.55, momentumVelocityRatio: 0.55, minimumVelocity: 0.02, sticky: false }}
                mousewheel={{
                  forceToAxis: true,
                  sensitivity: 1,
                  releaseOnEdges: true,
                }}
                slidesPerView="auto"
                slidesOffsetAfter={80}
                spaceBetween={15}
                grabCursor={true}
                simulateTouch={true}
                touchRatio={1}
                speed={520}
                navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
                onSlideChange={(swiper) => { setIsBeginning(swiper.isBeginning); setIsEnd(swiper.isEnd); }}
                onReachBeginning={() => { setIsBeginning(true); setIsEnd(false); }}
                onReachEnd={() => setIsEnd(true)}
                onFromEdge={(swiper) => { setIsBeginning(swiper.isBeginning); setIsEnd(swiper.isEnd); }}
              >
                {cards.map((card, i) => (
                  <SwiperSlide key={i} style={{ width: 390 }}>
                    <RevealCard inView={bodyInView} delay={`${Math.min(i, 9) * 0.07}s`}>
                      <TestimonialCard card={card} width={"390px"} height={"690px"}/>
                    </RevealCard>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 px-6 xl:px-10 2xl:px-16">
            <button ref={setPrevRef} disabled={isBeginning} className="w-12 h-12 rounded-full border-2 border-teal-300 flex items-center justify-center text-violet-500 text-lg hover:border-violet-600 hover:text-violet-700 disabled:opacity-25 transition-all duration-150"><svg
  width="16"
  height="16"
  viewBox="0 0 16 16"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M13 8H3M7 4L3 8l4 4"
    stroke="#111111"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg></button>
            <button ref={setNextRef} disabled={isEnd} className="w-12 h-12 rounded-full border-2 border-teal-300 flex items-center justify-center text-violet-500 text-lg hover:border-violet-600 hover:text-violet-700 disabled:opacity-25 transition-all duration-150"><svg
  width="16"
  height="16"
  viewBox="0 0 16 16"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M3 8h10M9 4l4 4-4 4"
    stroke="#111111"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg></button>
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="lg:hidden px-4 sm:px-6 overflow-x-hidden ">
          <Swiper
            modules={[Pagination, FreeMode, Mousewheel]}
            className="customers-swiper customers-swiper-mobile"
            freeMode={{ enabled: true, momentum: true, momentumRatio: 0.5, minimumVelocity: 0.02, sticky: false }}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
              releaseOnEdges: true,
            }}
            slidesPerView={1.2}
            spaceBetween={30}
            grabCursor={true}
            simulateTouch={true}
            touchRatio={1}
            speed={520}
            pagination={{ clickable: true }}
          >
            {cards.map((card, i) => (
              <SwiperSlide key={i}>
                <RevealCard inView={bodyInView} delay={`${Math.min(i, 9) * 0.07}s`}>
                  <TestimonialCard card={card} />
                </RevealCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}