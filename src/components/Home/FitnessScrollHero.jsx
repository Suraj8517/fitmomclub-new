import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { Dumbbell, Zap, Trophy, Flame, HeartPulse, Timer } from 'lucide-react';
import img1 from "../../assets/home/text reveal/img4.webp"
import img2 from "../../assets/home/text reveal/img5.webp"

/* ------------------------------------------------------------------ */
/*  helpers                                                             */
/* ------------------------------------------------------------------ */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(t) {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

/* ------------------------------------------------------------------ */
/*  useScrollProgress — tracks 0→1 progress as a tall section scrolls  */
/*  through the viewport. IMPORTANT: this no longer calls setState.    */
/*  Instead it invokes a callback directly with the raw progress value */
/*  so the caller can mutate DOM nodes via refs, completely skipping   */
/*  React's render/reconciliation cycle on every scroll frame. That's  */
/*  the single biggest lever for silky, non-janky scroll animation —   */
/*  we're only ever touching `transform`/`opacity` (compositor-only    */
/*  properties), never triggering layout or a component re-render.     */
/* ------------------------------------------------------------------ */
function useScrollProgress(onProgress) {
  const ref = useRef(null);
  const rafId = useRef(null);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    let ticking = false;

    const compute = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = rect.height - vh;
      let progress;
      if (scrollable <= 0) {
        progress = rect.top <= 0 ? 1 : 0;
      } else {
        progress = clamp((0 - rect.top) / scrollable, 0, 1);
      }
      onProgressRef.current(progress);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId.current = requestAnimationFrame(compute);
      }
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return ref;
}

/* ------------------------------------------------------------------ */
/*  useIsMobile — one resize-driven boolean, NOT part of the scroll    */
/*  hot path. Cheap, infrequent, safe to drive a re-render.            */
/* ------------------------------------------------------------------ */
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);
  return isMobile;
}

/* ------------------------------------------------------------------ */
/*  Color system                                                        */
/*  Cool jade/emerald grounds the brand (strength, vitality); warm       */
/*  ember accents the icons and signature moments (energy, heat of a     */
/*  workout). The two paired sections deliberately swap temperature —    */
/*  a dark, spotlit jade stage for the headline, a soft warm-cream        */
/*  page for the reading moment — so the hand-off itself feels like      */
/*  the story shifting register from "declaration" to "conversation".    */
/* ------------------------------------------------------------------ */
const INK = '#0A2E27';        // deep jade-black, used for body copy on light bg
const CREAM_TEXT = '#FBF3E7'; // warm off-white, used for headline on dark bg
const EMBER_A = '#BFF4EB';
const EMBER_B = '#4DB8A5';
const EMBER_C = '#136F63';

const FIRST_SECTION_BG =
  'radial-gradient(circle at 50% 18%, #1E9E78 0%, #0C6E52 42%, #06301F 100%)';
const SECOND_SECTION_BG =
  'radial-gradient(circle at 50% 50%, #dbfce6 0%, #dbfce6 10%, #F6F5F1 62%)';


const FloatingIcon = forwardRef(function FloatingIcon(
  { icon: Icon, style, size = 96, blur = 0, duration = 6, rotate = -8 },
  ref
) {
  return (
    <div
      ref={ref}
      className="absolute pointer-events-none select-none will-change-transform"
      style={{
        ...style,
        transform: 'translate3d(0,0,0) rotate(0deg)',
        backfaceVisibility: 'hidden',
        filter: blur ? `blur(${blur}px)` : 'none',
        zIndex: 5,
      }}
    >
      <div
        className="fsl-float"
        style={{
          '--dur': `${duration}s`,
          '--rot-start': `${rotate}deg`,
          '--rot-mid': `${rotate + 14}deg`,
          '--drift-x': `${8 + (size % 20)}px`,
          '--drift-y': `${-12 - (size % 15)}px`,
        }}
      >
        <div
          className="flex items-center justify-center shadow-2xl"
          style={{
            width: size,
            height: size,
            borderRadius: '38%',
            transform: `rotate(${rotate}deg)`,
            background: `linear-gradient(135deg, ${EMBER_A} 0%, ${EMBER_B} 48%, ${EMBER_C} 100%)`,
            boxShadow: '0 20px 40px -10px rgba(255,106,61,0.5)',
          }}
        >
          <Icon
            className="text-white/95 drop-shadow-md"
            style={{ width: size * 0.46, height: size * 0.46 }}
            strokeWidth={2.2}
          />
        </div>
      </div>
    </div>
  );
});

