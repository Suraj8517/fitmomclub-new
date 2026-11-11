import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../../assets/home/fitmom.png";
import phoneFrame from "../../assets/home/mockup.png";
import mockupImage from "../../assets/home/mockup.png";
import { Camera, Search, Plus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── Data ─────────────────────────────────────────────────────────────────────
const DAILY_GOAL = 2000, STEPS_GOAL = 10400, STEPS_TARGET = 504, ACTIVE_DAY = 1;
const HEALTH_VALUE = 19.0;
const CYCLE_DAY = 1, CYCLE_LENGTH = 28, NEXT_PERIOD = "30 Nov", EMOTION_DAY = 0;
const WEIGHT_START = 42.0, WEIGHT_NOW = 63.8, WEIGHT_TARGET = 70.0;

// ── Timing (snappier than before: shorter track + tighter scrub) ─────────────
const SCROLL_LENGTH_VH = 300;
const SCROLL_SCRUB = 0.55;
const ENTRY_SCRUB  = 0.6;

// ── Grid ─────────────────────────────────────────────────────────────────────
const GRID_W = 580, GRID_H = 780, PAD = 24;
const SCR_W = GRID_W - PAD * 2, SCR_H = GRID_H - PAD * 2;
const COL_GAP = 2, ROW_GAP = 5;
const COL = (SCR_W - COL_GAP - 80) / 2;
const PHOTO_H = 188, STEPS_H = 96, ROW2_H = 168, ROW3_H = 180;
const TOP_PAD = Math.floor(
  (SCR_H - (PHOTO_H + ROW_GAP + STEPS_H + ROW_GAP + ROW2_H + ROW_GAP + ROW3_H)) / 2
);

// ── Phases (0..1 of main scroll) ─────────────────────────────────────────────
const PHONE_FADE = [0.82, 0.98];
const UI_FADE    = [0.5, 0.74];
const IMPLODE_START = 0.80, IMPLODE_END = 0.95, IMPLODE_STAGGER = 0.014;
const IMPLODE_BLUR_PX = 14, IMPLODE_PULL = 0.7;
const FLASH_CENTER = 0.92, FLASH_HALF = 0.05, FLASH_PEAK = 0.5;
const REVEAL = [0.9, 1.0], REVEAL_BLUR_PX = 10;

// ── Easing toolkit ───────────────────────────────────────────────────────────
const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (t) => Math.min(Math.max(t, 0), 1);
const win   = (t, a, b) => clamp((t - a) / (b - a));
const fmt   = (n) => Math.round(n).toLocaleString();
const outCubic = (t) => 1 - Math.pow(1 - t, 3);
const outExpo  = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const inOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const inOutQuart = (t) => (t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2);
const outBack = (t, s = 1.7) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
const swoop = (t) => 0.35 * ease(t) + 0.65 * outBack(clamp(t), 1.1); // quick launch, tiny overshoot, settle
function ease(t) { const c = clamp(t); return c * c * c * (c * (c * 6 - 15) + 10); }

/**
 * Per-card micro entrance (no tilt) + near-identical move timing.
 *  e    = entry window (entry 0..1)
 *  from = where the card starts relative to its spread spot (x, y in px)
 *  s0   = starting scale, blur = starting blur, ez = entry easing
 *  curve = how far the path bows sideways (± fraction of distance, sign = direction)
 *  mEnd = scroll progress where the card lands in the grid
 *        (only ~0.01 apart, so they dock a hair apart from each other)
 */
const CFG = {
  yoga:    { e: [0.00, 0.55], from: { x:   0, y: 240 }, s0: 0.88, blur: 8,  ez: outExpo,  mEnd: 0.600, curve:  0.35 },
  steps:   { e: [0.10, 0.65], from: { x:  90, y: 220 }, s0: 0.92, blur: 4,  ez: outCubic, mEnd: 0.610, curve: -0.30 },
  sleep:   { e: [0.20, 0.75], from: { x: -90, y: 280 }, s0: 0.82, blur: 10, ez: outBack,  mEnd: 0.620, curve:  0.45 },
  heart:   { e: [0.28, 0.83], from: { x:   0, y: 320 }, s0: 0.65, blur: 6,  ez: outBack,  mEnd: 0.630, curve: -0.40 },
  cycle:   { e: [0.36, 0.91], from: { x: -60, y: 300 }, s0: 0.90, blur: 12, ez: outExpo,  mEnd: 0.640, curve:  0.40 },
  emotion: { e: [0.44, 1.00], from: { x:  60, y: 340 }, s0: 0.76, blur: 5,  ez: outCubic, mEnd: 0.650, curve: -0.35 },
};
const KEYS = Object.keys(CFG);

const FINAL_SIZES = {
  yoga: { w: 350, h: PHOTO_H }, steps: { w: 350, h: STEPS_H },
  sleep: { w: 175, h: ROW2_H }, heart: { w: 175, h: ROW2_H },
  cycle: { w: 175, h: ROW3_H }, emotion: { w: 175, h: ROW3_H },
};
const SPREAD_SIZES = {
  yoga: { w: 300, h: 165 }, steps: { w: 300, h: 84 },
  sleep: { w: 165, h: 160 }, heart: { w: 165, h: 160 },
  cycle: { w: 165, h: 170 }, emotion: { w: 165, h: 170 },
};
const S_DESKTOP = {
  yoga: { x: -50, y: -240 }, steps: { x: 50, y: -130 }, sleep: { x: -70, y: -20 },
  heart: { x: 80, y: 120 }, cycle: { x: -60, y: 230 }, emotion: { x: 40, y: 280 },
};
const S_MOBILE = {
  yoga: { x: -110, y: -310 }, steps: { x: 180, y: -190 }, sleep: { x: -285, y: -60 },
  heart: { x: 240, y: 130 }, cycle: { x: -260, y: 220 }, emotion: { x: 300, y: 290 },
};
const DESIGN_W = 390;

// Final grid centres
const stepsY = TOP_PAD + PHOTO_H + ROW_GAP;
const row2Y = stepsY + STEPS_H + ROW_GAP;
const row3Y = row2Y + ROW2_H + ROW_GAP;
const GROUP_W = COL * 2 + COL_GAP;
const leftX = (SCR_W - GROUP_W) / 2;
const rightX = leftX + COL + COL_GAP;
const sc = (lx, ly) => ({ fx: lx - SCR_W / 2, fy: ly - SCR_H / 2 });
const CYCLE_DX   = 20;
const EMOTION_DX = -20;
const F = {
  yoga: sc(SCR_W / 2, TOP_PAD + PHOTO_H / 2),
  steps: sc(SCR_W / 2, stepsY + STEPS_H / 2),
  sleep: sc(leftX + COL / 2+ CYCLE_DX, row2Y + ROW2_H / 2),
  heart: sc(rightX + COL / 2+ EMOTION_DX, row2Y + ROW2_H / 2),
  cycle: sc(leftX + COL / 2+ CYCLE_DX, row3Y + ROW3_H / 2),
  emotion: sc(rightX + COL / 2+ EMOTION_DX, row3Y + ROW3_H / 2),
};

const RING_CIRC = 2 * Math.PI * 17;

// ── Icons ────────────────────────────────────────────────────────────────────
function IconBadge({ bg, color, children, size = 28 }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center rounded-full"
         style={{ width: size, height: size, background: bg, color }}>
      {children}
    </div>
  );
}

