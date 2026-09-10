import React, { useState, useMemo } from "react";
import {
  Calendar,
  RotateCcw,
  Info,
  Baby,
  Sparkles,
  Stethoscope,
  ChevronDown,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + Math.round(days));
  return d;
}
function stripTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function fmtLong(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
function fmtShort(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Common size-comparison reference by week, widely used in prenatal guides.
const SIZE_BY_WEEK = [
  { w: 4, name: "poppy seed" }, { w: 5, name: "sesame seed" }, { w: 6, name: "lentil" },
  { w: 7, name: "blueberry" }, { w: 8, name: "kidney bean" }, { w: 9, name: "grape" },
  { w: 10, name: "kumquat" }, { w: 11, name: "fig" }, { w: 12, name: "lime" },
  { w: 13, name: "peapod" }, { w: 14, name: "lemon" }, { w: 15, name: "apple" },
  { w: 16, name: "avocado" }, { w: 17, name: "pear" }, { w: 18, name: "bell pepper" },
  { w: 19, name: "tomato" }, { w: 20, name: "banana" }, { w: 21, name: "carrot" },
  { w: 22, name: "spaghetti squash" }, { w: 23, name: "mango" }, { w: 24, name: "ear of corn" },
  { w: 25, name: "rutabaga" }, { w: 26, name: "scallion bunch" }, { w: 27, name: "cauliflower" },
  { w: 28, name: "eggplant" }, { w: 29, name: "butternut squash" }, { w: 30, name: "cabbage" },
  { w: 31, name: "coconut" }, { w: 32, name: "jicama" }, { w: 33, name: "pineapple" },
  { w: 34, name: "cantaloupe" }, { w: 35, name: "honeydew melon" }, { w: 36, name: "romaine lettuce" },
  { w: 37, name: "swiss chard bunch" }, { w: 38, name: "leek" }, { w: 39, name: "mini watermelon" },
  { w: 40, name: "small pumpkin" },
];
function babySizeForWeek(weeks) {
  const clamped = Math.min(40, Math.max(4, weeks));
  return SIZE_BY_WEEK.reduce((best, cur) =>
    Math.abs(cur.w - clamped) < Math.abs(best.w - clamped) ? cur : best
  );
}

function weeksDaysFrom(lmp, today) {
  const diffDays = Math.round((stripTime(today) - stripTime(lmp)) / 86400000) + 1;
  const clamped = Math.max(0, diffDays);
  return { totalDays: clamped, weeks: Math.floor(clamped / 7), days: clamped % 7 };
}

function buildMilestones(lmp) {
  const at = (days) => addDays(lmp, days);
  return [
    {
      key: "conception",
      icon: Sparkles,
      label: "Conception",
      sub: "About two weeks after your last period, the egg is fertilized.",
      startDays: 14,
      endDays: 14,
    },
    {
      key: "dating",
      icon: Stethoscope,
      label: "Dating scan",
      sub: "Confirms your baby's expected delivery date via crown-rump length measurement.",
      startDays: 7 * 7,
      endDays: 12 * 7,
    },
    {
      key: "nipt",
      icon: Stethoscope,
      label: "NIPT testing",
      sub: "A blood test screening for Down syndrome and other chromosomal conditions.",
      startDays: 10 * 7,
      endDays: 10 * 7,
    },
    {
      key: "nt",
      icon: Stethoscope,
      label: "Nuchal translucency scan",
      sub: "Measures fluid at the back of baby's neck as part of Down syndrome screening.",
      startDays: 12 * 7,
      endDays: 13.5 * 7,
    },
    {
      key: "preeclampsia",
      icon: Stethoscope,
      label: "Pre-eclampsia screening",
      sub: "A combined blood-pressure, blood-test, and ultrasound screen that detects most women who will develop pre-eclampsia.",
      startDays: 12 * 7,
      endDays: 13.5 * 7,
    },
    {
      key: "structural",
      icon: Stethoscope,
      label: "Structural scan",
      sub: "An early anatomy scan reviewing your baby's developing organs and structures.",
      startDays: 12 * 7,
      endDays: 16 * 7,
    },
    {
      key: "morphology",
      icon: Stethoscope,
      label: "Morphology scan",
      sub: "A detailed review of your baby's heart, brain, spine, and other organs.",
      startDays: 19 * 7,
      endDays: 20 * 7,
    },
    {
      key: "growth",
      icon: Stethoscope,
      label: "Growth scan",
      sub: "Checks your baby's health, position, size, and growth trajectory.",
      startDays: 24 * 7,
      endDays: 24 * 7,
    },
    {
      key: "edd",
      icon: Baby,
      label: "Estimated due date",
      sub: "Your estimated delivery date, 40 weeks from your last period.",
      startDays: 280,
      endDays: 280,
      highlight: true,
    },
  ].map((m) => ({
    ...m,
    startDate: at(m.startDays),
    endDate: at(m.endDays),
  }));
}

function statusFor(milestone, todayOffsetDays) {
  if (todayOffsetDays > milestone.endDays) return "past";
  if (todayOffsetDays >= milestone.startDays && todayOffsetDays <= milestone.endDays) return "current";
  return "upcoming";
}

export default function PregnancyCalculator() {
  const [lmp, setLmp] = useState("");
  const [confirmedLmp, setConfirmedLmp] = useState(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  const milestones = useMemo(() => (confirmedLmp ? buildMilestones(confirmedLmp) : null), [confirmedLmp]);
  const progress = useMemo(() => (confirmedLmp ? weeksDaysFrom(confirmedLmp, today) : null), [confirmedLmp]);

  const percentComplete = progress ? Math.min(100, (progress.totalDays / 280) * 100) : 0;
  const daysRemaining = progress ? Math.max(0, 280 - progress.totalDays) : 0;
  const trimester = progress ? (progress.weeks < 14 ? 1 : progress.weeks < 28 ? 2 : 3) : 1;
  const size = progress ? babySizeForWeek(progress.weeks) : null;

  const nextMilestone = useMemo(() => {
    if (!milestones || !progress) return null;
    return milestones.find((m) => statusFor(m, progress.totalDays) !== "past") || milestones[milestones.length - 1];
  }, [milestones, progress]);

  const activeKey = expanded ?? nextMilestone?.key ?? null;

  function handleReset() {
    setLmp("");
    setConfirmedLmp(null);
    setError("");
    setExpanded(null);
  }

  function handleCalculate() {
    if (!lmp) {
      setError("Please enter the first day of your last menstrual period.");
      setConfirmedLmp(null);
      return;
    }
    const parsed = new Date(lmp + "T00:00:00");
    if (isNaN(parsed.getTime())) {
      setError("That date doesn't look right.");
      setConfirmedLmp(null);
      return;
    }
    if (parsed > stripTime(today)) {
      setError("That date can't be in the future.");
      setConfirmedLmp(null);
      return;
    }
    setError("");
    setExpanded(null);
    setConfirmedLmp(parsed);
  }

  const RING_R = 80;
  const RING_CIRC = 2 * Math.PI * RING_R;
  const ringOffset = RING_CIRC - (percentComplete / 100) * RING_CIRC;

  return (
    <div className="min-h-screen w-full bg-[#f6f4f0] flex items-center justify-center p-6 pt-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-mono-data { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <div className="w-full max-w-3xl font-body mt-16 mb-16">
         <div className="flex flex-wrap items-end justify-center gap-4 mb-6 mt-6">
           <h1 className="font-display text-3xl font-semibold text-stone-900">
             Pregnancy Calculator
            </h1>
        <p className="text-justify text-black/60 text-md ">
The Pregnancy Calculator estimates your due date and tracks your pregnancy week-by-week using your last menstrual period or conception date. This due date calculator offers valuable insights into fetal development and helps you plan prenatal care. It’s a reliable tool for expecting mothers who want to monitor each trimester, prepare for delivery, and ensure a healthy pregnancy journey.
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
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
              <Calendar className="w-3.5 h-3.5" />
              First day of last menstrual period (LMP)
            </label>
            <input
              type="date"
              value={lmp}
              max={todayStr}
              onChange={(e) => setLmp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
              className="font-mono-data w-full text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>

          {error ? <p className="text-xs text-rose-500 font-medium">{error}</p> : null}

          <button
            onClick={handleCalculate}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            <Baby className="w-4 h-4" />
            Calculate
          </button>
        </div>

        {milestones && progress ? (
          <>
            {/* Hero: progress ring + trimester + size comparison */}
            <div className="mt-5 bg-white rounded-2xl border border-stone-200 p-6 grid sm:grid-cols-5 gap-6 items-center">
              <div className="sm:col-span-2 flex justify-center">
                <svg viewBox="0 0 200 200" className="w-full max-w-[170px]">
                  <circle cx="100" cy="100" r={RING_R} fill="none" className="stroke-stone-100" strokeWidth="14" />
                  <circle
                    cx="100" cy="100" r={RING_R} fill="none"
                    className="stroke-teal-500" strokeWidth="14" strokeLinecap="round"
                    strokeDasharray={RING_CIRC} strokeDashoffset={ringOffset}
                    transform="rotate(-90 100 100)"
                    style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}
                  />
                  <text x="100" y="94" textAnchor="middle" className="font-display" fontSize="34" fontWeight="600" fill="#1c1917">
                    {progress.weeks}
                  </text>
                  <text x="100" y="118" textAnchor="middle" className="font-mono-data" fontSize="12" fill="#78716c">
                    weeks {progress.days}d
                  </text>
                </svg>
              </div>
              <div className="sm:col-span-3 flex flex-col gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {[1, 2, 3].map((t) => (
                    <span
                      key={t}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        t === trimester
                          ? "bg-teal-600 text-white"
                          : t < trimester
                          ? "bg-teal-50 text-teal-600"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      Trimester {t}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-stone-600">
                  Baby is about the size of a{" "}
                  <span className="font-semibold text-stone-900">{size.name}</span> this week.
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <div>
                    <p className="font-mono-data text-2xl font-semibold text-stone-900 leading-none">{daysRemaining}</p>
                    <p className="text-[11px] text-stone-400 uppercase tracking-wide mt-1">days to go</p>
                  </div>
                  <div className="w-px h-8 bg-stone-100" />
                  <div>
                    <p className="font-mono-data text-sm font-semibold text-teal-700">{fmtShort(addDays(confirmedLmp, 280))}</p>
                    <p className="text-[11px] text-stone-400 uppercase tracking-wide mt-1">due date</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive timeline */}
            <div className="mt-5 bg-white rounded-2xl border border-stone-200 p-6">
              <p className="font-mono-data text-[11px] tracking-widest text-stone-400 uppercase mb-6">
                Tap a milestone for details
              </p>
              <div className="relative h-10 mb-2">
                <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-stone-100 rounded-full" />
                <div
                  className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${percentComplete}%` }}
                />
                {milestones.map((m) => {
                  const pos = (((m.startDays + m.endDays) / 2) / 280) * 100;
                  const status = statusFor(m, progress.totalDays);
                  const isActive = activeKey === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setExpanded(m.key)}
                      style={{ left: `${Math.min(98, Math.max(1, pos))}%` }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
                      aria-label={m.label}
                    >
                      <span
                        className={`block rounded-full border-2 transition-all ${
                          isActive
                            ? "w-5 h-5 bg-teal-600 border-teal-600"
                            : status === "past"
                            ? "w-3.5 h-3.5 bg-teal-100 border-teal-300"
                            : "w-3.5 h-3.5 bg-white border-stone-300 group-hover:border-teal-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] font-mono-data text-stone-300 mb-4">
                <span>Week 0</span>
                <span>Week 20</span>
                <span>Week 40</span>
              </div>

              {/* detail panel */}
              {milestones.map((m) => {
                if (m.key !== activeKey) return null;
                const status = statusFor(m, progress.totalDays);
                const Icon = m.icon;
                const singleDay = m.startDays === m.endDays;
                const daysUntil = m.startDays - progress.totalDays;
                return (
                  <div key={m.key} className={`rounded-xl p-4 ${m.highlight ? "bg-teal-50" : "bg-stone-50"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${m.highlight ? "bg-teal-600" : "bg-white border border-stone-200"}`}>
                        <Icon className={`w-4 h-4 ${m.highlight ? "text-white" : "text-teal-700"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-stone-900">{m.label}</p>
                          {status === "past" ? (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-teal-600">
                              <CheckCircle2 className="w-3 h-3" /> completed
                            </span>
                          ) : status === "current" ? (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                              <Clock className="w-3 h-3" /> in window now
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-stone-400">
                              <Clock className="w-3 h-3" /> in {daysUntil} day{daysUntil === 1 ? "" : "s"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-1">{m.sub}</p>
                        <p className="font-mono-data text-sm font-semibold text-stone-800 mt-2">
                          {singleDay ? fmtLong(m.startDate) : `${fmtLong(m.startDate)} to ${fmtLong(m.endDate)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full list, collapsible */}
            <div className="mt-5 bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
              {milestones.map((m) => {
                const Icon = m.icon;
                const status = statusFor(m, progress.totalDays);
                const isOpen = expanded === m.key;
                const singleDay = m.startDays === m.endDays;
                return (
                  <div key={m.key}>
                    <button
                      onClick={() => setExpanded(isOpen ? null : m.key)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-stone-50 transition-colors"
                    >
                      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${status === "past" ? "bg-teal-100" : "bg-stone-100"}`}>
                        {status === "past" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        ) : (
                          <Icon className="w-3.5 h-3.5 text-stone-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800">{m.label}</p>
                        <p className="font-mono-data text-xs text-stone-400">
                          {singleDay ? fmtShort(m.startDate) : `${fmtShort(m.startDate)} – ${fmtShort(m.endDate)}`}
                        </p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen ? (
                      <div className="px-4 pb-4 -mt-1">
                        <p className="text-xs text-stone-500">{m.sub}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

        <div className="w-full mt-5 flex items-start gap-2 text-xs text-stone-400">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p>
            Estimates assume a regular 28-day cycle and are calculated from the first day of
            your last menstrual period. Screening windows follow common clinical guidelines but
            your care provider's own assessment always takes precedence. Informational only --
            not medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}