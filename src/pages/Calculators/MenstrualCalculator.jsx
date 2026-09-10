import React, { useState, useMemo } from "react";
import {
  Calendar,
  RotateCcw,
  Info,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Droplet,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const CYCLE_LENGTHS = Array.from({ length: 26 }, (_, i) => i + 20); // 20..45
const PERIOD_LENGTHS = Array.from({ length: 9 }, (_, i) => i + 2); // 2..10

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function stripTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function fmtLong(date) {
  return date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function fmtShort(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function inRange(date, start, end) {
  const t = stripTime(date).getTime();
  return t >= stripTime(start).getTime() && t <= stripTime(end).getTime();
}

function buildCycle(cycleStart, cycleLength, periodLength) {
  const periodEnd = addDays(cycleStart, periodLength - 1);
  const nextStart = addDays(cycleStart, cycleLength);
  const ovulationDate = addDays(nextStart, -14);
  const fertileStart = addDays(ovulationDate, -5);
  const fertileEnd = addDays(ovulationDate, 1);
  return { cycleStart, periodEnd, nextStart, ovulationDate, fertileStart, fertileEnd };
}

function buildCycles(lastPeriod, cycleLength, periodLength, count = 14, startIndex = -1) {
  const cycles = [];
  for (let i = startIndex; i < startIndex + count; i++) {
    cycles.push(buildCycle(addDays(lastPeriod, i * cycleLength), cycleLength, periodLength));
  }
  return cycles;
}

function dayStatus(date, cycles) {
  for (const c of cycles) {
    if (inRange(date, c.cycleStart, c.periodEnd)) return "period";
  }
  for (const c of cycles) {
    if (sameDay(date, c.ovulationDate)) return "ovulation";
    if (inRange(date, c.fertileStart, c.fertileEnd)) return "fertile";
  }
  return null;
}

function currentCycleInfo(lastPeriod, cycleLength, periodLength, today) {
  const daysSince = Math.floor((stripTime(today) - stripTime(lastPeriod)) / 86400000);
  const cyclesElapsed = Math.floor(daysSince / cycleLength);
  const cycleStart = addDays(lastPeriod, cyclesElapsed * cycleLength);
  const cycleDay = daysSince - cyclesElapsed * cycleLength + 1;
  const cycle = buildCycle(cycleStart, cycleLength, periodLength);

  let phase = "Follicular phase";
  if (stripTime(today) <= stripTime(cycle.periodEnd)) phase = "Menstrual phase";
  else if (inRange(today, cycle.fertileStart, cycle.fertileEnd)) phase = "Fertile window";
  else if (stripTime(today) > stripTime(cycle.fertileEnd) && stripTime(today) < stripTime(cycle.nextStart)) {
    phase = "Luteal phase";
  }

  const daysToNextPeriod = Math.round((stripTime(cycle.nextStart) - stripTime(today)) / 86400000);
  const daysToOvulation = Math.round((stripTime(cycle.ovulationDate) - stripTime(today)) / 86400000);

  return { cycleDay, phase, cycle, daysToNextPeriod, daysToOvulation };
}

export default function MenstrualCycleCalculator() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState("");
  const [viewMonth, setViewMonth] = useState(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  function handleReset() {
    setLastPeriod("");
    setCycleLength(28);
    setPeriodLength(5);
    setConfirmed(null);
    setError("");
    setViewMonth(null);
  }

  function handleCalculate() {
    if (!lastPeriod) {
      setError("Please enter the first day of your last period.");
      setConfirmed(null);
      return;
    }
    const parsed = new Date(lastPeriod + "T00:00:00");
    if (isNaN(parsed.getTime())) {
      setError("That date doesn't look right.");
      setConfirmed(null);
      return;
    }
    if (parsed > stripTime(today)) {
      setError("The last period date can't be in the future.");
      setConfirmed(null);
      return;
    }
    setError("");
    setConfirmed(parsed);
    setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  const cycles = useMemo(
    () => (confirmed ? buildCycles(confirmed, cycleLength, periodLength) : null),
    [confirmed, cycleLength, periodLength]
  );
  const info = useMemo(
    () => (confirmed ? currentCycleInfo(confirmed, cycleLength, periodLength, today) : null),
    [confirmed, cycleLength, periodLength]
  );

  const calendarCells = useMemo(() => {
    if (!cycles || !viewMonth) return null;
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startWeekday = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells.map((date) => (date ? { date, status: dayStatus(date, cycles), isToday: sameDay(date, today) } : { date: null }));
  }, [cycles, viewMonth]);

  const PHASE_ICONS = {
    "Menstrual phase": Droplet,
    "Fertile window": Sparkles,
    "Luteal phase": Calendar,
    "Follicular phase": Calendar,
  };
  const PhaseIcon = info ? PHASE_ICONS[info.phase] : Calendar;

  return (
    <div className="min-h-screen w-full bg-[#f6f4f0] flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-mono-data { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <div className="w-full max-w-3xl font-body mt-26 mb-16">
         <div className="flex flex-wrap items-end justify-center gap-4 mb-6 mt-6">
           <h1 className="font-display text-3xl font-semibold text-stone-900">
             Menstrual Cycle Calculator
            </h1>
        <p className="text-justify text-black/60 text-md ">
Every woman experiences a unique menstrual cycle, and understanding it is key to maintaining reproductive health and overall well-being. Our Menstrual Cycle Calculator is designed to make this easier by helping you track your periods, predict ovulation days, and plan around important dates. Whether your goal is to manage PMS symptoms, improve cycle regularity, or better understand your fertility patterns, this tool provides a clear and reliable calendar view of your menstrual cycle.
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

        <div className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col gap-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                <Calendar className="w-3.5 h-3.5" />
                Last period date
              </label>
              <input
                type="date"
                value={lastPeriod}
                max={todayStr}
                onChange={(e) => setLastPeriod(e.target.value)}
                className="font-mono-data w-full text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">
                Cycle length
              </label>
              <select
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="font-mono-data w-full text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                {CYCLE_LENGTHS.map((n) => (
                  <option key={n} value={n}>{n} days</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">
                Period length
              </label>
              <select
                value={periodLength}
                onChange={(e) => setPeriodLength(Number(e.target.value))}
                className="font-mono-data w-full text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                {PERIOD_LENGTHS.map((n) => (
                  <option key={n} value={n}>{n} days</option>
                ))}
              </select>
            </div>
          </div>

          {error ? <p className="text-xs text-rose-500 font-medium">{error}</p> : null}

          <button
            onClick={handleCalculate}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Calculate
          </button>
        </div>

        {confirmed && info ? (
          <>
            {/* Today status */}
            <div className="mt-5 grid sm:grid-cols-3 gap-3">
              <div className="bg-teal-600 rounded-2xl p-4 flex flex-col justify-center">
                <p className="text-[11px] text-teal-100 uppercase tracking-wide mb-1">Today, cycle day</p>
                <p className="font-display text-3xl font-semibold text-white leading-none">{info.cycleDay}</p>
                <p className="flex items-center gap-1.5 text-xs text-teal-50 mt-2">
                  <PhaseIcon className="w-3.5 h-3.5" />
                  {info.phase}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col justify-center">
                <p className="text-[11px] text-stone-400 uppercase tracking-wide mb-1">Next period</p>
                <p className="font-mono-data text-lg font-semibold text-stone-900">{fmtShort(info.cycle.nextStart)}</p>
                <p className="text-xs text-stone-500 mt-1">
                  {info.daysToNextPeriod >= 0 ? `in ${info.daysToNextPeriod} days` : `${-info.daysToNextPeriod} days ago`}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col justify-center">
                <p className="text-[11px] text-stone-400 uppercase tracking-wide mb-1">Ovulation</p>
                <p className="font-mono-data text-lg font-semibold text-stone-900">{fmtShort(info.cycle.ovulationDate)}</p>
                <p className="text-xs text-stone-500 mt-1">
                  {info.daysToOvulation > 0
                    ? `in ${info.daysToOvulation} days`
                    : info.daysToOvulation === 0
                    ? "today"
                    : `${-info.daysToOvulation} days ago`}
                </p>
              </div>
            </div>

            {/* Calendar */}
            <div className="mt-5 bg-white rounded-2xl border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setViewMonth(addDays(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1), -1))}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <p className="font-mono-data text-sm font-semibold text-stone-800">
                  {viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
                <button
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} className="text-[10px] font-semibold text-stone-400 pb-1">{d}</div>
                ))}
                {calendarCells.map((cell, i) => {
                  if (!cell.date) return <div key={i} />;
                  let cls = "text-stone-600";
                  if (cell.status === "period") cls = "bg-rose-100 text-rose-700 font-semibold";
                  if (cell.status === "fertile") cls = "bg-teal-100 text-teal-800 font-semibold";
                  if (cell.status === "ovulation") cls = "bg-teal-600 text-white font-bold";
                  return (
                    <div
                      key={i}
                      className={`relative aspect-square flex items-center justify-center rounded-lg text-xs font-mono-data ${cls}`}
                    >
                      {cell.date.getDate()}
                      {cell.isToday ? (
                        <span className="absolute inset-0 rounded-lg ring-2 ring-stone-900 pointer-events-none" />
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 mt-4 text-[11px] text-stone-500 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-100 inline-block" /> Period
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-teal-100 inline-block" /> Fertile window
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" /> Ovulation day
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-lg ring-2 ring-stone-900 inline-block" /> Today
                </span>
              </div>
            </div>
          </>
        ) : null}

        <div className="w-full mt-5 flex items-start gap-2 text-xs text-stone-400">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p>
            Estimates assume your cycle length stays consistent and that ovulation occurs
            about 14 days before your next period. Actual timing varies by person and cycle.
            Informational only -- not medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}