/* Desktop layout — full cast, spread wide. */
const ICONS_DESKTOP = [
  { Icon: Flame, size: 130, blur: 3, duration: 7, top: '36%', left: '1%', rotate: -14, depth: 1.55, spin: 90 },
  { Icon: Zap, size: 56, blur: 0, duration: 5, top: '46%', left: '28%', rotate: 8, depth: 1.3, spin: -160 },
  { Icon: Dumbbell, size: 96, blur: 1.5, duration: 6.5, top: '30%', left: '71%', rotate: -10, depth: 0.9, spin: 130 },
  { Icon: Trophy, size: 150, blur: 4, duration: 8, top: '20%', left: '92%', rotate: 12, depth: 0.45, spin: -70 },
  { Icon: HeartPulse, size: 160, blur: 4, duration: 7.5, top: '68%', left: '13%', rotate: -18, depth: 0.8, spin: 110 },
  { Icon: Timer, size: 130, blur: 3, duration: 6, top: '65%', left: '84%', rotate: 16, depth: 0.65, spin: -140 },
];

/* Mobile layout — same cast, same choreography (parallax depth / spin /
   float duration all match), just smaller and pulled in from the edges
   so nothing clips off a narrow viewport. Same design, tuned scale. */
const ICONS_MOBILE = [
  { Icon: Flame, size: 66, blur: 2, duration: 7, top: '25%', left: '4%', rotate: -14, depth: 0.95, spin: 90 },
  { Icon: Zap, size: 34, blur: 0, duration: 5, top: '44%', left: '20%', rotate: 8, depth: 1.3, spin: -160 },
  { Icon: Dumbbell, size: 52, blur: 1, duration: 6.5, top: '28%', left: '68%', rotate: -10, depth: 0.9, spin: 130 },
  { Icon: Trophy, size: 76, blur: 2.5, duration: 8, top: '17%', left: '78%', rotate: 12, depth: 0.45, spin: -70 },
  { Icon: HeartPulse, size: 82, blur: 2.5, duration: 7.5, top: '70%', left: '10%', rotate: -18, depth: 0.4, spin: 110 },
  { Icon: Timer, size: 66, blur: 2, duration: 6, top: '66%', left: '74%', rotate: 16, depth: 0.65, spin: -140 },
];

const LINES = ['Your Fitness','Journey,', 'Anywhere', 'Anytime'];

const TOKENS = [
  { t: 'Personalised' }, { t: 'workouts,' },
  { img: img1, alt: 'progress tracking' },{ t: 'progress,' },{ t: 'tracking,' },
  { img: img2, alt: 'Mom and baby' },
  { t: 'and' }, { t: 'expert' }, { t: 'support' }, { t: 'all' }, { t: 'in' }, { t: 'one' }, { t: 'app' }
];

const TOTAL_WORDS = TOKENS.filter((tok) => tok.t).length;
const TOTAL_IMAGES = TOKENS.filter((tok) => tok.img).length;

/* Max inline width an image token expands to, in em, once fully revealed. */
const IMAGE_MAX_WIDTH_EM = 2.6;
const IMAGE_MAX_MARGIN_EM = 0.05;

function RevealParagraph({ wordRefs, imageWrapRefs, imageRefs, isMobile }) {
  let wordIdx = -1;
  let imgIdx = -1;

  return (
    <p
      className="max-w-4xl text-center leading-tight px-2"
      style={{
        fontSize: isMobile ? 'clamp(2.3rem, 6.4vw, 2.9rem)' : 'clamp(1.75rem, 3.4vw, 2.75rem)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 800,
      }}
    >
      {TOKENS.map((tok, i) => {
        if (tok.img) {
          imgIdx += 1;
          const capturedIdx = imgIdx;
          return (
            <span
              key={i}
              ref={(el) => (imageWrapRefs.current[capturedIdx] = el)}
              className="fsl-reveal-img-wrap inline-block h-[1.2em] -translate-y-1 align-middle overflow-hidden"
              style={{ width: '0px', marginLeft: '0px', marginRight: '0px' }}
            >
              <img
                ref={(el) => (imageRefs.current[capturedIdx] = el)}
                src={tok.img}
                alt={tok.alt}
                className="fsl-reveal-img h-[1.2em] w-[2.6em] rounded-2xl object-cover object-top"
                style={{
                  opacity: 0,
                  transform: 'scale(0.8)',
                  clipPath: 'inset(0 100% 0 0)',
                }}
              />
            </span>
          );
        }

        wordIdx += 1;
        const capturedIdx = wordIdx;
        return (
          <span
            key={i}
            ref={(el) => (wordRefs.current[capturedIdx] = el)}
            className="fsl-reveal-word"
            style={{
              opacity: 0,
              filter: 'blur(6px)',
              transform: 'translateY(0.35em)',
              color: INK,
              marginRight: '0.32em',
            }}
          >
            {tok.t}
          </span>
        );
      })}
    </p>
  );
}


