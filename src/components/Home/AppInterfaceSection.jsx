import { useEffect, useRef, forwardRef } from "react";
import logo from "../../assets/home/fitmom.png";
import phoneFrame from "../../assets/home/mockup.png";
// NOTE: point this at your actual mockup screenshot asset
import mockupImage from "../../assets/home/mockup.png";

// ── Scroll section height ────────────────────────────────────────────────────
const SCROLL_LENGTH_VH = 250;

// ── Spring constants ─────────────────────────────────────────────────────────
const SCROLL_SPRING = 7.5;   // exponential decay coefficient for scroll progress
const ENTRY_SPRING  = 6.0;   // exponential decay coefficient for entry progress

// ── Grid layout constants (UNCHANGED from file 1, except GAP split) ─────────
const GRID_W  = 580;
const GRID_H  = 780;
const PAD     = 24;
const SCR_W   = GRID_W - PAD * 2;
const SCR_H   = GRID_H - PAD * 2;

// Horizontal gap between the two columns (rows 2 & 3) — reduce this to tighten.
const COL_GAP = 2;
// Vertical gap between rows, and between stacked pills in the right column.
const ROW_GAP = 5;

const COL     = (SCR_W - COL_GAP-80) / 2;

const PHOTO_H = 188;
const ROW2_H  = 168;
const ROW3_H  = 154;
const MED_H   = 62;
const TOP_PAD = Math.floor(
  (SCR_H - (PHOTO_H + ROW_GAP + ROW2_H + ROW_GAP + ROW3_H + ROW_GAP + MED_H)) / 2
);

const DESIGN_W = 390;

// ── Phone frame — simple static sizing, no measurement/canvas work ─────────
const PHONE_FRAME_MAX_H = 1040;
const PHONE_FADE_START  = 0.82;
const PHONE_FADE_END    = 0.98;

// ── Mobile UI screen — pure CSS, no image asset. Sized to match the card
// grid exactly (GRID_W × GRID_H) so all cards land inside its bezel with
// the same padding as the design grid. Fades in once the logo band has
// fully faded out, so the floating cards have a "home" to rest on as they
// lock into place.
const MOBILE_UI_MAX_H      = 980; // was GRID_H (680) — increase this to make the mockup bigger
const MOBILE_UI_ASPECT     = GRID_W / GRID_H;
const MOBILE_UI_FADE_START = 0.58; // logo band opacity reaches 0 at p ≈ 0.56 (see bandOpacity below)
const MOBILE_UI_FADE_END   = 0.82; // finishes just as the phone frame bezel starts fading in

// ── Final phase: "implode → flash → iris reveal" transition ────────────────
// Cards individually collapse toward center (staggered, blurred), a soft
// radial flash sells the "snap", then the mockup image irises into focus.
const IMPLODE_START      = 0.80;  // when the first card begins collapsing
const IMPLODE_END        = 0.95;  // when the first card finishes collapsing
const IMPLODE_STAGGER    = 0.012; // per-card delay (in `p` units), keyed to card order
const IMPLODE_BLUR_PX    = 14;    // max blur applied to a card mid-implode
const IMPLODE_PULL       = 0.65;  // fraction cards get pulled toward center (0 = no pull, 1 = fully centered)

const FLASH_CENTER       = 0.92;  // where in scroll progress the flash peaks
const FLASH_HALF_WIDTH   = 0.05;  // bell-curve width around FLASH_CENTER
const FLASH_PEAK_OPACITY = 0.5;   // max opacity of the flash overlay

const REVEAL_START       = 0.90;  // mockup iris begins opening
const REVEAL_END         = 1.0;   // mockup iris fully open, in focus
const REVEAL_BLUR_PX     = 10;    // mockup starts this blurred, resolves to sharp

// ── Utility: linear interpolate ──────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const fmt  = (n) => Math.round(n).toLocaleString();

