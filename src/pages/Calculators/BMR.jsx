import React, { useState } from "react";
import {
  Ruler,
  Dumbbell,
  Flame,
  RotateCcw,
  Info,
  Percent,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const FORMULAS = [
  { key: "mifflin", label: "Mifflin St Jeor" },
  { key: "harris", label: "Revised Harris-Benedict" },
  { key: "katch", label: "Katch-McArdle" },
];

const ACTIVITY_LEVELS = [
  { key: "none", label: "No Activity", time: "0 minutes", freq: "Little or no exercise", factor: 1.2 },
  { key: "low", label: "Low Activity", time: "15-30 minutes", freq: "1-3 times per week", factor: 1.375 },
  { key: "light", label: "Light Activity", time: "15-30 minutes", freq: "4-5 times per week", factor: 1.46 },
  { key: "medium", label: "Medium Activity", time: "15-30 minutes", freq: "3-4 times per week", factor: 1.55 },
  { key: "high", label: "High Activity", time: "45-120 minutes", freq: "6-7 times per week", factor: 1.725 },
  { key: "veryhigh", label: "Very High Activity", time: "2+ hours", freq: "Daily", factor: 1.9 },
];

function calcBMR({ formula, gender, weightKg, heightCm, age, bodyFatPct }) {
  if (formula === "mifflin") {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return Math.round(gender === "male" ? base + 5 : base - 161);
  }
  if (formula === "harris") {
    return gender === "male"
      ? Math.round(13.397 * weightKg + 4.799 * heightCm - 5.677 * age + 88.362)
      : Math.round(9.247 * weightKg + 3.098 * heightCm - 4.33 * age + 447.593);
  }
  // Katch-McArdle
  const fat = Math.min(60, Math.max(0, bodyFatPct)) / 100;
  return Math.round(370 + 21.6 * (1 - fat) * weightKg);
}

export default function BMRCalculator() {
  const [unit, setUnit] = useState("metric");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(28);
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [formula, setFormula] = useState("mifflin");
  const [bodyFatPct, setBodyFatPct] = useState(20);
  const [bmr, setBmr] = useState(null);

  const totalInches = heightCm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  const weightLb = weightKg * 2.20462;

  function handleHeightSliderMetric(e) { setHeightCm(Number(e.target.value)); }
  function handleHeightSliderStandard(e) { setHeightCm(Math.round(Number(e.target.value) * 2.54 * 10) / 10); }
  function handleWeightSliderMetric(e) { setWeightKg(Number(e.target.value)); }
  function handleWeightSliderStandard(e) { setWeightKg(Math.round((Number(e.target.value) / 2.20462) * 10) / 10); }
  function handleFeetInput(e) {
    const ft = Number(e.target.value) || 0;
    setHeightCm(Math.round((ft * 12 + inches) * 2.54 * 10) / 10);
  }
  function handleInchesInput(e) {
    const inc = Number(e.target.value) || 0;
    setHeightCm(Math.round((feet * 12 + inc) * 2.54 * 10) / 10);
  }
  function handleWeightLbInput(e) { setWeightKg(Math.round((Number(e.target.value) / 2.20462) * 10) / 10); }
  function handleHeightCmInput(e) { setHeightCm(Number(e.target.value) || 0); }
  function handleWeightKgInput(e) { setWeightKg(Number(e.target.value) || 0); }

  function handleReset() {
    setUnit("metric");
    setGender("male");
    setAge(28);
    setHeightCm(170);
    setWeightKg(70);
    setFormula("mifflin");
    setBodyFatPct(20);
    setBmr(null);
  }

  function handleCalculate() {
    setBmr(calcBMR({ formula, gender, weightKg, heightCm, age, bodyFatPct }));
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
      `}</style>

      <div className="w-full max-w-3xl font-body mt-16 mb-16">
         <div className="flex flex-wrap items-end justify-center gap-4 mb-6 mt-6">
           <h1 className="font-display text-3xl font-semibold text-stone-900">
BMR Calculator            </h1>
        <p className="text-justify text-black/60 text-md ">
The basal metabolic rate calculator (BMR Calculator) estimates the number of calories your body burns at rest to maintain essential functions. Our BMR calculator for women also considers factors unique to female metabolism, helping you understand your daily energy needs more accurately. Combine your BMR with your activity level to determine your calorie requirements for weight loss, maintenance, or muscle gain. This calorie calculator is a must-have for planning effective diet and exercise programs tailored to your metabolism.
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Gender</p>
                <div className="grid grid-cols-2 gap-2">
                  {["male", "female"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`text-sm py-2 rounded-lg border capitalize transition-colors ${
                        gender === g
                          ? "bg-teal-600 border-teal-600 text-white font-semibold"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
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
                <input type="range" min={14} max={90} step={1} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full" />
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
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">BMR estimation formula</p>
              <div className="grid grid-cols-1 gap-2">
                {FORMULAS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFormula(f.key)}
                    className={`text-xs py-2.5 px-3 rounded-lg border font-medium transition-colors text-left ${
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

            {formula === "katch" ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    <Percent className="w-3.5 h-3.5" />
                    Body fat
                  </label>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      value={bodyFatPct}
                      onChange={(e) => setBodyFatPct(Number(e.target.value) || 0)}
                      className="font-mono-data w-16 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-300"
                    />
                    <span className="text-xs text-stone-400 font-mono-data">%</span>
                  </div>
                </div>
                <input type="range" min={3} max={50} step={1} value={bodyFatPct} onChange={(e) => setBodyFatPct(Number(e.target.value))} className="w-full" />
                <p className="text-[11px] text-stone-400 mt-1">Used only in the Katch-McArdle formula.</p>
              </div>
            ) : null}

            <button
              onClick={handleCalculate}
              className="mt-1 w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              <Flame className="w-4 h-4" />
              Calculate BMR
            </button>
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 flex flex-col">
            <div className="text-center">
              <p className="font-mono-data text-[11px] tracking-widest text-stone-400 uppercase mb-1">
                Basal metabolic rate
              </p>
              {bmr ? (
                <>
                  <p className="font-display text-5xl font-semibold text-stone-900 leading-none">
                    {bmr.toLocaleString()}
                  </p>
                  <p className="font-mono-data text-xs text-stone-400 mt-2">calories per day</p>
                </>
              ) : (
                <p className="font-mono-data text-sm text-stone-400 mt-3 mb-3">
                  Set your details and press calculate
                </p>
              )}
            </div>

            {bmr ? (
              <div className="mt-5 flex flex-col gap-1.5">
                <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide mb-1">
                  Estimated calories by activity level
                </p>
                {ACTIVITY_LEVELS.map((a) => {
                  const calories = Math.round(bmr * a.factor);
                  return (
                    <div key={a.key} className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-xs font-semibold text-stone-700">{a.label}</p>
                        <p className="text-[10px] text-stone-400">{a.time} &middot; {a.freq}</p>
                      </div>
                      <span className="font-mono-data text-sm font-semibold text-teal-700 shrink-0 ml-2">
                        {calories.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className="w-full mt-6 pt-4 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-400">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>
                BMR is the energy your body needs at complete rest. Multiply by an activity
                factor to estimate total daily calorie needs (TDEE). Informational only --
                not medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}