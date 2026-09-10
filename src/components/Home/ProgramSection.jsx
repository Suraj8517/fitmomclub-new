import { useState, useEffect, useRef } from "react";
import {
  ArrowRight, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Clock, Heart,
  Activity, User, Stethoscope
} from "lucide-react";
import handleConsultation from "../Helper/handleClick";
const PREVIEW_COUNT = 4;

const plans = [
  {
    icon: Heart,
    name: "Prenatal Conditions",
    subtitle: "Weight Management",
    tag: "Blossom",
    duration: "6 / 9 / 12 months",
    features: [
      "Input Call + Induction Call + 3 review calls with nutrition experts (1st month)",
      "Induction Call + Post Plan Call + 2 review calls with fitness experts (1st month)",
      "Customised diet plan with periodic revisions",
      "36+ live group prenatal workout sessions",
      "Diet & fitness review calls — twice monthly",
      "Meal plate review and progress follow-up on WhatsApp",
      "Access to recipe vault",
    ],
  },
  {
    icon: Activity,
    name: "Postnatal Conditions",
    subtitle: "Weight Management",
    tag: "Queen",
    duration: "6 / 9 / 12 months",
    features: [
      "Input Call + Induction Call + 3 review calls with nutrition experts (1st month)",
      "Induction Call + Post Plan Call + 2 review calls with fitness experts (1st month)",
      "Customised diet plan with periodic revisions",
      "41+ live group postnatal & DR workout sessions",
      "Diet & fitness review calls — twice monthly",
      "Meal plate review and progress follow-up on WhatsApp",
      "Monthly revisions to diet plan",
      "Access to recipe vault",
    ],
  },
  {
    icon: User,
    name: "No Health Conditions",
    subtitle: "Weight Management",
    tag: "Pro",
    duration: "6 / 9 / 12 months",
    features: [
      "Input Call + Induction Call + 3 review calls with nutrition experts (1st month)",
      "Customised diet plan with periodic revisions",
      "23+ live group workout sessions",
      "Diet review calls — twice monthly",
      "Daily meal plate review and progress follow-up on WhatsApp",
      "Access to recipe vault",
    ],
  },
  {
    icon: Stethoscope,
    name: "With Health Conditions",
    subtitle: "Weight Management",
    tag: "Elite",
    duration: "6 / 9 / 12 months",
    features: [
      "Input Call + Induction Call + 3 review calls with nutrition experts (1st month)",
      "Induction Call + Post Plan Call + 2 review calls with fitness experts (1st month)",
      "Customised diet & workout plan with periodic revisions",
      "41+ live group workout sessions",
      "Diet & fitness review calls — twice monthly",
      "Daily meal plate review and progress follow-up on WhatsApp",
      "Access to recipe vault",
    ],
  },
];

const C = {
  black: "#1d1d1f",
  blackHover: "#000000",
  bg: "#ffffff",
  pageBg: "#F6F5F1",
  border: "#e8e8ed",
  text: "#1d1d1f",
  textMid: "#6e6e73",
  textMuted: "#424245",
  footerGrad: "linear-gradient(to bottom, transparent 0%, #ffffff 45%)",
};

// ── Timing (slowed down, cinematic pacing) ──────────────────────────
// How long each card's own slide-in animation runs.
const CONTAINER_DURATION = 0.9;
// Breathing room between a card finishing and its CTA starting.
const CONTAINER_GAP = 0.2;
// Stagger between one card's entrance and the next card's.
const CARD_STAGGER = 0.18;
// How long the CTA button's fade/rise takes.
const CTA_DURATION = 0.7;
// Breathing room between the last CTA finishing and the nav row appearing.
const CTA_GAP = 0.2;

