import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from "../assets/home/fitmom.png";
import woman from "../assets/footer/woman.png"
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

// TODO: replace with your own image, e.g. import ctaImage from "../assets/footer/cta.jpg"
const CTA_IMAGE = woman;

/* ---------- icons ---------- */

const Svg = ({ children, size = 16, fill = "none", ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {children}
  </svg>
);

const ArrowUpRight = ({ size = 12 }) => (
  <Svg size={size} strokeWidth="2.2"><path d="M7 17 17 7M8 7h9v9" /></Svg>
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
  `inline-flex items-center gap-1.5 text-[14px] text-[#555] transition hover:text-[#111] ${focus}`;

/* ---------- footer ---------- */

export default function Footer() {
  return (
    <footer
      className="bg-gradient-to-b from-white to-[#f6f6f7] px-4 pb-6 pt-14 text-[#111] sm:px-8 sm:pt-20"
      style={{ fontFamily: FONT }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <div className="mx-auto max-w-[1100px]">
        {/* ===== CTA card ===== */}
        <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_24px_60px_-24px_rgba(20,20,40,0.18)] ring-1 ring-black/[0.03] md:grid md:grid-cols-2">
          <div className="flex flex-col justify-center px-7 py-10 sm:px-10 sm:py-12 md:py-14">
            <p className="text-[13px] text-[#6b6f80]">Start your journey</p>
            <h2 className="mt-4 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[34px]">
              Are you ready? Make a change.
            </h2>
            <p className="mt-4 max-w-[38ch] text-[15px] leading-[1.55] text-[#555]">
              Personalised health, lifestyle and fertility guidance, with a
              community of moms beside you every step of the way.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                to="/book-consultation"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#111] px-6 py-3.5 text-[14px] font-medium text-white transition hover:bg-[#0b4732] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111]"
              >
                Book a session <ArrowUpRight />
              </Link>
              <HashLink to="/#programs" className={`text-[14px] font-medium text-[#111] underline decoration-black/25 underline-offset-4 transition hover:decoration-black ${focus}`}>
                Our Programs
              </HashLink>
            </div>
          </div>

          {/* image: sits below the text on mobile, fills the right half on desktop */}
          <div className="p-3 pt-0 md:p-3">
            <img
              src={CTA_IMAGE}
              alt=""
              loading="lazy"
              className="h-[240px] w-full rounded-[22px] object-cover sm:h-[300px] md:h-full md:min-h-[320px]"
            />
          </div>
        </section>

        {/* ===== Columns ===== */}
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-16 lg:grid-cols-[1.35fr_0.8fr_1fr_0.8fr_1.5fr] lg:gap-x-8">
          {/* brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="" aria-hidden="true" className="h-9 w-9 object-contain" />
              <span className="text-[20px] font-semibold tracking-[-0.03em]">FitMom Club</span>
            </div>
            <p className="mt-4 max-w-[30ch] text-[14px] leading-[1.55] text-[#555]">
              Health, lifestyle and fertility support, made for moms.
            </p>
          </div>

          <nav aria-label="Pages">
            <ColTitle>Pages</ColTitle>
            <ul className="space-y-4">
              {PAGES.map((l) => (
                <li key={l.label}><Link to={l.href} className={colLink}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Programs">
            <ColTitle>Programs</ColTitle>
            <ul className="space-y-4">
              {PROGRAMS.map((l) => (
                <li key={l.label}><Link to={l.href} className={colLink}>{l.label} <ArrowUpRight /></Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Socials">
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
          <div className="col-span-2 lg:col-span-1">
            <ColTitle>From our blog</ColTitle>
            <p className="max-w-[34ch] text-[14px] leading-[1.55] text-[#555]">
              Read tips, stories and expert advice on health, lifestyle and
              fertility for moms.
            </p>
            <Link
              to="/blogs"
              className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-[#111] px-6 py-3.5 text-[14px] font-medium text-white transition hover:bg-[#0b4732] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111]"
            >
              Read our blogs <ArrowUpRight />
            </Link>
          </div>
        </div>

        {/* ===== Bottom row ===== */}
        <div className="mt-14 flex flex-col gap-5 text-[12px] text-[#555] sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
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

          <ul className="flex items-center gap-5 text-[#555]">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className={`transition hover:text-[#111] ${focus}`}>
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