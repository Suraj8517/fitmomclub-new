import React, { useState } from "react";
import {
  Calendar,
  RotateCcw,
  Info,
  Sparkles,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const CYCLE_LENGTHS = Array.from({ length: 26 }, (_, i) => i + 20); // 20..45

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function fmt(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtShort(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function calcOvulation({ lastPeriod, cycleLength }) {
  const nextPeriodStart = addDays(lastPeriod, cycleLength);
  const ovulationDate = addDays(nextPeriodStart, -14);
  const windowStart = addDays(ovulationDate, -2);
  const windowEnd = addDays(ovulationDate, 2);
  const intercourseStart = addDays(ovulationDate, -5);
  const intercourseEnd = ovulationDate;
  const pregnancyTest = addDays(ovulationDate, 9);
  const dueDate = addDays(nextPeriodStart, 280 - cycleLength);

  const cycles = [];
  let periodStart = lastPeriod;
  for (let i = 0; i < 6; i++) {
    const nextStart = addDays(periodStart, cycleLength);
    const ov = addDays(nextStart, -14);
    cycles.push({
      periodStart,
      ovWindowStart: addDays(ov, -2),
      ovWindowEnd: addDays(ov, 2),
      due: addDays(periodStart, 280),
    });
    periodStart = nextStart;
  }

  return { nextPeriodStart, ovulationDate, windowStart, windowEnd, intercourseStart, intercourseEnd, pregnancyTest, dueDate, cycles };
}

function buildCalendarMonth(centerDate, windowStart, windowEnd, ovulationDate) {
  const year = centerDate.getFullYear();
  const month = centerDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return cells.map((date) => {
    if (!date) return { date: null };
    const inWindow = date >= stripTime(windowStart) && date <= stripTime(windowEnd);
    const isOvulation = sameDay(date, ovulationDate);
    return { date, inWindow, isOvulation };
  });
}

function stripTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function OvulationCalculator() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleReset() {
    setLastPeriod("");
    setCycleLength(28);
    setResult(null);
    setError("");
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  function handleCalculate() {
    if (!lastPeriod) {
      setError("Please enter the first day of your last period.");
      setResult(null);
      return;
    }
    const parsed = new Date(lastPeriod + "T00:00:00");
    if (isNaN(parsed.getTime())) {
      setError("That date doesn't look right.");
      setResult(null);
      return;
    }
    if (parsed > stripTime(today)) {
      setError("The last period date can't be in the future.");
      setResult(null);
      return;
    }
    setError("");
    setResult(calcOvulation({ lastPeriod: parsed, cycleLength }));
  }

  const calendarCells = result
    ? buildCalendarMonth(result.ovulationDate, result.windowStart, result.windowEnd, result.ovulationDate)
    : null;

  return (
    <div className="min-h-screen w-full bg-[#f6f4f0] flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-mono-data { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <div className="w-full max-w-3xl font-body mt-16 mb-16">
         <div className="flex flex-wrap items-end justify-center gap-4 mb-6 mt-6">
           <h1 className="font-display text-3xl font-semibold text-stone-900">
              Ovulation Calculator
            </h1>
        <p className="text-justify text-black/60 text-md ">
Our Ovulation Calculator helps you predict your most fertile days and ovulation date based on your menstrual cycle length. Whether you’re trying to conceive or tracking for better reproductive health, this fertility calculator provides a clear view of your fertile window. With accurate ovulation predictions, you can improve your chances of pregnancy and plan ahead with confidence. It’s also a helpful ovulation tracker for cycle regularity and PMS management        </p>
      

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

        <div className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col gap-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                <Calendar className="w-3.5 h-3.5" />
                First day of your last period
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
                Length of your cycle
              </label>
              <select
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="font-mono-data w-full text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                {CYCLE_LENGTHS.map((n) => (
                  <option key={n} value={n}>
                    {n} days
                  </option>
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

        {result ? (
          <div className="grid md:grid-cols-5 gap-5 mt-5">
            <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-teal-600" />
                <p className="font-mono-data text-[11px] tracking-widest text-stone-400 uppercase">
                  Estimated results
                </p>
              </div>
              <dl className="flex flex-col gap-3">
                <div>
                  <dt className="text-xs text-stone-400">Ovulation window</dt>
                  <dd className="font-display text-lg font-semibold text-stone-900">
                    {fmtShort(result.windowStart)} &ndash; {fmtShort(result.windowEnd)}
                  </dd>
                </div>
                <div className="pt-3 border-t border-stone-100">
                  <dt className="text-xs text-stone-400">Most probable ovulation date</dt>
                  <dd className="font-display text-lg font-semibold text-teal-700">
                    {fmt(result.ovulationDate)}
                  </dd>
                </div>
                <div className="pt-3 border-t border-stone-100">
                  <dt className="text-xs text-stone-400">Best days to try</dt>
                  <dd className="font-mono-data text-sm font-semibold text-stone-800">
                    {fmtShort(result.intercourseStart)} &ndash; {fmtShort(result.intercourseEnd)}
                  </dd>
                </div>
                <div className="pt-3 border-t border-stone-100">
                  <dt className="text-xs text-stone-400">Pregnancy test date</dt>
                  <dd className="font-mono-data text-sm font-semibold text-stone-800">
                    {fmt(result.pregnancyTest)}
                  </dd>
                </div>
                <div className="pt-3 border-t border-stone-100">
                  <dt className="text-xs text-stone-400">Next period start</dt>
                  <dd className="font-mono-data text-sm font-semibold text-stone-800">
                    {fmt(result.nextPeriodStart)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="md:col-span-3 bg-white rounded-2xl border border-stone-200 p-6">
              <p className="font-mono-data text-[11px] tracking-widest text-stone-400 uppercase mb-3">
                {result.ovulationDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} className="text-[10px] font-semibold text-stone-400 pb-1">
                    {d}
                  </div>
                ))}
                {calendarCells.map((cell, i) => {
                  if (!cell.date) return <div key={i} />;
                  return (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center rounded-lg text-xs font-mono-data ${
                        cell.isOvulation
                          ? "bg-teal-600 text-white font-bold"
                          : cell.inWindow
                          ? "bg-teal-100 text-teal-800 font-semibold"
                          : "text-stone-500"
                      }`}
                    >
                      {cell.date.getDate()}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 text-[11px] text-stone-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
                  Ovulation day
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-teal-100 inline-block" />
                  Fertile window
                </span>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                  Next 6 cycles
                </p>
                <div className="flex flex-col gap-1.5">
                  {result.cycles.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2"
                    >
                      <span className="font-mono-data text-stone-500">Period {fmtShort(c.periodStart)}</span>
                      <span className="font-mono-data text-teal-700 font-semibold">
                        {fmtShort(c.ovWindowStart)}&ndash;{fmtShort(c.ovWindowEnd)}
                      </span>
                      <span className="font-mono-data text-stone-400">Due {fmtShort(c.due)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="w-full mt-5 flex items-start gap-2 text-xs text-stone-400">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p>
            Estimates assume ovulation occurs 14 days before your next period. Actual timing
            varies by cycle and person. Informational only -- not medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}