const Icons = {
  scale: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <rect width="512" height="512" rx="96" fill="#000000" />
      <path d="M80 138 C170 34 342 34 432 138 L354 236 H158 Z" fill="#21DA7C" />
      <path d="M256 217 L335 98 L308 217 Z" fill="#000000" />
    </svg>
  ),
  cycle: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#ffffff"
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 48 C17 38 19 20 32 8 C45 20 47 38 32 48Z" />
      <path d="M32 48 C15 44 7 32 9 22 C22 25 30 35 32 48Z" />
      <path d="M32 48 C49 44 57 32 55 22 C42 25 34 35 32 48Z" />
    </svg>
  ),
  emotion: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="4.5" r="2.1" />
      <path d="M8.2 8.1C7.2 8.1 6.5 8.8 6.1 10L5.2 12.5C4.8 13.5 3.8 14 2.9 13.5C2.1 13.1 1.2 13.4 1.1 14.3C1 15.2 1.8 15.8 2.8 16C5.1 16.4 6.7 15.2 7.7 13.4L8.1 12.6L8.1 14.9C8.1 15.9 8.7 16.7 9.5 17.2L12 18.2L14.5 17.2C15.3 16.7 15.9 15.9 15.9 14.9L15.9 12.6L16.3 13.4C17.3 15.2 18.9 16.4 21.2 16C22.2 15.8 23 15.2 22.9 14.3C22.8 13.4 21.9 13.1 21.1 13.5C20.2 14 19.2 13.5 18.8 12.5L17.9 10C17.5 8.8 16.8 8.1 15.8 8.1Z" />
      <path d="M12 17.5C9.9 16.3 7.4 15.5 5.5 16.3C3.9 17 3.6 18.5 4.6 19.5C5.5 20.4 8.1 20.7 10.2 20.2C10.8 20.1 11.4 19.8 12 19.5C12.6 19.8 13.2 20.1 13.8 20.2C15.9 20.7 18.5 20.4 19.4 19.5C20.4 18.5 20.1 17 18.5 16.3C16.6 15.5 14.1 16.3 12 17.5Z" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></svg>
  ),
  stethoscope: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v6a4 4 0 0 0 8 0V3" /><path d="M10 13v1a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="10" r="2" />
    </svg>
  ),
  chevron: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// Defined outside the component so it never remounts.
