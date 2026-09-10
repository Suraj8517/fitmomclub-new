import React, { useState } from "react";
import {
  HeartPulse,
  RotateCcw,
  Info,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const FORMULAS = [
  { key: "standard", label: "Standard (220 − age)" },
  { key: "tanaka", label: "Tanaka (208 − 0.7 × age)" },
];

const ZONES = [
  { key: "z1", label: "Zone 1 · Warm up", desc: "Very light activity, active recovery", lo: 0.5, hi: 0.6, color: "bg-teal-100 text-teal-700" },
  { key: "z2", label: "Zone 2 · Fat burn", desc: "Light, conversational pace", lo: 0.6, hi: 0.7, color: "bg-teal-200 text-teal-800" },
  { key: "z3", label: "Zone 3 · Cardio", desc: "Moderate, aerobic endurance", lo: 0.7, hi: 0.8, color: "bg-teal-400 text-white" },
  { key: "z4", label: "Zone 4 · Hard", desc: "Vigorous, anaerobic threshold", lo: 0.8, hi: 0.9, color: "bg-teal-600 text-white" },
  { key: "z5", label: "Zone 5 · Peak", desc: "Maximum effort, short bursts only", lo: 0.9, hi: 1.0, color: "bg-teal-800 text-white" },
];

function calcMaxHR(formula, age) {
  if (formula === "tanaka") return Math.round(208 - 0.7 * age);
  return Math.round(220 - age);
}

// Karvonen method when resting HR is known, otherwise plain % of max HR.
function calcZoneRange(maxHR, restingHR, lo, hi) {
  if (restingHR) {
    const reserve = maxHR - restingHR;
    return {
      low: Math.round(reserve * lo + restingHR),
      high: Math.round(reserve * hi + restingHR),
    };
  }
  return {
    low: Math.round(maxHR * lo),
    high: Math.round(maxHR * hi),
  };
}

export default function HeartRateCalculator() {
  const [age, setAge] = useState(28);
  const [restingHR, setRestingHR] = useState("");
  const [formula, setFormula] = useState("standard");
  const [result, setResult] = useState(null);

  function handleReset() {
    setAge(28);
    setRestingHR("");
    setFormula("standard");
    setResult(null);
  }

  function handleCalculate() {
    const maxHR = calcMaxHR(formula, age);
    const resting = restingHR ? Number(restingHR) : null;
    const zones = ZONES.map((z) => ({
      ...z,
      ...calcZoneRange(maxHR, resting, z.lo, z.hi),
    }));
    setResult({ maxHR, resting, zones });
  }

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
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.18); }
          30% { transform: scale(1); }
          45% { transform: scale(1.12); }
          60% { transform: scale(1); }
        }
        .heartbeat { animation: heartbeat 1.1s ease-in-out infinite; transform-origin: center; }
      `}</style>

      <div className="w-full max-w-3xl font-body mt-16 mb-16">
         <div className="flex flex-wrap items-end justify-center gap-4 mb-6 mt-6">
           <h1 className="font-display text-3xl font-semibold text-stone-900">
Heart Rate Calculator
            </h1>
        <p className="text-justify text-black/60 text-md ">
        Optimize your cardiovascular training with our Heart Rate Calculator—a tool designed to help you easily compute your resting heart rate, maximum heart rate, and ideal training zones tailored to your fitness goals. Whether you’re using it as a Target Heart Rate Calculator to plan workouts or a Heart Rate Zone Calculator to monitor training intensity, FitMom Club empowers your fitness journey with precise, actionable insights.
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

        <div className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col gap-5">
          <div className="grid sm:grid-cols-2 gap-4">
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
              <input type="range" min={10} max={90} step={1} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Resting heart rate
                </label>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    placeholder="optional"
                    value={restingHR}
                    onChange={(e) => setRestingHR(e.target.value)}
                    className="font-mono-data w-20 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder:text-stone-300 placeholder:font-normal"
                  />
                  <span className="text-xs text-stone-400 font-mono-data">bpm</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Add this for more precise zones (Karvonen method). Measure it first thing in the
                morning, before getting out of bed.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Max heart rate formula</p>
            <div className="grid grid-cols-2 gap-2">
              {FORMULAS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFormula(f.key)}
                  className={`text-xs py-2.5 px-3 rounded-lg border font-medium transition-colors ${
                    formula === f.key
                      ? "bg-teal-600 border-teal-600 text-white font-semibold"
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            <HeartPulse className="w-4 h-4" />
            Calculate
          </button>
        </div>

        {result ? (
          <>
            {/* Hero */}
            <div className="mt-5 bg-white rounded-2xl border border-stone-200 p-6 flex items-center gap-6">
              <HeartPulse className="w-12 h-12 text-teal-600 heartbeat shrink-0" />
              <div>
                <p className="font-mono-data text-[11px] tracking-widest text-stone-400 uppercase mb-1">
                  Estimated max heart rate
                </p>
                <p className="font-display text-4xl font-semibold text-stone-900 leading-none">
                  {result.maxHR}
                  <span className="text-xl text-stone-400 ml-1">bpm</span>
                </p>
                {result.resting ? (
                  <p className="text-xs text-stone-500 mt-2">
                    Zones calculated with heart rate reserve (Karvonen method), using a resting
                    rate of {result.resting} bpm.
                  </p>
                ) : (
                  <p className="text-xs text-stone-500 mt-2">
                    Zones shown as a percentage of max heart rate. Add your resting heart rate
                    above for more precise, personalized zones.
                  </p>
                )}
              </div>
            </div>

            {/* Zone bar */}
            <div className="mt-5 bg-white rounded-2xl border border-stone-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-teal-600" />
                <p className="font-mono-data text-[11px] tracking-widest text-stone-400 uppercase">
                  Target zones
                </p>
              </div>

              <div className="flex w-full h-8 rounded-lg overflow-hidden mb-1">
                {result.zones.map((z) => (
                  <div
                    key={z.key}
                    className={`${z.color} flex items-center justify-center text-[10px] font-semibold`}
                    style={{ width: `${(z.hi - z.lo) * 100}%` }}
                  >
                    {Math.round(z.lo * 100)}–{Math.round(z.hi * 100)}%
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 mt-4">
                {result.zones.map((z) => (
                  <div key={z.key} className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5">
                    <div>
                      <p className="text-xs font-semibold text-stone-700">{z.label}</p>
                      <p className="text-[10px] text-stone-400">{z.desc}</p>
                    </div>
                    <span className="font-mono-data text-sm font-semibold text-teal-700 shrink-0 ml-2">
                      {z.low}–{z.high} bpm
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        <div className="w-full mt-5 flex items-start gap-2 text-xs text-stone-400">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p>
            These estimates use standard age-based formulas and are not a substitute for a
            supervised fitness or cardiac assessment. If you have a heart condition or are new
            to exercise, check with a doctor before training in higher zones.
          </p>
        </div>
      </div>
    </div>
  );
}