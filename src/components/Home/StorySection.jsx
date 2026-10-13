import { Fragment, useRef, useLayoutEffect } from "react";
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
  Venus,
  Apple,Moon
} from "lucide-react";
import Nutrition from "../Helper/StorySection/Nutrition";
import Fitness from "../Helper/StorySection/Fitness";
import Coach from "../Helper/StorySection/Coach";
import RunningMap from "../Helper/StorySection/Expert";
import Goals from "../Helper/StorySection/Goals";
import Nutrition2 from "../Helper/StorySection/Nutrition2";
import MenstrualCycle from "../Helper/StorySection/MenstrualCycle";
import Sleep from "../Helper/StorySection/SleepTracker";
import HealthTracker from "../Helper/StorySection/ActivityTracker";

gsap.registerPlugin(ScrollTrigger);

// True on phones / small tablets — animations start earlier and run a bit
// faster there, so content never scrolls away before its entrance plays.
const isMobile = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
const mom ="https://res.cloudinary.com/q1vba78b/image/upload/v1791863501/mother_vfrvcr.webp";
const wellness="https://res.cloudinary.com/q1vba78b/image/upload/v1791863505/wellness_e74adj.webp"
const online ="https://res.cloudinary.com/q1vba78b/image/upload/v1791863503/online_bq5yyz.webp"
const trainer = "https://res.cloudinary.com/q1vba78b/image/upload/v1791863505/trainer_bxgvuy.webp"
const support ="https://res.cloudinary.com/q1vba78b/image/upload/v1791863503/support_xgn6cr.webp"
const goals="https://res.cloudinary.com/q1vba78b/image/upload/v1791863504/goal_oip8yb.webp"
const nutrition ="https://res.cloudinary.com/q1vba78b/image/upload/v1791863503/nutrition_rodna3.webp"
const sleep="https://res.cloudinary.com/q1vba78b/image/upload/v1786101450/sleep_s2d5rx.webp"
const cycle ="https://res.cloudinary.com/q1vba78b/image/upload/v1786078998/cycle_f6p4lu.webp"
const tracker = "https://res.cloudinary.com/q1vba78b/image/upload/v1786105331/activity_fjkxqw.webp"
const stories = [
{
  id: 1,
  title: "Workout Tracker",
  badge: "Stay Active",
  badgeBg: "#FFE7A8",
  icon: Target,
  iconColor: "#B56A00",
  image: goals,
  description:
    "Track your workouts, monitor your progress, and stay motivated with personalized insights that help you build a consistent fitness routine.",
  overlay: "goals",
},
 {
  id: 2,
  title: "Menstrual Cycle Tracking",
  badge: "Hormonal Health",
  badgeBg: "#FAD7E6",      // Soft pink
  icon: Venus,
  iconColor: "#D63384",    // Deep pink
  image: cycle,
  description:
    "Your cycle changes your body's needs. FitMom Club helps you train, eat, and recover with personalized guidance.",
  overlay: "cycle",
},
  {
    id: 3,
    title: "Smart Nutrition Support",
    badge: "Healthy Eating",
    badgeBg: "#D7F5D8",
    icon: Apple,
    iconColor: "#2E7D32",
    image: nutrition,
    description:
      "Receive personalized nutrition plans crafted around your lifestyle, recovery, and health goals to fuel your body with confidence.",
    overlay: "nutrition2",
  },
    {
  id: 4,
  title: "Sleep Tracker",
  badge: "Better Sleep",
  badgeBg: "#E3E8FF",
  icon: Moon,
  iconColor: "#4F46E5",
  image: sleep,
  description:
    "Track your sleep patterns and receive personalized insights to improve your rest, recovery, energy, and overall well-being.",
  overlay: "sleep",
},
  {
  id: 5,
  title: "Health Tracker",
  badge: "Overall Wellness",
  badgeBg: "#D7F5D8",
  icon: Apple,
  iconColor: "#2E7D32",
  image: tracker,
  description:
    "Track your daily health metrics, monitor your progress, and receive personalized insights to support your overall wellness journey.",
  overlay: "tracker",
},
];

