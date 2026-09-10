import React, { useEffect, useRef, useState } from "react";
import bgdesk from "../assets/footer/bgdesk.png";
import bgmob from "../assets/footer/bgmob.png";
import logo from "../assets/home/fitmom.png"
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
const SOCIAL_LINKS = [
  {
    label: "Instagram",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
    href: "https://www.instagram.com/fitmomclub.co/",
  },
  {
    label: "Facebook",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.022 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.918 8.437-9.94z" />
      </svg>
    ),
    href: "https://www.facebook.com/Fitmomclub.co",
  },
  {
    label: "YouTube",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.12C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.391.521a2.994 2.994 0 0 0-2.107 2.12A31.29 31.29 0 0 0 0 12a31.29 31.29 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.107 2.12c1.886.521 9.391.521 9.391.521s7.505 0 9.391-.521a2.994 2.994 0 0 0 2.107-2.12A31.29 31.29 0 0 0 24 12a31.29 31.29 0 0 0-.502-5.814zM9.6 15.568V8.432L15.818 12 9.6 15.568z" />
      </svg>
    ),
    href: "https://www.youtube.com/channel/UCD1g7ji_oZieKaeU3vMvoQw",
  },
];

const linkGroups = [
  {
    title: "Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "Community", href: "/community" },
      { label: "Our App", href: "/our-app" },
      { label: "Blogs", href: "/blogs" },
      { label: "FAQ", href: "/FAQs" },
      { label: "Webinars", href: "/webinars" },
    ],
  },
 
  {
    title: "Programs",
    links: [
      { label: "Health & Lifestyle Management", href: "/fmc" },
      { label: "Natural Conception & Fertility", href: "/miracle" },
    ],
  },
];

const policyLinks = [  { label: "Privacy Policy", href: "/privacy-policy" }, { label: "Terms & Conditions", href: "/terms-and-conditions" } ];

/* ---------- parallax hook ---------- */

function useParallax(speed = 0.15) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const el = ref.current;
      if (!el) {
        ticking = false;
        return;
      }
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      // distance of the element's center from the viewport center, used
      // to drive a gentle up/down drift as the footer scrolls into view
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportH / 2;
      const delta = (viewportCenter - elementCenter) * speed;
      setOffset(delta);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return { ref, offset };
}

/* ---------- footer ---------- */

export default function Footer() {
  const { ref: parallaxRef, offset } = useParallax(0.12);

  return (
    <footer className=" px-3 py-3 sm:px-6 sm:py-6">
      <div
        ref={parallaxRef}
        className="relative mx-auto overflow-hidden rounded-[26px] bg-[#0b4732] shadow-[0_20px_60px_-20px_rgba(11,60,42,0.55)]"
      >
        {/* ===== Background artwork (parallax) ===== */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.15)` }}
        >
          <img
            src={bgmob}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover sm:hidden"
          />
          <img
            src={bgdesk}
            alt=""
            aria-hidden="true"
            className="hidden h-full w-full object-cover object-bottom sm:block"
          />
        </div>

        {/* ===== Overlay for legibility ===== */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#04180f]/70 via-[#0b4732]/35 to-[#04180f]/85"
        />

        {/* ===== Hero copy ===== */}
        <div className="relative z-10 flex flex-col gap-6 px-6 pt-10 sm:px-10 sm:pt-14 md:flex-row md:items-start md:justify-between">
          <h2 className="text-3xl font-bold leading-tight text-white drop-shadow-sm sm:text-4xl">
            Are you ready?
            <span className="block text-white/90">Make a change.</span>
          </h2>

          <div className="flex shrink-0 items-center gap-6">
            <HashLink
              to="/#programs"
              className="flex items-center gap-2 text-[14px] font-medium text-white/90 underline decoration-white/40 underline-offset-4 transition hover:text-white hover:decoration-white"
            >
              Our Programs
            </HashLink>
            <Link
              to="/book-consultation"
              className="rounded-lg bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#0b4732] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Book a session
            </Link>
          </div>
        </div>

        {/* spacer so the illustration has room to breathe before the panel */}
        <div className="h-[190px] sm:h-[200px]" />

        {/* ===== Bottom row: brand (transparent) + glass nav card ===== */}
        <div className="relative z-10 flex flex-col gap-6 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:pb-10">
          {/* Brand, sits directly on the illustration */}
          <div className="shrink-0">
            <div className="flex items-center gap-2 text-white">
             <img src={logo} alt="FitMom Club" className="h-18 w-18" />
              <span className="text-[18px] font-bold uppercase tracking-[0.16em]">
                FitMom Club
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                    aria-label={social.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 ring-1 ring-white/20 transition hover:text-white hover:ring-white/50"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Glass nav card */}
          <div className="w-full rounded-2xl bg-[#06301f]/30 px-6 py-6 backdrop-blur-sm ring-1 ring-white/10 sm:w-auto sm:px-8">
            <div className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4">
              {linkGroups.map((group) => (
                <div key={group.title}>
                  <h4 className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    {group.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href} className="text-[13.5px] text-white/85 transition hover:text-white">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Legal */}
              <div>
                <h4 className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/45">
                  Legal
                </h4>
                <ul className="space-y-2.5">
                  {policyLinks.map((label) => (
                    <li key={label.label}>
                      <a
                        href={label.href}
                        className="text-[13.5px] text-white/85 transition hover:text-white"
                      >
                        {label.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}