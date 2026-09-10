import React, { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Droplet } from "lucide-react";

// ---------------------------------------------------------------------------
// Cycle Calendar — a dark, glanceable period/fertility tracker.
//
// Day states (mirrors the reference app):
//   period            solid coral fill
//   predictedPeriod   dashed coral ring
//   fertile           solid violet fill
//   today             thin violet outline ring
//
// Data is derived, not hard-coded per month: given a last-period start date
// and average cycle/period length, we compute logged period days, a fertile
// window, and a predicted-period window for whichever month is on screen.
// ---------------------------------------------------------------------------

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function startOfDay(d) {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}
function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function dayKey(d) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function CycleCalendar() {
  const today = useMemo(() => startOfDay(new Date()), []);

  // The reference screenshot: logged period Aug 5–6, today Aug 7,
  // predicted period Aug 8–11, fertile window Aug 20–29.
  const lastPeriodStart = useMemo(() => startOfDay(new Date(2026, 7, 5)), []);
  const periodLength = 7; // logged (5,6) + predicted (8,9,10,11) = 7 total
  const cycleLength = 28;

  const [cursor, setCursor] = useState(new Date(2026, 7, 1)); // month in view
  const [selected, setSelected] = useState(today);
  const [direction, setDirection] = useState(0); // -1 prev, 1 next, for slide anim
  const [animKey, setAnimKey] = useState(0);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const changeMonth = useCallback((delta) => {
    setDirection(delta);
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
    setAnimKey((k) => k + 1);
  }, []);

  // ---- derive classification for any date -------------------------------
  const classify = useCallback(
    (date) => {
      const d = startOfDay(date);
      const diff = Math.round((d - lastPeriodStart) / 86400000);
      const cycleDay = ((diff % cycleLength) + cycleLength) % cycleLength;

      const isLogged = diff >= 0 && diff < 2; // Aug 5 & 6 are "logged" (past)
      const isPeriod = cycleDay >= 0 && cycleDay < periodLength;
      const isFertile = cycleDay >= 15 && cycleDay < 25; // ~day 16–25 fertile window

      if (isPeriod) {
        return isLogged ? "period" : "predictedPeriod";
      }
      if (isFertile) return "fertile";
      return "none";
    },
    [lastPeriodStart, periodLength, cycleLength]
  );

  // ---- build the 7-wide grid for the current month -----------------------
  const gridDays = useMemo(() => {
    const first = new Date(year, month, 1);
    const firstWeekday = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [year, month]);

  // Header shows the selected day, clamped into whichever month is in view.
  const daysInViewMonth = new Date(year, month + 1, 0).getDate();
  const headerDay = Math.min(selected.getDate(), daysInViewMonth);
  const headerLabel = `${String(headerDay).padStart(2, "0")} ${
    MONTH_NAMES[month]
  } ${year}`;

  return (
    <div
  className="absolute hidden lg:block z-30"
  style={{ right: "6%", top: "50%", transform: "translateY(-50%)" }}
>
    <div
      className="nut-card rounded-3xl p-6 shadow-2xl font-sans"
      style={{
        width: 340,
        background: "rgba(28,28,30,0.96)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
        animation: "nutCardIn 0.55s cubic-bezier(0.16,1,0.3,1) forwards",
      }}
    >
      {/* ---- top bar ---- */}
      <div className="flex items-center justify-between px-1 pb-4">
        <button
          className="text-neutral-300 hover:text-white active:scale-90 transition-all duration-150"
          aria-label="Back"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-white text-[16px] font-semibold tracking-wide">
          Cycle
        </h1>
        <div className="text-neutral-300 hover:text-white transition-colors duration-150">
          <Droplet size={17} strokeWidth={2} className="rotate-180" />
        </div>
      </div>
      <div className="h-px w-full bg-white/10 mb-4" />

      {/* ---- month nav ---- */}
      <div className="flex items-center justify-between px-1 mb-5">
        <button
          onClick={() => changeMonth(-1)}
          className="text-teal-400 hover:text-teal-300 active:scale-75 transition-transform duration-150 p-1"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="relative overflow-hidden h-6 w-40 flex items-center justify-center">
          <h2
            key={animKey}
            className="absolute text-white text-[17px] font-semibold tracking-wide whitespace-nowrap animate-month-slide"
            style={{ "--slide-from": direction >= 0 ? "24px" : "-24px" }}
          >
            {headerLabel}
          </h2>
        </div>

        <button
          onClick={() => changeMonth(1)}
          className="text-teal-400 hover:text-teal-300 active:scale-75 transition-transform duration-150 p-1"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ---- weekday header ---- */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((w, i) => (
          <div
            key={i}
            className="text-center text-neutral-500 text-[12px] font-medium"
          >
            {w}
          </div>
        ))}
      </div>

      {/* ---- day grid ---- */}
      <div key={`grid-${animKey}`} className="grid grid-cols-7 gap-y-2 gap-x-">
        {gridDays.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />;
          const state = classify(date);
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selected);

          return (
            <DayCell
              key={dayKey(date)}
              date={date}
              state={state}
              isToday={isToday}
              isSelected={isSelected}
              delay={idx * 14}
              onClick={() => setSelected(date)}
            />
          );
        })}
      </div>

      {/* ---- legend ---- */}
      <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
        <LegendItem color="bg-[#F5877E]" label="Period" />
        <LegendItem dashed label="Predicted" />
        <LegendItem color="bg-[#B49BF0]" label="Fertile" />
      </div>

      <style>{`
        @keyframes nutCardIn {
          0% { opacity: 0; transform: translateY(18px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes monthSlide {
          from { opacity: 0; transform: translateX(var(--slide-from, 20px)); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-month-slide {
          animation: monthSlide 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes dayIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-day-in {
          animation: dayIn 320ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes ringPulse {
          0%   { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.45); }
          70%  { box-shadow: 0 0 0 8px rgba(139, 92, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
        }
        .animate-ring-pulse {
          animation: ringPulse 2.2s ease-out infinite;
        }

        @keyframes dashRotate {
          to { stroke-dashoffset: -24; }
        }
        .animate-dash-rotate {
          animation: dashRotate 6s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .nut-card, .animate-day-in, .animate-month-slide, .animate-ring-pulse, .animate-dash-rotate {
            animation: none !important;
          }
        }
      `}</style>
    </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function DayCell({ date, state, isToday, isSelected, delay, onClick }) {
  const day = date.getDate();

  const base =
    "relative flex items-center  justify-center w-full aspect-square rounded-full text-[13px] select-none cursor-pointer transition-transform duration-150 ease-out active:scale-90 hover:scale-105 animate-day-in";

  let fillClasses = "";
  let textClasses = "text-neutral-200";
  let ring = null;

  if (state === "period") {
    fillClasses = "bg-[#F5877E]";
    textClasses = "text-[#2a0a08] font-semibold";
  } else if (state === "fertile") {
    fillClasses = "bg-[#B49BF0]";
    textClasses = "text-[#20123f] font-semibold";
  } else {
    fillClasses = "bg-[#141417] border border-white/10";
  }

  return (
    <div
      onClick={onClick}
      className={`${base} ${fillClasses} ${
        isSelected && state === "none" ? "ring-1 ring-white/30" : ""
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={`${textClasses} relative z-10`}>{day}</span>

      {/* predicted period: dashed ring, gently rotating */}
      {state === "predictedPeriod" && (
        <svg
          className="absolute inset-0 w-full h-full animate-dash-rotate"
          viewBox="0 0 40 40"
        >
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="#F5877E"
            strokeWidth="1.6"
            strokeDasharray="4 3.2"
          />
        </svg>
      )}

      {/* today: pulsing violet outline */}
      {isToday && (
        <span className="absolute inset-0 rounded-full ring-2 ring-violet-400 animate-ring-pulse" />
      )}
    </div>
  );
}

function LegendItem({ color, dashed, label }) {
  return (
    <div className="flex items-center gap-2">
      {dashed ? (
        <span className="w-3 h-3 rounded-full border-[1.6px] border-dashed border-[#F5877E]" />
      ) : (
        <span className={`w-3 h-3 rounded-full ${color}`} />
      )}
      <span className="text-neutral-400 text-[11px]">{label}</span>
    </div>
  );
}