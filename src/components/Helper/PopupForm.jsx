import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import male from "../../assets/form/male.png";
import female from "../../assets/form/female.png";

// Body-type result images — change these paths to match your project.
import maleUnderweight from "../../assets/form/male/male-underweight.png";
import maleNormal from "../../assets/form/male/male-normal.png";
import maleOverweight from "../../assets/form/male/male-overweight.png";
import maleObese from "../../assets/form/male/male-obese.png";
import maleExtremeObese from "../../assets/form/male/male-extreme-obese.png";
import femaleUnderweight from "../../assets/form/female/female-underweight.png";
import femaleNormal from "../../assets/form/female/female-normal.png";
import femaleOverweight from "../../assets/form/female/female-overweight.png";
import femaleObese from "../../assets/form/female/female-obese.png";
import femaleExtremeObese from "../../assets/form/female/female-extreme-obese.png";


const ENV_SHEET_URL = import.meta.env?.VITE_SHEET_URL || "";
console.log("ENV_SHEET_URL", ENV_SHEET_URL);
const COUNTRY_CODES = [
  { code: "+91", label: "India" },
  { code: "+1", label: "United States" },
  { code: "+44", label: "United Kingdom" },
  { code: "+61", label: "Australia" },
  { code: "+971", label: "United Arab Emirates" },
  { code: "+65", label: "Singapore" },
  { code: "+49", label: "Germany" },
  { code: "+33", label: "France" },
  { code: "+39", label: "Italy" },
  { code: "+81", label: "Japan" },
  { code: "+60", label: "Malaysia" },
  { code: "+66", label: "Thailand" },
  { code: "+62", label: "Indonesia" },
  { code: "+94", label: "Sri Lanka" },
  { code: "+92", label: "Pakistan" },
  { code: "+880", label: "Bangladesh" },
  { code: "+27", label: "South Africa" },
  { code: "+254", label: "Kenya" },
  { code: "+34", label: "Spain" },
  { code: "+46", label: "Sweden" },
  { code: "+31", label: "Netherlands" },
  { code: "+41", label: "Switzerland" },
  { code: "+52", label: "Mexico" },
  { code: "+55", label: "Brazil" },
  { code: "+63", label: "Philippines" },
  { code: "+84", label: "Vietnam" },
  { code: "+90", label: "Turkey" },
  { code: "+20", label: "Egypt" },
  { code: "+974", label: "Qatar" },
  { code: "+968", label: "Oman" },
  { code: "+973", label: "Bahrain" },
];

const GOALS = [
  "Weight Management",
  "Health Issue Management",
  "Natural Conception/Fertility",
  "Currently Pregnant",
];

const EMPTY_FORM = {
  name: "",
  email: "",
  countryCode: "",
  customCode: "",
  phone: "",
  gender: "",
  age: "",
  height: "",
  heightUnit: "cm",
  weight: "",
  weightUnit: "kg",
  city: "",
  goal: "",
  website: "", // honeypot — real users never see or fill this
};

const STEPS = ["age", "gender", "contact", "goal", "weight", "height", "result"];

/* ───────────────────────── validation & sanitising ───────────────────────── */

