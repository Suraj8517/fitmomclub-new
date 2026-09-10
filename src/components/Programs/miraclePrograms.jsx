import { useState } from "react";
import {
  ArrowRight, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Clock, Heart,
  Activity, User, Stethoscope
} from "lucide-react";
import handleConsultation from "../Helper/handleClick";
const PREVIEW_SECTIONS = 2;

const sharedSection1 = [
  {
    title: "Personal Health Coaches",
    items: [
      "Certified Fitcoach",
      "Physiotherapist",
      "Clinical Dietitian",
    ],
  },
  {
    title: "Premium Services",
    items: [
      "Input call + Induction call + 2 Review calls",
    ],
  },
  {
    title: "Special Features",
    items: [
      "Blood work monitoring",
      "Habit inculcation",
      "Lifestyle modification",
      "Addition of super foods",
    ],
  },
  {
    title: "Add Ons",
    items: [
      "Meditation techniques",
    ],
  },
  {
    title: "Complementary",
    items: [
      "Fitness/ Nutrition Webinars",
      "Handouts and checklist on stress, sleep, unhealthy habits, environmental factors and intimacy management",
    ],
  },
];
const sharedSection2 = [
  {
    title: "Personal Health Coaches",
    items: [
      "Clinical Dietitian",
    ],
  },
  {
    title: "Premium Services",
    items: [
      "Input call + Induction call + 2 Review calls",
    ],
  },
  {
    title: "Special Features",
    items: [
      "Blood work monitoring",
      "Habit inculcation",
      "Lifestyle modification",
      "Addition of super foods",
    ],
  },
  {
    title: "Add Ons",
    items: [
      "Meditation techniques",
    ],
  },
  {
    title: "Complementary",
    items: [
      "Fitness/ Nutrition Webinars",
      "Handouts and checklist on stress, sleep, unhealthy habits, environmental factors and intimacy management",
    ],
  },
];

const plans = [
  {
    icon: Heart,
    name: "Natural Conception",
    subtitle: "Tailored To Fit Your Needs",
    tag: "TTC Naturally",
    duration: "6 / 9 / 12 months",
    features: [
      "Customized Diet Plan",
      "Live group workout sessions - Cardio, Yoga & S&C",
      "Diet review call -Monthly twice",
      "Meal plate review and progress follow-up in WhatsApp",
      "Diet & fitness review calls — twice monthly",
      "Meal plate review and progress follow-up on WhatsApp",
      "Monthly revisions in the diet plan",
      "Access to recipe vault",
    ],
    sections: sharedSection1,
  },
  {
    icon: Activity,
    name: "Postnatal Conditions",
    subtitle: "Tailored To Fit Your Needs",
    tag: "TTC Treatment",
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
    sections: sharedSection2,
  },
];

const C = {
  black: "#1d1d1f",
  blackHover: "#000000",
  bg: "#ffffff",
  pageBg: "#f6f4f0",
  border: "#e8e8ed",
  text: "#1d1d1f",
  textMid: "#6e6e73",
  textMuted: "#424245",
  footerGrad: "linear-gradient(to bottom, transparent 0%, #ffffff 45%)",
};


function PlanCard({ plan, animIndex }) {
  const { icon: Icon, name, subtitle, tag, duration, sections } = plan;
  const [expanded, setExpanded] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [btnActive, setBtnActive] = useState(false);

  const visibleSections = expanded ? sections : sections.slice(0, PREVIEW_SECTIONS);
  const hasMore = sections.length > PREVIEW_SECTIONS;
  const hiddenCount = sections.length - PREVIEW_SECTIONS;

  return (
    <div
      className="relative flex flex-col rounded-[28px]"
      style={{
        backgroundColor: C.bg,
        border: `1px solid ${C.border}`,
        minHeight: 540,
        animation: `slideInRight 0.55s cubic-bezier(0.22,1,0.36,1) ${animIndex * 0.1}s both`,
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
        className="absolute top-5 left-5 text-[12px] sm:text-[13px] md:text-sm font-semibold px-3 py-1 rounded-full"
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
        className=" absolute top-[-32px] left-[43%] w-16 h-16 rounded-full flex items-center justify-center border-[5px] border-white"
         style={{
          background: "linear-gradient(90deg,#50ffaa,#00d4ff)",
          letterSpacing: "0.02em",
          textDecoration: "none",
          boxShadow: "0 6px 16px rgba(0,0,0,0.18)"
        }}>
      
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

        {/* Titled feature sections */}
        <div className="px-9 pt-5 pb-24 flex-1">
          <div className="flex flex-col gap-5">
            {visibleSections.map((section, sIdx) => (
              <div
                key={section.title}
                style={{ animation: `fadeUp 0.4s ease ${sIdx * 0.05}s both` }}
              >
                <p
                  className="text-[11px] sm:text-xs font-bold uppercase mb-2"
                  style={{ color: C.black, letterSpacing: "0.06em" }}
                >
                  {section.title}
                </p>
                <ul className="flex flex-col gap-2">
                  {section.items.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
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
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="mt-4 flex items-center gap-1.5 text-sm sm:text-[15px] font-semibold transition-colors"
              style={{ color: C.black, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.6}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}
            >
              {expanded
                ? <><ChevronUp size={15} /> Show less</>
                : <><ChevronDown size={15} /> +{hiddenCount} more {hiddenCount === 1 ? "section" : "sections"}</>}
            </button>
          )}
        </div>

        {/* Footer CTA */}
        <div
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

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
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

export default function MiracleProgramSection() {
  // Shared index state used by both mobile (1 card) and desktop (3 cards)
  const [startIndex, setStartIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const VISIBLE_DESKTOP = 3;
  const VISIBLE_MOBILE = 1;

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

  return (
    <section className="px-4 sm:px-6 md:px-8 py-10 sm:py-20 md:py-32" style={{ backgroundColor: C.pageBg, }}>
      <div className="mx-auto max-w-7xl">

        {/* Section header */}
        <div className="w-full flex flex-col items-center justify-center text-center px-6 pb-14">
          <h1
            className="text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-[#1d1d1f] leading-[1.07] tracking-tight max-w-5xl 2xl:max-w-6xl mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            FitMom Club <br/>Miracle Plans
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-[#6e6e73] leading-relaxed mb-8 max-w-3xl">
            Customized. Effective. Nurturing.<br className="hidden sm:block" /> Expert-backed solutions to fit your lifestyle.
          </p>
        </div>

        {/* ── MOBILE: 1 card at a time ── */}
        <div className="lg:hidden">
          <div key={`mobile-${animKey}`} className="pt-8">
            <PlanCard plan={plans[startIndex]} animIndex={0} />
          </div>

          {/* Mobile nav */}
          <div className="mt-8 flex items-center justify-between px-1">
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
          <p className="text-center text-sm text-[#86868b] mt-4 font-medium">
            {startIndex + 1} of {plans.length}
          </p>
        </div>

        {/* ── DESKTOP: 3 cards with carousel ── */}
        <div className="hidden lg:block">
          <div key={`desktop-${animKey}`} className="grid grid-cols-2 gap-7 pt-8 max-w-4xl mx-auto">
            {plans.slice(startIndex, startIndex + VISIBLE_DESKTOP).map((plan, i) => (
              <PlanCard key={startIndex + i} plan={plan} animIndex={i} />
            ))}
          </div>

          
        </div>

      </div>
    </section>
  );
}