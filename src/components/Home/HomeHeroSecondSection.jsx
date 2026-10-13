import { Link } from "react-router-dom";
import { Fragment, useEffect, useLayoutEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CommunityStatsSection from "./StatSection";

gsap.registerPlugin(ScrollTrigger);

const HEADING = "A Weight Loss Program Designed Just for You";
const PARALLAX_LAG = 120; // px the section trails behind the scroll

export default function HomeHeroSecondSection() {
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(null);

  // ─── Scroll parallax (unchanged) ───────────────────────────────────────────
  useEffect(() => {
    const computeTarget = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (rect.top - windowHeight) / (windowHeight + rect.height);
        targetRef.current = progress * -PARALLAX_LAG; // positive = section rises slower
      }
    };

    const LERP_FACTOR = 0.08;

    const tick = () => {
      currentRef.current += (targetRef.current - currentRef.current) * LERP_FACTOR;

      if (Math.abs(targetRef.current - currentRef.current) > 0.01) {
        setOffsetY(currentRef.current);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        currentRef.current = targetRef.current;
        setOffsetY(currentRef.current);
        rafRef.current = null;
      }
    };

    const handleScroll = () => {
      computeTarget();
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    computeTarget();
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ─── GSAP: scroll-triggered reveal, drifting glow, magnetic CTA ────────────
  useLayoutEffect(() => {
    const root = contentRef.current;
    if (!root) return undefined;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // One orchestrated moment: heading words rise, then copy, then CTA.
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          once: true,
        },
      });

      tl.fromTo(
        q("[data-word]"),
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
          stagger: 0.07,
          clearProps: "filter",
        }
      )
        .fromTo(
          q("[data-copy]"),
          { y: 28, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            clearProps: "filter",
          },
          "-=0.6"
        )
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
          "-=0.4"
        );

      // Soft glow behind the text drifts slowly — the only ambient motion.
      gsap.to(q("[data-orb]"), {
        x: 40,
        y: -30,
        scale: 1.12,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    // Magnetic CTA — leans toward the cursor, springs back on leave.
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
    <section
      ref={containerRef}
      className="relative h-[120vh] w-full bg-[#F6F5F1] z-10 py-6 sm:py-8 lg:pb-25 lg:pt-10 mt-[-60vh] sm:mt-[-70vh] overflow-hidden"
      style={{
        transform: `translate3d(0, ${offsetY}px, 0)`,
        willChange: "transform",
      }}
    >
      <CommunityStatsSection />

      <div
        ref={contentRef}
        className="relative max-w-3xl mx-auto px-6 sm:px-12 lg:px-8 text-center"
      >
        {/* Ambient glow */}
        <div
          data-orb
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(80,255,170,0.55) 0%, rgba(0,212,255,0.25) 50%, rgba(0,212,255,0) 70%)",
          }}
        />

        <h2 className="text-4xl sm:text-5xl 2xl:text-6xl font-normal text-neutral-900 leading-tight tracking-tight mb-8">
          <span className="sr-only">{HEADING}</span>
          {HEADING.split(" ").map((w, i) => (
            <Fragment key={`${w}-${i}`}>
              <span
                aria-hidden="true"
                className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom"
              >
                <span data-word className="inline-block will-change-transform">
                  {w}
                </span>
              </span>{" "}
            </Fragment>
          ))}
        </h2>

        <p
          data-copy
          className="text-lg 2xl:text-2xl text-neutral-500 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Your journey is unique, and so is our Best Online Weight Loss Fitness &amp; Diet Program
          for Women &amp; Moms. We tailor every workout and meal plan to your body, your goals,
          and your lifestyle. Rediscover your strength with the support you deserve.
        </p>

        {/* Padded hit-area so the magnetic pull starts just before the cursor
            reaches the button; negative margin keeps layout unchanged. */}
        <div data-magnet className="-m-5 inline-block p-5">
          <div data-cta>
            <Link
              to="/fmc"
              className="inline-flex items-center justify-center rounded-full bg-teal-500 hover:bg-teal-600 active:bg-teal-700 transition-colors px-8 py-3.5 text-sm font-medium text-white shadow-sm"
              style={{
                background: "linear-gradient(90deg,#50ffaa,#00d4ff)",
                color: "#062019",
                letterSpacing: "0.02em",
                textDecoration: "none",
              }}
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}