function FloatingOverlay({ type }) {
  switch (type) {
    case "nutrition":
     return(<Nutrition/>);

    case "fitness":
      return (
        <Fitness/>
      );

    case "sleep":
      return (
        <Sleep/>
      );
case "tracker":
  return(
    <HealthTracker/>
  );
    case "goals":
      return (
        <Goals/>
      );

    case "nutrition2":
      return (
       <Nutrition2/>
      );
 case "cycle":
      return (
       <MenstrualCycle/>
      );
    default:
      return null;
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Animation helpers (GSAP + ScrollTrigger)                                   */
/* ────────────────────────────────────────────────────────────────────────── */
const CLEAR = "opacity,transform,filter";

// Words rise out of a mask, un-rotate and un-blur (same as the hero headline).
function SplitLines({ lines, lineClass = [] }) {
  return (
    <>
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {line.split(" ").map((w, i) => (
            <Fragment key={`${w}-${i}`}>
              <span
                aria-hidden="true"
                className={`inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom ${lineClass[li] || ""}`}
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
    rotate: 4,
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

function StoryScene({ story, index }) {
  const ref = useRef(null);
  const Icon = story.icon;

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const badge = q("[data-badge]");
      const icon = q("[data-icon]");
      const words = q("[data-word]");
      const desc = q("[data-desc]");
      const layer = q("[data-layer]");
      const dim = q("[data-dim]");

      let tl = null;

      const hide = () => {
        gsap.set(badge, { opacity: 0, y: -16, x: -12 });
        gsap.set(icon, { opacity: 0, y: -16, x: -12, scale: 0.6 });
        hideWords(words);
        gsap.set(desc, { opacity: 0, y: 28, filter: "blur(6px)" });
      };

      const play = () => {
        tl?.kill();
        hide();
        tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(badge, { opacity: 1, y: 0, x: 0, duration: 0.8, clearProps: CLEAR }, 0.05)
          .to(
            icon,
            { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.9, ease: "back.out(1.8)" },
            0.2
          );
        showWords(tl, words, 0.2);
        tl.to(desc, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, clearProps: CLEAR }, 0.7)
          // Gentle idle float on the icon (replaces the old CSS keyframe loop).
          .to(
            icon,
            { y: -6, scale: 1.06, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 },
            1.1
          );
        if (isMobile()) tl.timeScale(1.25);
      };

      const reset = () => {
        tl?.kill();
        tl = null;
        hide();
      };

      hide();

      // Plays as the scene arrives — scrolling down OR back up into it —
      // and resets once it has scrolled away, so it replays each time.
      const enter = ScrollTrigger.create({
        trigger: root,
        start: () => (isMobile() ? "top 80%" : "top 60%"),
        end: "bottom 40%",
        onEnter: play,
        onEnterBack: play,
        onLeave: reset,
        onLeaveBack: reset,
      });

      // Exit: as the scene scrolls out, its content recedes and dims.
      // (Applied to the content layer only — transforms on the background
      // would break its fixed-attachment parallax.)
      const exit = gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        })
        .to(layer, { scale: 0.95, y: -30, ease: "none" }, 0)
        .to(dim, { opacity: 0.55, ease: "none" }, 0);

      return () => {
        enter.kill();
        exit.scrollTrigger?.kill();
        exit.kill();
        tl?.kill();
        gsap.set([badge, icon, words, desc, layer, dim], { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-[100vh] md:h-[100vh]"
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ zIndex: index + 1 }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${story.image})`,
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 h-full w-full"
          style={{
           
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        <div data-layer className="absolute inset-0 will-change-transform">
          {/* ── Badge + Icon ── */}
          <div
            className="absolute left-5 top-[45vh] sm:top-10 sm:left-10 flex items-center gap-2"
            style={{ zIndex: 2 }}
          >
            {/* Badge pill */}
            <div
              data-badge
              className="rounded-full backdrop-blur-sm px-5 py-4.5 font-medium text-sm shadow-lg"
              style={{
                backgroundColor: story.badgeBg,
                color: story.iconColor,
              }}
            >
              {story.badge}
            </div>

            {/* Icon circle */}
            <div
              data-icon
              className="flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-sm shadow-lg"
              style={{ backgroundColor: story.badgeBg }}
            >
              <Icon size={26} color={story.iconColor} strokeWidth={2.3} />
            </div>
          </div>

          {/* ── Title + Description ── */}
          <div
            className="absolute bottom-20 lg:left-14 left-4 max-w-3xl"
            style={{ zIndex: 2 }}
          >
            <h1
              className="whitespace-pre-line font-medium text-white leading-[0.98] tracking-[-0.02em]"
              style={{ fontSize: "clamp(28px, 4vw, 64px)" }}
            >
              <SplitLines lines={[story.title]} />
            </h1>

            <p
              data-desc
              className="mt-12 sm:text-[26px] text-[20px] mt:leading-10 leading-8 text-white/85 max-w-xl"
            >
              {story.description}
            </p>
          </div>

          <FloatingOverlay type={story.overlay} />
        </div>

        {/* Exit dimmer — fades in as the scene scrolls away */}
        <div
          data-dim
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black/20"
          style={{ zIndex: 3, opacity: 0 }}
        />
      </div>
    </div>
  );
}

export default function StorySection() {
  const headerRef = useRef(null);

  // Section heading: words rise in each time it scrolls into view.
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = q("[data-word]");
      let tl = null;

      const reset = () => {
        tl?.kill();
        tl = null;
        hideWords(words);
      };
      const play = () => {
        tl?.kill();
        hideWords(words);
        tl = gsap.timeline();
        showWords(tl, words, 0);
      };

      hideWords(words);
      const st = ScrollTrigger.create({
        trigger: el,
        start: () => (isMobile() ? "top 95%" : "top 85%"),
        end: "bottom top",
        onEnter: play,
        onEnterBack: play,
        onLeave: reset,
        onLeaveBack: reset,
      });

      return () => {
        st.kill();
        tl?.kill();
        gsap.set(words, { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="relative bg-[#F6F5F1]">
      <div ref={headerRef} className="max-w-4xl md:px-16 md:py-30 px-2 py-10">
        <h2 className="md:text-5xl text-2xl leading-8 md:leading-12 text-black/90 text-center sm:text-left">
          <SplitLines
            lines={["FitMom Club", "App Features"]}
            lineClass={["", "text-teal-600"]}
          />
        </h2>
      </div>
      {stories.map((story, index) => (
        <StoryScene key={story.id} story={story} index={index} />
      ))}
    </section>
  );
}