import React, { useState, useMemo } from "react";
import {
  Ruler,
  Scale,
  Target,
  TrendingDown,
  TrendingUp,
  Minus,
  CalendarClock,
  ChevronDown,
  Info,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const ACTIVITY_LEVELS = [
  { key: "none", label: "No sport/exercise", factor: 1.2 },
  { key: "light", label: "Light activity (sport 1-3 times per week)", factor: 1.375 },
  { key: "moderate", label: "Moderate activity (sport 3-5 times per week)", factor: 1.55 },
  { key: "high", label: "High activity (everyday exercise)", factor: 1.725 },
  { key: "extreme", label: "Extreme activity (professional athlete)", factor: 1.9 },
];

// weekly rate options, expressed in lb/week internally, shown as lb or kg depending on unit
const PACES = [
  { key: "mild", label: "Mild", lbPerWeek: 0.5 },
  { key: "moderate", label: "Moderate", lbPerWeek: 1 },
  { key: "aggressive", label: "Aggressive", lbPerWeek: 2 },
];

const LB_PER_KG = 2.20462;
const CM_PER_IN = 2.54;

function buildImperialHeights() {
  const opts = [];
  for (let totalIn = 48; totalIn <= 90; totalIn++) { // 4'0" to 7'6"
    const ft = Math.floor(totalIn / 12);
    const inch = totalIn % 12;
    opts.push({ value: totalIn, label: `${ft}ft ${inch}in`, cm: Math.round(totalIn * CM_PER_IN * 10) / 10 });
  }
  return opts;
}
function buildMetricHeights() {
  const opts = [];
  for (let cm = 120; cm <= 220; cm++) opts.push({ value: cm, label: `${cm} cm`, cm });
  return opts;
}
const IMPERIAL_HEIGHTS = buildImperialHeights();
const METRIC_HEIGHTS = buildMetricHeights();

function calcBMR({ gender, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

function fmtWeight(kg, unit) {
  if (unit === "metric") return `${Math.round(kg * 10) / 10} kg`;
  return `${Math.round(kg * LB_PER_KG * 10) / 10} lb`;
}
function fmtRate(lbPerWeek, unit) {
  if (unit === "metric") {
    const kg = Math.round((lbPerWeek / LB_PER_KG) * 100) / 100;
    return `${kg} kg/wk`;
  }
  return `${lbPerWeek} lb/wk`;
}

export default function WeightGoalCalculator() {
  const [unit, setUnit] = useState("imperial");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(30);
  const [heightVal, setHeightVal] = useState(71); // 5ft 11in in total inches
  const [activity, setActivity] = useState("moderate");
  const [currentWeight, setCurrentWeight] = useState(180); // in display unit
  const [targetWeight, setTargetWeight] = useState(165); // in display unit
  const [pace, setPace] = useState("moderate");
  const [hasCalculated, setHasCalculated] = useState(false);

  const heightOptions = unit === "imperial" ? IMPERIAL_HEIGHTS : METRIC_HEIGHTS;

  function handleUnitChange(next) {
    if (next === unit) return;
    if (next === "metric") {
      const opt = IMPERIAL_HEIGHTS.find((o) => o.value === heightVal) || IMPERIAL_HEIGHTS[0];
      setHeightVal(Math.round(opt.cm));
      setCurrentWeight(Math.round((currentWeight / LB_PER_KG) * 10) / 10);
      setTargetWeight(Math.round((targetWeight / LB_PER_KG) * 10) / 10);
    } else {
      const opt = METRIC_HEIGHTS.find((o) => o.value === heightVal) || METRIC_HEIGHTS[0];
      const totalIn = Math.round(opt.cm / CM_PER_IN);
      setHeightVal(totalIn);
      setCurrentWeight(Math.round(currentWeight * LB_PER_KG * 10) / 10);
      setTargetWeight(Math.round(targetWeight * LB_PER_KG * 10) / 10);
    }
    setUnit(next);
    setHasCalculated(false);
  }

  function handleReset() {
    setUnit("imperial");
    setGender("male");
    setAge(30);
    setHeightVal(71);
    setActivity("moderate");
    setCurrentWeight(180);
    setTargetWeight(165);
    setPace("moderate");
    setHasCalculated(false);
  }

  const heightCm = useMemo(() => {
    const opt = heightOptions.find((o) => o.value === heightVal) || heightOptions[0];
    return opt.cm;
  }, [heightVal, heightOptions]);

  const currentWeightKg = unit === "metric" ? currentWeight : currentWeight / LB_PER_KG;
  const targetWeightKg = unit === "metric" ? targetWeight : targetWeight / LB_PER_KG;

  const result = useMemo(() => {
    const bmr = calcBMR({ gender, weightKg: currentWeightKg, heightCm, age });
    const factor = ACTIVITY_LEVELS.find((a) => a.key === activity).factor;
    const maintain = bmr * factor;
    const diffKg = targetWeightKg - currentWeightKg;
    const direction = diffKg < -0.15 ? "lose" : diffKg > 0.15 ? "gain" : "maintain";
    const totalChangeKg = Math.abs(diffKg);
    const totalChangeLb = totalChangeKg * LB_PER_KG;

    const paceRows = PACES.map((p) => {
      const signedLb = direction === "gain" ? p.lbPerWeek : -p.lbPerWeek;
      const calDay = Math.round(maintain + signedLb * 500);
      const weeks = totalChangeLb > 0 ? totalChangeLb / p.lbPerWeek : 0;
      return { ...p, calDay, weeks };
    });

    return { bmr: Math.round(bmr), maintain: Math.round(maintain), direction, totalChangeKg, totalChangeLb, paceRows };
  }, [gender, currentWeightKg, targetWeightKg, heightCm, age, activity]);

  const selectedPace = result.paceRows.find((p) => p.key === pace) || result.paceRows[1];
  const goalDate = useMemo(() => {
    if (result.direction === "maintain" || selectedPace.weeks <= 0) return null;
    const d = new Date();
    d.setDate(d.getDate() + Math.round(selectedPace.weeks * 7));
    return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }, [result.direction, selectedPace]);

  const DirIcon = result.direction === "lose" ? TrendingDown : result.direction === "gain" ? TrendingUp : Minus;
  const dirColor = result.direction === "lose" ? "text-teal-600" : result.direction === "gain" ? "text-amber-600" : "text-stone-500";
  const dirBg = result.direction === "lose" ? "bg-teal-50 border-teal-200" : result.direction === "gain" ? "bg-amber-50 border-amber-200" : "bg-stone-100 border-stone-200";

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
      `}</style>

      <div className="w-full max-w-4xl font-body mt-16 mb-16">
        <div className="flex flex-wrap items-end justify-center gap-4 mb-6 mt-6">
           <h1 className="font-display text-3xl font-semibold text-stone-900">
Weight Loss Calculator
            </h1>
        <p className="text-justify text-black/60 text-md ">
Our Weight Loss Calculator helps you estimate how many calories you need to consume and burn to achieve your weight loss goals. Whether you want to lose fat, maintain muscle, or improve overall health, this tool uses your height, weight, age, gender, and activity level to calculate a safe calorie deficit. Use our Calorie Deficit Calculator to plan your diet, track progress, and stay motivated on your weight loss journey.        </p>
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
                onClick={() => handleUnitChange("imperial")}
                className={`flex-1 text-xs font-semibold py-2 rounded-full transition-all ${
                  unit === "imperial" ? "bg-stone-900 text-white shadow-sm" : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Imperial
              </button>
              <button
                onClick={() => handleUnitChange("metric")}
                className={`flex-1 text-xs font-semibold py-2 rounded-full transition-all ${
                  unit === "metric" ? "bg-stone-900 text-white shadow-sm" : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Metric
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Gender</p>
              <div className="grid grid-cols-2 gap-2">
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => { setGender(g); setHasCalculated(false); }}
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
                  onChange={(e) => { setAge(Number(e.target.value) || 0); setHasCalculated(false); }}
                  className="font-mono-data w-14 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
              <input
                type="range" min={14} max={90} step={1} value={age}
                onChange={(e) => { setAge(Number(e.target.value)); setHasCalculated(false); }}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                <Ruler className="w-3.5 h-3.5" />
                Height
              </label>
              <div className="relative">
                <select
                  value={heightVal}
                  onChange={(e) => { setHeightVal(Number(e.target.value)); setHasCalculated(false); }}
                  className="font-mono-data appearance-none w-full text-sm text-stone-800 bg-stone-50 border border-stone-200 rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  {heightOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Activity Level</label>
              <div className="relative">
                <select
                  value={activity}
                  onChange={(e) => { setActivity(e.target.value); setHasCalculated(false); }}
                  className="font-body appearance-none w-full text-sm text-stone-800 bg-stone-50 border border-stone-200 rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  {ACTIVITY_LEVELS.map((a) => (
                    <option key={a.key} value={a.key}>{a.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  <Scale className="w-3.5 h-3.5" />
                  Current Weight
                </label>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => { setCurrentWeight(Number(e.target.value) || 0); setHasCalculated(false); }}
                    className="font-mono-data w-17 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                  <span className="text-xs text-stone-400 font-mono-data">{unit === "metric" ? "kg" : "lb"}</span>
                </div>
              </div>
              <input
                type="range"
                min={unit === "metric" ? 35 : 80}
                max={unit === "metric" ? 180 : 400}
                step={1}
                value={currentWeight}
                onChange={(e) => { setCurrentWeight(Number(e.target.value)); setHasCalculated(false); }}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  <Target className="w-3.5 h-3.5" />
                  Target Weight
                </label>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    value={targetWeight}
                    onChange={(e) => { setTargetWeight(Number(e.target.value) || 0); setHasCalculated(false); }}
                    className="font-mono-data w-17 text-right text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                  <span className="text-xs text-stone-400 font-mono-data">{unit === "metric" ? "kg" : "lb"}</span>
                </div>
              </div>
              <input
                type="range"
                min={unit === "metric" ? 35 : 80}
                max={unit === "metric" ? 180 : 400}
                step={1}
                value={targetWeight}
                onChange={(e) => { setTargetWeight(Number(e.target.value)); setHasCalculated(false); }}
                className="w-full"
              />
            </div>

            <button
              onClick={() => setHasCalculated(true)}
              className="mt-1 w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              <Target className="w-4 h-4" />
              Calculate
            </button>
          </div>

          {/* RESULTS PANEL */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-stone-200 p-6">
            {hasCalculated ? (
              <div className="flex flex-col gap-5 rise-in">
                <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${dirBg}`}>
                  <div className="flex items-center gap-2">
                    <DirIcon className={`w-5 h-5 ${dirColor}`} />
                    <span className="text-sm text-stone-700">
                      {result.direction === "maintain"
                        ? "You're already at your target weight"
                        : `${result.direction === "lose" ? "Lose" : "Gain"} ${unit === "metric" ? `${Math.round(result.totalChangeKg * 10) / 10} kg` : `${Math.round(result.totalChangeLb * 10) / 10} lb`} to reach your goal`}
                    </span>
                  </div>
                  <span className="font-mono-data text-xs text-stone-400">
                    {fmtWeight(currentWeightKg, unit)} → {fmtWeight(targetWeightKg, unit)}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <p className="font-mono-data text-xs tracking-widest text-stone-400 uppercase">
                    Maintenance calories
                  </p>
                  <p className="font-display text-2xl font-semibold text-stone-900">
                    {result.maintain.toLocaleString()} <span className="text-sm text-stone-400 font-body">cal/day</span>
                  </p>
                </div>

                {result.direction !== "maintain" && (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Choose a pace</p>
                      <div className="grid grid-cols-3 gap-2">
                        {result.paceRows.map((p) => {
                          const isSelected = pace === p.key;
                          return (
                            <button
                              key={p.key}
                              onClick={() => setPace(p.key)}
                              className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 transition-colors ${
                                isSelected ? "border-teal-500 bg-teal-50" : "border-stone-200 bg-stone-50 hover:border-stone-300"
                              }`}
                            >
                              <span className="text-xs font-semibold text-stone-700">{p.label}</span>
                              <span className="font-mono-data text-[11px] text-stone-400">{fmtRate(p.lbPerWeek, unit)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                      <span className="text-sm text-stone-600">Daily calorie target</span>
                      <span className="font-mono-data text-lg font-semibold text-stone-900">
                        {selectedPace.calDay.toLocaleString()} cal/day
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="w-4 h-4 text-teal-600" />
                        <span className="text-sm text-stone-600">Estimated time to goal</span>
                      </div>
                      <span className="font-mono-data text-sm font-semibold text-stone-900">
                        {Math.ceil(selectedPace.weeks)} weeks{goalDate ? ` · ${goalDate}` : ""}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center min-h-[300px]">
                <p className="font-mono-data text-sm text-stone-400 text-center">
                  Set your details and press calculate
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