import React, { useEffect, useRef, useState } from "react";

const MACROS = [
  { val: 47, unit: "g", label: "Protein", color: "#EF4444", pct: 63 },
  { val: 67, unit: "g", label: "Carbs", color: "#3B82F6", pct: 90 },
  { val: 60, unit: "g", label: "Fat", color: "#F97316", pct: 81 },
];

const MEALS = [
  { emoji: "🥗", name: "Lunch", cal: 480 },
  { emoji: "🍎", name: "Snack", cal: 120 },
];

const GOAL = 2042;
const EATEN = 1000;
const RING_PCT = 49;

function useCountUp(target, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!start) {
      setValue(0);
      return;
    }
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic

    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(target * ease(p));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [start, target, duration]);

  return value;
}

// Fires visible=true only once the element is FULLY inside the viewport,
// and resets when it fully leaves so the animation can replay next time.
function useFullyVisible() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.999) {
          setVisible(true);
        } else if (entry.intersectionRatio === 0) {
          setVisible(false);
        }
      },
      { threshold: [0, 0.999, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

export default function Nutrition() {
  const [containerRef, visible] = useFullyVisible();

  const eaten = useCountUp(EATEN, 1100, visible);
  const ringPct = useCountUp(RING_PCT, 1100, visible);
  const macroValues = [
    useCountUp(MACROS[0].val, 1000, visible),
    useCountUp(MACROS[1].val, 1000, visible),
    useCountUp(MACROS[2].val, 1000, visible),
  ];
  const macroPcts = [
    useCountUp(MACROS[0].pct, 1000, visible),
    useCountUp(MACROS[1].pct, 1000, visible),
    useCountUp(MACROS[2].pct, 1000, visible),
  ];

  return (
    <div
      ref={containerRef}
      className="absolute hidden lg:block z-30"
      style={{ right: "6%", top: "50%", transform: "translateY(-50%)" }}
    >
      <style>{`
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.9); filter: blur(6px); }
          60% { filter: blur(0px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        @keyframes rowIn {
          0% { opacity: 0; transform: translateX(10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.08) rotate(-4deg); }
          50% { transform: scale(0.96) rotate(3deg); }
          75% { transform: scale(1.05) rotate(-2deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(220%); }
        }
        @keyframes ringGlow {
          0%, 100% { box-shadow: 0 0 0px rgba(20,184,166,0); }
          50% { box-shadow: 0 0 14px rgba(20,184,166,0.55); }
        }
        .nutri-card { opacity: 0; }
        .nutri-card.in {
          animation: cardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .nutri-streak { opacity: 0; }
        .nutri-streak.in {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s forwards;
        }
        .nutri-flame {
          display: inline-block;
          animation: flicker 1.8s ease-in-out infinite;
          transform-origin: 60% 90%;
        }
        .nutri-track { position: relative; overflow: hidden; }
        .nutri-fill { position: relative; overflow: hidden; }
        .nutri-fill.glow { animation: ringGlow 2.4s ease-in-out infinite; }
        .nutri-fill::after {
          content: "";
          position: absolute;
          top: 0; left: 0; height: 100%; width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          animation: shimmer 2.2s ease-in-out infinite;
          animation-delay: 1.3s;
        }
        .nutri-macro { opacity: 0; }
        .nutri-macro.in {
          animation-name: rowIn;
          animation-timing-function: cubic-bezier(0.22,1,0.36,1);
          animation-fill-mode: forwards;
        }
        .nutri-meal {
          opacity: 0;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .nutri-meal.in {
          animation-name: rowIn;
          animation-timing-function: cubic-bezier(0.22,1,0.36,1);
          animation-fill-mode: forwards;
        }
        .nutri-meal:hover {
          background: rgba(255,255,255,0.09) !important;
          transform: translateX(2px);
        }
      `}</style>

      <div
        className={`nutri-card${visible ? " in" : ""} rounded-3xl p-7 shadow-2xl`}
        style={{
          width: 320,
          background: "rgba(28,28,30,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Today's Goal
            </p>
            <p className="text-3xl font-bold text-white mt-1 tabular-nums">
              {Math.round(eaten)}{" "}
              <span
                className="text-base font-normal"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                / {GOAL} cal
              </span>
            </p>
          </div>
          <div
            className={`nutri-streak${visible ? " in" : ""} flex items-center gap-2 rounded-full px-4 py-2 text-sm`}
            style={{
              background: "rgba(20,184,166,0.15)",
              border: "1px solid rgba(20,184,166,0.3)",
              color: "#14B8A6",
            }}
          >
            <span className="nutri-flame">🔥</span> 4 Streak
          </div>
        </div>

        <div
          className="nutri-track mt-4 h-2 rounded-full"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <div
            className="nutri-fill glow h-full rounded-full"
            style={{ width: `${ringPct}%`, background: "#14B8A6" }}
          />
        </div>

        <div className="flex gap-4 mt-5">
          {MACROS.map((m, i) => (
            <div
              key={m.label}
              className={`nutri-macro${visible ? " in" : ""} flex-1`}
              style={{
                animationDuration: "0.5s",
                animationDelay: `${0.55 + i * 0.08}s`,
              }}
            >
              <p className="text-base font-semibold tabular-nums" style={{ color: m.color }}>
                {Math.round(macroValues[i])}
                {m.unit}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                {m.label}
              </p>
              <div
                className="nutri-track mt-2 h-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                <div
                  className="nutri-fill h-full rounded-full"
                  style={{ width: `${macroPcts[i]}%`, background: m.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2">
          {MEALS.map((meal, i) => (
            <div
              key={meal.name}
              className={`nutri-meal${visible ? " in" : ""} flex items-center justify-between rounded-xl px-3 py-2`}
              style={{
                background: "rgba(255,255,255,0.05)",
                animationDuration: "0.45s",
                animationDelay: `${0.9 + i * 0.1}s`,
              }}
            >
              <span className="text-base">{meal.emoji}</span>
              <p className="flex-1 ml-2 text-sm text-white">{meal.name}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                {meal.cal} kcal
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
