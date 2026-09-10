import React, { useState } from "react";
import {
  Droplet,
  Ruler,
  Dumbbell,
  Snowflake,
  Sun,
  CloudSun,
  Feather,
  Activity,
  Flame,
  RotateCcw,
  Info,
  GlassWater,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Water Intake Calculator
 * -----------------------------------------------------------------------
 * Single-file React + Tailwind component, styled to match the BMI
 * calculator (Fraunces / IBM Plex Mono / Inter, warm stone palette,
 * water-blue accent). Signature element: an animated filling bottle.
 *
 * Formula is a general-purpose estimate (weight-based baseline, adjusted
 * for age, gender, season/climate, and activity level) — informational
 * only, not medical advice.
 * -----------------------------------------------------------------------
 */

const AGE_GROUPS = [
  { key: "14-18", label: "14\u201318", factor: 1.08 },
  { key: "19-30", label: "19\u201330", factor: 1.0 },
  { key: "31-50", label: "31\u201350", factor: 1.0 },
  { key: "50+", label: "50+", factor: 0.95 },
];

const GENDERS = [
  { key: "male", label: "Male", factor: 1.1 },
  { key: "female", label: "Female", factor: 1.0 },
];

const SEASONS = [
  { key: "winter", label: "Winter", factor: 0.95, icon: Snowflake },
  { key: "normal", label: "Normal", factor: 1.0, icon: CloudSun },
  { key: "summer", label: "Summer", factor: 1.1, icon: Sun },
];

const ACTIVITIES = [
  { key: "light", label: "Lightly active", add: 0, icon: Feather },
  { key: "moderate", label: "Moderately active", add: 350, icon: Activity },
  { key: "active", label: "Very active", add: 700, icon: Flame },
];

const BOTTLE_SCALE_ML = 5000; // visual scale cap for the bottle fill

function calcWaterIntakeMl({
  weightKg,
  ageFactor,
  genderFactor,
  seasonFactor,
  activityAdd,
}) {
  let base = weightKg * 35; // ml, general 30-35ml/kg guideline
  base *= ageFactor;
  base *= genderFactor;
  base += activityAdd;
  base *= seasonFactor;
  return Math.round(base);
}

export default function WaterIntakeCalculator() {
  const [unit, setUnit] = useState("metric"); // 'metric' | 'standard'
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [age, setAge] = useState("19-30");
  const [gender, setGender] = useState("male");
  const [season, setSeason] = useState("normal");
  const [activity, setActivity] = useState("moderate");
  const [resultMl, setResultMl] = useState(null);

  const totalInches = heightCm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  const weightLb = weightKg * 2.20462;

  function handleHeightSliderMetric(e) {
    setHeightCm(Number(e.target.value));
  }
  function handleHeightSliderStandard(e) {
    setHeightCm(Math.round(Number(e.target.value) * 2.54 * 10) / 10);
  }
  function handleWeightSliderMetric(e) {
    setWeightKg(Number(e.target.value));
  }
  function handleWeightSliderStandard(e) {
    setWeightKg(Math.round((Number(e.target.value) / 2.20462) * 10) / 10);
  }
  function handleFeetInput(e) {
    const ft = Number(e.target.value) || 0;
    setHeightCm(Math.round((ft * 12 + inches) * 2.54 * 10) / 10);
  }
  function handleInchesInput(e) {
    const inc = Number(e.target.value) || 0;
    setHeightCm(Math.round((feet * 12 + inc) * 2.54 * 10) / 10);
  }
  function handleWeightLbInput(e) {
    setWeightKg(Math.round((Number(e.target.value) / 2.20462) * 10) / 10);
  }
  function handleHeightCmInput(e) {
    setHeightCm(Number(e.target.value) || 0);
  }
  function handleWeightKgInput(e) {
    setWeightKg(Number(e.target.value) || 0);
  }

  function handleReset() {
    setUnit("metric");
    setHeightCm(170);
    setWeightKg(70);
    setAge("19-30");
    setGender("male");
    setSeason("normal");
    setActivity("moderate");
    setResultMl(null);
  }

  function handleCalculate() {
    const ageFactor = AGE_GROUPS.find((a) => a.key === age).factor;
    const genderFactor = GENDERS.find((g) => g.key === gender).factor;
    const seasonFactor = SEASONS.find((s) => s.key === season).factor;
    const activityAdd = ACTIVITIES.find((a) => a.key === activity).add;
    setResultMl(
      calcWaterIntakeMl({
        weightKg,
        ageFactor,
        genderFactor,
        seasonFactor,
        activityAdd,
      }),
    );
  }

  const fillPercent = resultMl
    ? Math.min(100, (resultMl / BOTTLE_SCALE_ML) * 100)
    : 0;

  // bottle geometry
  const bottleTop = 20;
  const bottleBottom = 235;
  const totalH = bottleBottom - bottleTop;
  const fillH = (fillPercent / 100) * totalH;
  const fillY = bottleBottom - fillH;

  const liters = resultMl ? resultMl / 1000 : 0;
  const flOz = resultMl ? resultMl * 0.033814 : 0;
  const glasses = resultMl ? Math.round(resultMl / 250) : 0;

  return (
    <div className="min-h-screen w-full bg-[#f6f4f0] flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-mono-data { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        input[type="range"] { -webkit-appearance: none; appearance: none; background: transparent; }
        input[type="range"]::-webkit-slider-runnable-track { height: 4px; border-radius: 999px; background: #E7E2D8; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; margin-top: -7px;
          width: 18px; height: 18px; border-radius: 999px; background: #0369A1;
          border: 3px solid white; box-shadow: 0 0 0 1px #D6D1C4; cursor: pointer;
        }
        input[type="range"]::-moz-range-track { height: 4px; border-radius: 999px; background: #E7E2D8; }
        input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 999px; background: #0369A1;
          border: 3px solid white; box-shadow: 0 0 0 1px #D6D1C4; cursor: pointer;
        }
      `}</style>

      <div className="w-full max-w-3xl font-body mt-28">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-center gap-4 mb-6 mt-6">
          <h1 className="font-display text-3xl font-semibold text-stone-900">
            Water Intake Calculator
          </h1>
          <p className="text-justify text-black/60 text-md ">
            Stay hydrated with our Water Intake Calculator, designed to estimate your daily water needs based on your weight, activity level, and climate. Proper hydration supports metabolism, weight loss, skin health, and energy levels. Use this tool to track your water intake and maintain optimal health.
          </p>
        </div>

        <div className="flex items-end justify-between mb-6">
          <div>
            <Link
              to="/health-calculators"
              className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Link>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors border border-stone-200 hover:border-stone-300 rounded-full px-3 py-1.5 bg-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        <div className="grid md:grid-cols-5 gap-5">
          {/* LEFT: input panel */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-stone-200 p-5 flex flex-col gap-5">
            {/* unit toggle */}
            <div className="flex items-center bg-stone-100 rounded-full p-1">
              <button
                onClick={() => setUnit("metric")}
                className={`flex-1 text-xs font-semibold py-2 rounded-full transition-all ${
                  unit === "metric"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Metric
              </button>
              <button
                onClick={() => setUnit("standard")}
                className={`flex-1 text-xs font-semibold py-2 rounded-full transition-all ${
                  unit === "standard"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Standard
              </button>
            </div>

            {/* age */}
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Age
              </p>
              <div className="grid grid-cols-4 gap-2">
                {AGE_GROUPS.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => setAge(a.key)}
                    className={`font-mono-data text-xs py-2 rounded-lg border transition-colors ${
                      age === a.key
                        ? "bg-sky-600 border-sky-600 text-white font-semibold"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* gender */}
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Gender
              </p>
              <div className="grid grid-cols-2 gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g.key}
                    onClick={() => setGender(g.key)}
                    className={`text-sm py-2 rounded-lg border transition-colors ${
                      gender === g.key
                        ? "bg-sky-600 border-sky-600 text-white font-semibold"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* height */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  <Ruler className="w-3.5 h-3.5" />
                  Height
                </label>
                {unit === "metric" ? (
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      value={Math.round(heightCm)}
                      onChange={handleHeightCmInput}
                      className="font-mono-data w-16 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">
                      cm
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      value={feet}
                      onChange={handleFeetInput}
                      className="font-mono-data w-12 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">
                      ft
                    </span>
                    <input
                      type="number"
                      value={inches}
                      onChange={handleInchesInput}
                      className="font-mono-data w-12 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-300 ml-1"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">
                      in
                    </span>
                  </div>
                )}
              </div>
              {unit === "metric" ? (
                <input
                  type="range"
                  min={100}
                  max={220}
                  step={1}
                  value={heightCm}
                  onChange={handleHeightSliderMetric}
                  className="w-full"
                />
              ) : (
                <input
                  type="range"
                  min={40}
                  max={90}
                  step={1}
                  value={Math.round(totalInches)}
                  onChange={handleHeightSliderStandard}
                  className="w-full"
                />
              )}
            </div>

            {/* weight */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  <Dumbbell className="w-3.5 h-3.5" />
                  Weight
                </label>
                {unit === "metric" ? (
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      value={Math.round(weightKg * 10) / 10}
                      onChange={handleWeightKgInput}
                      className="font-mono-data w-16 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">
                      kg
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      value={Math.round(weightLb)}
                      onChange={handleWeightLbInput}
                      className="font-mono-data w-16 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">
                      lb
                    </span>
                  </div>
                )}
              </div>
              {unit === "metric" ? (
                <input
                  type="range"
                  min={30}
                  max={180}
                  step={1}
                  value={weightKg}
                  onChange={handleWeightSliderMetric}
                  className="w-full"
                />
              ) : (
                <input
                  type="range"
                  min={66}
                  max={400}
                  step={1}
                  value={Math.round(weightLb)}
                  onChange={handleWeightSliderStandard}
                  className="w-full"
                />
              )}
            </div>

            {/* season */}
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Season
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SEASONS.map((s) => {
                  const Icon = s.icon;
                  const isActive = season === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setSeason(s.key)}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border text-xs transition-colors ${
                        isActive
                          ? "bg-sky-600 border-sky-600 text-white font-semibold"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* activity */}
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Activity level
              </p>
              <div className="grid grid-cols-3 gap-2">
                {ACTIVITIES.map((a) => {
                  const Icon = a.icon;
                  const isActive = activity === a.key;
                  return (
                    <button
                      key={a.key}
                      onClick={() => setActivity(a.key)}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border text-[11px] leading-tight text-center transition-colors ${
                        isActive
                          ? "bg-sky-600 border-sky-600 text-white font-semibold"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="mt-1 w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              <Droplet className="w-4 h-4" />
              Calculate
            </button>
          </div>

          {/* RIGHT: bottle / result panel */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 flex flex-col items-center">
            <svg viewBox="0 0 300 260" className="w-full max-w-[180px]">
              <defs>
                <clipPath id="bottleClip">
                  <path d="M110 20 L110 40 C110 50 90 55 90 75 L90 220 C90 233 100 243 113 243 L187 243 C200 243 210 233 210 220 L210 75 C210 55 190 50 190 40 L190 20 Z" />
                </clipPath>
              </defs>

              {/* fill */}
              <g clipPath="url(#bottleClip)">
                <rect
                  x="80"
                  y={fillY}
                  width="140"
                  height={totalH + 40}
                  className="fill-sky-400"
                  style={{
                    transition: "y 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
                <rect
                  x="80"
                  y={fillY}
                  width="140"
                  height="4"
                  className="fill-sky-200"
                  style={{
                    transition: "y 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </g>

              {/* scale ticks */}
              {[0, 1, 2, 3, 4, 5].map((L) => {
                const y =
                  bottleBottom - ((L * 1000) / BOTTLE_SCALE_ML) * totalH;
                return (
                  <line
                    key={L}
                    x1="82"
                    y1={y}
                    x2="90"
                    y2={y}
                    className="stroke-stone-300"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* bottle outline */}
              <path
                d="M110 20 L110 40 C110 50 90 55 90 75 L90 220 C90 233 100 243 113 243 L187 243 C200 243 210 233 210 220 L210 75 C210 55 190 50 190 40 L190 20 Z"
                fill="none"
                className="stroke-stone-800"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* cap */}
              <rect
                x="103"
                y="8"
                width="94"
                height="14"
                rx="4"
                className="fill-stone-800"
              />
            </svg>

            <div className="text-center mt-2">
              <p className="font-mono-data text-[11px] tracking-widest text-stone-400 uppercase mb-1">
                Recommended daily
              </p>
              {resultMl ? (
                <>
                  <p className="font-display text-5xl font-semibold text-stone-900 leading-none">
                    {liters.toFixed(1)}
                    <span className="text-2xl text-stone-400 ml-1">L</span>
                  </p>
                  <p className="font-mono-data text-xs text-stone-400 mt-2">
                    {unit === "standard"
                      ? `${Math.round(flOz)} fl oz \u00b7 `
                      : ""}
                    {glasses} glasses (250ml)
                  </p>
                </>
              ) : (
                <p className="font-mono-data text-sm text-stone-400 mt-3">
                  Set your details and press calculate
                </p>
              )}
            </div>

            <div className="w-full mt-6 pt-4 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-400">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>
                This is a general estimate based on weight, age, gender,
                climate, and activity. Individual needs vary \u2014 check with a
                healthcare provider for personalized guidance.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 mt-4 font-mono-data">
          <GlassWater className="w-3 h-3" />
          Estimate uses a 30\u201335ml per kg baseline, adjusted for your inputs
        </div>
      </div>
    </div>
  );
}
