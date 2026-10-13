import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
// Adjust this path to wherever your hero image lives relative to this file.
import hero from "../assets/home/hero.jpg";

/* ──────────────────────────────────────────────────────────────────────────
   FitMom Club loader

   While loading: a light screen with FITMOM CLUB cut out of it. Through the
   letters you see photos that swap rapidly.

   On finish: the swapping photos fade away so the REAL hero section shows
   through the letters, then the
   wordmark scales up until a single letter fills the screen. During the last
   part of the zoom the whole overlay fades out, so the page underneath is
   revealed with no hard cut.

   Usage (App.jsx) – the site must be rendered underneath the loader:
     const [loading, setLoading] = useState(true);
     <>
       <Site />
       {loading && <Loader onComplete={() => setLoading(false)} />}
     </>
   ────────────────────────────────────────────────────────────────────────── */

// Photos that swap behind the letters.
const DEFAULT_IMAGES = [
  "https://res.cloudinary.com/q1vba78b/image/upload/v1791863501/mother_vfrvcr.webp",
  "https://res.cloudinary.com/q1vba78b/image/upload/v1791863505/wellness_e74adj.webp",
  "https://res.cloudinary.com/q1vba78b/image/upload/v1791863503/online_bq5yyz.webp",
  "https://res.cloudinary.com/q1vba78b/image/upload/v1791863505/trainer_bxgvuy.webp",
  "https://res.cloudinary.com/q1vba78b/image/upload/v1791863503/support_xgn6cr.webp",
  "https://res.cloudinary.com/q1vba78b/image/upload/v1791863504/goal_oip8yb.webp",
  "https://res.cloudinary.com/q1vba78b/image/upload/v1791863503/nutrition_rodna3.webp",
  "https://res.cloudinary.com/q1vba78b/image/upload/v1786101450/sleep_s2d5rx.webp",
  "https://res.cloudinary.com/q1vba78b/image/upload/v1786078998/cycle_f6p4lu.webp",
  "https://res.cloudinary.com/q1vba78b/image/upload/v1786105331/activity_fjkxqw.webp",
];

const BG_COLOR = "#f6f5f1";
const SWAP_MS = 180;          // photo changes ~5x per second
const MIN_DURATION = 2600;    // shortest time before the exit starts
const MAX_WAIT = 6000;        // never wait longer than this for photos
const HERO_FADE_MS = 500;     // photo behind letters crossfades to the hero
const HOLD_MS = 350;          // brief rest on the hero before zooming
const ZOOM_MS = 1900;         // wordmark scale-up duration
const FADE_START = 0.82;      // zoom progress where the light screen starts to fade out

// Share of the screen width the wordmark takes up
const widthDesktop = (W) => Math.min(W * 0.62, 760);
const widthMobile = (W) => W * 0.58;

const FONT_FAMILY = "Anton, Impact, 'Arial Narrow Bold', sans-serif";

// Soft start, long glide, soft landing (quint is gentler at the ends than cubic).
const easeInOutQuint = (t) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

let measureCtx = null;
function measure(text, fs) {
  if (!measureCtx) measureCtx = document.createElement("canvas").getContext("2d");
  measureCtx.font = `${fs}px ${FONT_FAMILY}`;
  const m = measureCtx.measureText(text);
  return { w: m.width, a: m.actualBoundingBoxAscent || fs * 0.75 };
}

/* Measure the "T" from real glyph pixels: crossbar thickness and ink width,
   as ratios of the letter's cap height, so the zoom works with any fallback font. */
