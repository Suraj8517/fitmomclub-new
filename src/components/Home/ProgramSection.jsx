import { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Clock, Heart,
  Activity, User, Stethoscope
} from "lucide-react";
import handleConsultation from "../Helper/handleClick";

gsap.registerPlugin(ScrollTrigger);

// True on phones / small tablets — animations start earlier and run a bit
// faster there, so content never scrolls away before its entrance plays.
const isMobile = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

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

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ────────────────────────────────────────────────────────────────────────── */
/* Animation helpers. Every animated element is tagged with a data attribute: */
/*   data-head   header copy        data-card   card wrapper (GSAP-owned)     */
/*   data-badge  tag + icon badges  data-feat   feature rows                  */
/*   data-cta    card footer button data-nav    arrows / dots / counter       */
/* The inner card keeps its own CSS hover transform, so the two never clash.  */
/* ────────────────────────────────────────────────────────────────────────── */
const CLEAR = "opacity,transform,filter";

function buildCardsTimeline(tl, root, { x, at = 0 }) {
  const cards = root.querySelectorAll("[data-card]");
  const badges = root.querySelectorAll("[data-badge]");
  const feats = root.querySelectorAll("[data-feat]");
  const ctas = root.querySelectorAll("[data-cta]");

  gsap.set(cards, { opacity: 0, x, scale: 0.96 });
  gsap.set(badges, { scale: 0 });
  gsap.set(feats, { opacity: 0, y: 12 });
  gsap.set(ctas, { opacity: 0, y: 20 });

  tl.to(
    cards,
    { opacity: 1, x: 0, scale: 1, duration: 1, stagger: 0.14, ease: "power4.out", clearProps: CLEAR },
    at
  )
    .to(
      badges,
      { scale: 1, duration: 0.7, stagger: 0.07, ease: "back.out(2.2)", clearProps: "transform" },
      at + 0.45
    )
    .to(
      feats,
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.035, ease: "power3.out", clearProps: CLEAR },
      at + 0.55
    )
    .to(
      ctas,
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power4.out", clearProps: CLEAR },
      at + 0.95
    );
  return tl;
}