/**
 * Smootherstep (Ken Perlin) easing — unchanged from file 1.
 */
function ease(t) {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * c * (c * (c * 6 - 15) + 10);
}

// ── Small presentational helpers ────────────────────────────────────────────
function IconBadge({ bg, color, children, size = 28, live = false }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div
        className="flex items-center justify-center rounded-full w-full h-full transition-transform duration-300"
        style={{ background: bg, color }}
      >
        {children}
      </div>
      {live && (
        <>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
        </>
      )}
    </div>
  );
}

// Marker slides via ref (imperative, RAF-driven — avoids React re-render churn)
const GradientBar = forwardRef(function GradientBar({ initialValue = 0 }, ref) {
  return (
    <div className="relative w-full h-1.5 rounded-full bg-neutral-800 overflow-visible">
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width: "100%",
          background:
            "linear-gradient(90deg,#38BDF8 0%,#34D399 22%,#FBBF24 55%,#FB923C 78%,#EF4444 100%)",
        }}
      />
      <div
        ref={ref}
        className="absolute top-1/2 w-2 h-4 rounded-full bg-white -translate-y-1/2 shadow-[0_0_6px_rgba(255,255,255,0.6)]"
        style={{ left: `calc(${initialValue * 100}% - 6px)`, willChange: "left" }}
      />
    </div>
  );
});

