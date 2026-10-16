import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import hero from "../../assets/home/hero.jpg";
import mobhero from "../../assets/home/mobile-hero.jpg";
import RunningSVG from "../Helper/StorySection/RunningSVG";
import Heart from "../Helper/Heart";
import ConsultationButton from "../Helper/ConsultationButton";

gsap.registerPlugin(ScrollTrigger);
const MOB_IMAGE = mobhero;
const BG_IMAGE = hero;
const SMOOTHING = 7;
const PILLS_GAP = 28;

// Background framing: tweak these to taste
const BG_ZOOM_DESKTOP = 1.12; // 1 = no zoom
const BG_SHIFT_DESKTOP = 10; // % pushed to the right
const BG_ZOOM_MOBILE = 1.06;
const BG_SHIFT_MOBILE = 0;

const BADGE_TEXT = "JOIN THE MOM TRIBE • GET STRONGER • FMC •";

const pills = [
  {
    label: "Proactive and adaptive coaching",
    bg: "bg-emerald-50",
    text: "text-emerald-900",
    icon: <RunningSVG color="#1c8c77" />,
  },
  {
    label: "Holistic health",
    bg: "bg-violet-50",
    text: "text-violet-900",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-600 animate-heartbeat"
      >
        <path
          d="M12 20s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Personalized answers",
    bg: "bg-sky-50",
    text: "text-sky-900",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600 overflow-visible"
      >
        <path
          d="M5 3v4M3 5h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="animate-twinkle-a origin-[5px_5px]"
        />
        <path
          d="M19 13v4M17 15h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="animate-twinkle-b origin-[19px_15px]"
        />
        <path
          d="M11 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="animate-twinkle-main origin-[11px_11px]"
        />
      </svg>
    ),
  },
];

/* ────────────────────────────────────────────────────────────────────────── */
/* SplitWords — masked word-by-word reveal (rise + un-rotate + un-blur).       */
/* Animates only the inner word spans, never the scroll-driven parent, so it   */
/* can't fight the inline transforms the scroll logic applies.                 */
/* Re-plays every time it mounts (Phase B mounts each time it re-enters).      */
/* ────────────────────────────────────────────────────────────────────────── */
function SplitWords({ text, delay = 0, stagger = 0.07 }) {
  const ref = useRef(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el.querySelectorAll("[data-w]"),
        {
          yPercent: 115,
          rotate: 5,
          opacity: 0,
          filter: "blur(10px)",
          transformOrigin: "0% 100%",
        },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          stagger,
          delay,
          clearProps: "filter",
        }
      );
    });
    return () => mm.revert();
  }, [delay, stagger]);

  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span
            aria-hidden="true"
            className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom"
          >
            <span data-w className="inline-block will-change-transform">
              {w}
            </span>
          </span>{" "}
        </Fragment>
      ))}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* PillsBlock — pills + eyebrow + CTA. Staggered spring-in, clip-path CTA      */