// Works out when the prev/next nav row should appear: only once every
// visible card AND its button have fully finished animating in.
function navDelay(visibleCount) {
  return (
    (visibleCount - 1) * CARD_STAGGER +
    CONTAINER_DURATION +
    CONTAINER_GAP +
    CTA_DURATION +
    CTA_GAP
  );
}

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let skippedInitial = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!skippedInitial) {
          skippedInitial = true;
          return;
        }

        setInView(entry.isIntersecting);
      },
      {
        threshold: 0,
    
        rootMargin: "0px 0px -35% 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function PlanCard({ plan, animIndex }) {
  const { icon: Icon, name, subtitle, tag, duration, features } = plan;
  const [expanded, setExpanded] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [btnActive, setBtnActive] = useState(false);

  const visible = expanded ? features : features.slice(0, PREVIEW_COUNT);
  const hasMore = features.length > PREVIEW_COUNT;

  const containerDelay = animIndex * CARD_STAGGER;
  const buttonDelay = containerDelay + CONTAINER_DURATION + CONTAINER_GAP;

  return (
    <div
      className="relative flex flex-col rounded-[28px]"
      style={{
        backgroundColor: C.bg,
        border: `1px solid ${C.border}`,
        minHeight: 540,
        animation: `slideInRight ${CONTAINER_DURATION}s cubic-bezier(0.22,1,0.36,1) ${containerDelay}s both`,
        transition: "box-shadow 0.35s ease, transform 0.35s ease, border-color 0.35s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.10)";
        e.currentTarget.style.borderColor = "transparent";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = C.border;
      }}
    >
      {/* Tag badge */}
      <span
        className="absolute bg-teal-600 top-5 left-5 text-[12px] sm:text-[13px] md:text-sm font-semibold px-3 py-1 rounded-full"
         style={{
          background: "linear-gradient(90deg,#50ffaa,#00d4ff)",
          letterSpacing: "0.02em",
          textDecoration: "none",
          boxShadow: "0 6px 16px rgba(0,0,0,0.18)"
        }}
      >
        {tag}
      </span>

      {/* Icon badge */}
      <div
        className=" bg-teal-600 absolute top-[-32px] left-[43%] w-16 h-16 rounded-full flex items-center justify-center border-[5px] border-white"
     style={{
          background: "linear-gradient(90deg,#50ffaa,#00d4ff)",
          letterSpacing: "0.02em",
          textDecoration: "none",
          boxShadow: "0 6px 16px rgba(0,0,0,0.18)"
        }}
      >
        <Icon size={24} color="#062019" strokeWidth={1.75} />
      </div>

      <div className="overflow-hidden flex flex-col flex-1">
        {/* Card top */}
        <div className="pt-14 pb-5 px-9 border-b" style={{ borderColor: C.border }} >
          <p className="text-2xl sm:text-[26px] md:text-3xl lg:text-[27px] xl:text-3xl font-semibold leading-[1.15] tracking-tight" style={{ color: C.text }}>
            {name}
          </p>
          <p className="text-sm sm:text-base md:text-[17px] mt-1.5" style={{ color: C.textMid }}>
            {subtitle}
          </p>
          <div className="flex items-center gap-2 mt-3.5" style={{ color: C.textMuted }}>
            <Clock size={16} strokeWidth={1.75} />
            <span className="text-sm sm:text-[15px] md:text-base font-medium">{duration}</span>
          </div>
        </div>

        {/* Features */}
        <div className="px-9 pt-5 pb-24 flex-1">
          <ul className="flex flex-col gap-3.5">
            {visible.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-3"
                style={{ animation: `fadeUp 0.55s ease ${containerDelay + 0.15 + i * 0.06}s both` }}
              >
                <span
                  className="mt-[9px] shrink-0 rounded-full"
                  style={{ width: 6, height: 6, backgroundColor: C.black }}
                />
                <span className="text-[15px] sm:text-base md:text-[16px] lg:text-[15px] xl:text-base leading-relaxed" style={{ color: C.textMuted }}>
                  {f}
                </span>
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="mt-3.5 flex items-center gap-1.5 text-sm sm:text-[15px] font-semibold transition-colors"
              style={{ color: C.black, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.6}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}
            >
              {expanded
                ? <><ChevronUp size={15} /> Show less</>
                : <><ChevronDown size={15} /> +{features.length - PREVIEW_COUNT} more</>}
            </button>
          )}
        </div>

        {/* Footer CTA — its entrance only starts once the container's
            own slide-in animation has fully finished. */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-4 rounded-b-[28px]"
          style={{
            background: C.footerGrad,
            opacity: 0,
            animation: `ctaFadeUp ${CTA_DURATION}s cubic-bezier(0.22,1,0.36,1) ${buttonDelay}s both`,
          }}
        >
          <button
          onClick={handleConsultation}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => { setBtnHover(false); setBtnActive(false); }}
            onMouseDown={() => setBtnActive(true)}
            onMouseUp={() => setBtnActive(false)}
            className="w-full flex items-center justify-between rounded-full py-3.5 px-6 text-sm sm:text-base md:text-[15px] font-semibold"
            style={{
              backgroundColor: btnHover ? C.blackHover : C.black,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              transform: btnActive ? "scale(0.97)" : btnHover ? "scale(1.015)" : "scale(1)",
              boxShadow: btnHover && !btnActive ? "0 10px 24px rgba(0,0,0,0.25)" : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
            }}
          >
            Make Appointment
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.18)",
                transform: btnHover ? "translateX(4px)" : "translateX(0)",
                transition: "transform 0.2s",
              }}
            >
              <ArrowRight size={15} color="#fff" />
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(70px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ctaFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function NavBtn({ onClick, disabled, children, ...rest }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => !disabled && setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        width: 44, height: 44,
        borderRadius: "50%",
        border: `1px solid ${hover ? C.black : "#d2d2d7"}`,
        backgroundColor: hover ? C.black : "#fff",
        color: hover ? "#fff" : C.black,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.3 : 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: active ? "scale(0.92)" : hover ? "scale(1.06)" : "scale(1)",
        transition: "background 0.2s, transform 0.15s, border-color 0.2s, color 0.2s",
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export default function ProgramSection() {
  // Shared index state used by both mobile (1 card) and desktop (3 cards)
  const [startIndex, setStartIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  // Scroll-triggered entrance for the whole section — replays every
  // time the section scrolls into view, resets when it scrolls out.
  const [sectionRef, isVisible] = useInView();

  const VISIBLE_DESKTOP = 3;
  const VISIBLE_MOBILE = 1;

  // Nav row (arrows + dots) only appears once every visible card and
  // its "Make Appointment" button have fully finished animating in.
  const mobileNavDelay = navDelay(VISIBLE_MOBILE);
  const desktopNavDelay = navDelay(VISIBLE_DESKTOP);

  const canPrevDesktop = startIndex > 0;
  const canNextDesktop = startIndex + VISIBLE_DESKTOP < plans.length;

  const canPrevMobile = startIndex > 0;
  const canNextMobile = startIndex + VISIBLE_MOBILE < plans.length;

  const prev = (visibleCount) => {
    if (startIndex > 0) {
      setStartIndex(i => Math.max(0, i - visibleCount));
      setAnimKey(k => k + 1);
    }
  };

  const next = (visibleCount) => {
    if (startIndex + visibleCount < plans.length) {
      setStartIndex(i => Math.min(plans.length - visibleCount, i + visibleCount));
      setAnimKey(k => k + 1);
    }
  };

  const goTo = (index) => {
    setStartIndex(index);
    setAnimKey(k => k + 1);
  };

  // Slow, staggered rise for the header — slides in while visible,
  // drops out quickly (no delay) when it scrolls out of view so it's
  // reset and ready to replay next time.
  const headerStyle = (delay) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(32px)",
    transition: isVisible
      ? `opacity 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}s`
      : "opacity 0.35s ease, transform 0.35s ease",
  });

  // Nav row fade — waits for cards to finish on the way in, fades out
  // immediately on the way out.
  const navStyle = (delay) => ({
    opacity: isVisible ? 1 : 0,
    transition: isVisible
      ? `opacity 0.7s ease ${delay}s`
      : "opacity 0.3s ease",
  });

  return (
    <section id="programs"
      ref={sectionRef}
      className="px-4 sm:px-6 md:px-8 py-10 sm:py-20 md:py-24"
      style={{ backgroundColor: C.pageBg }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Section header */}
        <div className="w-full flex flex-col items-center justify-center text-center px-6 pb-14">
          <h1
            className="text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-[#1d1d1f] leading-[1.07] tracking-tight max-w-5xl 2xl:max-w-6xl mb-6"
            style={{ letterSpacing: "-0.02em", ...headerStyle(0) }}
          >
            FitMom Club Plans
          </h1>
          <p
            className="text-lg sm:text-xl lg:text-2xl text-[#6e6e73] leading-relaxed mb-8 max-w-3xl"
            style={headerStyle(0.18)}
          >
            Customized. Effective. Nurturing.<br className="hidden sm:block" /> Expert-backed solutions to fit your lifestyle.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-[#1d1d1f] text-lg sm:text-xl font-medium hover:underline underline-offset-4"
            style={headerStyle(0.36)}
          >
            See how it works
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* ── MOBILE: 1 card at a time ── */}
        <div className="lg:hidden">
          {isVisible && (
            <div key={`mobile-${animKey}`} className="pt-8">
              <PlanCard plan={plans[startIndex]} animIndex={0} />
            </div>
          )}

          {/* Mobile nav — appears only after the card + its button
              have fully finished animating in */}
          <div
            className="mt-8 flex items-center justify-between px-1"
            style={navStyle(mobileNavDelay)}
          >
            <NavBtn onClick={() => prev(1)} disabled={!canPrevMobile} aria-label="Previous">
              <ChevronLeft size={18} />
            </NavBtn>

            {/* Dot indicators */}
            <div className="flex items-center gap-2.5">
              {plans.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to plan ${i + 1}`}
                  className="rounded-full transition-all duration-300 focus:outline-none"
                  style={{
                    width: i === startIndex ? 26 : 9,
                    height: 9,
                    backgroundColor: i === startIndex ? C.black : "#d2d2d7",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <NavBtn onClick={() => next(1)} disabled={!canNextMobile} aria-label="Next">
              <ChevronRight size={18} />
            </NavBtn>
          </div>

          {/* Plan counter */}
          <p
            className="text-center text-sm text-[#86868b] mt-4 font-medium"
            style={navStyle(mobileNavDelay + 0.1)}
          >
            {startIndex + 1} of {plans.length}
          </p>
        </div>

        {/* ── DESKTOP: 3 cards with carousel ── */}
        <div className="hidden lg:block">
          {isVisible && (
            <div key={`desktop-${animKey}`} className="grid grid-cols-3 gap-7 pt-8">
              {plans.slice(startIndex, startIndex + VISIBLE_DESKTOP).map((plan, i) => (
                <PlanCard key={startIndex + i} plan={plan} animIndex={i} />
              ))}
            </div>
          )}

          {/* Desktop nav — appears only after all 3 cards + their
              buttons have fully finished animating in */}
          <div
            className="mt-8 flex items-center justify-end gap-3"
            style={navStyle(desktopNavDelay)}
          >
            <div className="flex items-center gap-2 mr-3">
              {plans.map((_, i) => {
                const active = i >= startIndex && i < startIndex + VISIBLE_DESKTOP;
                return (
                  <span
                    key={i}
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: active ? 22 : 9,
                      height: 9,
                      backgroundColor: active ? C.black : "#d2d2d7",
                    }}
                  />
                );
              })}
            </div>
            <NavBtn onClick={() => prev(1)} disabled={!canPrevDesktop} aria-label="Previous">
              <ChevronLeft size={18} />
            </NavBtn>
            <NavBtn onClick={() => next(1)} disabled={!canNextDesktop} aria-label="Next">
              <ChevronRight size={18} />
            </NavBtn>
          </div>
        </div>

      </div>
    </section>
  );
}