const Icons = {
  scale: (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M12 8v4l2.5 2.5" strokeLinecap="round" />
    </svg>
  ),
  ratio: (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="currentColor">
      <circle cx="7" cy="7" r="4" />
      <circle cx="17" cy="17" r="4" opacity="0.5" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="currentColor">
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
    </svg>
  ),
  drop: (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="currentColor">
      <path d="M12 2s7 8.2 7 13a7 7 0 1 1-14 0c0-4.8 7-13 7-13Z" />
    </svg>
  ),
  heartbeat: (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h4l2-6 4 12 2-6h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevron: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const RING_CIRC = 2 * Math.PI * 17;

export default function AppInterfaceSection() {
  const wrapperRef = useRef(null);

  // ── All animation state lives in refs (unchanged from file 1) ─────────────
  const progressRef      = useRef(0);
  const entryProgressRef = useRef(0);
  const targetRef        = useRef(0);
  const entryTargetRef   = useRef(0);
  const scaleRef         = useRef(1);
  const isMobileRef      = useRef(
    typeof window !== "undefined" && window.innerWidth < 480
  );
  const rafRef      = useRef(null);
  const lastTimeRef = useRef(null);

  const scalerRef     = useRef(null);
  const bandRef       = useRef(null);
  const cardRefs      = useRef({});
  const phoneFrameRef = useRef(null);
  const mobileUIRef   = useRef(null);

  // ── Final phase: cards group + mockup image + flash overlay refs ────────
  const cardsGroupRef  = useRef(null);
  const mockupImageRef = useRef(null);
  const flashRef       = useRef(null);

  // ── Dynamic text / visual nodes for the dark cards ─────────────────────────
  const weightNodeRef     = useRef(null); // "Weight" card kg value
  const sleepHoursNodeRef = useRef(null); // "Sleep" card hr value
  const emotionalNodeRef  = useRef(null); // "Emotional" card status text

  const calorieIntakeRef  = useRef(null);
  const workoutBurnRef    = useRef(null);
  const stepsBurnRef      = useRef(null);
  const waterMlRef        = useRef(null);
  const whrValueRef       = useRef(null);
  const bmiValueRef       = useRef(null);

  const ringRefs         = useRef([]); // 3 <circle> refs for calorie rings
  const weightBarRef     = useRef(null);
  const whrBarRef        = useRef(null);
  const sleepGoalBarRef  = useRef(null);

  // ── LAYOUT CONSTANTS derived from grid (unchanged, using split gaps) ───────
  const row2Y  = TOP_PAD + PHOTO_H + ROW_GAP;
  const row3Y  = row2Y + ROW2_H + ROW_GAP;
  const medY   = row3Y + ROW3_H + ROW_GAP;
  const pill3H = (ROW2_H - ROW_GAP * 2) / 3;

  const GROUP_W      = COL * 2 + COL_GAP;
  const GROUP_OFFSET = (SCR_W - GROUP_W) / 2;

  const leftX  = GROUP_OFFSET;
  const rightX = leftX + COL + COL_GAP;

  const sc = (lx, ly) => ({
    fx: lx - SCR_W / 2,
    fy: ly - SCR_H / 2,
  });

  const F = {
    yoga:      sc(SCR_W / 2,         TOP_PAD + PHOTO_H / 2),
    sleep:     sc(leftX + COL / 2,   row2Y + ROW2_H / 2),
    steps:     sc(rightX + COL / 2,  row2Y + pill3H / 2),
    ready:     sc(rightX + COL / 2,  row2Y + pill3H + ROW_GAP + pill3H / 2),
    sleepPill: sc(rightX + COL / 2,  row2Y + (pill3H + ROW_GAP) * 2 + pill3H / 2),
    heart:     sc(leftX + COL / 2,   row3Y + ROW3_H / 2),
    run:       sc(rightX + COL / 2,  row3Y + ROW3_H / 2),
    med:       sc(SCR_W / 2,         medY + MED_H / 2),
  };

  const S_desktop = {
    yoga:      { x: -50, y: -240 },
    sleep:     { x: -70, y:  -20 },
    steps:     { x:  50, y: -280 },
    ready:     { x:  40, y: -175 },
    sleepPill: { x:  80, y:  -70 },
    heart:     { x: -60, y:  220 },
    run:       { x:  80, y:  120 },
    med:       { x:   60, y:  250 },
  };

  const S_mobile = {
    yoga:      { x:  -110, y: -310 },
    sleep:     { x: -285, y:  -60 },
    steps:     { x:  255, y: -290 },
    ready:     { x:  260, y: -180 },
    sleepPill: { x:  255, y:  -75 },
    heart:     { x: -260, y:  200 },
    run:       { x:  240, y:  130 },
    med:       { x:   110, y:  310 },
  };

  const FINAL_SIZES = {
    yoga:      { w: 350,  h: 188 },
    sleep:     { w: 175,    h: 168  },
    steps:     { w: 175,    h: pill3H  },
    ready:     { w: 175,    h: pill3H  },
    sleepPill: { w: 175,    h: pill3H  },
    heart:     { w: 175,    h: ROW3_H  },
    run:       { w: 175,    h: ROW3_H  },
    med:       { w: 350,  h: MED_H   },
  };

  const SPREAD_SIZES = {
    yoga:      { w: 300, h: 165 },
    sleep:     { w: 165, h: 160 },
    steps:     { w: 165, h: 52  },
    ready:     { w: 165, h: 52  },
    sleepPill: { w: 165, h: 52  },
    heart:     { w: 165, h: 145 },
    run:       { w: 165, h: 145 },
    med:       { w: 300, h: 52  },
  };

  useEffect(() => {
    const computeScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s  = Math.min(vw / (GRID_W + 32), vh / (GRID_H + 32), 1);
      scaleRef.current = s;
      if (scalerRef.current) {
        scalerRef.current.style.transform = `scale(${s})`;
      }
    };

    const updateTarget = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;

      entryTargetRef.current = Math.min(Math.max((vh - rect.top) / vh, 0), 1);

      const total = el.offsetHeight - vh;
      if (total > 0) {
        targetRef.current = Math.min(Math.max(-rect.top, 0), total) / total;
      }
    };

    const KEYS = ["yoga","sleep","steps","ready","sleepPill","heart","run","med"];

    const tick = (time) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 1 / 30);
      lastTimeRef.current = time;

      const entryAlpha  = 1 - Math.exp(-ENTRY_SPRING * dt);
      const scrollAlpha = 1 - Math.exp(-SCROLL_SPRING * dt);

      entryProgressRef.current +=
        (entryTargetRef.current - entryProgressRef.current) * entryAlpha;
      progressRef.current +=
        (targetRef.current - progressRef.current) * scrollAlpha;

      const easedEntry = ease(entryProgressRef.current);
      const p          = ease(progressRef.current);

      if (bandRef.current) {
        const bandScale   = lerp(1, 0.35, p);
        const bandOpacity = Math.max(0, lerp(1, 0, Math.min(p * 1.8, 1)));
        bandRef.current.style.transform = `translate(-50%, -50%) scale(${bandScale})`;
        bandRef.current.style.opacity   = bandOpacity;
      }

      const vh    = window.innerHeight;
      const riseY = (1 - easedEntry) * (vh || 800);
      if (scalerRef.current) {
        scalerRef.current.style.transform =
          `scale(${scaleRef.current}) translateY(${riseY / scaleRef.current}px)`;
      }

      const spreadScale = window.innerWidth / DESIGN_W;
      const S = isMobileRef.current ? S_mobile : S_desktop;

      for (let i = 0; i < KEYS.length; i++) {
        const key  = KEYS[i];
        const node = cardRefs.current[key];
        if (!node) continue;

        const fs = FINAL_SIZES[key];
        const ss = SPREAD_SIZES[key];

        const x = lerp(S[key].x * spreadScale, F[key].fx, p);
        const y = lerp(S[key].y,               F[key].fy, p);

        const sw = lerp(ss.w, fs.w, p);
        const sh = lerp(ss.h, fs.h, p);
        const scaleX = sw / fs.w;
        const scaleY = sh / fs.h;

        // ── Implode: staggered, blurred pull-to-center on the way out ──────
        const start = IMPLODE_START + i * IMPLODE_STAGGER;
        const end   = IMPLODE_END   + i * IMPLODE_STAGGER * 0.5;
        const it    = Math.min(Math.max((p - start) / (end - start), 0), 1);
        const implodeT = ease(it);

        const pullX = lerp(x, 0, implodeT * IMPLODE_PULL);
        const pullY = lerp(y, 0, implodeT * IMPLODE_PULL);
        const implodeScale   = lerp(1, 0.4, implodeT);
        const implodeOpacity = 1 - implodeT;
        const blurPx = implodeT * IMPLODE_BLUR_PX;

        node.style.transform =
          `translate3d(calc(${pullX}px - 50%), calc(${pullY}px - 50%), 0) scale(${scaleX * implodeScale}, ${scaleY * implodeScale})`;
        node.style.opacity = implodeOpacity;
        node.style.filter  = blurPx > 0.1 ? `blur(${blurPx}px)` : "none";
      }

      const yogaInner = cardRefs.current["yoga_inner"];
      if (yogaInner) {
        yogaInner.style.borderRadius = `${lerp(16, 12, p)}px`;
      }

      // ── Phone frame fade ──────────────────────────────────────────────────
      if (phoneFrameRef.current) {
        const fadeT = Math.min(
          Math.max((p - PHONE_FADE_START) / (PHONE_FADE_END - PHONE_FADE_START), 0),
          1
        );
        phoneFrameRef.current.style.opacity = fadeT;
      }

      // ── Mobile UI screen fade — only once the logo band is fully hidden ──
      if (mobileUIRef.current) {
        const uiFadeT = Math.min(
          Math.max((p - MOBILE_UI_FADE_START) / (MOBILE_UI_FADE_END - MOBILE_UI_FADE_START), 0),
          1
        );
        mobileUIRef.current.style.opacity = uiFadeT;
      }

      // ── Cards group: no longer drives opacity (per-card implode handles
      // that above) — just kill pointer events once fully imploded ────────
      if (cardsGroupRef.current) {
        const groupDone = p >= IMPLODE_END + KEYS.length * IMPLODE_STAGGER * 0.5;
        cardsGroupRef.current.style.pointerEvents = groupDone ? "none" : "auto";
      }

      // ── Flash: soft radial pulse that peaks right before the reveal ──────
      if (flashRef.current) {
        const dist = Math.abs(p - FLASH_CENTER);
        const flashT = Math.max(0, 1 - dist / FLASH_HALF_WIDTH);
        flashRef.current.style.opacity = flashT * flashT * FLASH_PEAK_OPACITY;
      }

      // ── Mockup: iris reveal + defocus-to-sharp ────────────────────────────
      if (mockupImageRef.current) {
        const rt = Math.min(
          Math.max((p - REVEAL_START) / (REVEAL_END - REVEAL_START), 0),
          1
        );
        const t = rt * rt * (3 - 2 * rt); // smoothstep

        const irisPct = lerp(0, 75, t); // % radius, clip-path circle grows from center
        mockupImageRef.current.style.opacity   = t < 0.02 ? 0 : 1;
        mockupImageRef.current.style.clipPath  = `circle(${irisPct}% at 50% 50%)`;
        mockupImageRef.current.style.transform = `translate(-50%, -50%) scale(${1.08 - 0.08 * t})`;
        mockupImageRef.current.style.filter    = `blur(${(1 - t) * REVEAL_BLUR_PX}px)`;
      }

      // ── Core stat text values ───────────────────────────────────────────────
      const weightKg   = lerp(70, 68, p).toFixed(1);
      const sleepHours = Math.round(lerp(6, 8, p));
      const mood       = p > 0.6 ? "Calm" : p > 0.3 ? "Okay" : "Tracking";

      if (weightNodeRef.current)     weightNodeRef.current.textContent     = weightKg;
      if (sleepHoursNodeRef.current) sleepHoursNodeRef.current.textContent = sleepHours;
      if (emotionalNodeRef.current)  emotionalNodeRef.current.textContent  = mood;

      // ── Increasing dashboard stats, all driven by scroll progress p ────────
      const calorieIntake = fmt(lerp(0, 1200, p));
      const workoutBurn   = fmt(lerp(0, 500, p));
      const stepsBurn     = fmt(lerp(0, 500, p));
      const waterMl       = fmt(lerp(0, 5000, p));
      const whrValue      = lerp(0.50, 0.80, p).toFixed(2);
      const bmiValue      = lerp(18.0, 23.14, p).toFixed(2);

      if (calorieIntakeRef.current) calorieIntakeRef.current.textContent = `${calorieIntake} / 1000`;
      if (workoutBurnRef.current)   workoutBurnRef.current.textContent   = workoutBurn;
      if (stepsBurnRef.current)     stepsBurnRef.current.textContent     = stepsBurn;
      if (waterMlRef.current)       waterMlRef.current.textContent       = `${waterMl} ml`;
      if (whrValueRef.current)      whrValueRef.current.textContent      = whrValue;
      if (bmiValueRef.current)      bmiValueRef.current.textContent      = bmiValue;

      // ── Calorie rings fill up as the section scrolls ────────────────────────
      const ringTargets = [0.72, 0.5, 0.5];
      ringRefs.current.forEach((circle, i) => {
        if (!circle) return;
        const pct = ringTargets[i] * p;
        circle.style.strokeDashoffset = `${RING_CIRC * (1 - pct)}`;
      });

      // ── Gradient bar markers slide into position ────────────────────────────
      const weightBarValue = lerp(0, 0.42, p);
      const whrBarValue    = lerp(0, 0.18, p);
      if (weightBarRef.current) weightBarRef.current.style.left = `calc(${weightBarValue * 100}% - 6px)`;
      if (whrBarRef.current)    whrBarRef.current.style.left    = `calc(${whrBarValue * 100}% - 6px)`;

      // ── Sleep goal bar fills 0 → 100% ───────────────────────────────────────
      if (sleepGoalBarRef.current) {
        sleepGoalBarRef.current.style.width = `${lerp(0, 100, p)}%`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", () => {
      updateTarget();
      computeScale();
      isMobileRef.current = window.innerWidth < 480;
    });

    updateTarget();
    computeScale();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", computeScale);
      cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gpuStyle = {
    willChange:         "transform",
    transformStyle:     "preserve-3d",
    backfaceVisibility: "hidden",
    contain:            "layout paint style",
  };

  const CardGPU = ({ name, children }) => {
    const fs = FINAL_SIZES[name];
    return (
      <div
        ref={el => { cardRefs.current[name] = el; }}
        className="absolute overflow-hidden"
        style={{
          width:  fs.w,
          height: fs.h,
          ...gpuStyle,
        }}
      >
        <div style={{ width: "100%", height: "100%" }}>
          {children}
        </div>
      </div>
    );
  };

  return (
    <section
      ref={wrapperRef}
      className="relative bg-[#F6F5F1]"
      style={{ height: `${SCROLL_LENGTH_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        <img
          ref={phoneFrameRef}
          src={phoneFrame}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute z-0 h-[60vh] lg:h-[90vh]"
          style={{
            width: "auto",
            opacity: 0,
          }}
        />

        <div
          ref={scalerRef}
          className="relative z-20"
          style={{
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <div className="relative" style={{ width: 0, height: 0 }}>

            {/* ── LOGO BAND ── */}
            <div
              ref={bandRef}
              className="absolute pointer-events-none w-[150px] mt:w-[220px] mt:h-[300px]"
              style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
            >
              <img src={logo} className="w-full h-full object-contain " alt="FitMom logo" />
            </div>
            <img
              src={phoneFrame}
              alt=""
              aria-hidden="true"
              onLoad={() => {
                window.dispatchEvent(new Event("__phoneFrameLoaded"));
                window.dispatchEvent(new Event("resize"));
              }}
              className="pointer-events-none select-none absolute z-0"
              style={{
                height: `70vh)`,
                width: "auto",
                opacity: 0,
                transition: "opacity 0.15s linear",
              }}
            />

          
            <div ref={cardsGroupRef} style={{ willChange: "opacity" }}>

              {/* ── DAILY CALORIE TRACKER (rings now fill up live) ── */}
              <CardGPU name="yoga">
                <div
                  ref={el => { cardRefs.current["yoga_inner"] = el; }}
                  className="w-full h-full bg-neutral-900 flex flex-col justify-center px-6 py-4 border border-neutral-800 transition-colors duration-300 hover:border-neutral-700"
                  style={{ borderRadius: 16 }}
                >
                  <p className="text-sm text-neutral-300 font-semibold mb-3">Track your Daily Calorie</p>
                  <div className="flex items-center justify-between flex-1">
                    {[
                      { label: "Calories Intake", ref: calorieIntakeRef, unit: "Kcal", color: "#2DD4BF", emoji: "🥗" },
                      { label: "Workout",         ref: workoutBurnRef,   unit: "Kcal Burned", color: "#F87171", emoji: "⚡️" },
                      { label: "Steps",           ref: stepsBurnRef,     unit: "Kcal Burned", color: "#FB923C", emoji: "👟" },
                    ].map((ring, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 flex-1 transition-transform duration-300 hover:scale-105">
                        <div className="relative w-20 h-20">
                          <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                            <circle cx="20" cy="20" r="17" fill="none" stroke="#2A2A2E" strokeWidth="2" />
                            <circle
                              ref={el => { ringRefs.current[i] = el; }}
                              cx="20" cy="20" r="17" fill="none" stroke={ring.color} strokeWidth="2"
                              strokeDasharray={`${RING_CIRC}`}
                              strokeDashoffset={`${RING_CIRC}`}
                              strokeLinecap="round"
                              style={{ transition: "stroke-dashoffset 0.1s linear" }}
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-2xl">{ring.emoji}</span>
                        </div>
                        <p className="text-[11px] text-neutral-300 text-center leading-tight font-medium">{ring.label}</p>
                        <p className="text-[10px] font-bold text-center leading-tight" style={{ color: ring.color }}>
                          <span ref={ring.ref}>0</span> <span className="text-neutral-500 font-medium">{ring.unit}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardGPU>

              {/* ── SLEEP ── */}
              <CardGPU name="sleep">
                <div className="w-full h-full bg-neutral-900 rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden border border-neutral-800 transition-all duration-300 hover:border-neutral-700 hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <IconBadge bg="rgba(56,189,248,0.15)" color="#38BDF8" size={32}>{Icons.moon}</IconBadge>
                      <p className="text-[13px] text-blue-400 font-semibold">Sleep</p>
                    </div>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-0.5">25 Oct {Icons.chevron}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span ref={sleepHoursNodeRef} className="text-3xl font-normal text-white">8</span>
                    <span className="text-[11px] text-neutral-400">hr</span>
                    <span className="text-3xl font-normal text-white">00</span>
                    <span className="text-[11px] text-neutral-400">min</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">100% Goal</p>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      ref={sleepGoalBarRef}
                      className="h-full rounded-full bg-blue-400"
                      style={{ width: "0%", transition: "width 0.1s linear" }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>Deep: 5h 10m</span>
                    <span>Light: 2h 50m</span>
                  </div>
                </div>
              </CardGPU>

              {/* ── WATER (count-up ml) ── */}
              <CardGPU name="steps">
                <div className="w-full h-full bg-neutral-900 rounded-2xl flex items-center px-3 gap-2.5 border border-neutral-800 transition-all duration-300 hover:border-neutral-700 hover:scale-[1.02]">
                  <IconBadge bg="rgba(59,130,246,0.15)" color="#3B82F6" size={32}>{Icons.drop}</IconBadge>
                  <div className="min-w-0">
                    <p className="text-[10px] text-blue-400 leading-none">Water</p>
                    <p ref={waterMlRef} className="text-base font-normal text-white leading-tight">0 ml</p>
                  </div>
                </div>
              </CardGPU>

              {/* ── HEALTH / VIEW ALL ── */}
              <CardGPU name="ready">
                <div className="w-full h-full bg-neutral-900 rounded-2xl flex items-center px-3 gap-2.5 border border-neutral-800 transition-all duration-300 hover:border-neutral-700 hover:scale-[1.02]">
                  <IconBadge bg="rgba(45,212,191,0.15)" color="#2DD4BF" size={32} >{Icons.heartbeat}</IconBadge>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-teal-400 leading-none">Health</p>
                    <p className="text-[12px] font-normal text-white leading-tight">View all</p>
                  </div>
                  <span className="text-neutral-500">{Icons.chevron}</span>
                </div>
              </CardGPU>

              {/* ── EMOTIONAL ── */}
              <CardGPU name="sleepPill">
                <div className="w-full h-full bg-neutral-900 rounded-2xl flex items-center px-3 gap-2.5 border border-neutral-800 transition-all duration-300 hover:border-neutral-700 hover:scale-[1.02]">
                  <IconBadge bg="rgba(244,114,182,0.15)" color="#F472B6" size={32} >{Icons.moon}</IconBadge>
                  <div className="min-w-0">
                    <p className="text-[10px] text-pink-400 leading-none">Emotional</p>
                    <p ref={emotionalNodeRef} className="text-[12px] font-normal text-white leading-tight">Tracking</p>
                  </div>
                </div>
              </CardGPU>

              {/* ── WEIGHT ── */}
              <CardGPU name="heart">
                <div className="w-full h-full bg-neutral-900 rounded-2xl p-3 flex flex-col justify-between border border-neutral-800 transition-all duration-300 hover:border-neutral-700 hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <IconBadge bg="rgba(52,211,153,0.15)" color="#34D399" size={32}>{Icons.scale}</IconBadge>
                      <p className="text-[13px] text-emerald-400 font-semibold">Weight</p>
                    </div>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-0.5">25 Oct {Icons.chevron}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span ref={weightNodeRef} className="text-4xl font-normal text-white">68.0</span>
                    <span className="text-sm text-neutral-400">kg</span>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-red-400 ml-0.5" fill="currentColor">
                      <path d="M4 6l8 8 4-4 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                  <GradientBar ref={weightBarRef} initialValue={0} />
                  <p className="text-[11px] text-neutral-500">
                    BMI <span ref={bmiValueRef} className="text-emerald-400 font-semibold">18.00</span>
                  </p>
                </div>
              </CardGPU>

              {/* ── WHR ── */}
              <CardGPU name="run">
                <div className="w-full h-full bg-neutral-900 rounded-2xl p-3 flex flex-col justify-between border border-neutral-800 transition-all duration-300 hover:border-neutral-700 hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <IconBadge bg="rgba(45,212,191,0.15)" color="#2DD4BF" size={32}>{Icons.ratio}</IconBadge>
                      <p className="text-[13px] text-teal-400 font-semibold">WHR</p>
                    </div>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-0.5">25 Oct {Icons.chevron}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span ref={whrValueRef} className="text-3xl font-normal text-white">0.50</span>
                    <span className="text-[11px] text-neutral-400">Ratio</span>
                  </div>
                  <GradientBar ref={whrBarRef} initialValue={0} />
                  <p className="text-[11px] text-neutral-500">
                    Progress <span className="text-teal-400 font-semibold">↘ Good</span>
                  </p>
                </div>
              </CardGPU>

              {/* ── MEDICAL RECORDS ── */}
              <CardGPU name="med">
                <div className="w-full h-full bg-neutral-900 rounded-2xl px-4 flex items-center justify-between border border-neutral-800 transition-all duration-300 hover:border-neutral-700 hover:scale-[1.01]">
                  <div className="flex items-center gap-3">
                    <IconBadge bg="rgba(255,255,255,0.06)" color="#9CA3AF" size={30}>
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M9 12h6M9 16h6M7 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2M9 4a2 2 0 0 1 4 0H9Z" strokeLinecap="round" />
                      </svg>
                    </IconBadge>
                    <span className="text-base font-medium text-neutral-300">Medical Records</span>
                  </div>
                  <span className="text-neutral-500">{Icons.chevron}</span>
                </div>
              </CardGPU>

            </div>
            {/* end cardsGroupRef */}

            {/* ── FLASH OVERLAY ── soft radial pulse that peaks right before
                the mockup resolves, sitting between the imploding cards and
                the mockup image. */}
            <div
              ref={flashRef}
              aria-hidden="true"
              className="pointer-events-none absolute z-20"
              style={{
                left: 0,
                top: 0,
                width: GRID_W,
                height: GRID_H,
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)",
                opacity: 0,
                willChange: "opacity",
              }}
            />

            {/* ── FINAL MOCKUP IMAGE ──────────────────────────────────────────
                Sits at the same centered origin the card grid uses. Starts
                invisible and clipped to a zero-radius circle; irises open
                and defocuses to sharp as the cards finish imploding. */}
            <img
              ref={mockupImageRef}
              src={mockupImage}
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute z-30"
              style={{
                left: 0,
                top: 0,
                transform: "translate(-50%, -50%) scale(1.08)",
                width: GRID_W,
                height: GRID_H,
                objectFit: "contain",
                opacity: 0,
                clipPath: "circle(0% at 50% 50%)",
                filter: `blur(${REVEAL_BLUR_PX}px)`,
                willChange: "opacity, clip-path, filter, transform",
              }}
            />

          </div>
        </div>
      </div>
    </section>
  );
}