import React, { useState } from "react";
import {
  Ruler,
  Dumbbell,
  Percent,
  RotateCcw,
  Info,
  User,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const RING_MAX_PCT = 45;
const RING_R = 82;
const RING_CIRC = 2 * Math.PI * RING_R;

// Categories per Jackson & Pollock / ACE norms.
// `min`/`max` are used both for classifying a result AND for drawing the
// levels bar below (max: Infinity is visually capped at BAR_MAX_PCT).
const CATEGORIES = {
  male: [
    { min: 0, max: 6, label: "Essential fat", color: "bg-stone-300" },
    { min: 6, max: 14, label: "Athletic", color: "bg-teal-600" },
    { min: 14, max: 18, label: "Fit", color: "bg-teal-400" },
    { min: 18, max: 25, label: "Average", color: "bg-amber-400" },
    { min: 25, max: Infinity, label: "Above average", color: "bg-orange-500" },
  ],
  female: [
    { min: 0, max: 14, label: "Essential fat", color: "bg-stone-300" },
    { min: 14, max: 21, label: "Athletic", color: "bg-teal-600" },
    { min: 21, max: 25, label: "Fit", color: "bg-teal-400" },
    { min: 25, max: 32, label: "Average", color: "bg-amber-400" },
    { min: 32, max: Infinity, label: "Above average", color: "bg-orange-500" },
  ],
};

// Visual cap for the levels bar so the open-ended last band still renders
// as a normal-sized segment instead of infinite width.
const BAR_MAX_PCT = 45;

function calcBodyFatPct({ heightCm, weightKg, age, gender }) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const sex = gender === "male" ? 1 : 0;
  // Deurenberg formula
  const pct = 1.2 * bmi + 0.23 * age - 10.8 * sex - 5.4;
  return Math.max(3, Math.round(pct * 10) / 10);
}

function getCategory(pct, gender) {
  const bands = CATEGORIES[gender];
  return bands.find((b) => pct <= b.max).label;
}

