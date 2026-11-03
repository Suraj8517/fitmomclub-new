import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../../assets/home/fitmom.png";
import phoneFrame from "../../assets/home/mockup.png";
// NOTE: point this at your actual mockup screenshot asset
import mockupImage from "../../assets/home/mockup.png";
import { Camera, Search, Plus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── Calorie + steps goals ────────────────────────────────────────────────────
const DAILY_GOAL   = 2000;
const STEPS_GOAL   = 10400;
const STEPS_TARGET = 504;   // value the steps count-up reaches
const ACTIVE_DAY   = 1;     // 0 = S, 1 = M, 2 = T ...

// ── Health tracker card ──────────────────────────────────────────────────────
const HEALTH_VALUE = 19.0;   // value the count-up reaches

// ── Cycle tracker + emotion cards ────────────────────────────────────────────
const CYCLE_DAY    = 1;
const CYCLE_LENGTH = 28;
const NEXT_PERIOD  = "30 Nov";
const EMOTION_DAY  = 0;      // 0 = M, 1 = T, 2 = W ... (highlighted bar)

// ── Weight card ──────────────────────────────────────────────────────────────
const WEIGHT_START  = 42.0;
const WEIGHT_NOW    = 63.8;   // value the count-up reaches
const WEIGHT_TARGET = 70.0;

// ── Scroll section height ────────────────────────────────────────────────────
const SCROLL_LENGTH_VH = 300;

// ── Scrub smoothing ──────────────────────────────────────────────────────────
const SCROLL_SCRUB = 1.1;
const ENTRY_SCRUB  = 0.8;

// ── Grid layout constants ────────────────────────────────────────────────────
const GRID_W  = 580;
const GRID_H  = 780;
const PAD     = 24;
const SCR_W   = GRID_W - PAD * 2;
const SCR_H   = GRID_H - PAD * 2;

const COL_GAP = 2;
const ROW_GAP = 5;

const COL     = (SCR_W - COL_GAP - 80) / 2;

// Row heights (top → bottom):
// yoga (full) → steps (full) → health | weight → cycle | emotion
const PHOTO_H = 188;
const STEPS_H = 96;
const ROW2_H  = 168;
const ROW3_H  = 180;
const TOP_PAD = Math.floor(
  (SCR_H -
    (PHOTO_H + ROW_GAP + STEPS_H + ROW_GAP + ROW2_H + ROW_GAP + ROW3_H)) / 2
);

const DESIGN_W = 390;

// ── Phone frame ──────────────────────────────────────────────────────────────
const PHONE_FADE_START  = 0.82;
const PHONE_FADE_END    = 0.98;

// ── Mobile UI screen fade ────────────────────────────────────────────────────
const MOBILE_UI_FADE_START = 0.58;
const MOBILE_UI_FADE_END   = 0.82;

// ── Final phase: "implode → flash → iris reveal" transition ────────────────
const IMPLODE_START      = 0.80;
const IMPLODE_END        = 0.95;
const IMPLODE_STAGGER    = 0.012;
const IMPLODE_BLUR_PX    = 14;
const IMPLODE_PULL       = 0.65;

const FLASH_CENTER       = 0.92;
const FLASH_HALF_WIDTH   = 0.05;
const FLASH_PEAK_OPACITY = 0.5;

const REVEAL_START       = 0.90;
const REVEAL_END         = 1.0;
const REVEAL_BLUR_PX     = 10;

// ── Utility ──────────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const fmt  = (n) => Math.round(n).toLocaleString();

/** Smootherstep (Ken Perlin) easing. */
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

const Icons = {
  scale: (
   
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#000000"/>

  <path
    d="M80 138
       C170 34 342 34 432 138
       L354 236
       H158 Z"
    fill="#21DA7C"
  />

  <path
    d="M256 217 L335 98 L308 217 Z"
    fill="#000000"
  />
</svg>

  ),
  cycle: (
    
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M32 48 C17 38 19 20 32 8 C45 20 47 38 32 48Z"/>
  <path d="M32 48 C15 44 7 32 9 22 C22 25 30 35 32 48Z"/>
  <path d="M32 48 C49 44 57 32 55 22 C42 25 34 35 32 48Z"/>
</svg>

  ),
  emotion: (
   
<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">

  <circle cx="12" cy="4.5" r="2.1"/>

  
  <path d="
    M8.2 8.1
    C7.2 8.1 6.5 8.8 6.1 10
    L5.2 12.5
    C4.8 13.5 3.8 14 2.9 13.5
    C2.1 13.1 1.2 13.4 1.1 14.3
    C1 15.2 1.8 15.8 2.8 16
    C5.1 16.4 6.7 15.2 7.7 13.4
    L8.1 12.6
    L8.1 14.9
    C8.1 15.9 8.7 16.7 9.5 17.2
    L12 18.2
    L14.5 17.2
    C15.3 16.7 15.9 15.9 15.9 14.9
    L15.9 12.6
    L16.3 13.4
    C17.3 15.2 18.9 16.4 21.2 16
    C22.2 15.8 23 15.2 22.9 14.3
    C22.8 13.4 21.9 13.1 21.1 13.5
    C20.2 14 19.2 13.5 18.8 12.5
    L17.9 10
    C17.5 8.8 16.8 8.1 15.8 8.1
    Z
  "/>

  
  <path d="
    M12 17.5
    C9.9 16.3 7.4 15.5 5.5 16.3
    C3.9 17 3.6 18.5 4.6 19.5
    C5.5 20.4 8.1 20.7 10.2 20.2
    C10.8 20.1 11.4 19.8 12 19.5
    C12.6 19.8 13.2 20.1 13.8 20.2
    C15.9 20.7 18.5 20.4 19.4 19.5
    C20.4 18.5 20.1 17 18.5 16.3
    C16.6 15.5 14.1 16.3 12 17.5
    Z
  "/>
</svg>

  ),
  moon: (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="currentColor">
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  ),
  stethoscope: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v6a4 4 0 0 0 8 0V3" />
      <path d="M10 13v1a5 5 0 0 0 10 0v-2" />
      <circle cx="20" cy="10" r="2" />
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
  const scaleRef   = useRef(1);

  const scalerRef     = useRef(null);
  const bandRef       = useRef(null);
  const logoRef       = useRef(null);
  const cardRefs      = useRef({});
  const phoneFrameRef = useRef(null);
  const mobileUIRef   = useRef(null);

  // ── Final phase: cards group + mockup image + flash overlay refs ────────
  const cardsGroupRef  = useRef(null);
  const mockupImageRef = useRef(null);
  const flashRef       = useRef(null);

  // ── Dynamic text / visual nodes for the dark cards ─────────────────────────
  const weightNodeRef     = useRef(null);
  const weightDeltaRef    = useRef(null);
  const healthValueRef    = useRef(null);

  const calorieIntakeRef  = useRef(null);
  const kcalLeftRef       = useRef(null);
  const fibreRef          = useRef(null);
  const workoutBurnRef    = useRef(null);

  // Steps card
  const stepsCountRef     = useRef(null);
  const stepsBarRef       = useRef(null);
  const stepsCalRef       = useRef(null);

  const ringRefs         = useRef([]);
  const weightBarRef     = useRef(null);

  // ── LAYOUT CONSTANTS derived from grid ─────────────────────────────────────
  const stepsY = TOP_PAD + PHOTO_H + ROW_GAP;
  const row2Y  = stepsY + STEPS_H + ROW_GAP;
  const row3Y  = row2Y + ROW2_H + ROW_GAP;

  const GROUP_W      = COL * 2 + COL_GAP;
  const GROUP_OFFSET = (SCR_W - GROUP_W) / 2;

  const leftX  = GROUP_OFFSET;
  const rightX = leftX + COL + COL_GAP;

  const sc = (lx, ly) => ({
    fx: lx - SCR_W / 2,
    fy: ly - SCR_H / 2,
  });

  const F = {
    yoga:  sc(SCR_W / 2,         TOP_PAD + PHOTO_H / 2),
    steps: sc(SCR_W / 2,         stepsY + STEPS_H / 2),
    sleep: sc(leftX + COL / 2,   row2Y + ROW2_H / 2),
    heart: sc(rightX + COL / 2,  row2Y + ROW2_H / 2),
    cycle:   sc(leftX + COL / 2,   row3Y + ROW3_H / 2),
    emotion: sc(rightX + COL / 2,  row3Y + ROW3_H / 2),
  };

  const S_desktop = {
    yoga:  { x: -50, y: -240 },
    steps: { x:  50, y: -130 },
    sleep: { x: -70, y:  -20 },
    heart: { x:  80, y:  120 },
    cycle:   { x: -60, y:  230 },
    emotion: { x:  40, y:  280 },
  };

  const S_mobile = {
    yoga:  { x: -110, y: -310 },
    steps: { x:  180, y: -190 },
    sleep: { x: -285, y:  -60 },
    heart: { x:  240, y:  130 },
    cycle:   { x: -260, y:  220 },
    emotion: { x:  300, y:  290 },
  };

  const FINAL_SIZES = {
    yoga:  { w: 350, h: PHOTO_H },
    steps: { w: 350, h: STEPS_H },
    sleep: { w: 175, h: ROW2_H },
    heart: { w: 175, h: ROW2_H },
    cycle:   { w: 175, h: ROW3_H },
    emotion: { w: 175, h: ROW3_H },
  };

  const SPREAD_SIZES = {
    yoga:  { w: 300, h: 165 },
    steps: { w: 300, h: 84 },
    sleep: { w: 165, h: 160 },
    heart: { w: 165, h: 160 },
    cycle:   { w: 165, h: 170 },
    emotion: { w: 165, h: 170 },
  };

  // ─── GSAP ScrollTrigger scrub ──────────────────────────────────────────────
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const state  = { p: 0, entry: 0 };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const KEYS   = ["yoga", "steps", "sleep", "heart", "cycle", "emotion"];

    // Logo entrance — tied to state.entry. Never touches opacity.
    const LOGO_IN  = 0.5;
    const LOGO_OUT = 0.25;
    const logoEl   = logoRef.current;
    let logoTl     = null;
    let logoPlayed = false;

    const logoFrom = { scale: 0.6, y: 36, filter: "blur(10px)" };
    const resetLogo = () => {
      logoTl?.kill();
      logoTl = null;
      if (logoEl) gsap.set(logoEl, logoFrom);
    };
    const playLogo = () => {
      if (!logoEl) return;
      logoTl?.kill();
      gsap.set(logoEl, logoFrom);
      logoTl = gsap.to(logoEl, {
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "back.out(1.6)",
        clearProps: "filter",
      });
    };
    const updateLogo = () => {
      if (reduce || !logoEl) return;
      if (!logoPlayed && state.entry >= LOGO_IN) {
        logoPlayed = true;
        playLogo();
      } else if (logoPlayed && state.entry < LOGO_OUT) {
        logoPlayed = false;
        resetLogo();
      }
    };

    const computeScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      scaleRef.current = Math.min(vw / (GRID_W + 32), vh / (GRID_H + 32), 1);
    };

    const render = () => {
      updateLogo();
      const easedEntry = ease(state.entry);
      const p          = ease(state.p);
      const vh         = window.innerHeight;

      // ── Logo band: shrinks + fades out as the grid forms ─────────────────
      if (bandRef.current) {
        const bandScale   = lerp(1, 0.35, p);
        const bandOpacity = Math.max(0, lerp(1, 0, Math.min(p * 1.8, 1)));
        bandRef.current.style.transform = `translate(-50%, -50%) scale(${bandScale})`;
        bandRef.current.style.opacity   = bandOpacity;
      }

      // ── Whole stage rises in from below ──────────────────────────────────
      const riseY = (1 - easedEntry) * (vh || 800);
      if (scalerRef.current) {
        scalerRef.current.style.transform =
          `scale(${scaleRef.current}) translateY(${riseY / scaleRef.current}px)`;
      }

      const spreadScale = window.innerWidth / DESIGN_W;
      const S = window.innerWidth < 480 ? S_mobile : S_desktop;

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
        yogaInner.style.borderRadius = `${lerp(20, 14, p)}px`;
      }

      // ── Phone frame fade ──────────────────────────────────────────────────
      if (phoneFrameRef.current) {
        const fadeT = Math.min(
          Math.max((p - PHONE_FADE_START) / (PHONE_FADE_END - PHONE_FADE_START), 0),
          1
        );
        phoneFrameRef.current.style.opacity = fadeT;
      }

      // ── Mobile UI screen fade ─────────────────────────────────────────────
      if (mobileUIRef.current) {
        const uiFadeT = Math.min(
          Math.max((p - MOBILE_UI_FADE_START) / (MOBILE_UI_FADE_END - MOBILE_UI_FADE_START), 0),
          1
        );
        mobileUIRef.current.style.opacity = uiFadeT;
      }

      // ── Cards group: kill pointer events once fully imploded ──────────────
      if (cardsGroupRef.current) {
        const groupDone = p >= IMPLODE_END + KEYS.length * IMPLODE_STAGGER * 0.5;
        cardsGroupRef.current.style.pointerEvents = groupDone ? "none" : "auto";
      }

      // ── Flash ─────────────────────────────────────────────────────────────
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
        const t = rt * rt * (3 - 2 * rt);

        const irisPct = lerp(0, 75, t);
        mockupImageRef.current.style.opacity   = t < 0.02 ? 0 : 1;
        mockupImageRef.current.style.clipPath  = `circle(${irisPct}% at 50% 50%)`;
        mockupImageRef.current.style.transform = `translate(-50%, -50%) scale(${1.08 - 0.08 * t})`;
        mockupImageRef.current.style.filter    = `blur(${(1 - t) * REVEAL_BLUR_PX}px)`;
      }

      // ── Core stat text values ─────────────────────────────────────────────
      const healthVal  = lerp(0, HEALTH_VALUE, p).toFixed(2);

      if (healthValueRef.current)    healthValueRef.current.textContent    = healthVal;

      // ── Calories ──────────────────────────────────────────────────────────
      const consumedRaw   = lerp(0, 1200, p);
      const calorieIntake = fmt(consumedRaw);
      const kcalLeft      = fmt(Math.max(DAILY_GOAL - consumedRaw, 0));
      const fibreG        = Math.round(lerp(0, 25, p));
      const workoutBurn   = fmt(lerp(0, 500, p));

      if (calorieIntakeRef.current) calorieIntakeRef.current.textContent = calorieIntake;
      if (kcalLeftRef.current)      kcalLeftRef.current.textContent      = kcalLeft;
      if (fibreRef.current)         fibreRef.current.textContent         = fibreG;
      if (workoutBurnRef.current)   workoutBurnRef.current.textContent   = workoutBurn;

      // ── Calorie ring: fills as consumed approaches the daily goal ─────────
      const ring = ringRefs.current[0];
      if (ring) {
        const progress = Math.min(consumedRaw / DAILY_GOAL, 1);
        ring.style.strokeDashoffset = `${RING_CIRC * (1 - progress)}`;
      }

      // ── Steps today ───────────────────────────────────────────────────────
      const stepsNow = Math.round(lerp(0, STEPS_TARGET, p));
      const stepsCal = Math.round(stepsNow * 0.04);
      const stepsKm  = (stepsNow * 0.0008).toFixed(1);

      if (stepsCountRef.current) stepsCountRef.current.textContent = stepsNow.toLocaleString();
      if (stepsCalRef.current)   stepsCalRef.current.textContent   = `${stepsCal} cal · ${stepsKm} km`;
      if (stepsBarRef.current) {
        stepsBarRef.current.style.width = `${Math.min(stepsNow / STEPS_GOAL, 1) * 100}%`;
      }

      // ── Weight card ───────────────────────────────────────────────────────
      const weightCur = lerp(WEIGHT_START, WEIGHT_NOW, p);
      const weightPct = ((weightCur - WEIGHT_START) / (WEIGHT_TARGET - WEIGHT_START)) * 100;

      if (weightNodeRef.current)  weightNodeRef.current.textContent  = weightCur.toFixed(1);
      if (weightDeltaRef.current) weightDeltaRef.current.textContent = `+${(weightCur - WEIGHT_START).toFixed(1)} kg from start`;
      if (weightBarRef.current)   weightBarRef.current.style.width   = `${Math.min(Math.max(weightPct, 0), 100)}%`;

    };

    const onResize = () => {
      computeScale();
      render();
    };
    window.addEventListener("resize", onResize);

    if (!reduce) resetLogo();
    computeScale();
    render();

    const ctx = gsap.context(() => {
      gsap.to(state, {
        entry: 1,
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: wrapper,
          start: "top bottom",
          end: "top top",
          scrub: reduce ? true : ENTRY_SCRUB,
        },
      });

      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: reduce ? true : SCROLL_SCRUB,
        },
      });
    }, wrapper);

    return () => {
      window.removeEventListener("resize", onResize);
      logoTl?.kill();
      if (logoEl) gsap.set(logoEl, { clearProps: "all" });
      ctx.revert();
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

        {/* Single phone frame */}
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
              <div ref={logoRef} className="w-full h-full">
                <img src={logo} className="w-full h-full object-contain " alt="FitMom logo" />
              </div>
            </div>

            <div ref={cardsGroupRef} style={{ willChange: "opacity" }}>

              {/* ── DAILY CALORIE TRACKER ── */}
              <CardGPU name="yoga">
                <div
                  ref={el => { cardRefs.current["yoga_inner"] = el; }}
                  className="w-full h-full flex flex-col justify-between gap-2 px-4 py-3 border border-neutral-800 transition-colors duration-300 hover:border-neutral-700 overflow-hidden"
                  style={{
                    borderRadius: 20,
                    background:
                      "radial-gradient(120% 80% at 0% 0%, #5b6349 0%, rgba(138,154,106,0) 55%), linear-gradient(160deg, #1c1c1c 0%, #121212 100%)",
                
                  }}
                >
                  {/* TOP: ring + stats */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 shrink-0">
                      <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                        <circle cx="20" cy="20" r="17" fill="none" stroke="#3a3f2e" strokeWidth="2.5" />
                        <circle
                          ref={el => { ringRefs.current[0] = el; }}
                          cx="20" cy="20" r="17" fill="none" stroke="#8a9a6a" strokeWidth="2.5"
                          strokeDasharray={`${RING_CIRC}`}
                          strokeDashoffset={`${RING_CIRC}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span ref={kcalLeftRef} className="text-lg font-light text-neutral-300 leading-none">
                          {DAILY_GOAL.toLocaleString()}
                        </span>
                        <span className="text-[7px] tracking-widest text-neutral-500 mt-0.5">KCAL LEFT</span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      {[
                        { label: "Consumed", ref: calorieIntakeRef, unit: "" },
                        { label: "Burned",   ref: workoutBurnRef,   unit: "" },
                        { label: "Fibre",    ref: fibreRef,         unit: " g" },
                      ].map((row, i, arr) => (
                        <div
                          key={row.label}
                          className={`flex items-center justify-between py-1 ${i < arr.length - 1 ? "border-b border-neutral-800" : ""}`}
                        >
                          <span className="text-[11px] text-neutral-400">{row.label}</span>
                          <span className="text-sm font-semibold text-white leading-none">
                            <span ref={row.ref}>0</span>{row.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MACROS */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Protein", color: "#F87171", value: 0, goal: 120 },
                      { label: "Carbs",   color: "#FB923C", value: 0, goal: 240 },
                      { label: "Fat",     color: "#60A5FA", value: 0, goal: 53  },
                    ].map(m => (
                      <div key={m.label}>
                        <p className="text-[10px] font-medium leading-tight" style={{ color: m.color }}>{m.label}</p>
                        <p className="text-[10px] font-semibold text-white leading-tight">{m.value} / {m.goal} g</p>
                        <div className="h-[3px] rounded-full bg-neutral-800 mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((m.value / m.goal) * 100, 100)}%`, background: m.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Scan food", icon: <Camera size={13} className="text-neutral-400" /> },
                      { label: "Search",    icon: <Search size={13} className="text-orange-400" /> },
                      { label: "Log meal",  icon: <Plus size={13} className="text-blue-400" /> },
                    ].map(btn => (
                      <button
                        key={btn.label}
                        className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-neutral-800 bg-white/[0.02] text-[10px] text-neutral-200 font-medium transition-colors duration-200 hover:bg-white/[0.06] hover:border-neutral-700"
                      >
                        {btn.icon}
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardGPU>

              {/* ── STEPS TODAY (full width, directly below the calorie card) ── */}
              <CardGPU name="steps">
                <div
                  className="w-full h-full rounded-2xl px-3.5 py-2.5 flex flex-col justify-between overflow-hidden border border-neutral-800 transition-colors duration-300 hover:border-neutral-700"
                   style={{
                    background:
                      "radial-gradient(120% 80% at 0% 0%, #734520 0%, rgba(138,154,106,0) 55%), linear-gradient(160deg, #1c1c1c 0%, #121212 100%)",
                  }}
                >
                  {/* header: icon + title, stats on the right */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconBadge bg="rgba(251,146,60,0.18)" color="#FB923C" size={26}>{Icons.bolt}</IconBadge>
                      <p className="text-[12px] text-neutral-400 font-medium">Steps Today</p>
                    </div>
                    <p ref={stepsCalRef} className="text-[11px] text-orange-400 font-medium">0 cal · 0.0 km</p>
                  </div>

                  {/* count (left) + week dots (right) */}
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span ref={stepsCountRef} className="text-3xl font-medium text-white leading-none">0</span>
                      <span className="text-[11px] text-neutral-500">/ {STEPS_GOAL.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-2.5">
                      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                          <span
                            className={`w-2 h-2 rounded-full ${i === ACTIVE_DAY ? "bg-orange-400" : "bg-neutral-700"}`}
                          />
                          <span className={`text-[8px] leading-none ${i === ACTIVE_DAY ? "text-orange-300" : "text-neutral-500"}`}>
                            {d}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      ref={stepsBarRef}
                      className="h-full rounded-full bg-orange-400"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              </CardGPU>

              {/* ── HEALTH TRACKER ── */}
              <CardGPU name="sleep">
                <div
                  className="w-full h-full rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden border border-neutral-800 transition-colors duration-300 hover:border-neutral-700"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 0% 0%, #5b6349 0%, rgba(138,154,106,0) 55%), linear-gradient(160deg, #1c1c1c 0%, #121212 100%)",
                  }}
                >
                  {/* header: sage badge + title */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "#b9c79a", color: "#1c2415" }}
                    >
                      {Icons.stethoscope}
                    </div>
                    <p className="text-[13px] text-neutral-300 font-medium">Health Tracker</p>
                  </div>

                  {/* value + marker name */}
                  <div>
                    <span ref={healthValueRef} className="text-3xl font-medium text-white leading-none">0.00</span>
                    <p className="text-[11px] text-neutral-500 mt-1">AST (SGOT)</p>
                  </div>

                  {/* outlined action button */}
                  <button
                    className="w-full flex items-center justify-center gap-1 py-2 rounded-xl border text-[11px] font-medium transition-colors duration-200 hover:bg-white/[0.04]"
                    style={{ borderColor: "rgba(138,154,106,0.45)", color: "#8a9a6a" }}
                  >
                    Open trackers
                    <span style={{ color: "#8a9a6a" }}>{Icons.chevron}</span>
                  </button>
                </div>
              </CardGPU>

              {/* ── WEIGHT ── */}
              <CardGPU name="heart">
                <div
                  className="w-full h-full rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden border border-neutral-800 transition-colors duration-300 hover:border-neutral-700"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 0% 0%, #236945 0%, rgba(34,197,94,0) 55%), linear-gradient(160deg, #1c1c1c 0%, #121212 100%)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#21DA7C] text-white flex items-center justify-center shrink-0 p-1">
                      {Icons.scale}
                    </div>
                    <p className="text-[13px] text-neutral-300 font-medium">Weight</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span ref={weightNodeRef} className="text-3xl font-medium text-white leading-none">
                      {WEIGHT_START.toFixed(1)}
                    </span>
                    <span className="text-sm text-neutral-400">kg</span>
                  </div>

                  <p className="text-[11px] text-neutral-500">Target {WEIGHT_TARGET.toFixed(1)} kg</p>

                  <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      ref={weightBarRef}
                      className="h-full rounded-full bg-[#21DA7C]"
                      style={{ width: "0%" }}
                    />
                  </div>

                  <p ref={weightDeltaRef} className="text-[11px] font-semibold text-[#21DA7C]">
                    +0.0 kg from start
                  </p>
                </div>
              </CardGPU>

              {/* ── CYCLE TRACKER ── */}
              <CardGPU name="cycle">
                <div
                  className="w-full h-full rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden border border-neutral-800 transition-colors duration-300 hover:border-neutral-700"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 0% 0%, #49237d 0%, rgba(124,58,237,0) 55%), linear-gradient(160deg, #1c1c1c 0%, #121212 100%)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0">
                      {Icons.cycle}
                    </div>
                    <p className="text-[13px] text-neutral-300 font-medium">Cycle Tracker</p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-medium text-white leading-none">Day {CYCLE_DAY}</span>
                      <span className="text-[12px] text-neutral-400">/ {CYCLE_LENGTH}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-2">Fertile Window</p>
                  </div>

                  <div className="w-full rounded-full bg-violet-600 text-white text-[11px] font-semibold text-center py-2">
                    Next period · {NEXT_PERIOD}
                  </div>
                </div>
              </CardGPU>

              {/* ── EMOTION ── */}
              <CardGPU name="emotion">
                <div
                  className="w-full h-full rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden border border-neutral-800 transition-colors duration-300 hover:border-neutral-700"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 0% 0%, #661e45 0%, rgba(244,114,182,0) 55%), linear-gradient(160deg, #1c1c1c 0%, #121212 100%)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-pink-300 text-pink-950 flex items-center justify-center shrink-0">
                      {Icons.emotion}
                    </div>
                    <p className="text-[13px] text-neutral-300 font-medium">Emotion</p>
                  </div>

                  <div>
                    <p className="text-[26px] font-medium text-white leading-[1.05]">
                      Log<br />Emotion
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-1.5 leading-snug">
                      Tap to log how you feel today
                    </p>
                  </div>

                  <div className="flex justify-between">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <span className={`text-[9px] leading-none ${i === EMOTION_DAY ? "text-pink-300" : "text-neutral-500"}`}>
                          {d}
                        </span>
                        <span
                          className={`h-[3px] w-4 rounded-full ${i === EMOTION_DAY ? "bg-pink-300" : "bg-neutral-700"}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardGPU>

            </div>
            {/* end cardsGroupRef */}

            {/* ── FLASH OVERLAY ── */}
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

            {/* ── FINAL MOCKUP IMAGE ── */}
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