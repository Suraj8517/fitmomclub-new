import React, { useEffect, useRef, useState } from "react";
import img1 from "../../assets/our app/mockup-left.png"
import img2 from "../../assets/our app/mockup-right.png"
import img3 from "../../assets/our app/mockup-mid.png"
import img4 from "../../assets/our app/mockup-left-end.png"
import img5 from "../../assets/our app/mockup-right-end.png"

const FAR_LEFT_SRC = img4;
const LEFT_SRC = img1;
const CENTER_SRC = img3;
const RIGHT_SRC = img2;
const FAR_RIGHT_SRC = img5;

/** Fires once the ref'd element enters the viewport and stays true afterward.
 *  Only triggers from an actual scroll intersection — no timer fallback.
 *  IMPORTANT: never attach this ref to an element that's conditionally
 *  display:none (e.g. "md:hidden") — a hidden element has a zero-size
 *  bounding box and can never register as intersecting. */
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
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function Placeholder({ label }) {
  return (
    <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-2 "
      style={{ background: "linear-gradient(135deg, #e0e0e8, #4db8a5)" }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#a78bfa" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="#a78bfa" />
        <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-[11px] text-[#888] text-center px-4 font-poppins">{label}</p>
    </div>
  );
}

/**
 * Reveal wrapper: keeps the OUTER div doing pure positioning (untouched,
 * same math as your original code) and puts the fade/slide animation on
 * an INNER div using a simple CSS transition driven directly by React
 * state. This avoids CSS custom properties + calc() combos inside
 * keyframes, which is a much more fragile technique.
 */
function RevealImg({ from, inView, delay, children }) {
  const offset =
    from === "left" ? "translateX(-60px)" :
    from === "right" ? "translateX(60px)" :
    "translateY(70px) scale(0.92)"; // from === "center"

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0) translateY(0) scale(1)" : offset,
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}`,
      }}
    >
      {children}
    </div>
  );
}

function PhoneFan({
  heightStyle,
  sideOffset,
  farOffset,
  sideSize,
  farSize,
  centerSize,
  sideShadow,
  farShadow,
  centerShadow,
  inView,
}) {
  return (
    <div
      className="relative flex items-end justify-center w-full max-w-[1100px]"
      style={{ height: heightStyle }}
    >
      {/* Far-left image */}
      <div
        className="absolute z-[0] lg:left-[23%] right-[48%] lg:bottom-12 bottom-[10%]"
        style={{
          transform: `translateX(-50%) translateX(-${farOffset})`,
          width: farSize.width,
          height: farSize.height,
          filter: `drop-shadow(0 14px 28px rgba(0,0,0,${farShadow}))`,
        }}
      >
        <RevealImg from="left" inView={inView} delay="0.05s">
          {FAR_LEFT_SRC ? (
            <img src={FAR_LEFT_SRC} alt="App screen far left" className="w-full h-full object-contain" />
          ) : (
            <Placeholder label="Mockup image far left" />
          )}
        </RevealImg>
      </div>

      {/* Left image */}
      <div
        className="absolute z-[1] lg:right-[50%] right-[30%] lg:bottom-0 bottom-[3%]"
        style={{
          transform: `translateX(-50%) translateX(-${sideOffset})`,
          width: sideSize.width,
          height: sideSize.height,
          filter: `drop-shadow(0 16px 32px rgba(0,0,0,${sideShadow}))`,
        }}
      >
        <RevealImg from="left" inView={inView} delay="0.18s">
          {LEFT_SRC ? (
            <img src={LEFT_SRC} alt="App screen 1" className="w-full h-full object-contain" />
          ) : (
            <Placeholder label="Mockup image 1" />
          )}
        </RevealImg>
      </div>

      {/* Center image */}
      <div
        className="absolute z-[3] lg:left-[50%] left-[50%]"
        style={{
          bottom: 0,
          transform: "translateX(-50%)",
          width: centerSize.width,
          height: centerSize.height,
          filter: `drop-shadow(0 24px 48px rgba(0,0,0,${centerShadow}))`,
        }}
      >
        <RevealImg from="center" inView={inView} delay="0.3s">
          {CENTER_SRC ? (
            <img src={CENTER_SRC} alt="App screen 2" className="w-full h-full object-contain" />
          ) : (
            <Placeholder label="Mockup image 2" />
          )}
        </RevealImg>
      </div>

      {/* Right image */}
      <div
        className="absolute z-[1] lg:left-[40%] left-[52%] lg:bottom-0 bottom-[3%]"
        style={{
          transform: `translateX(-50%) translateX(${sideOffset})`,
          width: sideSize.width,
          height: sideSize.height,
          filter: `drop-shadow(0 16px 32px rgba(0,0,0,${sideShadow}))`,
        }}
      >
        <RevealImg from="right" inView={inView} delay="0.18s">
          {RIGHT_SRC ? (
            <img src={RIGHT_SRC} alt="App screen 3" className="w-full h-full object-contain" />
          ) : (
            <Placeholder label="Mockup image 3" />
          )}
        </RevealImg>
      </div>

      {/* Far-right image */}
      <div
        className="absolute z-[0] lg:left-[34%] left-[53%] lg:bottom-12 bottom-[10%]"
        style={{
          transform: `translateX(-50%) translateX(${farOffset})`,
          width: farSize.width,
          height: farSize.height,
          filter: `drop-shadow(0 14px 28px rgba(0,0,0,${farShadow}))`,
        }}
      >
        <RevealImg from="right" inView={inView} delay="0.05s">
          {FAR_RIGHT_SRC ? (
            <img src={FAR_RIGHT_SRC} alt="App screen far right" className="w-full h-full object-contain" />
          ) : (
            <Placeholder label="Mockup image far right" />
          )}
        </RevealImg>
      </div>
    </div>
  );
}

export default function PhoneMockupSection() {
  // Ref lives on a wrapper that is ALWAYS rendered (never display:none),
  // so the observer can measure it on every screen size.
  const [fanRef, fanInView] = useInView({ threshold: 0.1 });
  const [textRef, textInView] = useInView();

  return (
    <section className="w-full flex flex-col items-center bg-[#F6F5F1] px-4 sm:px-6 ">
      <style>{`
        .pm-text {
          opacity: 0;
        }
        .pm-text[data-inview="true"] {
          animation: pmTextUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes pmTextUp {
          from { opacity: 0; transform: translate3d(0, 24px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pm-text { opacity: 1 !important; animation: none !important; transform: none !important; }
        }
      `}</style>

      {/* Always-rendered wrapper carries the observer ref */}
      <div ref={fanRef} className="w-full flex flex-col items-center">
        {/* Mobile fan — tighter spacing, hidden md+ */}
        <div className="md:hidden w-full flex justify-center" style={{ transform: "translateY(-4%)" }}>
          <PhoneFan
            heightStyle="clamp(290px, 58vw, 280px)"
            sideOffset="clamp(26px, 13vw, 60px)"
            farOffset="clamp(48px, 24vw, 100px)"
            sideSize={{ width: "clamp(258px, 15vw,290px)", height: "clamp(242px, 32vw, 290px)" }}
            farSize={{ width: "clamp(220px, 13vw, 250px)", height: "clamp(200px, 27vw, 250px)" }}
            centerSize={{ width: "clamp(290px, 18vw, 322px)", height: "clamp(266px, 38vw, 310px)" }}
            sideShadow="0.16"
            farShadow="0.12"
            centerShadow="0.2"
            inView={fanInView}
          />
        </div>

        {/* Desktop fan — original spacing, hidden below md */}
        <div className="hidden md:flex w-full justify-center" style={{ transform: "translateY(-6%)" }}>
          <PhoneFan
            heightStyle="clamp(300px, 50vw, 540px)"
            sideOffset="clamp(120px, 19vw, 210px)"
            farOffset="clamp(220px, 34vw, 380px)"
            sideSize={{ width: "clamp(140px, 19vw, 220px)", height: "clamp(290px, 40vw, 500px)" }}
            farSize={{ width: "clamp(110px, 15vw, 180px)", height: "clamp(230px, 32vw, 400px)" }}
            centerSize={{ width: "clamp(170px, 23vw, 250px)", height: "clamp(350px, 48vw, 510px)" }}
            sideShadow="0.18"
            farShadow="0.12"
            centerShadow="0.22"
            inView={fanInView}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-2 sm:px-0 pt-4">
        <p
          ref={textRef}
          data-inview={textInView}
          className="pm-text font-semibold text-sm sm:text-base md:text-lg text-center text-black/50 leading-relaxed"
        >
          At FitMom Club, we believe in a unique, personalized approach to fitness. We begin by assessing your fitness level, health conditions, and personal goals to design a plan just for you. With tailored workouts and expert guidance, we help you achieve sustainable results in your wellness journey.
        </p>
      </div>
    </section>
  );
}