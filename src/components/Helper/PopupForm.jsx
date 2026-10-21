import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {BODY_TYPES,BODY_IMAGES,GENDER_OPTIONS,COUNTRY_CODES,STEPS,GOALS,EMPTY_FORM,ALLOWED_GENDERS,ALLOWED_WEIGHT_UNITS,ALLOWED_HEIGHT_UNITS,} from "./Data/popupForm/popupFormData"
import {NAME_RE,CITY_RE,EMAIL_RE,PHONE_RE,IN_PHONE_RE,CUSTOM_CODE_RE} from "./popupFormHelpers/popupFormRegex"
import {getBodyType,cleanText,cleanEmail,cleanCode,cleanUrl,cleanUtm,FORMULA_START,safeCell,toCm,toKg} from "./popupFormHelpers/popupFormValidations"
import ArrowRight from "../PopupForm/arrowRight";
import ProgressBar from "../PopupForm/progressBar";
import StepHeading from "../PopupForm/stepHeading";
import TextField from "../PopupForm/textField";
import NumberField from "../PopupForm/numberField";
import SelectField from "../PopupForm/selectField";
import SuccessView from "../PopupForm/successView";
import StepAge from "../PopupForm/stepAge";
import StepGender from "../PopupForm/stepGender";
import StepContact from "../PopupForm/stepContact";
import StepGoal from "../PopupForm/stepGoal";
import StepWeight from "../PopupForm/stepWeight";
import StepHeight from "../PopupForm/stepHeight";
import StepResult from "../PopupForm/stepResult";
import IconX from "./iconX";
const ENV_SHEET_URL = import.meta.env?.VITE_SHEET_URL || "";






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
  floatingButtonLabel = "Free Body Assessment",
  popupTitle = "Get Your FREE Health & Fitness Report", // common title shown on every step
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
        className="fixed bottom-4 right-4 z-900 group inline-flex items-center gap-2.5
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

       

        <span className="relative whitespace-nowrap">
          Get Your FREE Fitness Report 
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
      aria-label={popupTitle}
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

        {/* Common title (shown on every step + success screen) */}
        <div className="shrink-0 px-5 pb-1 sm:px-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-teal-600/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
            {popupTitle}
          </p>
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

