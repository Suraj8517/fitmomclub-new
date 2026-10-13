import React, { Fragment, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../assets/home/fitmom.png";
import woman from "../assets/footer/woman.png";

gsap.registerPlugin(ScrollTrigger);

/* ---------- content ---------- */

const PAGES = [
  { label: "Home", href: "/" },
  { label: "Community", href: "/community" },
  { label: "Our App", href: "/our-app" },
  { label: "Blogs", href: "/blogs" },
  { label: "FAQ", href: "/FAQs" },
];

const PROGRAMS = [
  { label: "Health & Lifestyle", href: "/fmc" },
  { label: "Natural Conception", href: "/miracle" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/fitmomclub.co/" },
  { label: "Facebook", href: "https://www.facebook.com/Fitmomclub.co" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCD1g7ji_oZieKaeU3vMvoQw" },
];

const POLICIES = [
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const CTA_IMAGE = woman;
const HEADLINE = "Are you ready? Make a change.";

/* ---------- icons ---------- */

const Svg = ({ children, size = 16, fill = "none", ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {children}
  </svg>
);

// The arrow nudges up-right when its parent link (class "group") is hovered.
const ArrowUpRight = ({ size = 12 }) => (
  <Svg
    size={size}
    strokeWidth="2.2"
    className="transition-transform duration-300 ease-out group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);
const IgIcon = () => (
  <Svg size={17}><rect x="2.5" y="2.5" width="19" height="19" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" /></Svg>
);
const FbIcon = () => (
  <Svg size={17} fill="currentColor" strokeWidth="0"><path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.022 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.918 8.437-9.94z" /></Svg>
);
const YtIcon = () => (
  <Svg size={19} fill="currentColor" strokeWidth="0"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.12C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.391.521a2.994 2.994 0 0 0-2.107 2.12A31.29 31.29 0 0 0 0 12a31.29 31.29 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.107 2.12c1.886.521 9.391.521 9.391.521s7.505 0 9.391-.521a2.994 2.994 0 0 0 2.107-2.12A31.29 31.29 0 0 0 24 12a31.29 31.29 0 0 0-.502-5.814zM9.6 15.568V8.432L15.818 12 9.6 15.568z" /></Svg>
);

const SOCIAL_ICONS = { Instagram: <IgIcon />, Facebook: <FbIcon />, YouTube: <YtIcon /> };

/* ---------- small building blocks ---------- */

const FONT = "'Inter', 'Segoe UI', system-ui, sans-serif";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111]";

const ColTitle = ({ children }) => (
  <h3 className="mb-5 text-[14px] font-medium text-[#111]">{children}</h3>
);

const colLink =
  `group inline-flex items-center gap-1.5 text-[14px] text-[#555] transition hover:text-[#111] ${focus}`;

const pillBtn =
  "group inline-flex items-center gap-2.5 rounded-full bg-[#111] px-6 py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#0b4732] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111]";

/* Masked word-by-word headline (words are animated by the footer timeline). */
function SplitHeadline({ text }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
            <span data-w className="inline-block will-change-transform">{w}</span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

/* ---------- footer ---------- */

export default function Footer() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* ---- CTA card: one timeline, plays when the card scrolls into view ---- */
      gsap.set(q("[data-img]"), { scale: 1.3 });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: q("[data-cta-card]")[0], start: "top 85%", once: true },
        })
        .from(q("[data-cta-card]"), { y: 70, opacity: 0, duration: 1 })
        .from(q("[data-label]"), { y: 14, opacity: 0, duration: 0.6 }, "-=0.6")
        .from(
          q("[data-w]"),
          {
            yPercent: 115,
            rotate: 5,
            opacity: 0,
            filter: "blur(8px)",
            transformOrigin: "0% 100%",
            duration: 1,
            ease: "power4.out",
            stagger: 0.07,
            clearProps: "filter",
          },
          "-=0.5"
        )
        .from(q("[data-para]"), { y: 20, opacity: 0, duration: 0.7 }, "-=0.7")
        .from(
          q("[data-cta-action]"),
          { y: 20, opacity: 0, scale: 0.92, duration: 0.7, stagger: 0.1, ease: "back.out(1.6)", clearProps: "transform" },
          "-=0.5"
        )
        // image: wipes open from the bottom while it settles from a zoom
        .fromTo(
          q("[data-img-wrap]"),
          { clipPath: "inset(100% 0% 0% 0% round 22px)" },
          { clipPath: "inset(0% 0% 0% 0% round 22px)", duration: 1.2, ease: "power4.inOut", clearProps: "clipPath" },
          0.2
        )
        .to(q("[data-img]"), { scale: 1.12, duration: 1.6, ease: "power3.out" }, 0.2);

      // image parallax while scrolling past
      gsap.fromTo(
        q("[data-img]"),
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: q("[data-cta-card]")[0], start: "top bottom", end: "bottom top", scrub: true },
        }
      );

      /* ---- Link columns: staggered rise ---- */
      gsap.from(q("[data-col]"), {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: q("[data-cols]")[0], start: "top 90%", once: true },
      });

      /* ---- Bottom row ---- */
      gsap.from(q("[data-bottom]"), {
        y: 16,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: { trigger: q("[data-bottom-row]")[0], start: "top 98%", once: true },
      });
    });

    /* ---- Magnetic pill buttons (mouse / trackpad only) ---- */
    mm.add(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
      () => {
        const cleanups = q("[data-magnet]").map((el) => {
          const move = (e) => {
            const r = el.getBoundingClientRect();
            gsap.to(el, {
              x: (e.clientX - (r.left + r.width / 2)) * 0.25,
              y: (e.clientY - (r.top + r.height / 2)) * 0.35,
              duration: 0.4,
              ease: "power3.out",
              overwrite: "auto",
            });
          };
          const leave = () =>
            gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          return () => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          };
        });
        return () => cleanups.forEach((fn) => fn());
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <footer
      ref={rootRef}
      className="bg-gradient-to-b from-[#F5F3F0] to-[#f6f6f7] px-4 pb-6 pt-14 text-[#111] sm:px-8 sm:pt-20"
      style={{ fontFamily: FONT }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <div className="mx-auto max-w-[1300px]">
        {/* ===== CTA card ===== */}
        <section
          data-cta-card
          className="overflow-hidden rounded-[32px] bg-white shadow-[0_24px_60px_-24px_rgba(20,20,40,0.18)] ring-1 ring-black/[0.03] md:grid md:grid-cols-2"
        >
          <div className="flex flex-col justify-center px-7 py-10 sm:px-10 sm:py-12 md:py-14">
            <p data-label className="text-[13px] text-[#6b6f80]">Start your journey</p>
            <h2 className="mt-4 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[34px]">
              <SplitHeadline text={HEADLINE} />
            </h2>
            <p data-para className="mt-4 max-w-[38ch] text-[15px] leading-[1.55] text-[#555]">
              Personalised health, lifestyle and fertility guidance, with a
              community of moms beside you every step of the way.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div data-cta-action>
                <div data-magnet className="inline-block">
                  <Link to="/book-consultation" className={pillBtn}>
                    Book a session <ArrowUpRight />
                  </Link>
                </div>
              </div>
              <div data-cta-action>
                <HashLink to="/#programs" className={`text-[14px] font-medium text-[#111] underline decoration-black/25 underline-offset-4 transition hover:decoration-black ${focus}`}>
                  Our Programs
                </HashLink>
              </div>
            </div>
          </div>

          {/* image: below the text on mobile, right half on desktop */}
          <div className="p-3 pt-0 md:p-3">
            <div
              data-img-wrap
              className="mt-4 h-[240px] overflow-hidden  rounded-[22px] sm:h-[300px] md:mt-4 md:h-full md:min-h-[320px]"
            >
              <img
                data-img
                src={CTA_IMAGE}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover will-change-transform "
              />
            </div>
          </div>
        </section>

        {/* ===== Columns ===== */}
        <div
          data-cols
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-16 lg:grid-cols-[1.35fr_0.8fr_1fr_0.8fr_1.5fr] lg:gap-x-8"
        >
          {/* brand */}
          <div data-col className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="" aria-hidden="true" className="h-9 w-9 object-contain" />
              <span className="text-[20px] font-semibold tracking-[-0.03em]">FitMom Club</span>
            </div>
            <p className="mt-4 max-w-[30ch] text-[14px] leading-[1.55] text-[#555]">
              Health, lifestyle and fertility support, made for moms.
            </p>
          </div>

          <nav data-col aria-label="Pages">
            <ColTitle>Pages</ColTitle>
            <ul className="space-y-4">
              {PAGES.map((l) => (
                <li key={l.label}><Link to={l.href} className={colLink}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav data-col aria-label="Programs">
            <ColTitle>Programs</ColTitle>
            <ul className="space-y-4">
              {PROGRAMS.map((l) => (
                <li key={l.label}><Link to={l.href} className={colLink}>{l.label} <ArrowUpRight /></Link></li>
              ))}
            </ul>
          </nav>

          <nav data-col aria-label="Socials">
            <ColTitle>Socials</ColTitle>
            <ul className="space-y-4">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className={colLink}>
                    {s.label} <ArrowUpRight />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* blogs */}
          <div data-col className="col-span-2 lg:col-span-1">
            <ColTitle>From our blog</ColTitle>
            <p className="max-w-[34ch] text-[14px] leading-[1.55] text-[#555]">
              Read tips, stories and expert advice on health, lifestyle and
              fertility for moms.
            </p>
            <div data-magnet className="mt-5 inline-block">
              <Link to="/blogs" className={pillBtn}>
                Read our blogs <ArrowUpRight />
              </Link>
            </div>
          </div>
        </div>

        {/* ===== Bottom row ===== */}
        <div
          data-bottom-row
          className="mt-14 flex flex-col gap-5 text-[12px] text-[#555] sm:mt-16 sm:flex-row sm:items-center sm:justify-between"
        >
          <p data-bottom className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© {new Date().getFullYear()} FitMom Club</span>
            <span aria-hidden="true">·</span>
            <span>All rights reserved</span>
            {POLICIES.map((l) => (
              <React.Fragment key={l.label}>
                <span aria-hidden="true">·</span>
                <Link to={l.href} className="text-[#8a8d9a] transition hover:text-[#111]">{l.label}</Link>
              </React.Fragment>
            ))}
          </p>

          <ul data-bottom className="flex items-center gap-5 text-[#555]">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className={`inline-block transition duration-300 hover:-translate-y-1 hover:text-[#111] ${focus}`}
                >
                  {SOCIAL_ICONS[s.label]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}