import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Ruler,
  Dumbbell,
  Flame,
  RotateCcw,
  Info,
  ChevronDown,
  Gauge,
  Beef,
  Wheat,
  Droplet,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const ACTIVITY_LEVELS = [
  { key: "sedentary", label: "Sedentary — little or no exercise", factor: 1.2 },
  { key: "light", label: "Light — exercise 1–3×/week", factor: 1.375 },
  { key: "moderate", label: "Moderate — exercise 4–5×/week", factor: 1.465 },
  { key: "active", label: "Active — daily or intense 3–4×/week", factor: 1.55 },
  { key: "veryactive", label: "Very active — intense 6–7×/week", factor: 1.725 },
  { key: "extra", label: "Extra active — very intense daily, physical job", factor: 1.9 },
];

// lbPerWeek spans -2 .. +2, used both for the math and for gauge position
const PLANS = [
  { key: "extremeloss", label: "Extreme loss", short: "Extreme loss", lbPerWeek: -2, accent: "rose" },
  { key: "loss", label: "Weight loss", short: "Loss", lbPerWeek: -1, accent: "rose" },
  { key: "mildloss", label: "Mild loss", short: "Mild loss", lbPerWeek: -0.5, accent: "teal" },
  { key: "maintain", label: "Maintain", short: "Maintain", lbPerWeek: 0, accent: "stone" },
  { key: "mildgain", label: "Mild gain", short: "Mild gain", lbPerWeek: 0.5, accent: "teal" },
  { key: "gain", label: "Weight gain", short: "Gain", lbPerWeek: 1, accent: "amber" },
  { key: "extremegain", label: "Extreme gain", short: "Extreme gain", lbPerWeek: 2, accent: "amber" },
];

const ACCENT_CLASSES = {
  rose: { chip: "bg-rose-50 text-rose-600 border-rose-200", bar: "bg-rose-400", dot: "bg-rose-500", text: "text-rose-600" },
  teal: { chip: "bg-teal-50 text-teal-700 border-teal-200", bar: "bg-teal-500", dot: "bg-teal-600", text: "text-teal-700" },
  stone: { chip: "bg-stone-100 text-stone-600 border-stone-200", bar: "bg-stone-400", dot: "bg-stone-500", text: "text-stone-600" },
  amber: { chip: "bg-amber-50 text-amber-700 border-amber-200", bar: "bg-amber-400", dot: "bg-amber-500", text: "text-amber-700" },
};

