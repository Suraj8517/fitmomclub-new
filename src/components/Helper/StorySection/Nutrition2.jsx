import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Bell, Minimize2, Maximize2 } from "lucide-react";

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

// Eased ramp from 0 -> target, used for both the calorie count and the
// ring's fill percentage so they land in sync.
function useAnimatedValue(target, duration = 1000, delay = 0, enabled = true) {
  const [value, setValue] = useState(0);
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
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay, enabled]);
  return value;
}

const MACROS = [
  { label: "Protein", value: 25, max: 146, unit: "g", color: "#E5484D" },
  { label: "Carbs", value: 162, max: 293, unit: "g", color: "#2F8FE8" },
  { label: "Fat", value: 22, max: 65, unit: "g", color: "#F5A524" },
  { label: "Fibre", value: 13, max: 33, unit: "g", color: "#3DBE64" },
];

const CALORIES = 986;
const GOAL = 2342;
const PCT = CALORIES / GOAL;

const RESIZE_TRANSITION = "0.4s cubic-bezier(0.65, 0, 0.35, 1)";

function pick(compact, compactVal, fullVal) {
  return compact ? compactVal : fullVal;
}

export default function Nutrition1() {
  const cardRef = useRef(null);
  const inView = useInFullView(cardRef);

  const [reminderOn, setReminderOn] = useState(false);
  const [range, setRange] = useState("D");
  const [compact, setCompact] = useState(false);

  

  const RING_VB = 280;
  const stroke = pick(compact, 8, 11);
  const r = (RING_VB - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  const cardWidth = pick(compact, 200, 280);
  const ringBox = pick(compact, 132, 196);
  const outerPadX = pick(compact, 11, 15);
  const outerPadTop = pick(compact, 12, 17);
  const outerPadBottom = pick(compact, 15, 22);
  const headerMB = pick(compact, 11, 20);
  const headerBtn = pick(compact, 21, 28);
  const ringMB = pick(compact, 14, 24);
  const calorieFont = pick(compact, 22, 32);
  const goalPad = pick(compact, 11, 16);
  const goalRadius = pick(compact, 14, 18);
  const goalMB = pick(compact, 7, 11);
  const macroGapX = pick(compact, 11, 16);
  const macroGapY = pick(compact, 9, 13);
  const reminderPad = pick(compact, 9, 13);
  const bellSize = pick(compact, 24, 32);
  const toggleW = pick(compact, 27, 34);
  const toggleH = pick(compact, 15, 20);
  const thumbSize = pick(compact, 12, 16);

  // Ring sweeps in first, calories count up alongside it, macro bars and
  // the reminder card follow in a short stagger once the card is visible.
  const animatedPct = useAnimatedValue(PCT, 1100, 150, inView);
  const animatedCalories = useAnimatedValue(CALORIES, 1100, 150, inView);
  const dash = circumference * animatedPct;

  return (
    <div
      ref={cardRef}
      className="absolute hidden lg:block z-30 rounded-3xl overflow-hidden"
      style={{
        right: "6%",
        top: "50%",
        width: cardWidth,
        transform: inView ? "translateY(-50%)" : "translateY(-46%)",
        opacity: inView ? 1 : 0,
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1), width ${RESIZE_TRANSITION}`,
        background:
          "radial-gradient(120% 90% at 50% 0%, #123328 0%, #0b1f19 45%, #060b0a 100%)",
      }}
    >
      <style>{`
        @keyframes nut1BellRing {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-14deg); }
          30% { transform: rotate(12deg); }
          45% { transform: rotate(-8deg); }
          60% { transform: rotate(5deg); }
          75% { transform: rotate(-2deg); }
        }
        @keyframes nut1RowIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nut1BarFill {
          from { width: 0%; }
        }
        @keyframes nut1PopIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        .nut1-thumb {
          transition: left 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), width ${RESIZE_TRANSITION}, height ${RESIZE_TRANSITION};
        }
        .nut1-toggle-track {
          transition: background-color 0.28s ease, width ${RESIZE_TRANSITION}, height ${RESIZE_TRANSITION};
        }
        .nut1-icon-btn {
          transition: transform 0.15s ease, background-color 0.15s ease, width ${RESIZE_TRANSITION}, height ${RESIZE_TRANSITION};
        }
        .nut1-icon-btn:hover {
          background: rgba(255,255,255,0.1) !important;
        }
        .nut1-icon-btn:active {
          transform: scale(0.88);
        }
        .nut1-pill {
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.15s ease;
        }
        .nut1-pill:active {
          transform: scale(0.94);
        }
        .nut1-resize {
          transition: width ${RESIZE_TRANSITION}, height ${RESIZE_TRANSITION}, padding ${RESIZE_TRANSITION},
                      margin ${RESIZE_TRANSITION}, font-size ${RESIZE_TRANSITION}, gap ${RESIZE_TRANSITION},
                      border-radius ${RESIZE_TRANSITION};
        }
        @media (prefers-reduced-motion: reduce) {
          .nut1-thumb, .nut1-toggle-track, .nut1-icon-btn, .nut1-pill, .nut1-resize {
            transition: none !important;
          }
        }
      `}</style>

      
      <div
        className="nut1-resize w-full text-white"
        style={{
          fontFamily: "'Poppins', 'Segoe UI', sans-serif",
          paddingLeft: outerPadX,
          paddingRight: outerPadX,
          paddingTop: outerPadTop,
          paddingBottom: outerPadBottom,
        }}
      >
        {/* Header */}
        <div
          className="nut1-resize flex items-center justify-between"
          style={{ marginBottom: headerMB }}
        >
          <button
            className="nut1-icon-btn nut1-resize rounded-full flex items-center justify-center"
            style={{ width: headerBtn, height: headerBtn, background: "rgba(255,255,255,0.06)" }}
          >
            <ChevronLeft size={pick(compact, 12, 15)} strokeWidth={2.5} />
          </button>

          <div
            className="nut1-resize flex items-center rounded-full"
            style={{ padding: pick(compact, 2, 3), background: "rgba(255,255,255,0.05)" }}
          >
            {["D", "W", "M"].map((r_) => (
              <button
                key={r_}
                onClick={() => setRange(r_)}
                className="nut1-pill nut1-resize rounded-full font-medium"
                style={{
                  paddingLeft: pick(compact, 10, 16),
                  paddingRight: pick(compact, 10, 16),
                  paddingTop: pick(compact, 4, 6),
                  paddingBottom: pick(compact, 4, 6),
                  fontSize: pick(compact, 10, 12),
                  background: range === r_ ? "rgba(45,184,144,0.18)" : "transparent",
                  color: range === r_ ? "#3ECF9E" : "rgba(255,255,255,0.55)",
                  border: range === r_ ? "1px solid rgba(62,207,158,0.35)" : "1px solid transparent",
                }}
              >
                {r_}
              </button>
            ))}
          </div>

          <div
            className="nut1-icon-btn nut1-resize rounded-xl flex items-center justify-center"
            style={{ width: headerBtn, height: headerBtn, background: "rgba(255,255,255,0.05)" }}
          >
            <span style={{ fontSize: pick(compact, 11, 14), transition: `font-size ${RESIZE_TRANSITION}` }}>📋</span>
          </div>
        </div>

        {/* Ring */}
        <div className="nut1-resize flex items-center justify-center" style={{ marginBottom: ringMB }}>
          <button className="nut1-icon-btn p-1.5 -ml-1 rounded-full" style={{ color: "rgba(255,255,255,0.55)" }}>
            <ChevronLeft size={pick(compact, 14, 18)} strokeWidth={2} />
          </button>

          <div className="nut1-resize relative mx-2" style={{ width: ringBox, height: ringBox }}>
            <svg
              viewBox={`0 0 ${RING_VB} ${RING_VB}`}
              className="nut1-resize"
              style={{ width: ringBox, height: ringBox, transform: "rotate(-90deg)" }}
            >
              <circle
                cx={RING_VB / 2}
                cy={RING_VB / 2}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth={stroke}
              />
              <circle
                cx={RING_VB / 2}
                cy={RING_VB / 2}
                r={r}
                fill="none"
                stroke="#2FBE8F"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                style={{
                  filter: inView ? "drop-shadow(0 0 6px rgba(47,190,143,0.55))" : "none",
                  transition: "filter 0.4s ease",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p
                className="nut1-resize font-medium"
                style={{
                  fontSize: pick(compact, 9, 11),
                  marginBottom: pick(compact, 2, 3),
                  color: "#3ECF9E",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(6px)",
                  transition: `opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s, font-size ${RESIZE_TRANSITION}`,
                }}
              >
                Aug 04
              </p>
              <p
                className="nut1-resize font-bold tabular-nums"
                style={{ fontSize: calorieFont, lineHeight: 1.1 }}
              >
                {Math.round(animatedCalories)}
              </p>
              <p
                className="nut1-resize"
                style={{
                  fontSize: pick(compact, 9, 11),
                  marginTop: pick(compact, 2, 3),
                  color: "rgba(255,255,255,0.55)",
                  opacity: inView ? 1 : 0,
                  transition: `opacity 0.5s ease 0.3s, font-size ${RESIZE_TRANSITION}`,
                }}
              >
                of {GOAL} cal
              </p>
              <button
                className="nut1-icon-btn nut1-resize rounded-lg"
                style={{
                  marginTop: pick(compact, 6, 9),
                  paddingLeft: pick(compact, 9, 12),
                  paddingRight: pick(compact, 9, 12),
                  paddingTop: pick(compact, 4, 5),
                  paddingBottom: pick(compact, 4, 5),
                  fontSize: pick(compact, 9, 10),
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.7)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "scale(1)" : "scale(0.9)",
                  transition: `opacity 0.5s ease 0.45s, transform 0.5s ease 0.45s, background-color 0.15s ease, font-size ${RESIZE_TRANSITION}, padding ${RESIZE_TRANSITION}`,
                }}
              >
                Edit Goal
              </button>
            </div>
          </div>

          <button className="nut1-icon-btn p-1.5 -mr-1 rounded-full" style={{ color: "rgba(255,255,255,0.55)" }}>
            <ChevronRight size={pick(compact, 14, 18)} strokeWidth={2} />
          </button>
        </div>

        {/* Goal card */}
        <div
          className="nut1-resize"
          style={{
            padding: goalPad,
            borderRadius: goalRadius,
            marginBottom: pick(compact, 8, 12),
            background: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(255,255,255,0.05)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(14px)",
            transition: `opacity 0.55s ease 0.5s, transform 0.55s ease 0.5s, padding ${RESIZE_TRANSITION}, border-radius ${RESIZE_TRANSITION}, margin ${RESIZE_TRANSITION}`,
          }}
        >
          <div className="nut1-resize flex items-center justify-between" style={{ marginBottom: goalMB }}>
            <p className="nut1-resize font-semibold" style={{ fontSize: pick(compact, 11, 13) }}>
              Goal
            </p>
            <Pencil size={pick(compact, 10, 12)} color="#3ECF9E" />
          </div>

          <div
            className="nut1-resize grid grid-cols-2"
            style={{ columnGap: macroGapX, rowGap: macroGapY }}
          >
            {MACROS.map((m, i) => (
              <div
                key={m.label}
                style={{
                  opacity: inView ? 1 : 0,
                  animation: inView
                    ? `nut1RowIn 0.5s ease ${0.6 + i * 0.09}s both`
                    : "none",
                }}
              >
                <p
                  className="nut1-resize"
                  style={{ fontSize: pick(compact, 9, 11), marginBottom: pick(compact, 4, 6), color: "rgba(255,255,255,0.75)" }}
                >
                  {m.label} <span className="font-bold text-white">{m.value}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>
                    /{m.max}
                    {m.unit}
                  </span>
                </p>
                <div
                  className="rounded-full overflow-hidden"
                  style={{ height: pick(compact, 3, 4), background: "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((m.value / m.max) * 100, 100)}%`,
                      background: m.color,
                      animation: inView
                        ? `nut1BarFill 0.7s ease ${0.75 + i * 0.09}s both`
                        : "none",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meal reminder */}
        <div
          className="nut1-resize flex items-center"
          style={{
            padding: reminderPad,
            gap: pick(compact, 7, 9),
            borderRadius: goalRadius,
            background: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(255,255,255,0.05)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(14px)",
            transition: `opacity 0.55s ease 1.05s, transform 0.55s ease 1.05s, padding ${RESIZE_TRANSITION}, gap ${RESIZE_TRANSITION}, border-radius ${RESIZE_TRANSITION}`,
          }}
        >
          <div
            className="nut1-resize rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: bellSize, height: bellSize, background: "#2FBE8F" }}
          >
            <Bell
              size={pick(compact, 11, 13)}
              color="#0b1f19"
              fill="#0b1f19"
              style={{
                animation: inView ? "nut1BellRing 1.8s ease 1.4s 1" : "none",
                transformOrigin: "50% 20%",
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="nut1-resize font-semibold" style={{ fontSize: pick(compact, 10, 12), marginBottom: 2 }}>
              Meal Reminder
            </p>
            <p
              className="nut1-resize leading-snug"
              style={{ fontSize: pick(compact, 8, 9), color: "rgba(255,255,255,0.5)" }}
            >
              Breakfast at 10:00 AM, Lunch at 02:00 PM, Dinner at 08:00 PM
            </p>
          </div>
          <button
            onClick={() => setReminderOn((v) => !v)}
            className="nut1-toggle-track rounded-full flex-shrink-0 relative"
            style={{ width: toggleW, height: toggleH, background: reminderOn ? "#2FBE8F" : "rgba(255,255,255,0.15)" }}
          >
            <div
              className="nut1-thumb absolute top-0.5 rounded-full bg-white"
              style={{
                width: thumbSize,
                height: thumbSize,
                left: reminderOn ? toggleW - thumbSize - 2 : 2,
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}