function PlanCard({ plan }) {
  const { icon: Icon, name, subtitle, tag, duration, features } = plan;
  const [expanded, setExpanded] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [btnActive, setBtnActive] = useState(false);

  const visible = expanded ? features : features.slice(0, PREVIEW_COUNT);
  const hasMore = features.length > PREVIEW_COUNT;

  return (
    // data-card is animated by GSAP; the inner div owns the hover transform.
    <div data-card className="h-full">
      <div
        className="relative flex h-full flex-col rounded-[28px]"
        style={{
          backgroundColor: C.bg,
          border: `1px solid ${C.border}`,
          minHeight: 540,
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
          data-badge
          className="absolute bg-teal-600 top-5 left-5 text-[12px] sm:text-[13px] md:text-sm font-semibold px-3 py-1 rounded-full"
          style={{
            background: "linear-gradient(90deg,#50ffaa,#00d4ff)",
            letterSpacing: "0.02em",
            textDecoration: "none",
            boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
          }}
        >
          {tag}
        </span>

        {/* Icon badge */}
        <div
          data-badge
          className=" bg-teal-600 absolute top-[-32px] left-[43%] w-16 h-16 rounded-full flex items-center justify-center border-[5px] border-white"
          style={{
            background: "linear-gradient(90deg,#50ffaa,#00d4ff)",
            letterSpacing: "0.02em",
            textDecoration: "none",
            boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
          }}
        >
          <Icon size={24} color="#062019" strokeWidth={1.75} />
        </div>

        <div className="overflow-hidden flex flex-col flex-1">
          {/* Card top */}
          <div className="pt-14 pb-5 px-9 border-b" style={{ borderColor: C.border }}>
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
                <li key={i} data-feat className="flex items-start gap-3">
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
                onMouseEnter={e => (e.currentTarget.style.opacity = 0.6)}
                onMouseLeave={e => (e.currentTarget.style.opacity = 1)}
              >
                {expanded
                  ? <><ChevronUp size={15} /> Show less</>
                  : <><ChevronDown size={15} /> +{features.length - PREVIEW_COUNT} more</>}
              </button>
            )}
          </div>

          {/* Footer CTA */}
          <div
            data-cta
            className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-4 rounded-b-[28px]"
            style={{ background: C.footerGrad }}
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
      </div>
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

  const sectionRef = useRef(null);
  const swapDirRef = useRef(1); // 1 = next (cards enter from right), -1 = prev

  const VISIBLE_DESKTOP = 3;
  const VISIBLE_MOBILE = 1;

  const canPrevDesktop = startIndex > 0;
  const canNextDesktop = startIndex + VISIBLE_DESKTOP < plans.length;

  const canPrevMobile = startIndex > 0;
  const canNextMobile = startIndex + VISIBLE_MOBILE < plans.length;

  const prev = (visibleCount) => {
    if (startIndex > 0) {
      swapDirRef.current = -1;
      setStartIndex(i => Math.max(0, i - visibleCount));
      setAnimKey(k => k + 1);
    }
  };

  const next = (visibleCount) => {
    if (startIndex + visibleCount < plans.length) {
      swapDirRef.current = 1;
      setStartIndex(i => Math.min(plans.length - visibleCount, i + visibleCount));
      setAnimKey(k => k + 1);
    }
  };

  const goTo = (index) => {
    swapDirRef.current = index >= startIndex ? 1 : -1;
    setStartIndex(index);
    setAnimKey(k => k + 1);
  };

  // ─── Scroll-driven entrance ────────────────────────────────────────────────
  // Plays when the section reaches the viewport — whether you scroll down into
  // it or back up into it — and resets once it leaves, so it replays each time.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return undefined;

    const q = gsap.utils.selector(section);
    let tl = null;

    const hideAll = () => {
      gsap.set(q("[data-head]"), { opacity: 0, y: 40, filter: "blur(8px)" });
      gsap.set(q("[data-nav]"), { opacity: 0, y: 12 });
    };

    const play = () => {
      tl?.kill();
      hideAll();
      tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(q("[data-head]"), {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
        clearProps: CLEAR,
      });

      buildCardsTimeline(tl, section, { x: 90, at: 0.3 });

      tl.to(
        q("[data-nav]"),
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, clearProps: CLEAR },
        ">-0.2"
      );

      if (isMobile()) tl.timeScale(1.3);
    };

    const reset = () => {
      tl?.kill();
      tl = null;
      hideAll();
      gsap.set(q("[data-card]"), { opacity: 0, x: 90, scale: 0.96 });
      gsap.set(q("[data-badge]"), { scale: 0 });
      gsap.set(q("[data-feat]"), { opacity: 0, y: 12 });
      gsap.set(q("[data-cta]"), { opacity: 0, y: 20 });
    };

    // Start hidden before the first paint, then let ScrollTrigger decide.
    reset();

    const st = ScrollTrigger.create({
      trigger: section,
      start: () => (isMobile() ? "top 92%" : "top 75%"),
      end: "bottom 15%",
      onEnter: play,
      onEnterBack: play,
      onLeave: reset,
      onLeaveBack: reset,
    });

    return () => {
      st.kill();
      tl?.kill();
      gsap.set(
        q("[data-head],[data-card],[data-badge],[data-feat],[data-cta],[data-nav]"),
        { clearProps: "all" }
      );
    };
  }, []);

  // ─── Carousel swap: new cards slide in from the direction of travel ────────
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || animKey === 0 || prefersReducedMotion()) return undefined;

    const swapRoots = section.querySelectorAll("[data-swap]");
    const tl = gsap.timeline();
    swapRoots.forEach((root) => {
      buildCardsTimeline(tl, root, { x: 70 * swapDirRef.current, at: 0 });
    });
    return () => tl.kill();
  }, [animKey]);

  return (
    <section
      id="programs"
      ref={sectionRef}
      className="px-4 sm:px-6 md:px-8 py-10 sm:py-20 md:py-24"
      style={{ backgroundColor: C.pageBg, overflowX: "clip" }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Section header */}
        <div className="w-full flex flex-col items-center justify-center text-center px-6 pb-14">
          <h1
            data-head
            className="text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-[#1d1d1f] leading-[1.07] tracking-tight max-w-5xl 2xl:max-w-6xl mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            FitMom Club Plans
          </h1>
          <p
            data-head
            className="text-lg sm:text-xl lg:text-2xl text-[#6e6e73] leading-relaxed mb-8 max-w-3xl"
          >
            Customized. Effective. Nurturing.<br className="hidden sm:block" /> Expert-backed solutions to fit your lifestyle.
          </p>
          <a
            data-head
            href="#"
            className="inline-flex items-center gap-2 text-[#1d1d1f] text-lg sm:text-xl font-medium hover:underline underline-offset-4"
          >
            See how it works
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* ── MOBILE: 1 card at a time ── */}
        <div className="lg:hidden">
          <div key={`mobile-${animKey}`} data-swap className="pt-8">
            <PlanCard plan={plans[startIndex]} />
          </div>

          {/* Mobile nav */}
          <div
            data-nav
            className="mt-8 flex items-center justify-between px-1"
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
          <p data-nav className="text-center text-sm text-[#86868b] mt-4 font-medium">
            {startIndex + 1} of {plans.length}
          </p>
        </div>

        {/* ── DESKTOP: 3 cards with carousel ── */}
        <div className="hidden lg:block">
          <div
            key={`desktop-${animKey}`}
            data-swap
            className="grid grid-cols-3 gap-7 pt-8"
          >
            {plans.slice(startIndex, startIndex + VISIBLE_DESKTOP).map((plan, i) => (
              <PlanCard key={startIndex + i} plan={plan} />
            ))}
          </div>

          {/* Desktop nav */}
          <div data-nav className="mt-8 flex items-center justify-end gap-3">
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