import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Share2,
  Moon,
  Sun,
  Sparkles,
  TrendingUp,
  Grid3x3,
  BedDouble,
  Bell,
} from "lucide-react";

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

// Eased ramp from 0 -> target, used for the sleep-hours counter.
// Reports "done" a beat after it settles so callers can trigger a landing pulse.
function useAnimatedValue(target, duration = 1000, delay = 0, enabled = true) {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!enabled) {
      setValue(0);
      setDone(false);
      return;
    }
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

// ── Sleep data ───────────────────────────────────────────────────────────
const SLEEP_HOURS = 7;
const GOAL_HOURS = 8;
const BED_HOUR = 10; // clock-face position (10 o'clock) — 10:00 PM
const WAKE_HOUR = 5; // clock-face position (1 o'clock) — 01:00 AM
const SLEEP_TIME_LABEL = "10:00 PM";
const WAKE_TIME_LABEL = "05:00 AM";

const ACCENT = "#2F8FE8"; // primary sleep blue
const SUN_COLOR = "#F5A524";

// Polar helper: angleDeg measured clockwise from 12 o'clock (0deg = top).
function polar(cx, cy, angleDeg, radius) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

const CLOCK_NUMBERS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function AnimatedSleepCard() {
  const cardRef = useRef(null);
  const inView = useInFullView(cardRef);
  const [range, setRange] = useState("D");
  const [bedTimeOpen, setBedTimeOpen] = useState(true);
  const [reminderOn, setReminderOn] = useState(false);

  // ── Ring geometry (scaled down ~24% from the original) ──
  const box = 168;
  const cx = box / 2;
  const cy = box / 2;
  const ringR = 72;
  const ringStroke = 11;
  const faceR = ringR - ringStroke / 2 - 3;
  const numbersR = ringR - ringStroke / 2 - 14;
  const tickR = ringR + ringStroke / 2 + 3;

  const bedAngle = (BED_HOUR % 12) * 30;
  const wakeAngle = (WAKE_HOUR % 12) * 30;
  const sweepDeg = (wakeAngle - bedAngle + 360) % 360;
  const largeArc = sweepDeg > 180 ? 1 : 0;

  const bedPt = polar(cx, cy, bedAngle, ringR);
  const wakePt = polar(cx, cy, wakeAngle, ringR);
  const arcPath = `M ${bedPt.x} ${bedPt.y} A ${ringR} ${ringR} 0 ${largeArc} 1 ${wakePt.x} ${wakePt.y}`;

  const [animatedHours, hoursDone] = useAnimatedValue(SLEEP_HOURS, 900, 200, inView);

  return (
    <div className="relative min-h-screen w-full" >
      <div>
        <div
          ref={cardRef}
          className="absolute hidden lg:block z-30 rounded-[1.4rem] overflow-hidden"
          style={{
            right: "6%",
            top: "50%",
            transform: inView ? "translateY(-50%)" : "translateY(-46%)",
            opacity: inView ? 1 : 0,
            transition:
              "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
            background:
              "radial-gradient(90% 55% at 50% 0%, #123457 0%, #0a1c30 38%, #050d18 68%, #000000 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <style>{`
            @keyframes slPopIn { from { opacity: 0; transform: scale(0.6) rotate(-8deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
            @keyframes slRowIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slNumberLand { 0% { transform: scale(1); } 40% { transform: scale(1.14); } 100% { transform: scale(1); } }
            @keyframes slArcDraw { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
            @keyframes slMoonGlow {
              0%, 100% { filter: drop-shadow(0 0 3px rgba(47,143,232,0.5)); }
              50% { filter: drop-shadow(0 0 9px rgba(47,143,232,0.9)); }
            }
            @keyframes slBellRing {
              0%, 100% { transform: rotate(0deg); }
              15% { transform: rotate(-14deg); }
              30% { transform: rotate(12deg); }
              45% { transform: rotate(-8deg); }
              60% { transform: rotate(5deg); }
            }
            .sl-number-land { animation: slNumberLand 0.4s cubic-bezier(0.34,1.56,0.64,1); }
            .sl-arc-in { animation: slArcDraw 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s both; transform-origin: 84px 84px; }
            .sl-moon-badge { animation: slMoonGlow 2.6s ease-in-out infinite; }
            .sl-bell { animation: slBellRing 1.8s ease 1.2s 1; transform-origin: 50% 20%; }
            .sl-icon-btn { transition: transform 0.15s ease, background-color 0.15s ease; }
            .sl-icon-btn:hover { background: rgba(255,255,255,0.12) !important; }
            .sl-icon-btn:active { transform: scale(0.88); }
            .sl-pill { transition: background-color 0.25s ease, color 0.25s ease, transform 0.15s ease; }
            .sl-pill:active { transform: scale(0.94); }
            .sl-btn { transition: transform 0.15s ease, filter 0.15s ease; }
            .sl-btn:hover { filter: brightness(1.08); }
            .sl-btn:active { transform: scale(0.97); }
            .sl-stat-card { transition: transform 0.2s ease, background-color 0.2s ease; }
            .sl-stat-card:hover { transform: translateY(-2px); background: rgba(255,255,255,0.08) !important; }
            .sl-chevron { transition: transform 0.3s cubic-bezier(0.65,0,0.35,1); }
            .sl-toggle-track { transition: background-color 0.28s ease; }
            .sl-thumb { transition: left 0.28s cubic-bezier(0.34,1.56,0.64,1); }
            @media (prefers-reduced-motion: reduce) {
              .sl-icon-btn, .sl-pill, .sl-btn, .sl-stat-card, .sl-bell, .sl-moon-badge,
              .sl-number-land, .sl-arc-in, .sl-chevron, .sl-toggle-track, .sl-thumb {
                animation: none !important;
                transition: none !important;
              }
            }
          `}</style>

          <div
            className="w-[236px] px-3 pt-3 pb-3 text-white"
            style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between mb-2.5">
              <button
                className="sl-icon-btn w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "rgba(30,60,100,0.4)" }}
              >
                <ChevronLeft size={13} strokeWidth={2.5} color="#fff" />
              </button>

              <div
                className="flex items-center rounded-full p-0.5 gap-0.5"
                style={{ background: "rgba(15,35,60,0.6)" }}
              >
                {["D", "W", "M"].map((r_) => (
                  <button
                    key={r_}
                    onClick={() => setRange(r_)}
                    className="sl-pill px-2.5 py-1 rounded-full text-[10px]"
                    style={{
                      background: range === r_ ? "rgba(47,143,232,0.35)" : "transparent",
                      color: range === r_ ? "#6CB3F5" : "rgba(255,255,255,0.85)",
                      fontWeight: range === r_ ? 700 : 500,
                    }}
                  >
                    {r_}
                  </button>
                ))}
              </div>

              <button
                className="sl-icon-btn w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "rgba(30,60,100,0.4)" }}
              >
                <Share2 size={11} strokeWidth={2.2} color="rgba(255,255,255,0.85)" />
              </button>
            </div>

            {/* Clock ring */}
            <div className="flex items-center justify-center mb-2.5">
              <button className="sl-icon-btn p-0.5 -ml-1 rounded-full" style={{ color: "rgba(255,255,255,0.6)" }}>
                <ChevronLeft size={15} strokeWidth={2} />
              </button>

              <div
                className="relative mx-1"
                style={{
                  width: box,
                  height: box,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "scale(1)" : "scale(0.92)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
              >
                <svg width={box} height={box}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={tickR}
                    fill="none"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth={1}
                    strokeDasharray="1 5.6"
                  />
                  <circle cx={cx} cy={cy} r={ringR} fill="none" stroke="rgba(140,150,165,0.35)" strokeWidth={ringStroke} />
                  <circle cx={cx} cy={cy} r={faceR} fill="#04070d" />
                  <path
                    d={arcPath}
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth={ringStroke}
                    strokeLinecap="round"
                    className={inView ? "sl-arc-in" : ""}
                    style={{ opacity: inView ? 1 : 0 }}
                  />
                  {CLOCK_NUMBERS.map((n, i) => {
                    const angle = i * 30;
                    const p = polar(cx, cy, angle, numbersR);
                    return (
                      <text
                        key={n}
                        x={p.x}
                        y={p.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={9}
                        fontWeight={600}
                        fill="rgba(255,255,255,0.65)"
                      >
                        {n}
                      </text>
                    );
                  })}
                </svg>

                {/* Bedtime badge (moon) */}
                <div
                  className="sl-moon-badge absolute rounded-full flex items-center justify-center"
                  style={{
                    width: 22,
                    height: 22,
                    left: bedPt.x - 11,
                    top: bedPt.y - 11,
                    background: "#0C2A4A",
                    boxShadow: "0 0 0 2px #04070d, 0 0 0 3px rgba(47,143,232,0.5)",
                  }}
                >
                  <Moon size={10} color="#fff" fill="#fff" />
                </div>

                {/* Wake badge (sun) */}
                <div
                  className="absolute rounded-full flex items-center justify-center"
                  style={{
                    width: 22,
                    height: 22,
                    left: wakePt.x - 11,
                    top: wakePt.y - 11,
                    background: SUN_COLOR,
                    boxShadow: "0 0 0 2px #04070d",
                  }}
                >
                  <Sun size={10} color="#fff" />
                </div>

                {/* Center readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p
                    className="text-[10px] font-semibold mb-0"
                    style={{
                      color: "#6CB3F5",
                      opacity: inView ? 1 : 0,
                      transform: inView ? "translateY(0)" : "translateY(6px)",
                      transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
                    }}
                  >
                    Today
                  </p>
                  <p className={`flex items-baseline gap-1 tabular-nums ${hoursDone ? "sl-number-land" : ""}`}>
                    <span className="text-2xl font-bold">{Math.round(animatedHours)}</span>
                    <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>hr</span>
                  </p>
                  <p
                    className="text-[10px] mt-0"
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      opacity: inView ? 1 : 0,
                      transition: "opacity 0.5s ease 0.3s",
                    }}
                  >
                    of {GOAL_HOURS} hr
                  </p>
                  <button
                    className="sl-icon-btn mt-1 px-3 py-0.5 rounded-full text-[9px]"
                    style={{
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.75)",
                      opacity: inView ? 1 : 0,
                      transform: inView ? "scale(1)" : "scale(0.9)",
                      transition: "opacity 0.5s ease 0.45s, transform 0.5s ease 0.45s, background-color 0.15s ease",
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <button className="sl-icon-btn p-0.5 -mr-1 rounded-full" style={{ color: "rgba(255,255,255,0.6)" }}>
                <ChevronRight size={15} strokeWidth={2} />
              </button>
            </div>

            {/* Edit Sleep data CTA */}
            <button
              className="sl-btn w-full rounded-xl py-2 mb-2.5 flex items-center justify-center gap-1.5 text-[12px] font-medium"
              style={{
                background: ACCENT,
                color: "#fff",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.55s ease 0.5s, transform 0.55s ease 0.5s",
              }}
            >
              Edit Sleep data
              <Sparkles size={12} />
            </button>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-2 mb-2.5">
              <div
                className="sl-stat-card rounded-lg px-2.5 py-2"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  opacity: inView ? 1 : 0,
                  animation: inView ? "slRowIn 0.5s ease 0.6s both" : "none",
                }}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <span
                    className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      background: ACCENT,
                      opacity: inView ? 1 : 0,
                      animation: inView ? "slPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.75s both" : "none",
                    }}
                  >
                    <TrendingUp size={9} color="#fff" />
                  </span>
                  <span className="text-[10px]" style={{ color: "#6CB3F5" }}>Goal</span>
                </div>
                <p className="text-sm font-semibold">{GOAL_HOURS}h 0m</p>
              </div>

              <div
                className="sl-stat-card rounded-lg px-2.5 py-2"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  opacity: inView ? 1 : 0,
                  animation: inView ? "slRowIn 0.5s ease 0.7s both" : "none",
                }}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <span
                    className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      background: ACCENT,
                      opacity: inView ? 1 : 0,
                      animation: inView ? "slPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.85s both" : "none",
                    }}
                  >
                    <Grid3x3 size={9} color="#fff" />
                  </span>
                  <span className="text-[10px]" style={{ color: "#6CB3F5" }}>Woke Up</span>
                </div>
                <p className="text-sm font-semibold">{WAKE_TIME_LABEL}</p>
              </div>
            </div>

            {/* Bed Time detail card */}
            <div
              className="rounded-xl p-3"
              style={{
                background: "rgba(20,20,20,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.55s ease 0.8s, transform 0.55s ease 0.8s",
              }}
            >
              <button
                onClick={() => setBedTimeOpen((v) => !v)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <BedDouble size={13} color={ACCENT} />
                  <span className="text-[12px] font-semibold">Bed Time</span>
                </div>
                <ChevronDown
                  size={13}
                  color="rgba(255,255,255,0.6)"
                  className="sl-chevron"
                  style={{ transform: bedTimeOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {bedTimeOpen && (
                <div className="mt-2">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {[
                      { label: "Sleep Time", value: SLEEP_TIME_LABEL },
                      { label: "Wakeup Time", value: WAKE_TIME_LABEL },
                      { label: "Sleep Hours", value: `${SLEEP_HOURS} hr` },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-[9px] mb-0" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</p>
                        <p className="text-[11px] font-medium">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] leading-snug">
                    <span style={{ color: "#3DBE64" }}>Severely Sleep-Deprived</span>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}> – </span>
                    <span style={{ color: "#6CB3F5" }}>Low Sleep</span>
                  </p>
                </div>
              )}
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
}