const TEXT_ZOOM_END = 0.30;  // headline has fully "arrived" by this point
const FADE_START = 0.28;     // headline + icons start dissolving here
const FADE_END = 0.38;       // ...and the paragraph's backdrop is fully in by here
const WORDS_START = 0.36;    // words then reveal gradually, paced by scroll
const WORDS_END = 0.86;
const IMAGES_START = 0.88;   // photo reveal begins after all words are done
const IMAGES_END = 0.98;

function ScrollStory() {
  const isMobile = useIsMobile();

  const headlineGroupRef = useRef(null);   // scale + rotateX target
  const headlineLayerRef = useRef(null);   // opacity target (headline + icons layer)
  const paragraphBackdropRef = useRef(null); // opacity target (paragraph layer)
  const iconRefs = useRef([]);
  const wordRefs = useRef([]);
  const imageWrapRefs = useRef([]);
  const imageRefs = useRef([]);

  const icons = isMobile ? ICONS_MOBILE : ICONS_DESKTOP;

  const handleProgress = (progress) => {
 
    const textT = clamp(progress / TEXT_ZOOM_END, 0, 1);
    const textEase = smoothstep(textT);
    const FLIP_MAX_DEG = isMobile ? 60 : 72; // slightly gentler on narrow/close viewports
    const flipDeg = textEase * FLIP_MAX_DEG;
    const textScale = 1 + textEase * (isMobile ? 1.1 : .8);

    // fade tied to the flip itself — content starts dissolving a little
    // right from the very first pixel of scroll, not just once it finishes
    const zoomFadeOpacity = 1 - textEase * 1;

    // icons: ambient float (CSS) + scroll parallax (upward) + scroll rotation
    const iconTravel = progress * (isMobile ? 380 : 650);

    // headline/icon dissolve — a short, snappy crossfade into the paragraph's
    // backdrop so the handoff feels instant rather than dragged out
    const fadeT = clamp((progress - FADE_START) / (FADE_END - FADE_START), 0, 1);
    const fadeEased = smoothstep(fadeT);

    // words then reveal one by one over a much longer, dedicated scroll range,
    // so the reveal is genuinely paced by scrolling instead of compressed
    // into the headline's fade window
    const wordPhase = clamp((progress - WORDS_START) / (WORDS_END - WORDS_START), 0, 1);
    const wordRevealCount = Math.round(wordPhase * TOTAL_WORDS);
    const wordsComplete = wordRevealCount >= TOTAL_WORDS;

    // combine: content fades a bit as it scales up, then fully dissolves
    // during the crossfade into the paragraph
    const contentOpacity = clamp(zoomFadeOpacity * (1 - fadeEased), 0, 1);

    // --- write everything directly to the DOM, no React re-render ---
    if (headlineGroupRef.current) {
      headlineGroupRef.current.style.transform = `scale(${textScale}) rotateX(${flipDeg}deg)`;
    }
    if (headlineLayerRef.current) {
      headlineLayerRef.current.style.opacity = contentOpacity;
    }
    if (paragraphBackdropRef.current) {
      paragraphBackdropRef.current.style.opacity = fadeEased;
    }

    iconRefs.current.forEach((el, i) => {
      if (!el) return;
      const cfg = icons[i];
      const y = iconTravel * cfg.depth * -1;
      const spin = progress * cfg.spin;
      el.style.transform = `translate3d(0, ${y}px, 0) rotate(${spin}deg)`;
    });

    wordRefs.current.forEach((el, i) => {
      if (!el) return;
      const revealed = i < wordRevealCount;
      el.style.opacity = revealed ? '1' : '0';
      el.style.filter = revealed ? 'blur(0px)' : 'blur(6px)';
      el.style.transform = revealed ? 'translateY(0)' : 'translateY(0.35em)';
    });

    if (TOTAL_IMAGES > 0) {
      const perImageSpan = (IMAGES_END - IMAGES_START) / TOTAL_IMAGES;

      for (let i = 0; i < TOTAL_IMAGES; i += 1) {
        const winStart = IMAGES_START + i * perImageSpan;
        const winEnd = winStart + perImageSpan;
        const raw = wordsComplete
          ? clamp((progress - winStart) / (winEnd - winStart), 0, 1)
          : 0;
        const eased = smoothstep(raw);

        const wrapEl = imageWrapRefs.current[i];
        if (wrapEl) {
          wrapEl.style.width = `${eased * IMAGE_MAX_WIDTH_EM}em`;
          wrapEl.style.marginLeft = `${eased * IMAGE_MAX_MARGIN_EM}em`;
          wrapEl.style.marginRight = `${eased * IMAGE_MAX_MARGIN_EM}em`;
        }

        const imgEl = imageRefs.current[i];
        if (imgEl) {
          imgEl.style.opacity = eased;
          imgEl.style.transform = `scale(${0.8 + 0.2 * eased})`;
          imgEl.style.clipPath = `inset(0 ${(1 - eased) * 100}% 0 0)`;
        }
      }
    }
  };

  const sectionRef = useScrollProgress(handleProgress);

  return (
    <section ref={sectionRef} className="relative" style={{ height: '600vh' }}>
      <div className="fsl-sticky sticky top-0 w-full overflow-hidden" >
        {/* paragraph layer — fades in via the gradient overlay opacity AND
            per-word opacity, exactly as the headline layer above it fades out */}
        <div
          ref={paragraphBackdropRef}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6"
          style={{ background: SECOND_SECTION_BG, opacity: 0, willChange: 'opacity' }}
        >
          <RevealParagraph
            wordRefs={wordRefs}
            imageWrapRefs={imageWrapRefs}
            imageRefs={imageRefs}
            isMobile={isMobile}
          />
        </div>

        {/* headline + icons layer — dissolves away to reveal the paragraph
            layer beneath it, in the same screen position */}
        <div ref={headlineLayerRef} className="absolute inset-0 z-20" style={{ opacity: 1, willChange: 'opacity' }}>
          {icons.map((cfg, i) => (
            <FloatingIcon
              key={i}
              ref={(el) => (iconRefs.current[i] = el)}
              icon={cfg.Icon}
              size={cfg.size}
              blur={cfg.blur}
              duration={cfg.duration}
              rotate={cfg.rotate}
              style={{ top: cfg.top, left: cfg.left }}
            />
          ))}

          <div
            className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-3"
            style={{ perspective: isMobile ? '900px' : '1400px' }}
          >
            <div
              ref={headlineGroupRef}
              className="origin-top will-change-transform"
              style={{
                transform: 'scale(1) rotateX(0deg)',
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            >
              {LINES.map((line, i) => (
                <h1
                  key={i}
                  className="whitespace-nowrap uppercase leading-[0.92] tracking-tight text-center"
                  style={{
                    fontSize: isMobile
                      ? 'clamp(1.9rem, 12vw, 4rem)'
                      : 'clamp(3.5rem, 11vw, 6rem)',
                    color: "#111111",
                    fontWeight: 800,
                    letterSpacing: '0.01em',
                    
                  }}
                >
                  {line}
                </h1>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Root component                                                     */
/* ------------------------------------------------------------------ */
export default function FitnessScrollLanding() {
  return (
    <div className="w-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

        /* Use the small/dynamic viewport height on mobile so the sticky
           stage isn't mis-sized by the address bar showing/hiding. */
        .fsl-sticky { height: 100vh; }
        @supports (height: 100svh) {
          .fsl-sticky { height: 100svh; }
        }

        @keyframes fslFloatDrift {
          0%   { transform: translate(0,0) rotate(var(--rot-start, 0deg)); }
          50%  { transform: translate(var(--drift-x,10px), var(--drift-y,-14px)) rotate(var(--rot-mid, 8deg)); }
          100% { transform: translate(0,0) rotate(var(--rot-start, 0deg)); }
        }
        .fsl-float { animation: fslFloatDrift var(--dur, 6s) ease-in-out infinite; will-change: transform; }
        .fsl-reveal-word { display: inline-block; transition: opacity 0.5s ease, filter 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1); will-change: opacity, transform, filter; }

        /* No CSS transitions on the image reveal — every frame's width,
           clip-path, transform, and opacity are written directly from the
           scroll handler above, so the reveal tracks scroll position 1:1
           with zero added lag or overshoot. */
        .fsl-reveal-img-wrap { will-change: width; }
        .fsl-reveal-img { will-change: opacity, transform, clip-path; }

        @media (prefers-reduced-motion: reduce) {
          .fsl-float { animation: none !important; }
          .fsl-reveal-word { transition: none !important; }
        }
      `}</style>

      <ScrollStory />
    </div>
  );
}