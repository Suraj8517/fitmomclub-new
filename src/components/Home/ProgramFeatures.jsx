import React, { Fragment, useRef, useState, useCallback, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HeartPulse,
  Sparkles,
  Clock3,
  BadgeCheck,
  Users,
  Baby,
  Target,
  Apple,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const mom ="https://res.cloudinary.com/q1vba78b/image/upload/v1791863501/mother_vfrvcr.webp";
const wellness="https://res.cloudinary.com/q1vba78b/image/upload/v1791863505/wellness_e74adj.webp"
const online ="https://res.cloudinary.com/q1vba78b/image/upload/v1791863503/online_bq5yyz.webp"
const trainer = "https://res.cloudinary.com/q1vba78b/image/upload/v1791863505/trainer_bxgvuy.webp"
const support ="https://res.cloudinary.com/q1vba78b/image/upload/v1791863503/support_xgn6cr.webp"
const family = "https://res.cloudinary.com/q1vba78b/image/upload/v1791863500/family_eskmzh.webp"
const goals="https://res.cloudinary.com/q1vba78b/image/upload/v1791863504/goal_oip8yb.webp"
const nutrition ="https://res.cloudinary.com/q1vba78b/image/upload/v1791863503/nutrition_rodna3.webp"

const HEADING = "Everything a mom's wellness journey actually needs";

const stories = [
  {
    id: 1,
    title: "Tailored Fitness for Moms",
    badge: "Personalized Programs",
    badgeBg: "#8FF4E9",
    icon: HeartPulse,
    iconColor: "#004F4A",
    image: mom,
    description:
      "Personalized workout programs designed for prenatal, postnatal, and busy moms, helping you regain strength, improve mobility, and stay active at every stage.",
    overlay: "nutrition",
  },
  {
    id: 2,
    title: "Holistic Wellness",
    badge: "Mind & Body",
    badgeBg: "#ECDBFF",
    icon: Sparkles,
    iconColor: "#8865B3",
    image: wellness,
    description:
      "Achieve complete wellness through a balanced approach that combines fitness, nutritious eating, stress management, quality sleep, and emotional well-being.",
    overlay: "fitness",
  },
  {
    id: 3,
    title: "Flexible Schedules",
    badge: "Fits Your Lifestyle",
    badgeBg: "#D3E3FD",
    icon: Clock3,
    iconColor: "#1249A4",
    image: online,
    description:
      "Exercise anytime with flexible online sessions that easily fit into your daily routine—whether during nap time, early mornings, or evenings.",
    overlay: "coach",
  },
  {
    id: 4,
    title: "Expert Trainers",
    badge: "Certified Coaches",
    badgeBg: "#FFE7C7",
    icon: BadgeCheck,
    iconColor: "#C26A00",
    image: trainer,
    description:
      "Train with certified women's health and fitness specialists who provide safe, effective guidance tailored to every phase of motherhood.",
    overlay: "expert",
  },
  {
    id: 5,
    title: "Supportive Community",
    badge: "Grow Together",
    badgeBg: "#FFD9E8",
    icon: Users,
    iconColor: "#B4235D",
    image: support,
    description:
      "Become part of a positive community where moms inspire, encourage, and celebrate each other's progress throughout their wellness journey.",
    overlay: "community",
  },
  {
    id: 6,
    title: "Family-Friendly Approach",
    badge: "Wellness for Everyone",
    badgeBg: "#D9F7D9",
    icon: Baby,
    iconColor: "#1F7A3D",
    image: family,
    description:
      "Enjoy fitness routines that fit seamlessly into family life, with activities you can do alone or together with your little ones.",
    overlay: "family",
  },
  {
    id: 7,
    title: "Realistic Goals",
    badge: "Sustainable Results",
    badgeBg: "#FFE7A8",
    icon: Target,
    iconColor: "#B56A00",
    image: goals,
    description:
      "Focus on achievable milestones that build lasting healthy habits, helping you gain confidence without overwhelming your daily routine.",
    overlay: "goals",
  },
  {
    id: 8,
    title: "Custom Nutrition Plans",
    badge: "Healthy Eating",
    badgeBg: "#D7F5D8",
    icon: Apple,
    iconColor: "#2E7D32",
    image: nutrition,
    description:
      "Receive personalized nutrition plans crafted around your lifestyle, recovery, and health goals to fuel your body with confidence.",
    overlay: "nutrition2",
  },
];

// Hover / micro-interaction styles only. The scroll entrance is handled by
// GSAP on the outer [data-card] wrapper, so these never fight with it.
function AnimationStyles() {
  return (
    <style>{`
      .pf-card {
        transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                    box-shadow 0.35s ease;
        will-change: transform;
      }
      .pf-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 18px 32px rgba(20,35,31,0.12);
      }

      .pf-card-photo img {
        transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .pf-card:hover .pf-card-photo img {
        transform: scale(1.05);
      }

      .pf-medallion {
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .pf-card:hover .pf-medallion {
        transform: scale(1.1) rotate(-4deg);
      }

      .pf-nav-btn {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .pf-nav-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 14px rgba(20,35,31,0.14);
      }
      .pf-nav-btn:active {
        transform: translateY(0) scale(0.94);
      }

      .pf-dot {
        transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease;
      }

      .pf-track {
        transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
      }

      @media (prefers-reduced-motion: reduce) {
        .pf-card:hover {
          transform: none;
        }
        .pf-card-photo img,
        .pf-medallion,
        .pf-nav-btn,
        .pf-track {
          transition: none !important;
        }
        .pf-card:hover .pf-card-photo img,
        .pf-card:hover .pf-medallion {
          transform: none;
        }
      }
    `}</style>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Scroll animation helpers                                                   */
/*   data-card   card wrapper (GSAP-owned)   data-img   photo scale layer     */
/*   data-medal  icon medallion wrapper      data-text  badge / title / copy  */
/*   data-head   section header pieces       data-word  heading words         */
/* ────────────────────────────────────────────────────────────────────────── */
const CLEAR = "opacity,transform,filter";

function hideCard(el) {
  const q = gsap.utils.selector(el);
  gsap.set(el, { opacity: 0, y: 60, scale: 0.97 });
  gsap.set(q("[data-img]"), { scale: 1.25 });
  gsap.set(q("[data-medal]"), { scale: 0, rotate: -40 });
  gsap.set(q("[data-text]"), { opacity: 0, y: 16 });
}

function resetCard(el) {
  el._tl?.kill();
  el._tl = null;
  hideCard(el);
}

function playCard(el, delay = 0) {
  el._tl?.kill();
  hideCard(el);
  const q = gsap.utils.selector(el);
  el._tl = gsap
    .timeline({ delay, defaults: { ease: "power4.out" } })
    .to(el, { opacity: 1, y: 0, scale: 1, duration: 1, clearProps: CLEAR }, 0)
    .to(q("[data-img]"), { scale: 1, duration: 1.4, ease: "power3.out", clearProps: "transform" }, 0)
    .to(
      q("[data-medal]"),
      { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2.2)", clearProps: "transform" },
      0.45
    )
    .to(
      q("[data-text]"),
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, clearProps: CLEAR },
      0.5
    );
}

// Cards animate as each one reaches the viewport (rows reveal on their own
// as you scroll), replay when scrolled back into view from above, and reset
// once they leave.
function setupCards(els) {
  if (!els.length) return undefined;
  els.forEach(hideCard);

  const triggers = ScrollTrigger.batch(els, {
    start: "top 88%",
    end: "bottom 12%",
    interval: 0.1,
    batchMax: 4,
    onEnter: (batch) => batch.forEach((el, i) => playCard(el, i * 0.12)),
    onEnterBack: (batch) => batch.forEach((el, i) => playCard(el, i * 0.12)),
    onLeave: (batch) => batch.forEach(resetCard),
    onLeaveBack: (batch) => batch.forEach(resetCard),
  });

  return () => {
    triggers.forEach((t) => t.kill());
    els.forEach((el) => {
      el._tl?.kill();
      el._tl = null;
      const q = gsap.utils.selector(el);
      gsap.set([el, ...q("[data-img],[data-medal],[data-text]")], { clearProps: "all" });
    });
  };
}

function setupHeader(header) {
  if (!header) return undefined;
  const q = gsap.utils.selector(header);
  let tl = null;

  const hide = () => {
    gsap.set(q("[data-eyebrow]"), { opacity: 0, y: 16 });
    gsap.set(q("[data-word]"), {
      yPercent: 115,
      rotate: 5,
      opacity: 0,
      filter: "blur(10px)",
      transformOrigin: "0% 100%",
    });
    gsap.set(q("[data-sub]"), { opacity: 0, y: 20 });
  };

  const play = () => {
    tl?.kill();
    hide();
    tl = gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .to(q("[data-eyebrow]"), { opacity: 1, y: 0, duration: 0.6, clearProps: CLEAR })
      .to(
        q("[data-word]"),
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
        0.1
      )
      .to(q("[data-sub]"), { opacity: 1, y: 0, duration: 0.8, clearProps: CLEAR }, 0.7);
  };

  const reset = () => {
    tl?.kill();
    tl = null;
    hide();
  };

  hide();
  const st = ScrollTrigger.create({
    trigger: header,
    start: "top 85%",
    end: "bottom 10%",
    onEnter: play,
    onEnterBack: play,
    onLeave: reset,
    onLeaveBack: reset,
  });

  return () => {
    st.kill();
    tl?.kill();
    gsap.set(q("[data-eyebrow],[data-word],[data-sub]"), { clearProps: "all" });
  };
}

function StoryCard({ story }) {
  const Icon = story.icon;

  return (
    // data-card is animated by GSAP; .pf-card inside owns the hover transform.
    <div data-card className="h-full">
      <div
        className="pf-card relative flex h-full flex-col rounded-[26px] bg-white overflow-hidden"
        style={{
          border: "1px solid rgba(20,35,31,0.08)",
          boxShadow: "0 1px 2px rgba(20,35,31,0.04)",
        }}
      >
        {/* Photo */}
        <div className="pf-card-photo relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
          <div data-img className="absolute inset-0">
            <img
              src={story.image}
              alt={story.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(20,35,31,0.24) 0%, rgba(20,35,31,0) 40%)",
            }}
          />
        </div>

        {/* Icon medallion — straddles the photo/content seam */}
        <div className="relative px-6">
          <div data-medal className="absolute -top-6 left-6">
            <div
              className="pf-medallion w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: story.badgeBg,
                boxShadow: "0 6px 16px rgba(20,35,31,0.16), 0 0 0 4px #FFFFFF",
              }}
            >
              <Icon size={20} color={story.iconColor} strokeWidth={2.1} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-6 pt-9 pb-7">
          <span
            data-text
            className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2"
            style={{ color: story.iconColor }}
          >
            {story.badge}
          </span>
          <h3
            data-text
            className="text-[19px] leading-snug font-semibold mb-2.5"
            style={{ color: "#14231F" }}
          >
            {story.title}
          </h3>
          <p data-text className="text-[13.5px] leading-relaxed" style={{ color: "#5B655F" }}>
            {story.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Mobile carousel — one card visible at a time. Purely user-driven:
// swipe/drag, prev/next buttons, and dot indicators. No autoplay.
function MobileCarousel() {
  const [index, setIndex] = useState(0);
  const total = stories.length;
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const goTo = useCallback((next) => {
    setIndex(((next % total) + total) % total);
  }, [total]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 40) {
      if (touchDeltaX.current < 0) goTo(index + 1);
      else goTo(index - 1);
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div data-mobile className="sm:hidden">
      <div
        className="relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="pf-track flex"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {stories.map((story) => (
            <div key={story.id} className="w-full flex-shrink-0 px-0.5">
              <StoryCard story={story} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => goTo(index - 1)}
          className="pf-nav-btn w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(20,35,31,0.12)",
            boxShadow: "0 1px 2px rgba(20,35,31,0.06)",
          }}
        >
          <ChevronLeft size={18} color="#14231F" strokeWidth={2.2} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {stories.map((story, i) => (
            <button
              key={story.id}
              type="button"
              aria-label={`Go to ${story.title}`}
              onClick={() => goTo(i)}
              className="pf-dot rounded-full"
              style={{
                width: i === index ? 20 : 7,
                height: 7,
                background: i === index ? "#2E7D32" : "rgba(20,35,31,0.18)",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next"
          onClick={() => goTo(index + 1)}
          className="pf-nav-btn w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(20,35,31,0.12)",
            boxShadow: "0 1px 2px rgba(20,35,31,0.06)",
          }}
        >
          <ChevronRight size={18} color="#14231F" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

export default function ProgramFeatures() {
  const sectionRef = useRef(null);

  // ─── Scroll-driven entrance (GSAP + ScrollTrigger) ─────────────────────────
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const mm = gsap.matchMedia();
    const ok = "(prefers-reduced-motion: no-preference)";

    mm.add(ok, () => setupHeader(section.querySelector("[data-header]")));

    // Only the layout that's actually visible gets triggers.
    mm.add(`(min-width: 640px) and ${ok}`, () =>
      setupCards([...section.querySelectorAll("[data-grid] [data-card]")])
    );
    mm.add(`(max-width: 639px) and ${ok}`, () =>
      setupCards([...section.querySelectorAll("[data-mobile] [data-card]")])
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full" style={{ background: "#F5F4F0" }}>
      <AnimationStyles />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-20 lg:py-28">
        {/* Header */}
        <div data-header className="max-w-2xl mb-14 lg:mb-16">
          <span
            data-eyebrow
            className="block text-[11px] font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: "#2E7D32" }}
          >
            Why FitMom
          </span>
          <h2
            className="text-[34px] sm:text-[42px] leading-[1.1] font-semibold mb-4"
            style={{ color: "#14231F" }}
          >
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
            data-sub
            className="text-[15px] leading-relaxed"
            style={{ color: "#5B655F" }}
          >
            Eight pillars, built around real motherhood, not a generic fitness app.
          </p>
        </div>

        {/* Mobile — single card carousel, swipe-driven, no autoplay. */}
        <MobileCarousel />

        {/* Tablet/Desktop — 4 columns / 2 rows grid. */}
        <div
          data-grid
          className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
        >
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}