import React, { useEffect, useRef, useState } from "react";
import communityHero from "../../assets/our community/ourcommunityhero.webp";
import communityMobile from "../../assets/home/hero.webp";
import { HashLink } from "react-router-hash-link";
import { ArrowRight } from "lucide-react";
import handleConsultation from "../Helper/handleClick";

// ─────────────────────────────────────────────
// MOBILE VERSION – no scroll animation, mobile-first
// ─────────────────────────────────────────────
function OurCommunityMobile({ imageUrl, content }) {
  return (
    <section className="relative w-full bg-[#F6F4F0] overflow-hidden">
      <div className="relative w-full" style={{ height: "30svh" }}>
        <img
          src={imageUrl}
          alt="Our Community, FitMom Club"
          className="w-full h-full object-cover object-top-left"
        />
      </div>

      <div className="px-6 pt-2 pb-14">
        <p
          className="text-[10px] tracking-[0.22em] uppercase mt-4 mb-3"
          style={{ fontFamily: "'Poppins', sans-serif", color: "#00d1b8" }}
        >
          You're Never Alone Here
        </p>

        <div className="w-8 h-px bg-neutral-300 mb-4" />

        <h2
          className="text-[#1a1a1a] text-3xl font-medium mb-4 leading-snug"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Meet <span style={{ color: "#00d1b8" }}>Our Community</span>
        </h2>

        <p
          className="text-neutral-600 text-sm leading-relaxed text-justify"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {content}
        </p>

        <HashLink
          to="/#cta"
          className="inline-flex items-center gap-2 h-12 px-6 mt-6 rounded-full text-white text-sm font-semibold bg-teal-500 shadow-sm shadow-teal-900/10 transition-all duration-200 hover:bg-teal-600 hover:scale-[1.02] active:scale-[0.97]"
        >
          Join Now
          <ArrowRight size={14} />
        </HashLink>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// DESKTOP VERSION
// - No overlay, no top eyebrow/watermark
// - Text 1 shown by default (before scroll)
// - On scroll: text 1 hides, image shrinks to 95%, then Text 2 shows
// - Smoothed via rAF-driven scroll damping + eased progress
// ─────────────────────────────────────────────
function OurCommunityDesktop({ imageUrl, content, content2 }) {
  const sectionRef = useRef(null);
  const imgFrameRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  const MARGIN_PCT = 4; // each side; total width/height reduction = 5%

  // ── SPEED CONTROLS ─────────────────────────────────────────
  // DAMPING (0–1): how eagerly smoothScroll chases the real scroll position.
  // Lower = smoother/laggier ("floaty"), higher = snappier/more direct.
  const DAMPING = 0.09;
  // SCROLL_SPEED: multiplies the raw scroll distance before it drives the
  // animation. >1 = the sequence completes faster for the same amount of
  // physical scrolling. <1 = it takes more scrolling to reach the same point.
  const SCROLL_SPEED = .8;
  // SCROLL_DISTANCE_VH: total height (vh) of the scrollable section. This is
  // the "master" speed dial — also set on the <section> below via minHeight.
  // Bigger = more scrolling needed = slower. Smaller = faster.
  const SCROLL_DISTANCE_VH = 200;
  // ────────────────────────────────────────────────────────────
useEffect(() => {
  const section = sectionRef.current;
  if (!section) return;

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let targetScroll = 0;
  let smoothScroll = 0;
  let rafId = null;
  let maxScroll = 1; // actual max reachable value of `scrolled`, recomputed on scroll/resize

  const onScroll = () => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    // Real scrollable distance for this section (px), never negative
    const scrollableRange = Math.max(section.offsetHeight - vh, 1);
    maxScroll = scrollableRange * SCROLL_SPEED;
    targetScroll = -rect.top * SCROLL_SPEED;
  };

  const render = () => {
    smoothScroll += (targetScroll - smoothScroll) * DAMPING;
    if (Math.abs(targetScroll - smoothScroll) < 0.05) {
      smoothScroll = targetScroll;
    }

    const scrolled = smoothScroll;

    const frame = imgFrameRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;

    if (frame) {
      // Thresholds as FRACTIONS of the actual reachable scroll range,
      // so text2 always fully reveals by the end of the section —
      // no need to make the section taller.
      const P1 = maxScroll * 0.28; // text1 fades out / frame starts shrinking
      const P2 = maxScroll * 0.5;  // frame fully shrunk, hold (gap between texts)
      const P3 = maxScroll * 0.95; // text2 fully fades in near the end

      if (scrolled < 0) {
        Object.assign(frame.style, {
          top: "0%", left: "0%",
          width: "100%", height: "100%",
          borderRadius: "0px",
        });
        if (text1) { text1.style.opacity = "1"; text1.style.transform = "translateY(0px)"; }
        if (text2) { text2.style.opacity = "0"; text2.style.transform = "translateY(28px)"; }

      } else if (scrolled < P1) {
        const t = easeInOutCubic(scrolled / P1);
        const m = lerp(0, MARGIN_PCT, t);
        Object.assign(frame.style, {
          top: `${m}%`, left: `${m}%`,
          width: `calc(100% - ${m * 2}%)`,
          height: `calc(100% - ${m * 2}%)`,
          borderRadius: `${lerp(0, 14, t)}px`,
        });
        if (text1) {
          text1.style.opacity = String(lerp(1, 0, t));
          text1.style.transform = `translateY(${lerp(0, -20, t)}px)`;
        }
        if (text2) { text2.style.opacity = "0"; text2.style.transform = "translateY(28px)"; }

      } else if (scrolled < P2) {
        Object.assign(frame.style, {
          top: `${MARGIN_PCT}%`, left: `${MARGIN_PCT}%`,
          width: `calc(100% - ${MARGIN_PCT * 2}%)`,
          height: `calc(100% - ${MARGIN_PCT * 2}%)`,
          borderRadius: "14px",
        });
        if (text1) { text1.style.opacity = "0"; }
        if (text2) { text2.style.opacity = "0"; text2.style.transform = "translateY(28px)"; }

      } else if (scrolled < P3) {
        const t = easeInOutCubic((scrolled - P2) / (P3 - P2));
        Object.assign(frame.style, {
          top: `${MARGIN_PCT}%`, left: `${MARGIN_PCT}%`,
          width: `calc(100% - ${MARGIN_PCT * 2}%)`,
          height: `calc(100% - ${MARGIN_PCT * 2}%)`,
          borderRadius: "14px",
        });
        if (text1) { text1.style.opacity = "0"; }
        if (text2) {
          text2.style.opacity = String(lerp(0, 1, t));
          text2.style.transform = `translateY(${lerp(28, 0, t)}px)`;
        }

      } else {
        Object.assign(frame.style, {
          top: `${MARGIN_PCT}%`, left: `${MARGIN_PCT}%`,
          width: `calc(100% - ${MARGIN_PCT * 2}%)`,
          height: `calc(100% - ${MARGIN_PCT * 2}%)`,
          borderRadius: "14px",
        });
        if (text1) { text1.style.opacity = "0"; }
        if (text2) { text2.style.opacity = "1"; text2.style.transform = "translateY(0)"; }
      }
    }

    rafId = requestAnimationFrame(render);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
  rafId = requestAnimationFrame(render);

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (rafId) cancelAnimationFrame(rafId);
  };
}, [MARGIN_PCT, DAMPING, SCROLL_SPEED]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f6f4f0]"
      style={{ minHeight: `${SCROLL_DISTANCE_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        <div
          ref={imgFrameRef}
          className="absolute overflow-hidden"
          style={{
            top: "0%",
            left: "0%",
            width: "100%",
            height: "100%",
            borderRadius: 0,
          }}
        >
          <img
            src={imageUrl}
            alt="Our Community, FitMom Club"
            className="h-full w-full object-cover object-top absolute inset-0"
          />
      <div className="absolute top-0 left-0 right-0 h-240 bg-gradient-to-b from-black/70 to-black/5 pointer-events-none" />

          {/* Text block 1 — visible on load, fades out on scroll */}
          <div className="absolute inset-0 flex items-end justify-start pb-16 2xl:pb-20 pl-16 2xl:pl-20 pointer-events-none">
            <div
              ref={text1Ref}
              className="w-full max-w-lg 2xl:max-w-xl"
              style={{
                opacity: 1,
                transform: "translateY(0px)",
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                willChange: "opacity, transform",
              }}
            >
              
              <h2 className="text-white text-3xl 2xl:text-4xl font-medium mb-4 font-[Poppins] leading-snug">
                Join a Thriving Community of<br/> Moms on the Same Journey
              </h2>
              <p className="text-white/80 2xl:text-lg text-sm leading-relaxed font-[Poppins]">
                {content}
              </p>

              
            </div>
          </div>

          {/* Text block 2 — hidden initially, fades in after text 1 hides */}
          <div className="absolute inset-0 flex items-end justify-start pb-16 2xl:pb-20 pl-16 2xl:pl-20 pointer-events-none">
            <div
              ref={text2Ref}
              className="w-full max-w-lg 2xl:max-w-2xl"
              style={{
                opacity: 0,
                transform: "translateY(28px)",
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                willChange: "opacity, transform",
              }}
            >
          
              <p className="text-white/80 2xl:text-3xl text-sm leading-relaxed font-[Poppins]">
                {content2}
              </p>

              <button
                onClick={handleConsultation}
                className="pointer-events-auto inline-flex items-center gap-2 h-12 2xl:h-14 px-6 mt-6 rounded-full text-white text-sm 2xl:text-base font-semibold bg-teal-500 shadow-lg shadow-black/30 transition-all duration-200 hover:bg-teal-600 hover:scale-[1.02] active:scale-[0.97]"
              >
                Join Now
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────
export default function OurCommunitySection({
  imageUrl = communityHero,
  imageUrlMobile = communityMobile,
  content = `FitMom Club isn't just about workouts and meal plans — it's a circle of women who show up for each other every single day.
From new moms taking their first steps back to fitness, to seasoned members celebrating milestones, our community is built on encouragement, accountability, and real connection.`,
  content2 = `Here, you’ll find emotional support, accountability, and the encouragement to reach your wellness goals.`,
}) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile
    ? <OurCommunityMobile imageUrl={imageUrlMobile} content={content} />
    : <OurCommunityDesktop imageUrl={imageUrl} content={content} content2={content2} />;
}