/* reveal (borrowed from the footer), and a magnetic CTA on fine pointers.     */
/* ────────────────────────────────────────────────────────────────────────── */
function PillsBlock() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const pillEls = q("[data-pill]");
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(pillEls, {
          y: 50,
          scale: 0.7,
          opacity: 0,
          rotate: (i) => (i % 2 ? 5 : -5),
          duration: 0.8,
          stagger: 0.09,
          ease: "back.out(1.8)",
          // Hand control back to the CSS hover transform once settled.
          clearProps: "transform",
          onComplete: () =>
            pillEls.forEach((p) => p.setAttribute("data-ready", "")),
        })
        .from(q("[data-eyebrow]"), { y: 16, opacity: 0, duration: 0.5 }, "-=0.35")
        .fromTo(
          q("[data-cta]"),
          { clipPath: "inset(0% 50% 0% 50% round 999px)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0% round 999px)",
            opacity: 1,
            duration: 0.8,
            ease: "power4.out",
            clearProps: "clipPath",
          },
          "-=0.25"
        );
    });

    // Magnetic CTA — it leans toward the cursor, then springs back.
    mm.add(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
      () => {
        const zone = q("[data-magnet]")[0];
        const target = q("[data-cta]")[0];
        if (!zone || !target) return undefined;

        const onMove = (e) => {
          const r = zone.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          gsap.to(target, {
            x: dx * 0.22,
            y: dy * 0.3,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto",
          });
        };
        const onLeave = () =>
          gsap.to(target, {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "elastic.out(1, 0.4)",
            overwrite: "auto",
          });

        zone.addEventListener("pointermove", onMove);
        zone.addEventListener("pointerleave", onLeave);
        return () => {
          zone.removeEventListener("pointermove", onMove);
          zone.removeEventListener("pointerleave", onLeave);
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {/* Pills */}
      <div className="flex flex-col items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
        {pills.map((pill) => (
          <span
            key={pill.label}
            data-pill
            className={`hero-pill inline-flex items-center gap-1.5 sm:gap-2 rounded-full ${pill.bg} ${
              pill.label === "Proactive and adaptive coaching"
                ? "px-3 py-1 sm:px-4 sm:py-3"
                : "px-4 py-2.5 sm:px-6 sm:py-4"
            } text-xs sm:text-lg font-medium ${pill.text} shadow-sm`}
          >
            {pill.icon}
            {pill.label}
          </span>
        ))}
      </div>

      <p
        data-eyebrow
        className="mb-2 sm:mb-3 text-xs sm:text-lg font-medium text-white/80"
      >
        Begin Your Transformation
      </p>

      {/* Magnet hit-area is padded so the pull starts just before the cursor
          reaches the button; negative margin keeps layout unchanged. */}
      <div data-magnet className="-m-5 inline-block p-5">
        <div data-cta>
          <ConsultationButton label="Book a Free Consultation " />
        </div>
      </div>
    </div>
  );
}

export default function HomeHeroSection() {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [vh, setVh] = useState(800);
  const [mounted, setMounted] = useState(false);
  // Initialised from the real viewport (not a desktop default) so the hero is
  // the right height on the very first layout. Otherwise the page shortens by
  // 80vh on phones after ScrollTrigger has already measured every section
  // below it, and their animations fire far too late.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 640
  );
  const [scrollLengthVh, setScrollLengthVh] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 640 ? 220 : 300
  );

  const rawBadgeId = useId();
  const badgeId = `badge-${rawBadgeId.replace(/:/g, "")}`;

  const targetRef = useRef(0);
  const renderedRef = useRef(0);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Live-measured height of the Phase B headline so the pills/CTA block sits
  // at a tight offset on every screen size. useCallback keeps the ref stable so
  // the ResizeObserver isn't torn down and rebuilt on every animation frame.
  const phaseBHeightRef = useRef(220);
  const phaseBObserverRef = useRef(null);
  const phaseBMeasureRef = useCallback((node) => {
    if (phaseBObserverRef.current) {
      phaseBObserverRef.current.disconnect();
      phaseBObserverRef.current = null;
    }
    if (node) {
      const ro = new ResizeObserver((entries) => {
        const h = entries[0]?.contentRect?.height;
        if (h > 0) phaseBHeightRef.current = h;
      });
      ro.observe(node);
      phaseBObserverRef.current = ro;
    }
  }, []);

  // ─── Scroll-smoothing loop ─────────────────────────────────────────────────
  useEffect(() => {
    const applyViewportState = () => {
      setVh(window.innerHeight);
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setScrollLengthVh(mobile ? 220 : 300);
    };

    applyViewportState();
    const mountTimer = requestAnimationFrame(() => setMounted(true));

    // ── FIX 1: refresh ScrollTrigger only when the page height REALLY changed.
    // Before, ScrollTrigger.refresh() changed the layout, which re-fired the
    // ResizeObserver, which scheduled another refresh... an endless loop that
    // eventually froze scrolling.
    let refreshTimer = null;
    let lastHeight = document.body.offsetHeight;

    const doRefresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        // Record the height AFTER refresh so refresh-induced jitter is ignored.
        lastHeight = document.body.offsetHeight;
      }, 150);
    };

    const onBodyResize = () => {
      const h = document.body.offsetHeight;
      if (Math.abs(h - lastHeight) < 2) return;
      lastHeight = h;
      doRefresh();
    };

    const bodyObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(onBodyResize) : null;
    bodyObserver?.observe(document.body);
    if (document.fonts?.ready) document.fonts.ready.then(doRefresh);
    doRefresh();

    const updateTarget = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      targetRef.current = scrolled / total;
      startLoop(); // FIX 2: wake the loop only when there is something to animate
    };

    // ── FIX 2: the rAF loop now stops itself once it has caught up with the
    // scroll position, instead of running (and calling setProgress) forever.
    const tick = (time) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 1 / 30);
      lastTimeRef.current = time;
      const t = 1 - Math.exp(-SMOOTHING * dt);
      renderedRef.current += (targetRef.current - renderedRef.current) * t;

      if (Math.abs(targetRef.current - renderedRef.current) < 0.0005) {
        renderedRef.current = targetRef.current;
        setProgress(renderedRef.current);
        rafRef.current = null; // stop looping
        lastTimeRef.current = null;
        return;
      }

      setProgress(renderedRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    function startLoop() {
      if (rafRef.current == null) {
        lastTimeRef.current = null;
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    const onResize = () => {
      applyViewportState();
      updateTarget();
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", onResize);
    updateTarget();

    return () => {
      cancelAnimationFrame(mountTimer);
      clearTimeout(refreshTimer);
      bodyObserver?.disconnect();
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", onResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null; // important for StrictMode / HMR re-mounts
      lastTimeRef.current = null;
      if (phaseBObserverRef.current) phaseBObserverRef.current.disconnect();
    };
  }, []);

  // ─── GSAP: intro sequence, cursor glow, badge spin ─────────────────────────
  useEffect(() => {
    const root = wrapperRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return undefined;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    /* ---------- Page-load sequence ---------- */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl
        .from(
          q('[data-hero="badge"]'),
          { scale: 0, rotate: -120, opacity: 0, duration: 1, ease: "back.out(1.7)" },
          1.1
        )
        .from(q('[data-hero="cue"]'), { y: 20, opacity: 0, duration: 0.6 }, 1.4);

      // Rotating badge — keeps turning, speeds up on hover.
      const spin = gsap.to(q('[data-hero="badge-spin"]'), {
        rotation: 360,
        duration: 14,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });
      const badge = q('[data-hero="badge"]')[0];
      const faster = () => gsap.to(spin, { timeScale: 4, duration: 0.6 });
      const normal = () => gsap.to(spin, { timeScale: 1, duration: 0.8 });
      badge?.addEventListener("pointerenter", faster);
      badge?.addEventListener("pointerleave", normal);

      return () => {
        badge?.removeEventListener("pointerenter", faster);
        badge?.removeEventListener("pointerleave", normal);
      };
    });

    /* ---------- Cursor glow (mouse / trackpad only) ---------- */
    mm.add(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
      () => {
        const glow = q('[data-hero="glow"]')[0];
        if (!glow) return undefined;

        gsap.set(glow, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.6 });
        const glowX = gsap.quickTo(glow, "x", { duration: 0.7, ease: "power3" });
        const glowY = gsap.quickTo(glow, "y", { duration: 0.7, ease: "power3" });

        const onMove = (e) => {
          const r = stage.getBoundingClientRect();
          glowX(e.clientX - r.left);
          glowY(e.clientY - r.top);
        };
        const onEnter = () =>
          gsap.to(glow, { opacity: 1, scale: 1, duration: 0.5, overwrite: "auto" });
        const onLeave = () =>
          gsap.to(glow, { opacity: 0, scale: 0.6, duration: 0.5, overwrite: "auto" });

        stage.addEventListener("pointermove", onMove);
        stage.addEventListener("pointerenter", onEnter);
        stage.addEventListener("pointerleave", onLeave);

        return () => {
          stage.removeEventListener("pointermove", onMove);
          stage.removeEventListener("pointerenter", onEnter);
          stage.removeEventListener("pointerleave", onLeave);
        };
      }
    );

    return () => mm.revert();
  }, []);

  // ─── Background parallax + framing (zoom/shift lives on the <img>) ─────────
  const bgTranslateY = progress * -80;
  const bgSrc = isMobile ? MOB_IMAGE : BG_IMAGE;
  const bgZoom = isMobile ? BG_ZOOM_MOBILE : BG_ZOOM_DESKTOP;
  const bgShift = isMobile ? BG_SHIFT_MOBILE : BG_SHIFT_DESKTOP;

  // ─── Phase A: opening headline ─────────────────────────────────────────────
  const phaseAOpacity = 1 - easedRemap(progress, 0.1, 0.28, 0, 1);
  const phaseATranslateY = easedRemap(progress, 0.1, 0.28, 0, -80);
  // Defocuses as it leaves, so the exit feels like a rack focus.
  const phaseABlur = (1 - phaseAOpacity) * 10;

  // ─── Scroll cue ────────────────────────────────────────────────────────────
  const scrollCueOpacity = 1 - easedRemap(progress, 0, 0.08, 0, 1);

  // ─── Phase B ───────────────────────────────────────────────────────────────
  const phaseBTranslateY = easedRemap(progress, 0.2, 1.0, vh, -vh * 0.6);
  const phaseBVisible = progress > 0.18;

  // ─── Pills + CTA ───────────────────────────────────────────────────────────
  const pillsOffset = phaseBHeightRef.current + PILLS_GAP;
  const pillsTranslateY = easedRemap(
    progress,
    0.2,
    1.0,
    vh + pillsOffset,
    -vh * 0.6 + pillsOffset
  );
  const pillsVisible = progress > 0.18;

  return (
    <section
      ref={wrapperRef}
      style={{ height: `${scrollLengthVh}vh` }}
      className="relative"
    >
      <style>{`
        @keyframes heroScrollCue {
          0%, 100% { opacity: 0.45; transform: translateY(0); }
          50%      { opacity: 1; transform: translateY(5px); }
        }
        .hero-scroll-chevron { animation: heroScrollCue 1.6s ease-in-out infinite; }

        /* Hover feedback. The transition is only switched on once GSAP has
           finished the entrance (data-ready) so the two never fight. */
        .hero-pill:hover { transform: translateY(-2px) scale(1.03); }
        .hero-pill:active { transform: scale(0.97); }
        .hero-pill[data-ready] { transition: transform 0.2s ease, box-shadow 0.2s ease; }

        @media (prefers-reduced-motion: reduce) {
          .hero-scroll-chevron { animation: none; }
        }
      `}</style>

      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#F6F5F1]"
      >
        {/* ── Background ── */}
        <div className="absolute inset-0 overflow-hidden">
          <div data-hero="bg" className="absolute inset-0 will-change-transform">
            {/* Parallax layer (translate only; zoom/shift is applied on the img) */}
            <div
              className="absolute will-change-transform"
              style={{
                top: "-15%",
                bottom: "-20%",
                left: 0,
                right: 0,
                transform: `translate3d(0px, ${bgTranslateY}px, 0px)`,
              }}
            >
              <img
                src={bgSrc}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover ${
                  isMobile ? "object-center" : "object-top-right"
                }`}
                style={{
                  transform: `translateX(${bgShift}%) scale(${bgZoom})`,
                  transformOrigin: isMobile ? "center" : "top right",
                }}
                loading="eager"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/5" />
          </div>
        </div>

        {/* ── Cursor glow: above the photo, below the copy ── */}
        <div
          data-hero="glow"
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-[6] hidden h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_65%)] mix-blend-soft-light md:block"
        />

        {/* ── Content ── */}
        <div className="relative z-10 h-full w-full px-5 sm:px-12 lg:px-16">
          <div className="relative h-full w-full max-w-5xl">
            {/* Phase A: opening headline */}
            <div
              className="absolute left-0 will-change-[opacity,transform,filter]"
              style={{
                bottom: "18%",
                opacity: mounted ? phaseAOpacity : 0,
                transform: `translateY(${mounted ? phaseATranslateY : 24}px)`,
                filter: `blur(${phaseABlur}px)`,
                pointerEvents: phaseAOpacity > 0.05 ? "auto" : "none",
              }}
            >
              <h1 className="2xl:max-w-5xl max-w-2xl text-3xl font-medium leading-[1] text-white sm:text-[#2F4F4F] sm:text-6xl 2xl:text-[5.95rem]">
                <SplitWords
                  text="Join the #1 Fitness & Wellness Community for Moms"
                  delay={0.7}
                />
              </h1>
            </div>

            {/* Phase B: second headline — words rise in each time it re-enters */}
            {phaseBVisible && (
              <div
                className="absolute left-0 will-change-transform"
                style={{
                  top: 0,
                  transform: `translateY(${phaseBTranslateY}px)`,
                  pointerEvents: "auto",
                }}
              >
                <p
                  ref={phaseBMeasureRef}
                  className="max-w-2xl 2xl:max-w-5xl text-3xl font-medium leading-tight text-white sm:text-[#2B2B2B] sm:text-4xl lg:text-5xl 2xl:text-[5.55rem]"
                >
                  <SplitWords text="A program that fits your body, your goals and your life." />
                </p>
              </div>
            )}

            {/* Pills + CTA */}
            {pillsVisible && (
              <div
                className="absolute left-0"
                style={{
                  top: 0,
                  transform: `translateY(${pillsTranslateY}px)`,
                  pointerEvents: "auto",
                }}
              >
                <PillsBlock />
              </div>
            )}
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-6 left-5 z-10 flex flex-col items-start gap-1.5 text-xs font-medium uppercase tracking-widest text-white sm:bottom-8 sm:left-12 lg:left-16"
          style={{ opacity: scrollCueOpacity }}
        >
          <div data-hero="cue" className="flex flex-col items-center gap-2">
            <svg
              className="hero-scroll-chevron h-3 w-3 text-white/80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function remap(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function easeSmoothstep(t) {
  return t * t * (3 - 2 * t);
}

function easedRemap(value, inMin, inMax, outMin, outMax) {
  const t = clamp(remap(value, inMin, inMax, 0, 1), 0, 1);
  return outMin + easeSmoothstep(t) * (outMax - outMin);
}