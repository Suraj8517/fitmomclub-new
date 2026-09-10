import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Zap, Footprints, Watch } from "lucide-react";

// ---------------------------------------------------------------------------
// Fires once when the element is (almost) fully in view, then stops
// observing — matches the reveal pattern used by the other story overlays.
function useInFullView(ref, threshold = 0.5) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= threshold) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}

// Eased ramp from 0 -> target, used for the ring's fill % and any counters.
// Reports "done" a beat after it settles so callers can trigger a landing pulse.
function useAnimatedValue(target, duration = 1000, delay = 0, enabled = true) {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let raf;
    let start;
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts;
        const t = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(target * eased);
        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else {
          setDone(true);
        }
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay, enabled]);
  return [value, done];
}

const CALORIES = 320;
const GOAL = 500;
const KM = 4.2;
const WORKOUTS = 2;

const ACCENT = "#FF4438"; // primary red

export default function Goals() {
  const cardRef = useRef(null);
  const inView = useInFullView(cardRef);
  const [range, setRange] = useState("D");

  const size = 190;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  const [animatedPct] = useAnimatedValue(CALORIES / GOAL, 950, 150, inView);
  const [animatedCalories, caloriesDone] = useAnimatedValue(CALORIES, 950, 150, inView);
  const [animatedKm, kmDone] = useAnimatedValue(KM, 900, 350, inView);
  const dash = circumference * animatedPct;

  return (
    <div
      ref={cardRef}
      className="absolute hidden lg:block z-30 rounded-[1.75rem] overflow-hidden"
      style={{
        right: "6%",
        top: "50%",
        transform: inView ? "translateY(-50%)" : "translateY(-46%)",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        background:
          "radial-gradient(90% 55% at 50% 0%, #5c1210 0%, #2b0808 38%, #0a0303 68%, #000000 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <style>{`
        @keyframes gwPopIn { from { opacity: 0; transform: scale(0.6) rotate(-8deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        @keyframes gwRowIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gwNumberLand { 0% { transform: scale(1); } 40% { transform: scale(1.14); } 100% { transform: scale(1); } }
        @keyframes gwRingGlowPulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(255,68,56,0.45)); }
          50% { filter: drop-shadow(0 0 10px rgba(255,68,56,0.85)); }
        }
        @keyframes gwWatchTick {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        @keyframes gwBtnPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,68,56,0.5); }
          50% { box-shadow: 0 0 0 6px rgba(255,68,56,0); }
        }
        .gw-number-land { animation: gwNumberLand 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        .gw-ring-active { animation: gwRingGlowPulse 2.4s ease-in-out infinite; }
        .gw-watch { animation: gwWatchTick 2.6s ease-in-out 1.3s infinite; transform-origin: 50% 85%; }
        .gw-btn-primary { animation: gwBtnPulse 2.6s ease-in-out 1.5s infinite; }
        .gw-icon-btn { transition: transform 0.15s ease, background-color 0.15s ease; }
        .gw-icon-btn:hover { background: rgba(255,255,255,0.12) !important; }
        .gw-icon-btn:active { transform: scale(0.88); }
        .gw-pill { transition: background-color 0.25s ease, color 0.25s ease, transform 0.15s ease; }
        .gw-pill:active { transform: scale(0.94); }
        .gw-btn { transition: transform 0.15s ease, filter 0.15s ease; }
        .gw-btn:hover { filter: brightness(1.1); }
        .gw-btn:active { transform: scale(0.96); }
        .gw-stat-card { transition: transform 0.2s ease, background-color 0.2s ease; }
        .gw-stat-card:hover { transform: translateY(-2px); background: rgba(255,255,255,0.08) !important; }
        @media (prefers-reduced-motion: reduce) {
          .gw-icon-btn, .gw-pill, .gw-btn, .gw-stat-card, .gw-watch, .gw-btn-primary, .gw-ring-active, .gw-number-land {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div
        className="w-[300px] px-4 pt-4 pb-4 text-white"
        style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            className="gw-icon-btn w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(120,30,30,0.35)" }}
          >
            <ChevronLeft size={16} strokeWidth={2.5} color="#fff" />
          </button>

          <div
            className="flex items-center rounded-full p-0.5 gap-0.5"
            style={{ background: "rgba(60,15,15,0.55)" }}
          >
            {["D", "W", "M"].map((r_) => (
              <button
                key={r_}
                onClick={() => setRange(r_)}
                className="gw-pill px-3.5 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: range === r_ ? "rgba(180,30,25,0.55)" : "transparent",
                  color: range === r_ ? "#FF5A4E" : "rgba(255,255,255,0.85)",
                  fontWeight: range === r_ ? 700 : 500,
                }}
              >
                {r_}
              </button>
            ))}
          </div>

          <div className="w-8 h-8" />
        </div>

        {/* Ring */}
        <div className="flex items-center justify-center mb-4">
          <button
            className="gw-icon-btn p-1 -ml-1 rounded-full"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>

          <div className="relative mx-2" style={{ width: size, height: size }}>
            <svg
              width={size}
              height={size}
              style={{ transform: "rotate(-90deg)" }}
              className={inView && dash > 0 ? "gw-ring-active" : ""}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="rgba(150,150,150,0.45)"
                strokeWidth={stroke}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={ACCENT}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p
                className="text-xs font-semibold mb-0.5"
                style={{
                  color: ACCENT,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
                }}
              >
                Today
              </p>
              <p
                className={`text-4xl font-bold tabular-nums ${caloriesDone ? "gw-number-land" : ""}`}
              >
                {Math.round(animatedCalories)}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  opacity: inView ? 1 : 0,
                  transition: "opacity 0.5s ease 0.3s",
                }}
              >
                of {GOAL} kcal
              </p>
              <button
                className="gw-icon-btn mt-2 px-3 py-1 rounded-lg text-[11px]"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.4)",
                  color: "rgba(255,255,255,0.75)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "scale(1)" : "scale(0.9)",
                  transition: "opacity 0.5s ease 0.45s, transform 0.5s ease 0.45s, background-color 0.15s ease",
                }}
              >
                Edit Goal
              </button>
            </div>
          </div>

          <button
            className="gw-icon-btn p-1 -mr-1 rounded-full"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div
            className="gw-stat-card rounded-xl px-3 py-2.5 flex flex-col items-center gap-1"
            style={{
              background: "rgba(255,255,255,0.05)",
              opacity: inView ? 1 : 0,
              animation: inView ? "gwRowIn 0.5s ease 0.55s both" : "none",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={{
                  background: ACCENT,
                  opacity: inView ? 1 : 0,
                  animation: inView ? "gwPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.7s both" : "none",
                }}
              >
                <Zap size={11} color="#fff" fill="#fff" />
              </span>
              <span
                className={`text-md font-semibold text-red-600 tabular-nums ${caloriesDone ? "gw-number-land" : ""}`}
              >
                {Math.round(animatedCalories)}
              </span>
            </div>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.8)" }}>
              Kcal
            </p>
          </div>

          <div
            className="gw-stat-card rounded-xl px-3 py-2.5 flex flex-col items-center gap-1"
            style={{
              background: "rgba(255,255,255,0.05)",
              opacity: inView ? 1 : 0,
              animation: inView ? "gwRowIn 0.5s ease 0.65s both" : "none",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={{
                  background: ACCENT,
                  opacity: inView ? 1 : 0,
                  animation: inView ? "gwPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.8s both" : "none",
                }}
              >
                <Footprints size={11} color="#fff" />
              </span>
              <span
                className={`text-md font-semibold text-red-600 tabular-nums ${kmDone ? "gw-number-land" : ""}`}
              >
                {animatedKm.toFixed(1)}
              </span>
            </div>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.8)" }}>
              Km
            </p>
          </div>
        </div>

        {/* Gym Workouts card */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(20,20,20,0.85)",
            border: "1px solid rgba(255,255,255,0.06)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.55s ease 0.75s, transform 0.55s ease 0.75s",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-center">Gym Workouts</p>
            <span className="gw-watch inline-flex">
              <Watch size={16} color={ACCENT} strokeWidth={2} />
            </span>
          </div>

          <p className="text-[11px] mb-3 text-center" style={{ color: "rgba(255,255,255,0.55)" }}>
            Number of Workouts completed Today
          </p>

          <p className="text-xl font-light text-center mb-4">{WORKOUTS} workouts<span className="text-[11px] font-light text-red-600"> (320kcal)</span></p>

          <div className="flex gap-2">
            <button
              className="gw-btn gw-btn-primary flex-1 rounded-xl py-2.5 text-[10px] font-light"
              style={{ background: ACCENT, color: "#fff" }}
            >
              Add Gym Workout
            </button>
            <button
              className="gw-btn flex-1 rounded-xl py-2.5 text-[10px] font-light"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
            >
              Workout Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}