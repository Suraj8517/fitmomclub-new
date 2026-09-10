import React, { useMemo, useState } from "react";
import { Ruler, Dumbbell, RotateCcw, Info, ArrowRightLeft,ArrowLeft } from "lucide-react";
import {Link} from "react-router-dom";
const CATEGORIES = [
  { key: "under", label: "Underweight", min: 0, max: 18.5, color: "sky" },
  { key: "normal", label: "Normal", min: 18.5, max: 25, color: "teal" },
  { key: "over", label: "Overweight", min: 25, max: 30, color: "amber" },
  { key: "obese", label: "Obese", min: 30, max: Infinity, color: "rose" },
];

const COLOR_MAP = {
  sky: {
    stroke: "stroke-sky-500",
    text: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  teal: {
    stroke: "stroke-teal-600",
    text: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    dot: "bg-teal-600",
  },
  amber: {
    stroke: "stroke-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  rose: {
    stroke: "stroke-rose-600",
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-600",
  },
};

function getCategory(bmi) {
  return CATEGORIES.find((c) => bmi >= c.min && bmi < c.max) || CATEGORIES[CATEGORIES.length - 1];
}

// ---- gauge geometry helpers -------------------------------------------------
const GAUGE_MIN = 15;
const GAUGE_MAX = 40;
const CX = 150;
const CY = 148;
const R = 118;

function bmiToAngle(bmi) {
  const clamped = Math.min(GAUGE_MAX, Math.max(GAUGE_MIN, bmi));
  return 180 - ((clamped - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 180;
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = Math.abs(startAngle - endAngle) <= 180 ? 0 : 1;
  const sweepFlag = startAngle > endAngle ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
}

const ARC_STOPS = [15, 18.5, 25, 30, 40];
const ARC_COLORS = ["stroke-sky-500", "stroke-teal-600", "stroke-amber-500", "stroke-rose-600"];
const TICKS = [15, 18.5, 25, 30, 40];

export default function BMICalculator() {
  const [unit, setUnit] = useState("metric"); // 'metric' | 'imperial'
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);

  // derived imperial display values
  const totalInches = heightCm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  const weightLb = weightKg * 2.20462;

  const bmi = useMemo(() => {
    const h = heightCm / 100;
    if (!h || !weightKg) return 0;
    return weightKg / (h * h);
  }, [heightCm, weightKg]);

  const bmiRounded = Math.round(bmi * 10) / 10;
  const category = getCategory(bmi);
  const colors = COLOR_MAP[category.color];

  const needleAngle = bmiToAngle(bmi || GAUGE_MIN);
  const needleRotation = 90 - needleAngle;

  function handleReset() {
    setHeightCm(170);
    setWeightKg(70);
  }

  function handleHeightSliderMetric(e) {
    setHeightCm(Number(e.target.value));
  }
  function handleHeightSliderImperial(e) {
    const totalIn = Number(e.target.value);
    setHeightCm(Math.round(totalIn * 2.54 * 10) / 10);
  }
  function handleWeightSliderMetric(e) {
    setWeightKg(Number(e.target.value));
  }
  function handleWeightSliderImperial(e) {
    const lb = Number(e.target.value);
    setWeightKg(Math.round((lb / 2.20462) * 10) / 10);
  }

  function handleFeetInput(e) {
    const ft = Number(e.target.value) || 0;
    const newTotalIn = ft * 12 + inches;
    setHeightCm(Math.round(newTotalIn * 2.54 * 10) / 10);
  }
  function handleInchesInput(e) {
    const inc = Number(e.target.value) || 0;
    const newTotalIn = feet * 12 + inc;
    setHeightCm(Math.round(newTotalIn * 2.54 * 10) / 10);
  }
  function handleWeightLbInput(e) {
    const lb = Number(e.target.value) || 0;
    setWeightKg(Math.round((lb / 2.20462) * 10) / 10);
  }
  function handleHeightCmInput(e) {
    setHeightCm(Number(e.target.value) || 0);
  }
  function handleWeightKgInput(e) {
    setWeightKg(Number(e.target.value) || 0);
  }

  return (
    <div className="min-h-screen w-full bg-[#f6f4f0] py-24 flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-mono-data { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        input[type="range"] { -webkit-appearance: none; appearance: none; background: transparent; }
        input[type="range"]::-webkit-slider-runnable-track { height: 4px; border-radius: 999px; background: #E7E2D8; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; margin-top: -7px;
          width: 18px; height: 18px; border-radius: 999px; background: #0F172A;
          border: 3px solid white; box-shadow: 0 0 0 1px #D6D1C4; cursor: pointer;
        }
        input[type="range"]::-moz-range-track { height: 4px; border-radius: 999px; background: #E7E2D8; }
        input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 999px; background: #0F172A;
          border: 3px solid white; box-shadow: 0 0 0 1px #D6D1C4; cursor: pointer;
        }
      `}</style>

      <div className="w-full max-w-3xl font-body ">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-center gap-4 mb-6 mt-6">
           <h1 className="font-display text-3xl font-semibold text-stone-900">
              BMI calculator
            </h1>
        <p className="text-justify text-black/60 text-md ">Maintaining a healthy body weight plays a vital role in overall wellness, and one of the easiest ways to evaluate your weight status is by using a BMI calculator for women. Body Mass Index (BMI) is a simple and reliable method developed by health experts to determine whether your weight is appropriate for your height. With just your height and weight, you can calculate body mass index instantly and understand which category you fall into: underweight, normal, overweight, or obese.</p>
      

        </div>
          <div className="flex items-end justify-between mb-6">
          <div>
            <Link to="/health-calculators" className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors">
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
          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 flex flex-col gap-6">
            {/* unit toggle */}
            <div className="flex items-center bg-stone-100 rounded-full p-1">
              <button
                onClick={() => setUnit("metric")}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-full transition-all ${
                  unit === "metric"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Metric
              </button>
              <button
                onClick={() => setUnit("imperial")}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-full transition-all ${
                  unit === "imperial"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Imperial
              </button>
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
                      className="font-mono-data w-16 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-stone-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">cm</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      value={feet}
                      onChange={handleFeetInput}
                      className="font-mono-data w-12 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-stone-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">ft</span>
                    <input
                      type="number"
                      value={inches}
                      onChange={handleInchesInput}
                      className="font-mono-data w-12 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-stone-300 ml-1"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">in</span>
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
                  onChange={handleHeightSliderImperial}
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
                      className="font-mono-data w-16 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-stone-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">kg</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      value={Math.round(weightLb)}
                      onChange={handleWeightLbInput}
                      className="font-mono-data w-16 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-stone-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">lb</span>
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
                  onChange={handleWeightSliderImperial}
                  className="w-full"
                />
              )}
            </div>

            {/* legend */}
            <div className="border-t border-stone-100 pt-4 space-y-2">
              {CATEGORIES.map((c) => {
                const cc = COLOR_MAP[c.color];
                const isActive = category.key === c.key;
                return (
                  <div
                    key={c.key}
                    className={`flex items-center justify-between text-xs px-2 py-1.5 rounded-lg transition-colors ${
                      isActive ? cc.bg : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cc.dot}`} />
                      <span className={isActive ? `font-semibold ${cc.text}` : "text-stone-500"}>
                        {c.label}
                      </span>
                    </div>
                    <span className="font-mono-data text-stone-400">
                      {c.max === Infinity ? `${c.min}+` : `${c.min}\u2013${c.max}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: gauge / result panel */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-stone-200 p-6 flex flex-col items-center">
            <svg viewBox="0 0 300 180" className="w-full max-w-md">
              {/* segmented arc */}
              {ARC_COLORS.map((strokeClass, i) => {
                const startAngle = bmiToAngle(ARC_STOPS[i]);
                const endAngle = bmiToAngle(ARC_STOPS[i + 1]);
                return (
                  <path
                    key={i}
                    d={describeArc(CX, CY, R, startAngle, endAngle)}
                    fill="none"
                    strokeWidth={18}
                    strokeLinecap="butt"
                    className={strokeClass}
                    opacity={0.85}
                  />
                );
              })}

              {/* tick marks + labels */}
              {TICKS.map((t) => {
                const angle = bmiToAngle(t);
                const inner = polarToCartesian(CX, CY, R - 12, angle);
                const outer = polarToCartesian(CX, CY, R + 10, angle);
                const labelPos = polarToCartesian(CX, CY, R + 24, angle);
                return (
                  <g key={t}>
                    <line
                      x1={inner.x}
                      y1={inner.y}
                      x2={outer.x}
                      y2={outer.y}
                      className="stroke-stone-300"
                      strokeWidth={1.5}
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-stone-400 font-mono-data"
                      fontSize="9"
                    >
                      {t}
                    </text>
                  </g>
                );
              })}

              {/* needle */}
              <g
                style={{
                  transform: `rotate(${needleRotation}deg)`,
                  transformOrigin: `${CX}px ${CY}px`,
                  transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <line
                  x1={CX}
                  y1={CY}
                  x2={CX}
                  y2={CY - R + 26}
                  className="stroke-stone-900"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </g>
              <circle cx={CX} cy={CY} r={7} className="fill-stone-900" />
              <circle cx={CX} cy={CY} r={3} className="fill-white" />
            </svg>

            {/* result readout */}
            <div className="text-center -mt-4">
              <p className="font-mono-data text-[11px] tracking-widest text-stone-400 uppercase mb-1">
                Your BMI
              </p>
              <p className="font-display text-6xl font-semibold text-stone-900 leading-none">
                {bmi > 0 ? bmiRounded.toFixed(1) : "\u2013"}
              </p>
              <div
                className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border text-sm font-semibold ${colors.bg} ${colors.text} ${colors.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {category.label}
              </div>
            </div>

            <div className="w-full mt-6 pt-4 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-400">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>
                BMI is a general screening measure and doesn't account for muscle mass, bone
                density, or body composition. Talk to a healthcare provider for a full
                assessment.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 mt-4 font-mono-data">
          <ArrowRightLeft className="w-3 h-3" />
          {unit === "metric" ? "1 kg \u2248 2.2 lb \u00b7 1 cm \u2248 0.39 in" : "1 lb \u2248 0.45 kg \u00b7 1 in \u2248 2.54 cm"}
        </div>
      </div>
    </div>
  );
}