import React, { useState, useMemo } from "react";
import male from '../assets/form/male.png'
import female from '../assets/form/female.png'

// Body-type result images — rename your files to match this pattern, or just
// change these import paths to point at your existing files.
import maleUnderweight from '../assets/form/male/male-underweight.png'
import maleNormal from '../assets/form/male/male-normal.png'
import maleOverweight from '../assets/form/male/male-overweight.png'
import maleObese from '../assets/form/male/male-obese.png'
import maleExtremeObese from '../assets/form/male/male-extreme-obese.png'
import femaleUnderweight from '../assets/form/female/female-underweight.png'
import femaleNormal from '../assets/form/female/female-normal.png'
import femaleOverweight from '../assets/form/female/female-overweight.png'
import femaleObese from '../assets/form/female/female-obese.png'
import femaleExtremeObese from '../assets/form/female/female-extreme-obese.png'

/**
 * BodyAssessmentForm
 * -------------------
 * Multi-step onboarding flow: Age -> Gender -> Weight -> Height -> Result (BMI + body type)
 *
 * Drop this into a React + Tailwind project. No extra dependencies required.
 * Light theme with custom +/- stepper buttons on every numeric field (native
 * spinner arrows are hidden in favor of these).
 *
 * Sizing: the card is capped at max-h-[92vh] with internal scrolling, so it
 * always fits inside the viewport instead of pushing the page down. Width is
 * a wider max-w-lg card on larger screens; on phones it still goes edge to
 * edge.
 */

// ---------------------------------------------------------------------------
// Config / data
// ---------------------------------------------------------------------------

const STEPS = ["age", "gender", "contact", "weight", "height", "result"];

const GENDER_IMAGES = { male, female };

const GENDER_OPTIONS = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
];

// Body-type result image per gender per BMI category
const BODY_IMAGES = {
  male: {
    underweight: maleUnderweight,
    normal: maleNormal,
    overweight: maleOverweight,
    obese: maleObese,
    extremeObese: maleExtremeObese,
  },
  female: {
    underweight: femaleUnderweight,
    normal: femaleNormal,
    overweight: femaleOverweight,
    obese: femaleObese,
    extremeObese: femaleExtremeObese,
  },
};