export default function BodyFatCalculator() {
  const [unit, setUnit] = useState("metric");
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState("male");
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [resultPct, setResultPct] = useState(null);

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
    setAge(28);
    setGender("male");
    setHeightCm(170);
    setWeightKg(70);
    setResultPct(null);
  }

  function handleCalculate() {
    setResultPct(calcBodyFatPct({ heightCm, weightKg, age, gender }));
  }

  const ringPercent = resultPct ? Math.min(100, (resultPct / RING_MAX_PCT) * 100) : 0;
  const ringOffset = RING_CIRC - (ringPercent / 100) * RING_CIRC;
  const category = resultPct ? getCategory(resultPct, gender) : null;
  const fatMassKg = resultPct ? Math.round((resultPct / 100) * weightKg * 10) / 10 : 0;
  const leanMassKg = resultPct ? Math.round((weightKg - fatMassKg) * 10) / 10 : 0;

  const bands = CATEGORIES[gender];
  const markerLeftPct = resultPct ? Math.min(100, (resultPct / BAR_MAX_PCT) * 100) : null;

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
          width: 18px; height: 18px; border-radius: 999px; background: #0F766E;
          border: 3px solid white; box-shadow: 0 0 0 1px #D6D1C4; cursor: pointer;
        }
        input[type="range"]::-moz-range-track { height: 4px; border-radius: 999px; background: #E7E2D8; }
        input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 999px; background: #0F766E;
          border: 3px solid white; box-shadow: 0 0 0 1px #D6D1C4; cursor: pointer;
        }
      `}</style>

      <div className="w-full max-w-3xl font-body mt-28 mb-16">
          <h1 className="font-display text-3xl text-center mb-4 font-semibold text-stone-900">
Body Fat calculator
            </h1>
        <p className="text-justify text-black/60 text-md ">
        Discover your body composition with our free online Body Fat Calculator. Choose from scientifically validated methods, including the Navy, <Link to="/bmi-calculator" className="text-sky-600 hover:text-sky-800">BMI</Link>, and Skinfold formulas, to get an accurate estimate of your body fat percentage. With personalized insights and health guidance, FitMom Club helps you understand your body, set realistic goals, and track meaningful progress with confidence.
        </p>
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
          <div className="md:col-span-3 bg-white rounded-2xl border border-stone-200 p-5 flex flex-col gap-5">
            <div className="flex items-center bg-stone-100 rounded-full p-1">
              <button
                onClick={() => setUnit("metric")}
                className={`flex-1 text-xs font-semibold py-2 rounded-full transition-all ${
                  unit === "metric" ? "bg-stone-900 text-white shadow-sm" : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Metric
              </button>
              <button
                onClick={() => setUnit("standard")}
                className={`flex-1 text-xs font-semibold py-2 rounded-full transition-all ${
                  unit === "standard" ? "bg-stone-900 text-white shadow-sm" : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Standard
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Gender</p>
              <div className="grid grid-cols-2 gap-2">
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg border capitalize transition-colors ${
                      gender === g
                        ? "bg-teal-600 border-teal-600 text-white font-semibold"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    {g}
                  </button>
                ))}
              </div>
            </div>

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
                      className="font-mono-data w-16 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">cm</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      value={feet}
                      onChange={handleFeetInput}
                      className="font-mono-data w-12 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">ft</span>
                    <input
                      type="number"
                      value={inches}
                      onChange={handleInchesInput}
                      className="font-mono-data w-12 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-300 ml-1"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">in</span>
                  </div>
                )}
              </div>
              {unit === "metric" ? (
                <input type="range" min={100} max={220} step={1} value={heightCm} onChange={handleHeightSliderMetric} className="w-full" />
              ) : (
                <input type="range" min={40} max={90} step={1} value={Math.round(totalInches)} onChange={handleHeightSliderStandard} className="w-full" />
              )}
            </div>

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
                      className="font-mono-data w-16 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">kg</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      value={Math.round(weightLb)}
                      onChange={handleWeightLbInput}
                      className="font-mono-data w-16 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">lb</span>
                  </div>
                )}
              </div>
              {unit === "metric" ? (
                <input type="range" min={30} max={180} step={1} value={weightKg} onChange={handleWeightSliderMetric} className="w-full" />
              ) : (
                <input type="range" min={66} max={400} step={1} value={Math.round(weightLb)} onChange={handleWeightSliderStandard} className="w-full" />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value) || 0)}
                  className="font-mono-data w-14 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
              <input
                type="range"
                min={14}
                max={80}
                step={1}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={handleCalculate}
              className="mt-1 w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              <Percent className="w-4 h-4" />
              Calculate
            </button>
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 flex flex-col items-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-[190px]">
              <circle cx="100" cy="100" r={RING_R} fill="none" className="stroke-stone-100" strokeWidth="14" />
              <circle
                cx="100"
                cy="100"
                r={RING_R}
                fill="none"
                className="stroke-teal-500"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={RING_CIRC}
                strokeDashoffset={ringOffset}
                transform="rotate(-90 100 100)"
                style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              />
              <foreignObject x="60" y="60" width="80" height="80">
                <div className="w-full h-full flex items-center justify-center">
                  <Percent className="w-7 h-7 text-teal-600" />
                </div>
              </foreignObject>
            </svg>

            <div className="text-center -mt-2">
              <p className="font-mono-data text-[11px] tracking-widest text-stone-400 uppercase mb-1">
                Your body fat is
              </p>
              {resultPct ? (
                <>
                  <p className="font-display text-5xl font-semibold text-stone-900 leading-none">
                    {resultPct}
                    <span className="text-2xl text-stone-400 ml-1">%</span>
                  </p>
                  <p className="font-mono-data text-xs text-stone-400 mt-2">
                    {category}
                  </p>
                </>
              ) : (
                <p className="font-mono-data text-sm text-stone-400 mt-3">
                  Set your details and press calculate
                </p>
              )}
            </div>

            {resultPct ? (
              <div className="w-full grid grid-cols-2 gap-2 mt-5">
                <div className="flex flex-col items-center bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
                  <span className="text-[10px] text-teal-800 font-medium uppercase tracking-wide">
                    Fat mass
                  </span>
                  <span className="font-mono-data text-sm font-semibold text-teal-800">
                    {fatMassKg} kg
                  </span>
                </div>
                <div className="flex flex-col items-center bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                  <span className="text-[10px] text-stone-500 font-medium uppercase tracking-wide">
                    Lean mass
                  </span>
                  <span className="font-mono-data text-sm font-semibold text-stone-700">
                    {leanMassKg} kg
                  </span>
                </div>
              </div>
            ) : null}

            <div className="w-full mt-6 pt-4 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-400">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>
                Estimated using height, weight, age, and gender (Deurenberg formula).
                Less accurate than skinfold, DEXA, or bioimpedance methods.
                Informational only -- not medical advice.
              </p>
            </div>
          </div>

          {/* Category levels -- always visible so users can see the scale
              before calculating, with a marker added once they do */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-stone-200 p-5">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="font-mono-data text-[11px] tracking-widest text-stone-400 uppercase mb-1">
                  Reference ranges
                </p>
                <h2 className="font-display text-xl font-semibold text-stone-900">
                  Body fat levels &middot; {gender === "male" ? "Men" : "Women"}
                </h2>
              </div>
            </div>

            {/* Segmented bar */}
            <div className="relative">
              <div className="w-full h-3 rounded-full overflow-hidden flex">
                {bands.map((band) => {
                  const segStart = Math.min(band.min, BAR_MAX_PCT);
                  const segEnd = Math.min(band.max, BAR_MAX_PCT);
                  const widthPct = ((segEnd - segStart) / BAR_MAX_PCT) * 100;
                  return (
                    <div
                      key={band.label}
                      className={band.color}
                      style={{ width: `${widthPct}%` }}
                      title={band.label}
                    />
                  );
                })}
              </div>

              {/* Marker for the user's current result */}
              {markerLeftPct !== null ? (
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${markerLeftPct}%` }}
                >
                  <div className="w-4 h-4 rounded-full bg-stone-900 border-2 border-white shadow-md" />
                  <div className="mt-1.5 -translate-x-1/2 left-1/2 relative">
                    <span className="font-mono-data text-[10px] font-semibold text-stone-900 bg-white border border-stone-200 rounded-full px-1.5 py-0.5 whitespace-nowrap shadow-sm">
                      You: {resultPct}%
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Legend */}
            <div className={`grid grid-cols-2 sm:grid-cols-5 gap-2 ${markerLeftPct !== null ? "mt-8" : "mt-4"}`}>
              {bands.map((band) => {
                const isCurrent = category === band.label;
                const rangeLabel =
                  band.max === Infinity
                    ? `${band.min}%+`
                    : band.min === 0
                    ? `< ${band.max}%`
                    : `${band.min}-${band.max}%`;
                return (
                  <div
                    key={band.label}
                    className={`rounded-lg border px-2.5 py-2 transition-colors ${
                      isCurrent ? "border-teal-300 bg-teal-50" : "border-stone-200 bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${band.color}`} />
                      <span
                        className={`text-[11px] font-semibold leading-tight ${
                          isCurrent ? "text-teal-800" : "text-stone-700"
                        }`}
                      >
                        {band.label}
                      </span>
                    </div>
                    <p className="font-mono-data text-[10px] text-stone-400">{rangeLabel}</p>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-stone-400 mt-4">
              Ranges follow common ACE / Jackson &amp; Pollock body composition norms and
              differ by gender due to typical essential fat differences. Switch the gender
              toggle above to compare scales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}