function measureT() {
  const fallback = { bar: 0.2, width: 0.6 };
  try {
    const size = 300;
    const c = document.createElement("canvas");
    c.width = 400;
    c.height = 400;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.font = `${size}px ${FONT_FAMILY}`;
    ctx.fillStyle = "#000";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("T", 50, 350);
    const { data } = ctx.getImageData(0, 0, 400, 400);
    const solid = (x, y) => data[(y * 400 + x) * 4 + 3] > 128;

    let minX = 400, maxX = -1, minY = 400, maxY = -1;
    for (let y = 0; y < 400; y++) {
      for (let x = 0; x < 400; x++) {
        if (solid(x, y)) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < 0) return fallback;
    const inkW = maxX - minX + 1;
    const inkH = maxY - minY + 1;

    // walk down a column near the left end of the bar (stem not in the way)
    const x = minX + Math.max(2, Math.round(inkW * 0.04));
    let y = minY;
    while (y <= maxY && solid(x, y)) y++;
    const bar = y - minY;
    if (bar < 4) return fallback;
    return { bar: bar / inkH, width: inkW / inkH };
  } catch (_) {
    return fallback;
  }
}

/* Work out font sizes, positions and the zoom target for the current screen. */
function computeLayout(W, H, isMobile) {
  const texts = isMobile ? ["FITMOM", "CLUB"] : ["FITMOM CLUB"];
  const targetW = isMobile ? widthMobile(W) : widthDesktop(W);

  const lines = texts.map((text) => {
    const w100 = measure(text, 100).w;
    const fs = (100 * targetW) / w100;
    const { a } = measure(text, fs);
    return { text, fs, a, x: W / 2 };
  });

  const gap = isMobile ? lines[0].a * 0.14 : 0;
  const total = lines.reduce((s, l) => s + l.a, 0) + gap * (lines.length - 1);
  let y = H / 2 - total / 2;
  lines.forEach((l) => {
    y += l.a;
    l.y = y;
    y += gap;
  });

  // Zoom target: the middle of the T's top bar (the T in "FITMOM", first line).
  const first = lines[0];
  const totalW = measure(first.text, first.fs).w;
  const wT = measure("T", first.fs).w;
  const toT = measure("FIT", first.fs).w; // advance up to and including the T
  const tAsc = measure("T", first.fs).a;   // cap height of the T
  const t = measureT();

  const ox = W / 2 - totalW / 2 + toT - wT / 2;   // horizontal centre of the T
  const barPx = t.bar * tAsc;                     // crossbar thickness in px
  const oy = first.y - tAsc + barPx / 2;          // vertical centre of the bar

  // Scale until the bar alone covers the viewport (height is the limiting side).
  const S = Math.max(H / barPx, W / (t.width * tAsc)) * 1.25;

  return { W, H, lines, ox, oy, S };
}

export default function Loader({ images = DEFAULT_IMAGES, heroImage = hero, onComplete }) {
  const maskId = `fm-mask-${useId().replace(/:/g, "")}`;
  const rootRef = useRef(null);
  const zoomRef = useRef(null);
  const loadedRef = useRef([]);
  const settledRef = useRef(0);
  const layoutRef = useRef(null);
  const unlockRef = useRef(() => {});

  const [idx, setIdx] = useState(0);
  const [, setHasImage] = useState(false);
  const [layout, setLayout] = useState(null);
  const [showHero, setShowHero] = useState(false); // photo behind letters crossfades to hero
  const [gone, setGone] = useState(false);
  const [fading, setFading] = useState(false);     // reduced-motion exit

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  /* lock page scroll while visible, and ALWAYS give it back (on finish or unmount) */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;

    // On reload the browser tries to restore the old scroll position. Turn that
    // off and jump to the top instantly, before the lock, so the page is at the
    // top the moment the loader opens.
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    const unlock = () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
    unlockRef.current = unlock;
    return unlock;
  }, []);

  /* preload every photo, including the hero, so swaps never flicker */
  const all = useRef([...images, heroImage]).current;
  useEffect(() => {
    let cancelled = false;
    all.forEach((src) => {
      const img = new Image();
      const done = (ok) => {
        if (cancelled) return;
        settledRef.current += 1;
        if (ok && src !== heroImage) {
          loadedRef.current.push(src);
          setHasImage(true);
        }
      };
      img.onload = () => done(true);
      img.onerror = () => done(false);
      img.src = src;
    });
    return () => {
      cancelled = true;
    };
  }, [all, heroImage]);

  /* swap the photo behind the letters (stops once the hero photo is showing) */
  useEffect(() => {
    if (showHero) return undefined;
    const t = setInterval(() => setIdx((i) => i + 1), reduced ? 1200 : SWAP_MS);
    return () => clearInterval(t);
  }, [showHero, reduced]);

  /* measure + position the wordmark once the font is ready, and on resize */
  useLayoutEffect(() => {
    let cancelled = false;
    const build = () => {
      const next = computeLayout(window.innerWidth, window.innerHeight, window.innerWidth < 640);
      layoutRef.current = next;
      setLayout(next);
    };
    (async () => {
      try {
        await document.fonts?.load("100px Anton");
        await document.fonts?.ready;
      } catch (_) {
        /* fallback font */
      }
      if (!cancelled) build();
    })();
    window.addEventListener("resize", build);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", build);
    };
  }, []);

  /* run the exit: crossfade to hero → zoom into a letter while fading out → done */
  useEffect(() => {
    if (!layout) return undefined;
    const start = performance.now();
    let raf;
    let started = false;
    const timers = [];

    const finish = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // still at the top when it opens up
      unlockRef.current(); // scroll is released even if the parent keeps us mounted
      setGone(true);
      onComplete?.();
    };

    const exit = () => {
      setShowHero(true);
      timers.push(
        setTimeout(() => {
          if (reduced) {
            setFading(true);
            timers.push(setTimeout(finish, 500));
            return;
          }
          const L = layoutRef.current;
          let t0 = null;
          const frame = (now) => {
            // use the rAF timestamp for BOTH start and current time (no first-frame jump)
            if (t0 === null) t0 = now;
            const p = Math.min(Math.max((now - t0) / ZOOM_MS, 0), 1);
            const s = Math.pow(L.S, easeInOutQuint(p)); // geometric zoom feels even
            zoomRef.current?.setAttribute(
              "transform",
              `translate(${L.ox} ${L.oy}) scale(${s}) translate(${-L.ox} ${-L.oy})`
            );
            // fade the whole overlay over the final stretch so the page melts in
            if (rootRef.current) {
              rootRef.current.style.opacity = String(1 - smoothstep(FADE_START, 1, p));
            }
            if (p < 1) raf = requestAnimationFrame(frame);
            else finish();
          };
          raf = requestAnimationFrame(frame);
        }, Math.max(HOLD_MS, HERO_FADE_MS - 100))
      );
    };

    const wait = (now) => {
      const elapsed = now - start;
      const photosDone = settledRef.current >= all.length;
      if (!started && ((elapsed >= MIN_DURATION && photosDone) || elapsed >= MAX_WAIT)) {
        started = true;
        exit();
        return;
      }
      raf = requestAnimationFrame(wait);
    };
    raf = requestAnimationFrame(wait);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!layout]);

  if (gone) return null;

  const list = loadedRef.current;
  const current = list.length ? list[idx % list.length] : null;

  const swapStyle = current
    ? {
        backgroundImage: `url("${current}")`,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
      }
    : { backgroundImage: "linear-gradient(135deg,#0b4732 0%,#2f8f6b 50%,#f6c1b0 100%)" };

  const layerHints = { willChange: "opacity", transform: "translateZ(0)" };
  // Swapping photos fade away on exit, so the letters open onto the REAL page
  // (your hero section) rather than a copy of the hero image.
  const swapFade = {
    opacity: showHero ? 0 : 1,
    transition: `opacity ${HERO_FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  };

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading FitMom Club"
      className="fixed inset-0 z-[9999]"
      style={{
        opacity: fading ? 0 : 1,
        transition: fading ? "opacity 500ms ease" : "none",
        pointerEvents: "auto",
        willChange: "opacity",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');`}</style>

      {/* photo layer: rapid swaps seen through the letters */}
      <div
        className="absolute inset-0"
        style={{ ...swapStyle, ...layerHints, ...swapFade }}
        aria-hidden="true"
      />

      {/* light screen with the wordmark cut out of it */}
      {layout && (
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${layout.W} ${layout.H}`}
          preserveAspectRatio="none"
        >
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={layout.W} height={layout.H}>
              <rect width={layout.W} height={layout.H} fill="#fff" />
              <g ref={zoomRef}>
                {layout.lines.map((l) => (
                  <text
                    key={l.text}
                    x={l.x}
                    y={l.y}
                    textAnchor="middle"
                    fontFamily={FONT_FAMILY}
                    fontSize={l.fs}
                    fill="#000"
                  >
                    {l.text}
                  </text>
                ))}
              </g>
            </mask>
          </defs>
          <rect width={layout.W} height={layout.H} fill={BG_COLOR} mask={`url(#${maskId})`} />
        </svg>
      )}

      {/* before the font is measured, keep the screen light so nothing flashes */}
      {!layout && <div className="absolute inset-0" style={{ background: BG_COLOR }} />}

      <span className="sr-only">FitMom Club</span>
    </div>
  );
}