import React, { useState } from "react";
import {
  Ruler,
  Dumbbell,
  UtensilsCrossed,
  Flame,
  Sofa,
  Footprints,
  Activity,
  Zap,
  RotateCcw,
  Info,
  Egg,
  Fish,
  Beef,
  Milk,
  Wheat,
  Nut,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";


const GOALS = [
  { key: "fatloss", label: "Fat loss", perKg: 2.0 },
  { key: "musclegain", label: "Muscle gain", perKg: 1.8 },
  { key: "maintenance", label: "Maintenance", perKg: 1.2 },
];

const ACTIVITIES = [
  { key: "sedentary", label: "Sedentary", factor: 0.9, icon: Sofa },
  { key: "light", label: "Lightly active", factor: 1.0, icon: Footprints },
  { key: "moderate", label: "Moderately active", factor: 1.05, icon: Activity },
  { key: "active", label: "Very active", factor: 1.15, icon: Zap },
];

// Common Indian high-protein foods with approx grams of protein per typical
// serving. Mix of veg, dairy, and non-veg staples so it works across diets.
const FOOD_SUGGESTIONS = [
  { key: "paneer", label: "Paneer", serving: "100g", proteinG: 18, icon: Milk },
  { key: "dahi", label: "Dahi / curd", serving: "1 cup (250g)", proteinG: 11, icon: Milk },
  { key: "moongdal", label: "Moong dal", serving: "1 cup cooked", proteinG: 14, icon: Wheat },
  { key: "toordal", label: "Toor dal", serving: "1 cup cooked", proteinG: 13, icon: Wheat },
  { key: "rajma", label: "Rajma", serving: "1 cup cooked", proteinG: 15, icon: Wheat },
  { key: "chana", label: "Chana / chole", serving: "1 cup cooked", proteinG: 15, icon: Wheat },
  { key: "sprouts", label: "Moong sprouts", serving: "1 cup", proteinG: 9, icon: Wheat },
  { key: "soyachunks", label: "Soya chunks", serving: "50g dry, cooked", proteinG: 26, icon: Wheat },
  { key: "tofu", label: "Tofu", serving: "100g", proteinG: 12, icon: Wheat },
  { key: "milk", label: "Milk", serving: "1 cup (240ml)", proteinG: 8, icon: Milk },
  { key: "eggs", label: "Eggs", serving: "2 large eggs", proteinG: 12, icon: Egg },
  { key: "chicken-curry", label: "Chicken curry", serving: "100g chicken", proteinG: 27, icon: Beef },
  { key: "fish-curry", label: "Fish curry", serving: "100g fish", proteinG: 20, icon: Fish },
  { key: "peanuts", label: "Peanuts / groundnuts", serving: "1/4 cup (35g)", proteinG: 9, icon: Nut },
  { key: "roasted-chana", label: "Roasted chana", serving: "1/4 cup (30g)", proteinG: 6, icon: Nut },
  { key: "protein-shake", label: "Whey protein shake", serving: "1 scoop", proteinG: 24, icon: Dumbbell },
];

const RING_MAX_G = 250;
const RING_R = 82;
const RING_CIRC = 2 * Math.PI * RING_R;

function calcProteinG({ weightKg, goalPerKg, activityFactor, age }) {
  const ageFactor = age >= 50 ? 1.1 : 1.0;
  return Math.round(weightKg * goalPerKg * activityFactor * ageFactor);
}

// Greedily pick a handful of foods whose combined protein lands close to
// the daily target, so the list feels like "here's a day that gets you
// there" rather than a random assortment.
function suggestFoodPlan(targetG) {
  if (!targetG) return [];
  const shuffled = [...FOOD_SUGGESTIONS].sort(() => Math.random() - 0.5);
  const picked = [];
  let running = 0;
  for (const food of shuffled) {
    if (running >= targetG) break;
    picked.push(food);
    running += food.proteinG;
    if (picked.length >= 6) break;
  }
  return picked;
}

export default function ProteinIntakeCalculator() {
  const [unit, setUnit] = useState("metric");
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState("male");
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [goal, setGoal] = useState("fatloss");
  const [activity, setActivity] = useState("sedentary");
  const [resultG, setResultG] = useState(null);
  const [foodPlan, setFoodPlan] = useState([]);

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
    setGoal("fatloss");
    setActivity("sedentary");
    setResultG(null);
    setFoodPlan([]);
  }

  function handleCalculate() {
    const goalPerKg = GOALS.find((g) => g.key === goal).perKg;
    const activityFactor = ACTIVITIES.find((a) => a.key === activity).factor;
    const g = calcProteinG({ weightKg, goalPerKg, activityFactor, age });
    setResultG(g);
    setFoodPlan(suggestFoodPlan(g));
  }

  const ringPercent = resultG ? Math.min(100, (resultG / RING_MAX_G) * 100) : 0;
  const ringOffset = RING_CIRC - (ringPercent / 100) * RING_CIRC;

  const caloriesFromProtein = resultG ? resultG * 4 : 0;
  const perMeal = resultG ? Math.round(resultG / 4) : 0;
  const perKgActual = resultG && weightKg ? (resultG / weightKg).toFixed(1) : 0;
  const foodPlanTotal = foodPlan.reduce((sum, f) => sum + f.proteinG, 0);

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
        <div className="flex flex-wrap items-end justify-center gap-4 mb-6 mt-6">
           <h1 className="font-display text-3xl font-semibold text-stone-900">
                            Protein intake calculator
            </h1>
        <p className="text-justify text-black/60 text-md ">
        Discover exactly how much protein your body needs with our free Protein Intake Calculator. Whether your goal is weight loss, muscle gain, or improved overall health, this daily protein intake calculator provides personalized recommendations based on your age, weight, activity level, and fitness goals. Learn the right protein requirements per day to support your journey and achieve lasting results with <Link to="/" className="text-sky-600 hover:text-sky-800">FitMom Club’s</Link> expert guidance.
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
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Goal</p>
              <div className="grid grid-cols-3 gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g.key}
                    onClick={() => setGoal(g.key)}
                    className={`text-xs py-2.5 rounded-lg border font-medium transition-colors ${
                      goal === g.key
                        ? "bg-teal-600 border-teal-600 text-white font-semibold"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Activity level</p>
              <div className="grid grid-cols-4 gap-2">
                {ACTIVITIES.map((a) => {
                  const Icon = a.icon;
                  const isActive = activity === a.key;
                  return (
                    <button
                      key={a.key}
                      onClick={() => setActivity(a.key)}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border text-[10px] leading-tight text-center transition-colors ${
                        isActive ? "bg-teal-600 border-teal-600 text-white font-semibold" : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300"
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
              className="mt-1 w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              <UtensilsCrossed className="w-4 h-4" />
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
                  <UtensilsCrossed className="w-7 h-7 text-teal-600" />
                </div>
              </foreignObject>
            </svg>

            <div className="text-center -mt-2">
              <p className="font-mono-data text-[11px] tracking-widest text-stone-400 uppercase mb-1">
                Daily protein target
              </p>
              {resultG ? (
                <>
                  <p className="font-display text-5xl font-semibold text-stone-900 leading-none">
                    {resultG}
                    <span className="text-2xl text-stone-400 ml-1">g</span>
                  </p>
                  <p className="font-mono-data text-xs text-stone-400 mt-2">
                    {perKgActual} g/kg &middot; {perMeal}g per meal (4 meals)
                  </p>
                </>
              ) : (
                <p className="font-mono-data text-sm text-stone-400 mt-3">
                  Set your details and press calculate
                </p>
              )}
            </div>

            {resultG ? (
              <div className="w-full grid grid-cols-1 gap-2 mt-5">
                <div className="flex items-center justify-between bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
                  <span className="flex items-center gap-1.5 text-xs text-teal-800 font-medium">
                    <Flame className="w-3.5 h-3.5" />
                    Calories from protein
                  </span>
                  <span className="font-mono-data text-xs font-semibold text-teal-800">
                    {caloriesFromProtein} kcal
                  </span>
                </div>
              </div>
            ) : null}

            <div className="w-full mt-6 pt-4 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-400">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>
                This estimate uses common sports-nutrition ranges (g of protein per kg
                bodyweight) adjusted for your goal, activity level, and age. Informational
                only -- not medical advice.
              </p>
            </div>
          </div>

          {/* Food suggestions -- appears after the first calculation */}
          {resultG ? (
            <div className="md:col-span-5 bg-white rounded-2xl border border-stone-200 p-5">
              <div className="flex items-end justify-between mb-1">
                <div>
                  <p className="font-mono-data text-[11px] tracking-widest text-stone-400 uppercase mb-1">
                    Food ideas
                  </p>
                  <h2 className="font-display text-xl font-semibold text-stone-900">
                    A day that gets you there
                  </h2>
                </div>
                <button
                  onClick={() => setFoodPlan(suggestFoodPlan(resultG))}
                  className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors border border-stone-200 hover:border-stone-300 rounded-full px-3 py-1.5 bg-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Shuffle
                </button>
              </div>
              <p className="font-mono-data text-xs text-stone-400 mb-4">
                ~{foodPlanTotal}g of your {resultG}g target from these servings
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {foodPlan.map((food) => {
                  const Icon = food.icon;
                  return (
                    <div
                      key={food.key}
                      className="flex items-start gap-2.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-800 leading-tight">
                          {food.label}
                        </p>
                        <p className="text-[11px] text-stone-400 leading-tight mt-0.5">
                          {food.serving}
                        </p>
                        <p className="font-mono-data text-xs font-semibold text-teal-700 mt-1">
                          {food.proteinG}g protein
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-stone-400 mt-4">
                Mix and match across meals -- these are just a starting point. Combine plant
                and animal sources freely based on what you actually enjoy eating.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}