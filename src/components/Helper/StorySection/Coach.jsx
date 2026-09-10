import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react";

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

// Eased ramp from 0 -> target, used for the average count-up.
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

// Kcal burned per day this week — Friday is the peak/highlighted day.
const DAYS = [
  { label: "S", value: 90 },
  { label: "M", value: 230 },
  { label: "TU", value: 20 },
  { label: "W", value: 260 },
  { label: "TH", value: 150 },
  { label: "F", value: 576 },
  { label: "SA", value: 60 },
];

const AVERAGE = Math.round(DAYS.reduce((sum, d) => sum + d.value, 0) / DAYS.length);
const MAX_VALUE = Math.max(...DAYS.map((d) => d.value));
const PEAK_LABEL = DAYS.find((d) => d.value === MAX_VALUE)?.label;

const ACCENT = "#FF4438";

export default function Coach() {
  const cardRef = useRef(null);
  const inView = useInFullView(cardRef);
  const [range, setRange] = useState("W");
  const [hovered, setHovered] = useState(null);

  const animatedAverage = useAnimatedValue(AVERAGE, 900, 700, inView);
  const trackHeight = 120;

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
        @keyframes waFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes waPeakGlow {
          0%, 100% { filter: drop-shadow(0 0 3px rgba(255,68,56,0.55)); }
          50% { filter: drop-shadow(0 0 9px rgba(255,68,56,0.95)); }
        }
        @keyframes waTooltipIn { from { opacity: 0; transform: translate(-50%, 4px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .wa-icon-btn { transition: transform 0.15s ease, background-color 0.15s ease; }
        .wa-icon-btn:hover { background: rgba(255,255,255,0.12) !important; }
        .wa-icon-btn:active { transform: scale(0.88); }
        .wa-pill { transition: background-color 0.25s ease, color 0.25s ease, transform 0.15s ease; }
        .wa-pill:active { transform: scale(0.94); }
        .wa-bar-fill { transition: height 0.75s cubic-bezier(0.22,1,0.36,1), filter 0.2s ease; }
        .wa-bar-track { transition: transform 0.15s ease; cursor: pointer; }
        .wa-bar-track:hover { transform: scaleX(1.35); }
        .wa-peak { animation: waPeakGlow 2.4s ease-in-out 1s infinite; }
        .wa-tooltip { animation: waTooltipIn 0.18s ease both; }
        .wa-avg-pill { transition: transform 0.2s ease, background-color 0.2s ease; }
        .wa-avg-pill:hover { transform: translateY(-2px); background: rgba(40,10,10,0.9) !important; }
        @media (prefers-reduced-motion: reduce) {
          .wa-icon-btn, .wa-pill, .wa-bar-fill, .wa-bar-track, .wa-peak, .wa-tooltip, .wa-avg-pill {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div
        className="w-[320px] px-5 pt-5 pb-5 text-white"
        style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="wa-icon-btn w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(120,30,30,0.35)" }}
          >
            <ChevronLeft size={17} strokeWidth={2.5} color="#fff" />
          </button>

          <div
            className="flex items-center rounded-full p-0.5 gap-0.5"
            style={{ background: "rgba(60,15,15,0.55)" }}
          >
            {["D", "W", "M"].map((r_) => (
              <button
                key={r_}
                onClick={() => setRange(r_)}
                className="wa-pill px-4 py-1.5 rounded-full text-xs font-medium"
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

          <div className="w-9 h-9" />
        </div>

        {/* Week nav */}
        <div className="flex items-center justify-between mb-8">
          <button className="wa-icon-btn p-1 rounded-full" style={{ color: "rgba(255,255,255,0.7)" }}>
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <p
            className="text-base font-semibold"
            style={{
              color: ACCENT,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
            }}
          >
            This Week
          </p>
          <button className="wa-icon-btn p-1 rounded-full" style={{ color: "rgba(255,255,255,0.4)" }}>
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Bar chart */}
        <div className="flex items-end justify-between mb-2" style={{ height: trackHeight }}>
          {DAYS.map((d, i) => {
            const isPeak = d.label === PEAK_LABEL && d.value > 0;
            const pctHeight = MAX_VALUE > 0 ? (d.value / MAX_VALUE) * 100 : 0;
            const isHovered = hovered === i;
            return (
              <div
                key={d.label + i}
                className="group relative flex flex-col items-center"
                style={{ height: trackHeight, width: 10 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              >
                {isHovered && (
                  <div
                    className="wa-tooltip absolute -top-7 left-1/2 px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap"
                    style={{ background: "rgba(0,0,0,0.85)", color: "#fff" }}
                  >
                    {d.value}
                  </div>
                )}
                <div
                  className="wa-bar-track relative w-full rounded-full overflow-hidden flex-shrink-0"
                  style={{
                    height: trackHeight,
                    background: "rgba(255,255,255,0.08)",
                    opacity: inView ? 1 : 0,
                    transitionDelay: `${i * 0.05}s`,
                  }}
                >
                  <div
                    className={`wa-bar-fill absolute bottom-0 left-0 w-full rounded-full ${
                      isPeak ? "wa-peak" : ""
                    }`}
                    style={{
                      height: inView ? `${pctHeight}%` : "0%",
                      background: isPeak
                        ? "linear-gradient(180deg, #FF6A55 0%, #FF3B2E 100%)"
                        : d.value > 0
                        ? "rgba(255,68,56,0.35)"
                        : "transparent",
                      transitionDelay: `${0.3 + i * 0.07}s`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Day labels */}
        <div className="flex items-center justify-between mb-6">
          {DAYS.map((d, i) => (
            <span
              key={d.label + i}
              className="text-xs text-center"
              style={{
                width: 10,
                color: d.label === PEAK_LABEL ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
                fontWeight: d.label === PEAK_LABEL ? 700 : 500,
              }}
            >
              {d.label}
            </span>
          ))}
        </div>

        {/* Average pill */}
        <div className="flex justify-center">
          <div
            className="wa-avg-pill flex items-center gap-2.5 rounded-2xl px-4 py-3"
            style={{
              background: "rgba(30,8,8,0.75)",
              border: "1px solid rgba(255,255,255,0.06)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.5s ease 0.9s, transform 0.5s ease 0.9s",
            }}
          >
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(255,68,56,0.18)",
                opacity: inView ? 1 : 0,
                animation: inView ? "waFadeUp 0.4s ease 1s both" : "none",
              }}
            >
              <Dumbbell size={15} color={ACCENT} strokeWidth={2.2} />
            </span>
            <span className="text-lg font-bold tabular-nums" style={{ color: ACCENT }}>
              {Math.round(animatedAverage)}
            </span>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              Average
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}