const gpuStyle = {
  willChange: "transform, opacity, filter",
  backfaceVisibility: "hidden",
  contain: "layout paint style",
  opacity: 0,
};
function CardGPU({ name, reg, children }) {
  const fs = FINAL_SIZES[name];
  return (
    <div ref={(el) => { reg.current[name] = el; }} className="absolute overflow-hidden"
         style={{ width: fs.w, height: fs.h, ...gpuStyle }}>
      <div style={{ width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
}

export default function AppInterfaceSection() {
  const wrapperRef = useRef(null);
  const scaleRef = useRef(1);
  const scalerRef = useRef(null);
  const bandRef = useRef(null);
  const logoRef = useRef(null);
  const cardRefs = useRef({});
  const phoneFrameRef = useRef(null);
  const mobileUIRef = useRef(null);
  const cardsGroupRef = useRef(null);
  const mockupImageRef = useRef(null);
  const flashRef = useRef(null);

  const weightNodeRef = useRef(null), weightDeltaRef = useRef(null), healthValueRef = useRef(null);
  const calorieIntakeRef = useRef(null), kcalLeftRef = useRef(null), fibreRef = useRef(null), workoutBurnRef = useRef(null);
  const stepsCountRef = useRef(null), stepsBarRef = useRef(null), stepsCalRef = useRef(null);
  const ringRefs = useRef([]), weightBarRef = useRef(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const state = { p: 0, entry: 0 };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Logo entrance
    const LOGO_IN = 0.35, LOGO_OUT = 0.15;
    const logoEl = logoRef.current;
    let logoTl = null, logoPlayed = false;
    const logoFrom = { scale: 0.55, y: 50, rotate: -18, filter: "blur(10px)" };
    const resetLogo = () => { logoTl?.kill(); logoTl = null; if (logoEl) gsap.set(logoEl, logoFrom); };
    const playLogo = () => {
      if (!logoEl) return;
      logoTl?.kill();
      gsap.set(logoEl, logoFrom);
      logoTl = gsap.to(logoEl, {
        scale: 1, y: 0, rotate: 0, filter: "blur(0px)",
        duration: 1.1, ease: "back.out(1.5)", clearProps: "filter",
      });
    };
    const updateLogo = () => {
      if (reduce || !logoEl) return;
      if (!logoPlayed && state.entry >= LOGO_IN) { logoPlayed = true; playLogo(); }
      else if (logoPlayed && state.entry < LOGO_OUT) { logoPlayed = false; resetLogo(); }
    };

    const computeScale = () => {
      scaleRef.current = Math.min(window.innerWidth / (GRID_W + 32), window.innerHeight / (GRID_H + 32), 1);
    };

    const render = () => {
      updateLogo();
      const p = state.p;
      const entry = state.entry;
      const vw = window.innerWidth;

      // Stage only scales now — each card handles its own entrance.
      if (scalerRef.current) scalerRef.current.style.transform = `scale(${scaleRef.current})`;

      // Logo band: fades in with entry, then shrinks + fades as the grid forms
      if (bandRef.current) {
        const out = outCubic(win(p, 0, 0.45));
        const inn = outCubic(win(entry, 0.1, 0.5));
        bandRef.current.style.transform = `translate(-50%, -50%) scale(${lerp(1, 0.3, out)}) rotate(${out * 12}deg)`;
        bandRef.current.style.opacity = Math.max(0, inn * (1 - out * 1.6));
      }

      const spreadScale = vw / DESIGN_W;
      const S = vw < 480 ? S_MOBILE : S_DESKTOP;
      
      for (let i = 0; i < KEYS.length; i++) {
        const key = KEYS[i];
        const node = cardRefs.current[key];
        if (!node) continue;
        const c = CFG[key];
        const fs = FINAL_SIZES[key], ss = SPREAD_SIZES[key];

        // 1) Micro entrance: each card has its own direction, scale, blur, easing
        const et = c.ez(win(entry, c.e[0], c.e[1]));
        const eo = outCubic(win(entry, c.e[0], c.e[0] + (c.e[1] - c.e[0]) * 0.5));
        const eIn = 1 - et;
        const eScale = lerp(c.s0, 1, et);
        const eBlur = (1 - eo) * c.blur;

        // 2) Spread → grid along a curved (quadratic bezier) path, faster than before
        const mt = swoop(win(p, 0, c.mEnd));
        const x0 = S[key].x * spreadScale, y0 = S[key].y;
        const x2 = F[key].fx,              y2 = F[key].fy;
        const dx = x2 - x0, dy = y2 - y0;
        const dist = Math.hypot(dx, dy) || 1;
        const bow = Math.max(-260, Math.min(260, dist * c.curve));
        const cx = (x0 + x2) / 2 + (-dy / dist) * bow;
        const cy = (y0 + y2) / 2 + ( dx / dist) * bow;
        const u = 1 - mt;
        let x = u * u * x0 + 2 * u * mt * cx + mt * mt * x2 + eIn * c.from.x;
        let y = u * u * y0 + 2 * u * mt * cy + mt * mt * y2 + eIn * c.from.y;

        const st = ease(win(p, 0, c.mEnd * 0.88));          // size settles a touch before position
        const lift = 1 + Math.sin(Math.PI * clamp(win(p, 0, c.mEnd))) * 0.05; // gentle mid-flight lift
        const scaleX = (lerp(ss.w, fs.w, st) / fs.w) * lift;
        const scaleY = (lerp(ss.h, fs.h, st) / fs.h) * lift;

        // 3) Implode: staggered, blurred pull-to-centre
        const start = IMPLODE_START + i * IMPLODE_STAGGER;
        const end = IMPLODE_END + i * IMPLODE_STAGGER * 0.5;
        const it = ease(win(p, start, end));
        x = lerp(x, 0, it * IMPLODE_PULL);
        y = lerp(y, 0, it * IMPLODE_PULL);
        const iScale = lerp(1, 0.4, it);

        node.style.transform =
          `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0) scale(${scaleX * iScale * eScale}, ${scaleY * iScale * eScale})`;
        node.style.opacity = eo * (1 - it);
        const blur = eBlur + it * IMPLODE_BLUR_PX;
        node.style.filter = blur > 0.1 ? `blur(${blur}px)` : "none";
      }

      const yogaInner = cardRefs.current["yoga_inner"];
      if (yogaInner) yogaInner.style.borderRadius = `${lerp(24, 14, outCubic(win(p, 0, 0.5)))}px`;

      if (phoneFrameRef.current) phoneFrameRef.current.style.opacity = win(p, PHONE_FADE[0], PHONE_FADE[1]);
      if (mobileUIRef.current) mobileUIRef.current.style.opacity = win(p, UI_FADE[0], UI_FADE[1]);

      if (cardsGroupRef.current) {
        const done = p >= IMPLODE_END + KEYS.length * IMPLODE_STAGGER * 0.5;
        cardsGroupRef.current.style.pointerEvents = done ? "none" : "auto";
      }

      if (flashRef.current) {
        const t = Math.max(0, 1 - Math.abs(p - FLASH_CENTER) / FLASH_HALF);
        flashRef.current.style.opacity = t * t * FLASH_PEAK;
      }

      if (mockupImageRef.current) {
        const rt = win(p, REVEAL[0], REVEAL[1]);
        const t = outExpo(rt);
        mockupImageRef.current.style.opacity = rt < 0.02 ? 0 : 1;
        mockupImageRef.current.style.clipPath = `circle(${lerp(0, 75, t)}% at 50% 50%)`;
        mockupImageRef.current.style.transform = `translate(-50%, -50%) scale(${1.1 - 0.1 * t})`;
        mockupImageRef.current.style.filter = `blur(${(1 - t) * REVEAL_BLUR_PX}px)`;
      }

      // ── Count-ups: fast ease-out so numbers land early, not at the very end ──
      const v = outCubic(win(p, 0.04, 0.7));

      if (healthValueRef.current) healthValueRef.current.textContent = lerp(0, HEALTH_VALUE, v).toFixed(2);

      const consumedRaw = lerp(0, 1200, v);
      if (calorieIntakeRef.current) calorieIntakeRef.current.textContent = fmt(consumedRaw);
      if (kcalLeftRef.current) kcalLeftRef.current.textContent = fmt(Math.max(DAILY_GOAL - consumedRaw, 0));
      if (fibreRef.current) fibreRef.current.textContent = Math.round(lerp(0, 25, v));
      if (workoutBurnRef.current) workoutBurnRef.current.textContent = fmt(lerp(0, 500, v));

      const ring = ringRefs.current[0];
      if (ring) ring.style.strokeDashoffset = `${RING_CIRC * (1 - Math.min(consumedRaw / DAILY_GOAL, 1))}`;

      const stepsNow = Math.round(lerp(0, STEPS_TARGET, v));
      if (stepsCountRef.current) stepsCountRef.current.textContent = stepsNow.toLocaleString();
      if (stepsCalRef.current)
        stepsCalRef.current.textContent = `${Math.round(stepsNow * 0.04)} cal · ${(stepsNow * 0.0008).toFixed(1)} km`;
      if (stepsBarRef.current) stepsBarRef.current.style.width = `${Math.min(stepsNow / STEPS_GOAL, 1) * 100}%`;

      const weightCur = lerp(WEIGHT_START, WEIGHT_NOW, v);
      const weightPct = ((weightCur - WEIGHT_START) / (WEIGHT_TARGET - WEIGHT_START)) * 100;
      if (weightNodeRef.current) weightNodeRef.current.textContent = weightCur.toFixed(1);
      if (weightDeltaRef.current) weightDeltaRef.current.textContent = `+${(weightCur - WEIGHT_START).toFixed(1)} kg from start`;
      if (weightBarRef.current) weightBarRef.current.style.width = `${clamp(weightPct / 100) * 100}%`;
    };

    const onResize = () => { computeScale(); render(); };
    window.addEventListener("resize", onResize);

    if (!reduce) resetLogo();
    computeScale();
    render();

    const ctx = gsap.context(() => {
      gsap.to(state, {
        entry: 1, ease: "none", onUpdate: render,
        scrollTrigger: { trigger: wrapper, start: "top 55%", end: "top top", scrub: reduce ? true : ENTRY_SCRUB },
      });
      gsap.to(state, {
        p: 1, ease: "none", onUpdate: render,
        scrollTrigger: { trigger: wrapper, start: "top top", end: "bottom bottom", scrub: reduce ? true : SCROLL_SCRUB },
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

  const cardBase = "w-full h-full rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden border border-neutral-800 transition-colors duration-300 hover:border-neutral-700";
  const bg = (c) => ({ background: `radial-gradient(120% 80% at 0% 0%, ${c} 0%, rgba(0,0,0,0) 55%), linear-gradient(160deg, #1c1c1c 0%, #121212 100%)` });

  return (
    <section ref={wrapperRef} className="relative bg-[#F6F5F1]" style={{ height: `${SCROLL_LENGTH_VH}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        <img ref={phoneFrameRef} src={phoneFrame} alt="" aria-hidden="true"
             className="pointer-events-none select-none absolute z-0 h-[60vh] lg:h-[90vh]"
             style={{ width: "auto", opacity: 0 }} />

        <div ref={scalerRef} className="relative z-20" style={{ transformOrigin: "center center", willChange: "transform" }}>
          <div className="relative" style={{ width: 0, height: 0 }}>

            {/* LOGO */}
            <div ref={bandRef} className="absolute pointer-events-none w-[150px] mt:w-[220px] mt:h-[300px]"
                 style={{ willChange: "transform, opacity", backfaceVisibility: "hidden", opacity: 0 }}>
              <div ref={logoRef} className="w-full h-full">
                <img src={logo} className="w-full h-full object-contain" alt="FitMom logo" />
              </div>
            </div>

            <div ref={cardsGroupRef}>

              {/* CALORIES */}
              <CardGPU name="yoga" reg={cardRefs}>
                <div ref={(el) => { cardRefs.current["yoga_inner"] = el; }}
                     className="w-full h-full flex flex-col justify-between gap-2 px-4 py-3 border border-neutral-800 transition-colors duration-300 hover:border-neutral-700 overflow-hidden"
                     style={{ borderRadius: 24, ...bg("#5b6349") }}>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 shrink-0">
                      <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                        <circle cx="20" cy="20" r="17" fill="none" stroke="#3a3f2e" strokeWidth="2.5" />
                        <circle ref={(el) => { ringRefs.current[0] = el; }} cx="20" cy="20" r="17" fill="none"
                                stroke="#8a9a6a" strokeWidth="2.5" strokeDasharray={`${RING_CIRC}`}
                                strokeDashoffset={`${RING_CIRC}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span ref={kcalLeftRef} className="text-lg font-light text-neutral-300 leading-none">{DAILY_GOAL.toLocaleString()}</span>
                        <span className="text-[7px] tracking-widest text-neutral-500 mt-0.5">KCAL LEFT</span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      {[
                        { label: "Consumed", ref: calorieIntakeRef, unit: "" },
                        { label: "Burned", ref: workoutBurnRef, unit: "" },
                        { label: "Fibre", ref: fibreRef, unit: " g" },
                      ].map((row, i, arr) => (
                        <div key={row.label} className={`flex items-center justify-between py-1 ${i < arr.length - 1 ? "border-b border-neutral-800" : ""}`}>
                          <span className="text-[11px] text-neutral-400">{row.label}</span>
                          <span className="text-sm font-semibold text-white leading-none"><span ref={row.ref}>0</span>{row.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Protein", color: "#F87171", value: 0, goal: 120 },
                      { label: "Carbs", color: "#FB923C", value: 0, goal: 240 },
                      { label: "Fat", color: "#60A5FA", value: 0, goal: 53 },
                    ].map((m) => (
                      <div key={m.label}>
                        <p className="text-[10px] font-medium leading-tight" style={{ color: m.color }}>{m.label}</p>
                        <p className="text-[10px] font-semibold text-white leading-tight">{m.value} / {m.goal} g</p>
                        <div className="h-[3px] rounded-full bg-neutral-800 mt-1 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min((m.value / m.goal) * 100, 100)}%`, background: m.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Scan food", icon: <Camera size={13} className="text-neutral-400" /> },
                      { label: "Search", icon: <Search size={13} className="text-orange-400" /> },
                      { label: "Log meal", icon: <Plus size={13} className="text-blue-400" /> },
                    ].map((btn) => (
                      <button key={btn.label} className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-neutral-800 bg-white/[0.02] text-[10px] text-neutral-200 font-medium transition-colors duration-200 hover:bg-white/[0.06] hover:border-neutral-700">
                        {btn.icon}{btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardGPU>

              {/* STEPS */}
              <CardGPU name="steps" reg={cardRefs}>
                <div className="w-full h-full rounded-2xl px-3.5 py-2.5 flex flex-col justify-between overflow-hidden border border-neutral-800 transition-colors duration-300 hover:border-neutral-700"
                     style={bg("#734520")}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconBadge bg="rgba(251,146,60,0.18)" color="#FB923C" size={26}>{Icons.bolt}</IconBadge>
                      <p className="text-[12px] text-neutral-400 font-medium">Steps Today</p>
                    </div>
                    <p ref={stepsCalRef} className="text-[11px] text-orange-400 font-medium">0 cal · 0.0 km</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span ref={stepsCountRef} className="text-3xl font-medium text-white leading-none">0</span>
                      <span className="text-[11px] text-neutral-500">/ {STEPS_GOAL.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2.5">
                      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                          <span className={`w-2 h-2 rounded-full ${i === ACTIVE_DAY ? "bg-orange-400" : "bg-neutral-700"}`} />
                          <span className={`text-[8px] leading-none ${i === ACTIVE_DAY ? "text-orange-300" : "text-neutral-500"}`}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div ref={stepsBarRef} className="h-full rounded-full bg-orange-400" style={{ width: "0%" }} />
                  </div>
                </div>
              </CardGPU>

              {/* HEALTH */}
              <CardGPU name="sleep" reg={cardRefs}>
                <div className={cardBase} style={bg("#5b6349")}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#b9c79a", color: "#1c2415" }}>{Icons.stethoscope}</div>
                    <p className="text-[13px] text-neutral-300 font-medium">Health Tracker</p>
                  </div>
                  <div>
                    <span ref={healthValueRef} className="text-3xl font-medium text-white leading-none">0.00</span>
                    <p className="text-[11px] text-neutral-500 mt-1">AST (SGOT)</p>
                  </div>
                  <button className="w-full flex items-center justify-center gap-1 py-2 rounded-xl border text-[11px] font-medium transition-colors duration-200 hover:bg-white/[0.04]"
                          style={{ borderColor: "rgba(138,154,106,0.45)", color: "#8a9a6a" }}>
                    Open trackers<span style={{ color: "#8a9a6a" }}>{Icons.chevron}</span>
                  </button>
                </div>
              </CardGPU>

              {/* WEIGHT */}
              <CardGPU name="heart" reg={cardRefs}>
                <div className={cardBase} style={bg("#236945")}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#21DA7C] text-white flex items-center justify-center shrink-0 p-1">{Icons.scale}</div>
                    <p className="text-[13px] text-neutral-300 font-medium">Weight</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span ref={weightNodeRef} className="text-3xl font-medium text-white leading-none">{WEIGHT_START.toFixed(1)}</span>
                    <span className="text-sm text-neutral-400">kg</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">Target {WEIGHT_TARGET.toFixed(1)} kg</p>
                  <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div ref={weightBarRef} className="h-full rounded-full bg-[#21DA7C]" style={{ width: "0%" }} />
                  </div>
                  <p ref={weightDeltaRef} className="text-[11px] font-semibold text-[#21DA7C]">+0.0 kg from start</p>
                </div>
              </CardGPU>

              {/* CYCLE */}
              <CardGPU name="cycle" reg={cardRefs}>
                <div className={cardBase} style={bg("#49237d")}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0">{Icons.cycle}</div>
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

              {/* EMOTION */}
              <CardGPU name="emotion" reg={cardRefs}>
                <div className={cardBase} style={bg("#661e45")}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-pink-300 text-pink-950 flex items-center justify-center shrink-0">{Icons.emotion}</div>
                    <p className="text-[13px] text-neutral-300 font-medium">Emotion</p>
                  </div>
                  <div>
                    <p className="text-[26px] font-medium text-white leading-[1.05]">Log<br />Emotion</p>
                    <p className="text-[10px] text-neutral-500 mt-1.5 leading-snug">Tap to log how you feel today</p>
                  </div>
                  <div className="flex justify-between">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <span className={`text-[9px] leading-none ${i === EMOTION_DAY ? "text-pink-300" : "text-neutral-500"}`}>{d}</span>
                        <span className={`h-[3px] w-4 rounded-full ${i === EMOTION_DAY ? "bg-pink-300" : "bg-neutral-700"}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardGPU>
            </div>

            {/* FLASH */}
            <div ref={flashRef} aria-hidden="true" className="pointer-events-none absolute z-20"
                 style={{ left: 0, top: 0, width: GRID_W, height: GRID_H, transform: "translate(-50%, -50%)",
                          background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)",
                          opacity: 0, willChange: "opacity" }} />

            {/* FINAL MOCKUP */}
            <img ref={mockupImageRef} src={mockupImage} alt="" aria-hidden="true"
                 className="pointer-events-none select-none absolute z-30"
                 style={{ left: 0, top: 0, transform: "translate(-50%, -50%) scale(1.1)", width: GRID_W, height: GRID_H,
                          objectFit: "contain", opacity: 0, clipPath: "circle(0% at 50% 50%)",
                          filter: `blur(${REVEAL_BLUR_PX}px)`,
                          willChange: "opacity, clip-path, filter, transform" }} />
          </div>
        </div>
      </div>
    </section>
  );
}