// Allow-lists (not block-lists)
const NAME_RE = /^\p{L}[\p{L}\p{M} .'-]{1,59}$/u; // letters, space . ' -
const CITY_RE = /^\p{L}[\p{L}\p{M} .'-]{1,59}$/u;
const EMAIL_RE =
  /^[A-Za-z0-9][A-Za-z0-9._%+-]{0,63}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,24}$/;
const PHONE_RE = /^[0-9]{7,12}$/;
const IN_PHONE_RE = /^[6-9][0-9]{9}$/; // Indian mobile numbers
const CUSTOM_CODE_RE = /^\+[0-9]{1,4}$/;

const ALLOWED_GENDERS = ["Male", "Female"];
const ALLOWED_WEIGHT_UNITS = ["kg", "lb"];
const ALLOWED_HEIGHT_UNITS = ["cm", "in"];

// Live input sanitizers (run on every keystroke)
const cleanText = (v, max = 60) =>
  String(v)
    .normalize("NFKC")
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{M} .'-]/gu, "") // drops digits, <>, =, @, quotes, emoji, control chars
    .replace(/^[^\p{L}]+/u, "") // must start with a letter
    .replace(/\s{2,}/g, " ")
    .slice(0, max);

const cleanEmail = (v) =>
  String(v)
    .replace(/[^A-Za-z0-9._%+@-]/g, "")
    .replace(/^[^A-Za-z0-9]+/, "")
    .slice(0, 254);

const cleanCode = (v) => {
  const s = String(v).replace(/[^0-9+]/g, "");
  return ("+" + s.replace(/\+/g, "")).slice(0, 5);
};

// Submit-time sanitizer: strips control / zero-width / bidi chars and
// neutralises Google Sheets formula triggers.
const FORMULA_START = /^[=+\-@\t\r|%]/;
const safeCell = (v, max = 200) => {
  const s = String(v ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "")
    .trim()
    .slice(0, max);
  return FORMULA_START.test(s) ? `'${s}` : s;
};

// UTM values: tiny allow-list
const cleanUtm = (v) => String(v || "").replace(/[^\w\-.~+ %]/g, "").slice(0, 100);

// Landing URL: http(s) only, rebuilt from parsed parts (no query/hash), length-capped
const cleanUrl = (href) => {
  try {
    const u = new URL(href);
    if (!/^https?:$/.test(u.protocol)) return "";
    return (u.origin + u.pathname).slice(0, 300);
  } catch {
    return "";
  }
};

const GENDER_OPTIONS = [
  { id: "Male", label: "Male", img: male },
  { id: "Female", label: "Female", img: female },
];

const BODY_IMAGES = {
  Male: {
    underweight: maleUnderweight,
    normal: maleNormal,
    overweight: maleOverweight,
    obese: maleObese,
    extremeObese: maleExtremeObese,
  },
  Female: {
    underweight: femaleUnderweight,
    normal: femaleNormal,
    overweight: femaleOverweight,
    obese: femaleObese,
    extremeObese: femaleExtremeObese,
  },
};

const BODY_TYPES = [
  {
    id: "underweight",
    label: "Underweight",
    max: 18.5,
    accent: "#0891B2",
    blurb: "You're on the lighter end. A structured plan can help you build muscle and strength.",
  },
  {
    id: "normal",
    label: "Normal",
    max: 25,
    accent: "#0D9488",
    blurb: "You're in a healthy range. The right plan will help you build definition and maintain it.",
  },
  {
    id: "overweight",
    label: "Overweight",
    max: 30,
    accent: "#D97706",
    blurb: "You're carrying some extra weight. A tailored plan can help you lean out and feel stronger.",
  },
  {
    id: "obese",
    label: "Obese",
    max: 40,
    accent: "#EA580C",
    blurb: "A tailored plan can help you bring your weight down steadily and safely.",
  },
  {
    id: "extremeObese",
    label: "Extreme Obese",
    max: Infinity,
    accent: "#DC2626",
    blurb: "A consistent, guided plan can help you make real progress — one step at a time.",
  },
];

const getBodyType = (bmi) =>
  BODY_TYPES.find((b) => bmi < b.max) ?? BODY_TYPES[BODY_TYPES.length - 1];

// unit helpers
const LB_PER_KG = 2.20462262;
const CM_PER_IN = 2.54;
const toKg = (v, unit) => (unit === "lb" ? v / LB_PER_KG : v);
const toCm = (v, unit) => (unit === "in" ? v * CM_PER_IN : v);

/* ───────────────────────── icons ───────────────────────── */

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconChevron(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ───────────────────────── main component ───────────────────────── */

export default function PopupForm({
  scriptURL = ENV_SHEET_URL,
  enablePageLoadTrigger = true,
  pageLoadDelay = 10000,
  buttonTriggerSelector = "[data-cpf-trigger]",
  buttonDelay = 3000,
  enableRouteChangeTrigger = true,
  routeChangeDelay = 10000,
  showFloatingButton = true,
  floatingButtonLabel = "Free Assessment",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [form, setForm] = useState(EMPTY_FORM);
  const [stepIndex, setStepIndex] = useState(0);
  const pendingTimers = useRef([]);
  const isFirstRoute = useRef(true);
  const location = useLocation();
  const routeKey = location.pathname + location.search;
  const url = ENV_SHEET_URL;
  const step = STEPS[stepIndex];

  // ---- Capture UTM params + landing page URL once, on first mount ----
  const trackingRef = useRef(null);
  if (trackingRef.current === null) {
    const params = new URLSearchParams(window.location.search);
    trackingRef.current = {
      utm_source: cleanUtm(params.get("utm_source")),
      utm_medium: cleanUtm(params.get("utm_medium")),
      utm_campaign: cleanUtm(params.get("utm_campaign")),
      utm_term: cleanUtm(params.get("utm_term")),
      utm_content: cleanUtm(params.get("utm_content")),
      page_url: cleanUrl(window.location.href),
    };
  }

  const openPopup = useCallback(() => setIsOpen(true), []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    // reset after the close animation finishes
    window.setTimeout(() => {
      setForm(EMPTY_FORM);
      setStatus("idle");
      setStepIndex(0);
    }, 250);
  }, []);

  // ---- Triggers: page load (once) + any element with data-cpf-trigger ----
  useEffect(() => {
    if (enablePageLoadTrigger) {
      const t = window.setTimeout(openPopup, pageLoadDelay);
      pendingTimers.current.push(t);
    }

    const handleClick = (e) => {
      const trigger = e.target.closest(buttonTriggerSelector);
      if (!trigger) return;
      const t = window.setTimeout(openPopup, buttonDelay);
      pendingTimers.current.push(t);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      pendingTimers.current.forEach(window.clearTimeout);
      pendingTimers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Trigger: open immediately from anywhere on the site ----
  // Any component/button can call: window.dispatchEvent(new Event("cpf:open"))
  useEffect(() => {
    const onOpen = () => setIsOpen(true);
    window.addEventListener("cpf:open", onOpen);
    return () => window.removeEventListener("cpf:open", onOpen);
  }, []);

  // ---- Trigger: react-router-dom navigation change ----
  useEffect(() => {
    if (!enableRouteChangeTrigger) return;

    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }

    const t = window.setTimeout(openPopup, routeChangeDelay);
    pendingTimers.current.push(t);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  // ---- Escape to close + body scroll lock ----
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && closePopup();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closePopup]);

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  // Convert the typed value when the unit toggle changes
  const changeWeightUnit = (unit) =>
    setForm((f) => {
      if (!ALLOWED_WEIGHT_UNITS.includes(unit) || unit === f.weightUnit) return f;
      const n = Number(f.weight);
      const weight = n
        ? String(Math.round(unit === "lb" ? n * LB_PER_KG : n / LB_PER_KG))
        : f.weight;
      return { ...f, weightUnit: unit, weight };
    });

  const changeHeightUnit = (unit) =>
    setForm((f) => {
      if (!ALLOWED_HEIGHT_UNITS.includes(unit) || unit === f.heightUnit) return f;
      const n = Number(f.height);
      const height = n
        ? String(Math.round(unit === "in" ? n / CM_PER_IN : n * CM_PER_IN))
        : f.height;
      return { ...f, heightUnit: unit, height };
    });

  // ---- BMI (always computed in metric) ----
  const weightKg = toKg(Number(form.weight), form.weightUnit);
  const heightCm = toCm(Number(form.height), form.heightUnit);

  const bmi = useMemo(() => {
    if (!(weightKg > 0) || !(heightCm > 0)) return null;
    const hM = heightCm / 100;
    return weightKg / (hM * hM);
  }, [weightKg, heightCm]);

  const bodyType = bmi ? getBodyType(bmi) : null;

  const codeOk =
    form.countryCode === "other"
      ? CUSTOM_CODE_RE.test(form.customCode)
      : COUNTRY_CODES.some((c) => c.code === form.countryCode);

  const phoneOk =
    form.countryCode === "+91" ? IN_PHONE_RE.test(form.phone) : PHONE_RE.test(form.phone);

  const ageNum = Number(form.age);

  const stepValid = {
    age: Number.isInteger(ageNum) && ageNum >= 1 && ageNum <= 120,
    gender: ALLOWED_GENDERS.includes(form.gender),
    contact:
      NAME_RE.test(form.name.trim()) &&
      EMAIL_RE.test(form.email) &&
      codeOk &&
      phoneOk &&
      CITY_RE.test(form.city.trim()),
    goal: GOALS.includes(form.goal),
    weight:
      ALLOWED_WEIGHT_UNITS.includes(form.weightUnit) && weightKg >= 20 && weightKg <= 400,
    height:
      ALLOWED_HEIGHT_UNITS.includes(form.heightUnit) && heightCm >= 50 && heightCm <= 260,
    result: !!bmi,
  };

  const canAdvance = stepValid[step];

  const goNext = () => {
    if (!canAdvance) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => {
    if (status === "submitting") return;
    setStatus("idle");
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleSubmit = async () => {
    if (status === "submitting") return;
    if (!STEPS.slice(0, -1).every((s) => stepValid[s])) return;

    if (form.website) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    const code = form.countryCode === "other" ? form.customCode : form.countryCode;

    try {
      if (url) {
        const t = trackingRef.current;
        const body = new FormData();
        body.append("name", safeCell(form.name, 60));
        body.append("email", safeCell(form.email, 254));
        // phone is strictly regex-validated (+digits only), so no apostrophe prefix needed
        body.append("phone", `${code}${form.phone}`.slice(0, 20));
        body.append("gender", safeCell(form.gender, 10));
        body.append("age", String(ageNum));
        body.append("height", `${Math.round(Number(form.height))}${form.heightUnit}`);
        body.append("weight", `${Math.round(Number(form.weight))}${form.weightUnit}`);
        body.append("city", safeCell(form.city, 60));
        body.append("goal", safeCell(form.goal, 60));
        body.append("date", new Date().toISOString());
        body.append("utm_source", safeCell(t.utm_source, 100));
        body.append("utm_medium", safeCell(t.utm_medium, 100));
        body.append("utm_campaign", safeCell(t.utm_campaign, 100));
        body.append("utm_term", safeCell(t.utm_term, 100));
        body.append("utm_content", safeCell(t.utm_content, 100));
        body.append("page_url", safeCell(t.page_url, 300));

        await fetch(url, { method: "POST", mode: "no-cors", body });
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (!isOpen) {
    if (!showFloatingButton) return null;
    return (
    
<button
  type="button"
  onClick={openPopup}
  aria-label={floatingButtonLabel}
  className="fixed bottom-4 right-4 z-900 floating-cta-btn group inline-flex items-center gap-2.5
    overflow-hidden rounded-full px-6 py-4
    text-sm sm:text-base font-semibold
    transition-all duration-300 ease-out
    hover:-translate-y-1 hover:scale-[1.03]
    active:scale-95
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
  style={{
    background: "linear-gradient(110deg, #50ffaa, #00d4ff, #50ffaa)",
    backgroundSize: "200% 100%",
    color: "#062019",
    boxShadow: "0 8px 28px rgba(0, 212, 255, 0.22)",
  }}
>
  {/* Animated glow */}
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 rounded-full
      opacity-0 transition-opacity duration-300
      group-hover:opacity-100"
    style={{
      boxShadow: "inset 0 0 18px rgba(255,255,255,0.5)",
    }}
  />

  {/* Heart icon */}
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className="relative shrink-0 transition-transform duration-300
      group-hover:scale-110"
  >
    <path
      d="M12 20s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>

  <span className="relative whitespace-nowrap">
    {floatingButtonLabel}
  </span>

  {/* Arrow */}
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className="relative transition-transform duration-300
      group-hover:translate-x-1"
  >
    <path
      d="M5 12h14m-6-6 6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>

    );
  }

  const showFlow = status !== "success";

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Body assessment"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-md animate-cpf-fade"
        onClick={closePopup}
      />

      {/* Card */}
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-50 shadow-2xl shadow-stone-900/20 animate-cpf-scale">
        {/* Header: back + progress + close */}
        <div className="flex shrink-0 items-center gap-3 px-5 pt-5 pb-3 sm:px-8 sm:pt-6">
          {showFlow ? (
            <>
              <button
                type="button"
                onClick={goBack}
                disabled={stepIndex === 0}
                className="text-stone-400 transition hover:text-stone-600 disabled:opacity-0"
                aria-label="Back"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <ProgressBar stepIndex={stepIndex} total={STEPS.length} />
            </>
          ) : (
            <div className="flex-1" />
          )}
          <button
            type="button"
            onClick={closePopup}
            aria-label="Close popup"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-200 hover:text-stone-700"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        {/* Content (scrolls inside the card) */}
        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-4 sm:px-8">
          {status === "success" ? (
            <SuccessView onDone={closePopup} />
          ) : (
            <>
              {step === "age" && (
                <StepAge value={form.age} onChange={setField("age")} />
              )}

              {step === "gender" && (
                <StepGender value={form.gender} onChange={setField("gender")} />
              )}

              {step === "contact" && (
                <StepContact form={form} setField={setField} />
              )}

              {step === "goal" && (
                <StepGoal value={form.goal} onChange={setField("goal")} gender={form.gender} />
              )}

              {step === "weight" && (
                <StepWeight
                  value={form.weight}
                  unit={form.weightUnit}
                  onChange={setField("weight")}
                  onUnitChange={changeWeightUnit}
                />
              )}

              {step === "height" && (
                <StepHeight
                  value={form.height}
                  unit={form.heightUnit}
                  onChange={setField("height")}
                  onUnitChange={changeHeightUnit}
                />
              )}

              {step === "result" && bmi && bodyType && (
                <StepResult
                  bmi={bmi}
                  bodyType={bodyType}
                  gender={form.gender}
                  status={status}
                />
              )}
            </>
          )}
        </div>

        {/* Footer CTA */}
        {showFlow && (
          <div className="shrink-0 px-5 pb-5 pt-2 sm:px-8 sm:pb-6">
            {step === "result" ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "submitting" || !canAdvance}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 py-3.5 text-center text-base font-bold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 hover:shadow-teal-600/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Get my plan
                    <ArrowRight />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                disabled={!canAdvance}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 py-3.5 text-center text-base font-bold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 hover:shadow-teal-600/30 active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
              >
                Continue
                <ArrowRight />
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes cpf-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes cpf-scale { from { opacity: 0; transform: translateY(8px) scale(.97) } to { opacity: 1; transform: translateY(0) scale(1) } }

        .animate-cpf-fade { animation: cpf-fade .25s ease-out both; }
        .animate-cpf-scale { animation: cpf-scale .28s cubic-bezier(.16,1,.3,1) both; }
      `}</style>
    </div>
  );
}

/* ───────────────────────── shared UI ───────────────────────── */

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="transition group-hover:translate-x-0.5"
    >
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProgressBar({ stepIndex, total }) {
  const pct = (stepIndex / (total - 1)) * 100;
  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-semibold tabular-nums text-stone-400">
        {stepIndex + 1}/{total}
      </span>
    </div>
  );
}

function StepHeading({ title, subtitle }) {
  return (
    <>
      <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-sm text-stone-500">{subtitle}</p>}
    </>
  );
}

const fieldShell =
  "flex items-center gap-2 rounded-2xl border border-stone-200 bg-white shadow-sm transition focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100";

function TextField({ value, onChange, type = "text", placeholder, autoFocus, inputMode, maxLength = 254 }) {
  return (
    <label className="block">
      <div className={`${fieldShell} px-5 py-3.5`}>
        <input
          type={type}
          inputMode={inputMode}
          autoFocus={autoFocus}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-lg font-semibold tracking-tight text-stone-900 outline-none placeholder:font-normal placeholder:text-stone-300"
        />
      </div>
    </label>
  );
}

// Number field with − / + steppers and an optional unit toggle (cm/in, kg/lb).
function NumberField({
  value,
  onChange,
  unit,
  units,
  onUnitChange,
  placeholder,
  autoFocus,
  max = 999,
}) {
  function bump(delta) {
    const current = Number(value || placeholder || 0);
    const next = Math.min(max, Math.max(1, current + delta));
    onChange(String(next));
  }

  return (
    <div className={`${fieldShell} gap-1 p-1.5`}>
      <button
        type="button"
        onClick={() => bump(-1)}
        aria-label="Decrease"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-50 text-stone-500 transition hover:bg-teal-50 hover:text-teal-700 active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 px-1">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={3}
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
            // clamp to max so values like 999 can't exceed the field's limit
            onChange(digits && Number(digits) > max ? String(max) : digits);
          }}
          className="w-full min-w-0 bg-transparent text-center text-3xl font-extrabold tracking-tight text-stone-900 outline-none placeholder:text-stone-300"
        />
        {units ? (
          <UnitToggle options={units} value={unit} onChange={onUnitChange} />
        ) : (
          <span className="shrink-0 text-sm font-medium text-stone-400">{unit}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => bump(1)}
        aria-label="Increase"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-50 text-stone-500 transition hover:bg-teal-50 hover:text-teal-700 active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function UnitToggle({ options, value, onChange }) {
  return (
    <div className="flex shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-white text-xs font-semibold">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          onClick={() => onChange(opt)}
          className={[
            "px-2.5 py-1.5 transition-colors",
            value === opt ? "bg-teal-600 text-white" : "text-stone-500 hover:bg-teal-50",
          ].join(" ")}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// Dropdown that expands inline, so the popup's scroll container can't clip it.
function SelectField({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-5 py-3.5 text-left text-lg shadow-sm transition ${
          open ? "border-teal-500 ring-2 ring-teal-100" : "border-stone-200 hover:border-stone-300"
        }`}
      >
        <span className={value ? "font-semibold tracking-tight text-stone-900" : "text-stone-300"}>
          {value || placeholder}
        </span>
        <IconChevron
          className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="overflow-hidden rounded-2xl border border-stone-200 bg-white py-1 shadow-sm"
        >
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <li key={opt} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-5 py-3 text-left text-base transition hover:bg-stone-50 ${
                    selected ? "bg-teal-50 font-semibold text-teal-700" : "text-stone-700"
                  }`}
                >
                  {opt}
                  {selected && <IconCheck className="h-4 w-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ───────────────────────── steps ───────────────────────── */

function StepAge({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <StepHeading
        title="How old are you?"
        subtitle="We'll use this to tailor your plan to your age group."
      />
      <div className="mt-6 sm:max-w-sm">
        <NumberField
          value={value}
          onChange={onChange}
          unit="years"
          placeholder="28"
          max={120}
          autoFocus
        />
      </div>
    </div>
  );
}

function StepGender({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <StepHeading
        title="Choose your gender"
        subtitle="This helps us personalize your body-type results."
      />

      <div className="mt-6 grid grid-cols-2 gap-4 pt-6 sm:gap-6">
        {GENDER_OPTIONS.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className="group relative h-36 w-full text-left transition active:scale-[0.99] sm:h-40"
            >
              <div
                className={`absolute inset-0 rounded-2xl border shadow-sm transition ${
                  selected
                    ? "border-teal-500 bg-teal-50 ring-2 ring-teal-100"
                    : "border-stone-200 bg-white group-hover:border-stone-300"
                }`}
              />
              <div className="relative z-10 flex h-full w-1/2 flex-col justify-end p-4">
                <span className={`text-base font-bold ${selected ? "text-teal-900" : "text-stone-900"}`}>
                  {opt.label}
                </span>
              </div>
              <img
                src={opt.img}
                alt={opt.label}
                className="pointer-events-none absolute -top-6 bottom-0 right-3 z-20 h-[calc(100%+1.5rem)] w-auto max-w-[55%] object-contain object-bottom drop-shadow-md"
              />
              {selected && (
                <span className="absolute left-4 top-4 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 shadow-md shadow-teal-600/30">
                  <IconCheck className="h-4 w-4 text-white" strokeWidth="3" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepContact({ form, setField }) {
  return (
    <div className="relative flex flex-col">
      <StepHeading
        title="A few details about you"
        subtitle="We'll use this to save your results and send your plan. All fields are required."
      />

      <div className="mt-6 flex flex-col gap-3 sm:max-w-md">
        <TextField
          value={form.name}
          onChange={(v) => setField("name")(cleanText(v))}
          placeholder="Full name *"
          maxLength={60}
          autoFocus
        />
        <TextField
          value={form.email}
          onChange={(v) => setField("email")(cleanEmail(v))}
          type="email"
          inputMode="email"
          placeholder="Email address *"
        />

        {/* Phone: country code select (+ custom "Other") + number */}
        <div>
          <div className={`${fieldShell} p-1.5`}>
            <div className="relative w-[42%] shrink-0">
              <select
                value={form.countryCode}
                onChange={(e) => setField("countryCode")(e.target.value)}
                className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-3 pr-7 text-sm font-semibold text-stone-900 outline-none"
                aria-label="Country code"
              >
                <option value="" disabled>
                  Code *
                </option>
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.label})
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
              <IconChevron className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </div>
            <div className="h-6 w-px shrink-0 bg-stone-200" />
            <input
              type="tel"
              inputMode="numeric"
              maxLength={12}
              value={form.phone}
              placeholder="Phone number *"
              onChange={(e) =>
                setField("phone")(e.target.value.replace(/[^0-9]/g, "").slice(0, 12))
              }
              className="w-full min-w-0 bg-transparent px-1 py-2 text-lg font-semibold tracking-tight text-stone-900 outline-none placeholder:font-normal placeholder:text-stone-300"
            />
          </div>

          {form.countryCode === "other" && (
            <div className="mt-3">
              <TextField
                value={form.customCode}
                onChange={(v) => setField("customCode")(cleanCode(v))}
                placeholder="Enter your country code (e.g. +49) *"
                maxLength={5}
              />
            </div>
          )}
        </div>

        <TextField
          value={form.city}
          onChange={(v) => setField("city")(cleanText(v))}
          placeholder="City *"
          maxLength={60}
        />

        {/* Honeypot: hidden from humans, bots tend to fill it */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={form.website || ""}
          onChange={(e) => setField("website")(e.target.value)}
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />
      </div>
    </div>
  );
}

function StepGoal({ value, onChange, gender }) {
  const filteredGoals = gender?.toLowerCase() === "male" ?GOALS.slice(0, 2) : GOALS;
  return (
    <div className="flex flex-col">
      <StepHeading
        title={
          <>
            What is your primary goal? <span className="text-teal-600">*</span>
          </>
        }
        subtitle="Pick the one that matters most right now — we'll shape your plan around it."
      />
      <div className="mt-6 sm:max-w-md">
        <SelectField
          value={value}
          onChange={onChange}
          options={filteredGoals}
          placeholder="Select primary goal"
        />
      </div>
    </div>
  );
}

function StepWeight({ value, unit, onChange, onUnitChange }) {
  return (
    <div className="flex flex-col">
      <StepHeading
        title="What's your current weight?"
        subtitle="Be honest — this is just the starting point."
      />
      <div className="mt-6 sm:max-w-sm">
        <NumberField
          value={value}
          onChange={onChange}
          unit={unit}
          units={["kg", "lb"]}
          onUnitChange={onUnitChange}
          placeholder={unit === "kg" ? "75" : "165"}
          max={999}
          autoFocus
        />
      </div>
    </div>
  );
}

function StepHeight({ value, unit, onChange, onUnitChange }) {
  return (
    <div className="flex flex-col">
      <StepHeading
        title="What's your height?"
        subtitle="We'll use this to calculate your BMI and body type."
      />
      <div className="mt-6 sm:max-w-sm">
        <NumberField
          value={value}
          onChange={onChange}
          unit={unit}
          units={["cm", "in"]}
          onUnitChange={onUnitChange}
          placeholder={unit === "cm" ? "170" : "67"}
          max={300}
          autoFocus
        />
      </div>
    </div>
  );
}

function StepResult({ bmi, bodyType, gender, status }) {
  const roundedBmi = Math.round(bmi * 10) / 10;
  const markerPct = Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100));
  const bodyImage = BODY_IMAGES[gender]?.[bodyType.id];

  return (
    <div className="flex flex-col sm:mx-auto sm:max-w-lg">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
        {bodyImage && (
          <div className="flex shrink-0 justify-center">
            <img
              src={bodyImage}
              alt={`${bodyType.label} body type`}
              className="h-36 w-auto object-contain drop-shadow-md sm:h-64"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col items-center sm:items-start">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-3xl">
            Your body type
          </h1>
          <p className="mt-1 text-sm text-stone-500">Based on your BMI</p>

          <div className="mt-3 flex flex-col items-center sm:items-start">
            <span className="text-5xl font-extrabold tracking-tight" style={{ color: bodyType.accent }}>
              {roundedBmi}
            </span>
            <span
              className="mt-2 rounded-full px-4 py-1 text-sm font-bold"
              style={{ backgroundColor: `${bodyType.accent}1A`, color: bodyType.accent }}
            >
              {bodyType.label}
            </span>
          </div>

          <p className="mx-auto mt-3 max-w-xs text-sm text-stone-500 sm:mx-0">{bodyType.blurb}</p>
        </div>
      </div>

      <div className="mt-6 w-full rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-500 via-40% to-red-500">
          <div
            className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-white shadow"
            style={{ left: `${markerPct}%`, backgroundColor: bodyType.accent }}
          />
        </div>
        <div className="mt-3 flex justify-between text-[11px] font-medium text-stone-400 sm:text-xs">
          <span>Underweight</span>
          <span>Normal</span>
          <span>Overweight</span>
          <span>Obese</span>
        </div>
      </div>

      {status === "error" && (
        <p className="mt-3 text-center text-xs font-medium text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}

function SuccessView({ onDone }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600/10 text-teal-600">
        <IconCheck className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-extrabold tracking-tight text-stone-900">
        Thank you — you're all set
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-snug text-stone-500">
        Our health consultant will reach out to you shortly. Please keep an eye on your
        phone and inbox.
      </p>
      <button
        type="button"
        onClick={onDone}
        className="mt-6 rounded-full bg-teal-600 px-8 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
      >
        Done
      </button>
    </div>
  );
}