// Standard BMI breakpoints -> body type used to pick the result image and copy
const BODY_TYPES = [
  {
    id: "underweight",
    label: "Underweight",
    max: 18.5,
    accent: "#0284C7",
    blurb: "You're on the lighter end. A structured plan can help you build muscle and strength.",
  },
  {
    id: "normal",
    label: "Normal",
    max: 25,
    accent: "#16A34A",
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

function getBodyType(bmi) {
  return BODY_TYPES.find((b) => bmi < b.max) ?? BODY_TYPES[BODY_TYPES.length - 1];
}

// ---------------------------------------------------------------------------
// Small UI helpers
// ---------------------------------------------------------------------------

function ProgressBar({ stepIndex, total }) {
  const pct = (stepIndex / (total - 1)) * 100;
  return (
    <div className="h-1.5 w-full rounded-full bg-stone-200 overflow-hidden">
      <div
        className="h-full rounded-full bg-teal-600 transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function TextField({ value, onChange, type = "text", placeholder, autoFocus, inputMode }) {
  return (
    <label className="block">
      <div
        className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white
                   px-5 py-3.5 shadow-sm transition focus-within:border-teal-500
                   focus-within:ring-2 focus-within:ring-teal-100"
      >
        <input
          type={type}
          inputMode={inputMode}
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-lg font-semibold tracking-tight text-stone-900
                     outline-none placeholder:font-normal placeholder:text-stone-300"
        />
      </div>
    </label>
  );
}

function NumberField({ value, onChange, unit, placeholder, autoFocus, min, max, step = 1 }) {
  return (
    <label className="block">
      <div
        className="flex items-baseline gap-2 rounded-2xl border border-stone-200 bg-white
                   px-5 py-4 shadow-sm transition focus-within:border-teal-500
                   focus-within:ring-2 focus-within:ring-teal-100"
      >
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^0-9]/g, "");
            onChange(digits);
          }}
          className="w-full min-w-0 bg-transparent text-3xl font-extrabold tracking-tight text-stone-900
                     outline-none placeholder:text-stone-300"
        />
        <span className="shrink-0 text-sm font-medium text-stone-400">{unit}</span>
      </div>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function BodyAssessmentForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState({
    age: "",
    gender: "",
    name: "",
    email: "",
    phone: "",
    weightKg: "",
    heightCm: "",
  });

  const step = STEPS[stepIndex];

  const bmi = useMemo(() => {
    const w = Number(data.weightKg);
    const hM = Number(data.heightCm) / 100;
    if (!w || !hM) return null;
    return w / (hM * hM);
  }, [data.weightKg, data.heightCm]);

  const bodyType = bmi ? getBodyType(bmi) : null;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const canAdvance = {
    age: Number(data.age) >= 10 && Number(data.age) <= 99,
    gender: !!data.gender,
    contact: data.name.trim().length >= 2 && EMAIL_RE.test(data.email) && data.phone.length >= 7,
    weight: Number(data.weightKg) >= 30 && Number(data.weightKg) <= 300,
    height: Number(data.heightCm) >= 100 && Number(data.heightCm) <= 250,
    result: true,
  }[step];

  function goNext() {
    if (!canAdvance) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function set(field, value) {
    setData((d) => ({ ...d, [field]: value }));
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-stone-100 text-stone-900 flex items-center justify-center p-3 sm:p-6">
      <div
        className="flex w-full max-w-2xl flex-col overflow-y-auto bg-stone-50
                   max-h-[92vh] sm:rounded-[2rem] sm:border sm:border-stone-200
                   sm:shadow-xl sm:shadow-stone-200/60"
      >
        {/* Header: back + progress */}
        <div className="sticky top-0 z-10 flex items-center gap-3 bg-stone-50/95 px-5 pt-5 pb-3 backdrop-blur sm:px-8 sm:pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="text-stone-400 hover:text-stone-600 disabled:opacity-0 transition"
            aria-label="Back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <ProgressBar stepIndex={stepIndex} total={STEPS.length} />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-5 pt-4 pb-4 sm:px-8">
          {step === "age" && <StepAge value={data.age} onChange={(v) => set("age", v)} />}

          {step === "gender" && (
            <StepGender value={data.gender} onChange={(v) => set("gender", v)} />
          )}

          {step === "contact" && (
            <StepContact
              name={data.name}
              email={data.email}
              phone={data.phone}
              onChangeName={(v) => set("name", v)}
              onChangeEmail={(v) => set("email", v)}
              onChangePhone={(v) => set("phone", v)}
            />
          )}

          {step === "weight" && (
            <StepWeight value={data.weightKg} onChange={(v) => set("weightKg", v)} />
          )}

          {step === "height" && (
            <StepHeight value={data.heightCm} onChange={(v) => set("heightCm", v)} />
          )}

          {step === "result" && bmi && bodyType && (
            <StepResult bmi={bmi} bodyType={bodyType} gender={data.gender} />
          )}
        </div>

        {/* Footer CTA */}
        {step !== "result" && (
          <div className="sticky bottom-0 bg-stone-50/95 px-5 pb-5 pt-2 backdrop-blur sm:px-8 sm:pb-6">
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              className="w-full rounded-2xl bg-teal-600 py-3.5 text-center text-base font-bold text-white transition
                         hover:bg-teal-700 disabled:bg-stone-200 disabled:text-stone-400 active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

function StepAge({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
        How old are you?
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        We'll use this to tailor your plan to your age group.
      </p>

      <div className="mt-6 sm:max-w-sm">
        <NumberField
          value={value}
          onChange={onChange}
          unit="years"
          placeholder="28"
          min={10}
          max={99}
          step={1}
          autoFocus
        />
      </div>
    </div>
  );
}

function StepGender({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
        Choose your gender
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        This helps us personalize your body-type results.
      </p>

      {/* pt-6 gives the bleeding head room to sit above the row without being clipped by the page */}
      <div className="mt-6 grid grid-cols-2 gap-4 pt-6 sm:gap-6">
        {GENDER_OPTIONS.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className="group relative h-32 w-full text-left transition active:scale-[0.99] sm:h-36"
            >
              {/* Card background — this is the only element that clips, so the border stays a clean rounded rect */}
              <div
                className={`absolute inset-0 rounded-2xl border bg-white shadow-sm transition
                  ${selected ? "border-teal-500 ring-2 ring-teal-100" : "border-stone-200 group-hover:border-stone-300"}
                `}
              />

              {/* Label */}
              <div className="relative z-10 flex h-full w-1/2 flex-col justify-end p-4">
                <span className="text-base font-bold text-stone-900">{opt.label}</span>
              </div>

              {/* Image — sits outside the card's clip box, so the head bleeds above the top edge */}
              <img
                src={GENDER_IMAGES[opt.id]}
                alt={opt.label}
                className="pointer-events-none absolute -top-6 bottom-0 right-3 z-20 h-[calc(100%+1.5rem)]
                           w-auto max-w-[55%] object-contain object-bottom drop-shadow-md"
              />

              {/* Selected check badge */}
              {selected && (
                <span className="absolute left-4 top-4 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 shadow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepContact({ name, email, phone, onChangeName, onChangeEmail, onChangePhone }) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
        A few details about you
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        We'll use this to save your results and send your plan.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:max-w-md">
        <TextField
          value={name}
          onChange={onChangeName}
          type="text"
          placeholder="Full name"
          autoFocus
        />
        <TextField
          value={email}
          onChange={onChangeEmail}
          type="email"
          inputMode="email"
          placeholder="Email address"
        />
        <TextField
          value={phone}
          onChange={(v) => onChangePhone(v.replace(/[^0-9+\s-]/g, ""))}
          type="tel"
          inputMode="tel"
          placeholder="Phone number"
        />
      </div>
    </div>
  );
}

function StepWeight({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
        What's your current weight?
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Be honest — this is just the starting point.
      </p>

      <div className="mt-6 sm:max-w-sm">
        <NumberField
          value={value}
          onChange={onChange}
          unit="kg"
          placeholder="75"
          min={30}
          max={300}
          step={1}
          autoFocus
        />
      </div>
    </div>
  );
}

function StepHeight({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
        What's your height?
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        We'll use this to calculate your BMI and body type.
      </p>

      <div className="mt-6 sm:max-w-sm">
        <NumberField
          value={value}
          onChange={onChange}
          unit="cm"
          placeholder="178"
          min={100}
          max={250}
          step={1}
          autoFocus
        />
      </div>
    </div>
  );
}

function StepResult({ bmi, bodyType, gender }) {
  const roundedBmi = Math.round(bmi * 10) / 10;
  // position of the marker along a 15–40 BMI scale, clamped 0–100%
  const markerPct = Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100));
  const bodyImage = BODY_IMAGES[gender]?.[bodyType.id];

  return (
    <div className="flex flex-col sm:mx-auto sm:max-w-lg">
      {/* Top: image + headline/number side-by-side on larger screens to save height */}
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
          <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
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

      {/* BMI gauge */}
      <div className="mt-6 w-full rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-40% to-red-400">
          <div
            className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-white bg-stone-900 shadow"
            style={{ left: `${markerPct}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between text-[11px] font-medium text-stone-400 sm:text-xs">
          <span>Underweight</span>
          <span>Normal</span>
          <span>Overweight</span>
          <span>Obese</span>
        </div>
      </div>

      <div className="mt-6 w-full">
        <button
          type="button"
          className="w-full rounded-2xl bg-teal-600 py-3.5 text-center text-base font-bold text-white
                     transition hover:bg-teal-700 active:scale-[0.98]"
        >
          Get my plan
        </button>
      </div>
    </div>
  );
}