function calcBMR({ gender, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

function useCountUp(target, duration = 450) {
  const [display, setDisplay] = useState(target);
  const frame = useRef(null);
  const from = useRef(target);

  useEffect(() => {
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const startVal = from.current;
    const delta = target - startVal;
    if (delta === 0) return;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(startVal + delta * eased));
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else from.current = target;
    }
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}

export default function CalorieCalculator() {
  const [unit, setUnit] = useState("standard");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(30);
  const [heightCm, setHeightCm] = useState(182);
  const [weightKg, setWeightKg] = useState(80);
  const [activity, setActivity] = useState("moderate");
  const [selectedPlan, setSelectedPlan] = useState("maintain");
  const [tab, setTab] = useState("plans");

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
    setUnit("standard");
    setGender("male");
    setAge(30);
    setHeightCm(182);
    setWeightKg(80);
    setActivity("moderate");
    setSelectedPlan("maintain");
    setTab("plans");
  }

  // live-computed, no button needed
  const result = useMemo(() => {
    const bmr = calcBMR({ gender, weightKg, heightCm, age });
    const factor = ACTIVITY_LEVELS.find((a) => a.key === activity).factor;
    const maintain = bmr * factor;
    const rows = PLANS.map((p) => {
      const calDay = maintain + p.lbPerWeek * 500; // 3,500 cal ≈ 1 lb, spread over 7 days
      return { ...p, calDay: Math.round(calDay), pct: Math.round((calDay / maintain) * 100) };
    });
    return { bmr: Math.round(bmr), maintain: Math.round(maintain), rows };
  }, [gender, weightKg, heightCm, age, activity]);

  const displayedMaintain = useCountUp(result.maintain);

  const currentPlan = result.rows.find((r) => r.key === selectedPlan) || result.rows[3];
  const displayedPlanCal = useCountUp(currentPlan.calDay);

  // macros for the selected plan
  const macros = useMemo(() => {
    const proteinG = Math.round(weightLb * 0.9);
    const proteinCal = proteinG * 4;
    const fatCal = currentPlan.calDay * 0.25;
    const fatG = Math.round(fatCal / 9);
    const carbCal = Math.max(currentPlan.calDay - proteinCal - fatCal, 0);
    const carbG = Math.round(carbCal / 4);
    const total = proteinCal + fatCal + carbCal || 1;
    return [
      { key: "protein", label: "Protein", grams: proteinG, cal: Math.round(proteinCal), pct: Math.round((proteinCal / total) * 100), icon: Beef, color: "bg-orange-400", text: "text-orange-600" },
      { key: "carbs", label: "Carbs", grams: carbG, cal: Math.round(carbCal), pct: Math.round((carbCal / total) * 100), icon: Wheat, color: "bg-amber-400", text: "text-amber-600" },
      { key: "fat", label: "Fat", grams: fatG, cal: Math.round(fatCal), pct: Math.round((fatCal / total) * 100), icon: Droplet, color: "bg-teal-400", text: "text-teal-600" },
    ];
  }, [weightLb, currentPlan.calDay]);

  const gaugeMin = -2, gaugeMax = 2;
  const gaugePct = ((currentPlan.lbPerWeek - gaugeMin) / (gaugeMax - gaugeMin)) * 100;

  function formatRate(lbPerWeek) {
    if (unit === "metric") {
      const kg = Math.round(lbPerWeek * 0.453592 * 100) / 100;
      return kg === 0 ? "0 kg/wk" : `${kg > 0 ? "+" : ""}${kg} kg/wk`;
    }
    return lbPerWeek === 0 ? "0 lb/wk" : `${lbPerWeek > 0 ? "+" : ""}${lbPerWeek} lb/wk`;
  }

  function handleGaugeClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const ratio = x / rect.width;
    const target = gaugeMin + ratio * (gaugeMax - gaugeMin);
    let closest = PLANS[0];
    let bestDiff = Infinity;
    for (const p of PLANS) {
      const diff = Math.abs(p.lbPerWeek - target);
      if (diff < bestDiff) { bestDiff = diff; closest = p; }
    }
    setSelectedPlan(closest.key);
  }

  return (
    <div className="min-h-screen w-full bg-[#f6f4f0] flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-mono-data { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }

        input[type="range"] { -webkit-appearance: none; appearance: none; background: transparent; }
        input[type="range"]::-webkit-slider-runnable-track { height: 4px; border-radius: 999px; background: #E7E2D8; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; margin-top: -7px;
          width: 18px; height: 18px; border-radius: 999px; background: #0F766E;
          border: 3px solid white; box-shadow: 0 0 0 1px #D6D1C4; cursor: pointer;
          transition: transform 0.15s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.15); }
        input[type="range"]::-moz-range-track { height: 4px; border-radius: 999px; background: #E7E2D8; }
        input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 999px; background: #0F766E;
          border: 3px solid white; box-shadow: 0 0 0 1px #D6D1C4; cursor: pointer;
        }

        @keyframes riseIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .rise-in { animation: riseIn 0.4s ease both; }

        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(15, 118, 110, 0.35); }
          100% { box-shadow: 0 0 0 10px rgba(15, 118, 110, 0); }
        }
        .pulse-marker { animation: pulseRing 1.8s ease-out infinite; }
      `}</style>

      <div className="w-full max-w-4xl font-body mt-16 mb-16">
        <div className="flex flex-wrap items-end justify-center gap-4 mb-6 mt-6">
           <h1 className="font-display text-3xl font-semibold text-stone-900">
Calories Burned Calculator
            </h1>
        <p className="text-justify text-black/60 text-md ">
        Our Calories Burned Calculator helps you estimate the number of calories burned during various exercises and activities. Whether you’re tracking workouts, planning weight loss, or optimizing your fitness routine, this Calorie Burn Calculator provides accurate results based on your weight, activity type, and duration. Stay on top of your health goals with this easy-to-use fitness tool.
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
          {/* INPUT PANEL */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 flex flex-col gap-5 h-fit">
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
                      value={Math.round(weightLb * 10) / 10}
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
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Activity</label>
              <div className="relative">
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="font-body appearance-none w-full text-sm text-stone-800 bg-stone-50 border border-stone-200 rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  {ACTIVITY_LEVELS.map((a) => (
                    <option key={a.key} value={a.key}>{a.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-stone-50 border border-stone-200 px-3 py-2.5">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Basal rate</span>
              <span className="font-mono-data text-sm font-semibold text-stone-700">{result.bmr.toLocaleString()} cal</span>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-5">
            <div>
              <p className="font-mono-data text-xs tracking-widest text-stone-400 uppercase mb-1">
                Maintenance calories
              </p>
              <p className="font-display text-4xl font-semibold text-stone-900">
                {displayedMaintain.toLocaleString()} <span className="text-sm text-stone-400 font-body">cal/day</span>
              </p>
            </div>

            {/* SIGNATURE GAUGE */}
            <div className="rise-in">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Energy spectrum</span>
                <span className={`font-mono-data text-xs px-2 py-0.5 rounded-full border ${ACCENT_CLASSES[currentPlan.accent].chip}`}>
                  {currentPlan.label} · {formatRate(currentPlan.lbPerWeek)}
                </span>
              </div>
              <div
                className="relative h-3 rounded-full cursor-pointer"
                style={{ background: "linear-gradient(to right, #fda4af, #d6d3d1 45%, #5eead4 55%, #fcd34d)" }}
                onClick={handleGaugeClick}
                role="slider"
                aria-label="Select a calorie plan"
                aria-valuenow={currentPlan.lbPerWeek}
                tabIndex={0}
              >
                {PLANS.map((p) => {
                  const pct = ((p.lbPerWeek - gaugeMin) / (gaugeMax - gaugeMin)) * 100;
                  return (
                    <div
                      key={p.key}
                      className="absolute top-1/2 -translate-y-1/2 w-0.5 h-2 bg-white/60"
                      style={{ left: `${pct}%` }}
                    />
                  );
                })}
                <div
                  className={`absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow transition-all duration-500 ease-out pulse-marker ${ACCENT_CLASSES[currentPlan.accent].dot}`}
                  style={{ left: `${gaugePct}%`, transform: "translate(-50%, -50%)" }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="font-mono-data text-[10px] text-rose-400">{formatRate(gaugeMin)}</span>
                <span className="font-mono-data text-[10px] text-stone-400">maintain</span>
                <span className="font-mono-data text-[10px] text-amber-500">{formatRate(gaugeMax)}</span>
              </div>
            </div>

            {/* selected plan callout */}
            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 ${ACCENT_CLASSES[currentPlan.accent].text || "text-teal-600"}`} />
                <span className="text-sm text-stone-600">Target for <span className="font-semibold text-stone-900">{currentPlan.label.toLowerCase()}</span></span>
              </div>
              <span className="font-mono-data text-lg font-semibold text-stone-900">{displayedPlanCal.toLocaleString()} cal/day</span>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-1 bg-stone-100 rounded-full p-1 w-fit">
              <button
                onClick={() => setTab("plans")}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
                  tab === "plans" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Plans
              </button>
              <button
                onClick={() => setTab("macros")}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
                  tab === "macros" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Macro split
              </button>
            </div>

            {tab === "plans" ? (
              <div className="flex flex-col gap-2 rise-in">
                {result.rows.map((r) => {
                  const isSelected = selectedPlan === r.key;
                  const barPct = Math.min(100, Math.max(6, r.pct - 60));
                  const ac = ACCENT_CLASSES[r.accent];
                  return (
                    <button
                      key={r.key}
                      onClick={() => setSelectedPlan(r.key)}
                      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-colors text-left ${
                        isSelected ? "border-teal-400 bg-teal-50/40" : "border-stone-200 bg-stone-50 hover:border-stone-300"
                      }`}
                    >
                      <span className={`text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 border ${ac.chip}`}>
                        {r.short}
                      </span>
                      <div className="flex-1 min-w-0 h-1.5 rounded-full bg-stone-200 overflow-hidden hidden sm:block">
                        <div className={`h-full rounded-full ${ac.bar} transition-all duration-500`} style={{ width: `${barPct}%` }} />
                      </div>
                      <span className="font-mono-data text-xs text-stone-400 shrink-0">
                        {formatRate(r.lbPerWeek)}
                      </span>
                      <span className="font-mono-data text-sm font-semibold text-stone-800 shrink-0 w-20 text-right">
                        {r.calDay.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-3 rise-in">
                {macros.map((m) => (
                  <div key={m.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 text-sm text-stone-600">
                        <m.icon className={`w-3.5 h-3.5 ${m.text}`} />
                        {m.label}
                      </span>
                      <span className="font-mono-data text-xs text-stone-500">
                        {m.grams}g · {m.cal.toLocaleString()} cal · {m.pct}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div className={`h-full rounded-full ${m.color} transition-all duration-500`} style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}
                <p className="text-xs text-stone-500 mt-1">
                  A general split for {currentPlan.label.toLowerCase()}: protein near {unit === "metric" ? "2g per kg" : "0.9g per lb"} of bodyweight, fat at 25% of calories, carbs filling the remainder.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full mt-5 flex items-start gap-2 text-xs text-stone-400">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p>
            Maintenance calories use the Mifflin–St Jeor formula. Each 500 cal/day change is
            roughly equal to 1 lb of bodyweight per week. Individual metabolism varies —
            informational only, not medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}