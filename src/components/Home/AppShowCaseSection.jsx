import { Fragment, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import screen1 from "../../assets/home/mobile/img1.png";
import screen2 from "../../assets/home/mobile/img2.png";
import useDeviceType from "../../components/Helper/DeviceType";
import AppleIcon  from "../../components/Helper/AppleIcon";
import  PlayStoreIcon  from "../../components/Helper/PlayStoreIcon";

import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const CLEAR = "opacity,transform,filter";
const PARALLAX_SCRUB = 0.8; // seconds the phones take to catch up with the scrollbar

/* ────────────────────────────────────────────────────────────────────────── */
/* Animation helpers                                                          */
/*   data-hdr / data-content / data-body / data-phones   trigger groups       */
/*   data-word  masked heading words     data-sub   copy lines                */
/*   data-link  text link                data-btn   store buttons             */
/*   data-phone phone screenshots (entrance only — the parallax lives on the  */
/*                                 wrapper divs, so the two never collide)    */
/* ────────────────────────────────────────────────────────────────────────── */

// Words rise out of a mask, un-rotate and un-blur (same as the hero headline).
function SplitLines({ lines }) {
  return (
    <>
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {line.split(" ").map((w, i) => (
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
          {li < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

const hideWords = (els) =>
  gsap.set(els, {
    yPercent: 115,
    rotate: 5,
    opacity: 0,
    filter: "blur(10px)",
    transformOrigin: "0% 100%",
  });

const showWords = (tl, els, at = 0) =>
  tl.to(
    els,
    {
      yPercent: 0,
      rotate: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.1,
      stagger: 0.07,
      ease: "power4.out",
      clearProps: CLEAR,
    },
    at
  );

// Plays when the trigger reaches the viewport — scrolling down OR back up
// into it — and resets once it leaves, so it replays every time.
function scrollReplay({ trigger, start, end = "bottom top", targets, hide, build }) {
  if (!trigger) return () => {};
  let tl = null;
  const reset = () => {
    tl?.kill();
    tl = null;
    hide();
  };
  const play = () => {
    tl?.kill();
    hide();
    tl = build();
  };

  hide();
  const st = ScrollTrigger.create({
    trigger,
    start,
    end,
    onEnter: play,
    onEnterBack: play,
    onLeave: reset,
    onLeaveBack: reset,
  });

  return () => {
    st.kill();
    tl?.kill();
    gsap.set(targets, { clearProps: "all" });
  };
}

// Header (heading + subtitle + link) — shared by mobile and desktop.
function setupHeader(root) {
  const q = gsap.utils.selector(root);
  const words = q("[data-hdr] [data-word]");
  const sub = q("[data-hdr] [data-sub]");
  const link = q("[data-hdr] [data-link]");

  return scrollReplay({
    trigger: root.querySelector("[data-hdr]"),
    start: "top 85%",
    targets: [...words, ...sub, ...link],
    hide: () => {
      hideWords(words);
      gsap.set(sub, { opacity: 0, y: 20 });
      gsap.set(link, { opacity: 0, y: 16 });
    },
    build: () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      showWords(tl, words, 0);
      tl.to(sub, { opacity: 1, y: 0, duration: 0.8, clearProps: CLEAR }, 0.6).to(
        link,
        { opacity: 1, y: 0, duration: 0.7, clearProps: CLEAR },
        0.85
      );
      return tl;
    },
  });
}

// Desktop second block: heading, copy, store buttons.
function setupDesktopContent(root) {
  const q = gsap.utils.selector(root);
  const words = q("[data-content] [data-word]");
  const sub = q("[data-content] [data-sub]");
  const btns = q("[data-content] [data-btn]");

  return scrollReplay({
    trigger: root.querySelector("[data-content]"),
    start: "top 70%",
    targets: [...words, ...sub, ...btns],
    hide: () => {
      hideWords(words);
      gsap.set(sub, { opacity: 0, y: 24 });
      gsap.set(btns, { opacity: 0, y: 20, scale: 0.92 });
    },
    build: () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      showWords(tl, words, 0);
      tl.to(sub, { opacity: 1, y: 0, duration: 0.9, clearProps: CLEAR }, 0.5).to(
        btns,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.6)",
          clearProps: CLEAR,
        },
        0.85
      );
      return tl;
    },
  });
}

// Phones rise + settle in. Each phone is triggered by its OWN position (not
// the text block), so it only hides/animates when it is actually about to
// enter the viewport — never while it is already on screen. Animates the
// <img>, not the parallax wrapper.
function setupPhones(root, wrapSel, start) {
  const wraps = [...root.querySelectorAll(wrapSel)];
  const cleanups = wraps.map((wrap, i) => {
    const img = wrap.querySelector("[data-phone]");
    return scrollReplay({
      trigger: wrap,
      start,
      targets: img,
      hide: () => gsap.set(img, { opacity: 0, y: 90, scale: 0.9 }),
      build: () =>
        gsap.timeline({ delay: i * 0.12 }).to(img, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.3,
          ease: "power4.out",
          clearProps: CLEAR,
        }),
    });
  });
  return () => cleanups.forEach((c) => c());
}

// Mobile body copy.
function setupMobileBody(root) {
  const q = gsap.utils.selector(root);
  const sub = q("[data-body] [data-sub]");

  return scrollReplay({
    trigger: root.querySelector("[data-body]"),
    start: "top 88%",
    targets: sub,
    hide: () => gsap.set(sub, { opacity: 0, y: 24 }),
    build: () =>
      gsap.timeline().to(sub, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: CLEAR,
      }),
  });
}

// Scroll-scrubbed parallax. progress 0→1 spans the section crossing the
// viewport — identical maths to the old handler, now smoothed by GSAP.
function setupParallax(section, apply, reset) {
  if (!section) return () => {};
  const state = { p: 0 };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  apply(0);
  const tween = gsap.to(state, {
    p: 1,
    ease: "none",
    onUpdate: () => apply(state.p),
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: reduce ? true : PARALLAX_SCRUB,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    reset();
  };
}

export default function HealthCoachSection() {
  const phone1Ref = useRef(null);
  const phone2Ref = useRef(null);
  const sectionRef = useRef(null);

  const mobilePhone1Ref = useRef(null);
  const mobilePhone2Ref = useRef(null);
  const mobileSectionRef = useRef(null);

  const deviceType = useDeviceType();

  // ─── GSAP: scrubbed parallax + scroll-triggered entrances ──────────────────
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const motionOK = "(prefers-reduced-motion: no-preference)";

    // Desktop parallax (lg+)
    mm.add("(min-width: 1024px)", () =>
      setupParallax(
        sectionRef.current,
        (p) => {
          if (phone1Ref.current) {
            phone1Ref.current.style.transform = `perspective(1400px) rotateZ(${-p * 30}deg) rotateX(${p * 12}deg) translateY(${p * 80}px) translateX(${-p * 40}px)`;
          }
          if (phone2Ref.current) {
            phone2Ref.current.style.transform = `perspective(1400px) rotateZ(${p * 32}deg) rotateX(${p * 10}deg) translateY(${-p * 40}px) translateX(${p * 20}px)`;
          }
        },
        () => {
          if (phone1Ref.current) phone1Ref.current.style.transform = "";
          if (phone2Ref.current) phone2Ref.current.style.transform = "";
        }
      )
    );

    // Mobile parallax (< lg)
    mm.add("(max-width: 1023px)", () =>
      setupParallax(
        mobileSectionRef.current,
        (p) => {
          if (mobilePhone1Ref.current) {
            mobilePhone1Ref.current.style.transform = `perspective(1000px) rotateZ(${-8 - p * 14}deg) rotateX(${p * 6}deg) translateY(${p * 20}px) translateX(${-p * 18}px)`;
          }
          if (mobilePhone2Ref.current) {
            mobilePhone2Ref.current.style.transform = `perspective(1000px) rotateZ(${8 + p * 14}deg) rotateX(${p * 6}deg) translateY(${-p * 16}px) translateX(${p * 18}px)`;
          }
        },
        () => {
          if (mobilePhone1Ref.current) mobilePhone1Ref.current.style.transform = "";
          if (mobilePhone2Ref.current) mobilePhone2Ref.current.style.transform = "";
        }
      )
    );

    // Desktop entrances
    mm.add(`(min-width: 1024px) and ${motionOK}`, () => {
      const root = sectionRef.current;
      if (!root) return undefined;
      const cleanups = [
        setupHeader(root),
        setupDesktopContent(root),
        setupPhones(root, "[data-phone-wrap]", "top 98%"),
      ];
      return () => cleanups.forEach((c) => c());
    });

    // Mobile entrances
    mm.add(`(max-width: 1023px) and ${motionOK}`, () => {
      const root = mobileSectionRef.current;
      if (!root) return undefined;
      const cleanups = [
        setupHeader(root),
        setupPhones(root, "[data-phone-wrap]", "top 95%"),
        setupMobileBody(root),
      ];
      return () => cleanups.forEach((c) => c());
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      {/* ── MOBILE VERSION (< lg) ── */}
      <section
        ref={mobileSectionRef}
        className="lg:hidden bg-[#F6F5F1] px-6 py-2 overflow-hidden"
      >
        <div data-hdr className="text-center mb-10 max-w-xs mx-auto">
          <h1 className="text-3xl sm:text-4xl font-normal text-[#2C2C2C] leading-[1.2] tracking-tight mb-4">
            <SplitLines lines={["Your Fitness Journey,", "Anywhere, Anytime"]} />
          </h1>
          <p data-sub className="text-base sm:text-lg text-[#4A4A4A] leading-relaxed mb-5">
            Personalised workouts, progress tracking,
            and expert support,{" "}
            <span className="text-teal-800">all in one app.</span>
          </p>

          <Link
            data-link
            to="our-app"
            className="inline-flex items-center gap-1.5 text-[#2C2C2C] text-base font-medium hover:underline underline-offset-4 transition-all"
          >
            See how it works
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Phone images — two images, parallax on scroll */}
        <div data-phones className="relative flex items-center justify-center mb-10 h-[340px] sm:h-[400px]">
          <div
            ref={mobilePhone1Ref}
            data-phone-wrap
            className="absolute left-[2%] top-[25%] w-[55%] max-w-[220px] z-10"
            style={{
              transform: "perspective(1000px) rotateZ(-8deg)",
              willChange: "transform",
            }}
          >
            <img
              data-phone
              src={screen1}
              alt="Health Coach chat interface"
              className="w-full drop-shadow-xl rounded-[2rem]"
            />
          </div>

          <div
            ref={mobilePhone2Ref}
            data-phone-wrap
            className="absolute right-[4%] -top-6 w-[55%] max-w-[220px] z-20"
            style={{
              transform: "perspective(1000px) rotateZ(8deg)",
              willChange: "transform",
            }}
          >
            <img
              data-phone
              src={screen2}
              alt="fitmom club interface"
              className="w-full drop-shadow-xl rounded-[2rem]"
            />
          </div>
        </div>

        {/* Body copy + CTA */}
        <div data-body className="text-center max-w-xs mx-auto">
          <h2 data-sub className="text-2xl sm:text-3xl font-normal text-[#1C1B1F] leading-[1.2] tracking-tight mb-4">
            Have a question about your health and wellness?
          </h2>
          <p data-sub className="text-sm sm:text-base text-[#3C3C3C] leading-relaxed mb-6">
            Ask anything, anytime. Get evidence-backed answers and tailored
            insights based on your data.
          </p>
        </div>
      </section>

      {/* ── DESKTOP VERSION (lg+) ── */}
      <section
        ref={sectionRef}
        className="relative w-full xl:min-h-[255vh] 2xl:min-h-[275vh] min-h-[275vh] bg-[#F6F5F1] overflow-hidden hidden lg:block"
      >
        <div data-hdr className="w-full flex flex-col items-center justify-center text-center px-6 pt-14 pb-2">
          <h1 className="text-4xl lg:text-5xl xl:text-[3rem] 2xl:text-[4rem] font-normal text-[#2C2C2C] leading-[1.2] tracking-tight 2xl:max-w-6xl max-w-5xl mb-5">
            <SplitLines lines={["Your Fitness Journey,", "Anywhere, Anytime"]} />
          </h1>
          <p data-sub className="text-lg lg:text-3xl text-[#4A4A4A] leading-relaxed mb-6">
            Personalised workouts, progress tracking,<br />
            and expert support, <span className="text-teal-800">all in one app.</span>
          </p>
          <a
            data-link
            href="#"
            className="inline-flex items-center gap-1.5 text-[#2C2C2C] text-lg font-medium hover:underline underline-offset-4 transition-all"
          >
            See how it works
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div data-content className="relative w-full 2xl:max-w-8xl mx-auto px-18 2xl:px-40 min-h-screen flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-shrink-0 w-full 2xl:w-[42%] lg:w-[52%] pt-22 lg:pt-0 z-30">
            <h2 className="text-4xl lg:text-5xl 2xl:text-[4rem] xl:text-[3rem] font-normal text-[#1C1B1F] leading-[1.15] tracking-tight mb-6">
              <SplitLines lines={["Your complete", "fitness companion"]} />
            </h2>

            <p data-sub className="text-base lg:text-lg 2xl:text-xl text-[#3C3C3C] leading-relaxed mb-8 max-w-lg">
              Access personalized workout plans, nutrition guidance, live classes, progress tracking, and expert support, all in one app designed to help you achieve lasting results.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <a
                data-btn
                href="#"
                className="hero-cta inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-100"
              >
                <PlayStoreIcon />
                Google Play
              </a>
              <a
                data-btn
                href="#"
                className="hero-cta inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-100"
              >
                <AppleIcon />
                App Store
              </a>
            </div>
          </div>

          {/* Phones with parallax */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              ref={phone2Ref}
            data-phone-wrap
              className="absolute pointer-events-auto w-[260px] sm:w-[320px] md:w-[400px] lg:w-[550px] xl:w-[650px] 2xl:w-[680px]  2xl:bottom-[-350px] 2xl:right-[80px] right-[150px] bottom-[-280px] xl:right-[60px] xl:bottom-[-280px] lg:right-[80px] lg:bottom-[-280px]"
              style={{
                transform: "perspective(1400px) rotateZ(0deg) rotateX(0deg)",
                willChange: "transform",
              }}
            >
              <img
                data-phone
                src={screen2}
                alt="fitmom club interface"
                className="w-full drop-shadow-2xl rounded-[2.8rem]"
              />
            </div>

            <div
              ref={phone1Ref}
            data-phone-wrap
              className=" absolute pointer-events-auto w-[260px] sm:w-[320px] md:w-[400px] lg:w-[480px] xl:w-[680px] 2xl:w-[680px] 2xl:bottom-[-730px] 2xl:left-[100px] left-[60px] bottom-[-500px] lg:left-[60px] lg:bottom-[-500px] xl:left-[60px] xl:bottom-[-650px]"
              style={{
                transform: "perspective(1400px) rotateZ(0deg) rotateX(0deg)",
                willChange: "transform",
              }}
            >
              <img
                data-phone
                src={screen1}
                alt="fitmom club interface"
                className="w-full drop-shadow-2xl rounded-[2.8rem] "
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}