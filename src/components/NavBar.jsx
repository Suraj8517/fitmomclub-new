import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/home/fitmom.png"

const NAV_LINKS = [
  { label: "Home", links: "/" },
  { label: "About Us", links: "about-us" },
  { label: "Our Community", links: "community" },
];

const WHAT_WE_OFFER = [
  { label: "Success Stories", links: "success-stories" },
  { label: "Our App", links: "our-app" },
  { label: "Webinars", links: "webinars" }
];
const Programs = [
  { label: "Health & Lifestyle Management", links: "fmc" },
  { label: "Natural Conception & Fertility", links: "miracle" },
];
const RESOURCES = [
  { label: "Blogs", links: "blogs" },
  { label: "Health Calculators", links: "health-calculators" },
];

const SUPPORT = [
  { label: "FAQ", links: "FAQs" },
];

const DOWNLOAD_LINKS = [
  {
    label: "Download on App Store",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    label: "Get it on Google Play",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3.18 23.76c.33.18.7.23 1.05.15l12.3-7.1-2.65-2.65-10.7 9.6zm-1.8-20.2C1.14 3.9 1 4.28 1 4.7v14.6c0 .42.14.8.38 1.14l.07.06 8.18-8.18v-.2L1.45 3.5l-.07.06zM20.34 10.3l-2.3-1.33-2.97 2.97 2.97 2.97 2.32-1.34c.66-.38.66-1.89-.02-2.27zM4.23.3L16.54 7.4 13.88 10.06 3.18.46C3.53.28 3.9.22 4.23.3z" />
      </svg>
    ),
  },
];

const DEFAULT_THEME = "dark";
const ROUTE_THEME_MAP = {
  "/": "light",
  "/about-us": "dark",
  "/community": "light",
  "/terms-and-conditions": "dark",
};

function getThemeForPath(pathname) {
  return ROUTE_THEME_MAP[pathname] ?? DEFAULT_THEME;
}

// Normalizes a link's `links` value ("about-us", "/") into a real path
function toPath(link) {
  return link === "/" ? "/" : `/${link}`;
}

// Case-insensitive, trailing-slash-tolerant comparison so route casing
// (e.g. "FAQs" vs "/faqs") or a trailing "/" doesn't silently break the match
function isActivePath(pathname, link) {
  const clean = (p) => p.replace(/\/+$/, "").toLowerCase() || "/";
  return clean(pathname) === clean(toPath(link));
}

function MenuLink({ to, children, active, delay = 0 }) {
  return (
    <Link
      to={to}
      style={{ animationDelay: `${delay}ms` }}
      className={[
        "stagger-item group flex items-center gap-2 -mx-2 px-2 py-[7px] rounded-lg text-[14.5px] transition-all duration-150 border",
        active
          ? "bg-teal-600 text-white font-semibold border-teal-700 shadow-sm"
          : "font-medium text-gray-700 border-transparent hover:bg-black/[0.04] hover:text-gray-900 hover:translate-x-0.5",
      ].join(" ")}
    >
      {active && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
      {children}
      <svg
        className={[
          "w-3 h-3 ml-auto -translate-x-0.5 transition-all duration-150",
          active
            ? "opacity-80 translate-x-0 text-white"
            : "opacity-0 group-hover:opacity-40 group-hover:translate-x-0",
        ].join(" ")}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function MenuColumn({ title, items, pathname, baseDelay = 0 }) {
  return (
    <div className="stagger-item" style={{ animationDelay: `${baseDelay}ms` }}>
      <p className="text-[10.5px] text-teal-700/70 font-bold uppercase tracking-[0.08em] mb-1.5">
        {title}
      </p>
      <div className="flex flex-col">
        {items.map((link, i) => (
          <MenuLink
            key={link.label}
            to={link.links}
            active={isActivePath(pathname, link)}
            delay={baseDelay + (i + 1) * 30}
          >
            {link.label}
          </MenuLink>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const textTheme = getThemeForPath(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const lastScrollY = useRef(0);
  const downloadRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 10);
      if (currentY > lastScrollY.current && currentY > 60) {
        setVisible(false);
        setMenuOpen(false);
        setDownloadOpen(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (downloadRef.current && !downloadRef.current.contains(e.target)) {
        setDownloadOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDownloadOpen(false);
  }, [pathname]);

  const useLightStyling = !scrolled && textTheme === "light";

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          visible ? "translate-y-0" : "-translate-y-full",
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-12">
          <div className="flex items-center justify-between h-16 sm:h-28">

            {/* Logo */}
            <Link
              to="/"
              className={[
                "flex items-center gap-2.5 shrink-0",
                pathname === "/terms-and-conditions" ? "invisible" : "",
              ].join(" ")}
            >
              <img className="w-12 h-12" src={logo} />
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-3 sm:gap-8">
              {/* Hamburger / X — with floating menu panel */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => { setMenuOpen((v) => !v); setDownloadOpen(false); }}
                  className={[
                    "flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-xl transition-all duration-200 active:scale-90",
                    menuOpen ? "rotate-90" : "rotate-0",
                    useLightStyling
                      ? "bg-white/20 hover:bg-white/30 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                  ].join(" ")}
                  aria-label="Menu"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {menuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4  14h16" />
                    )}
                  </svg>
                </button>

                {menuOpen && (
                  <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-[68px] sm:top-full sm:mt-3 w-auto sm:w-[440px] max-h-[calc(100vh-84px)] sm:max-h-[80vh] overflow-y-auto bg-[#f5f0eb] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-black/[0.06] p-4 sm:p-5 animate-panelIn">

                    {/* Main nav links — gradient pills, wraps on narrow screens */}
                    <div className="flex flex-wrap items-center gap-2 pb-4 mb-4 border-b border-black/[0.07]">
                      {NAV_LINKS.map((link, i) => {
                        const active = isActivePath(pathname, link);
                        return (
                          <Link
                            key={link.label}
                            to={link.links}
                            style={{
                              animationDelay: `${i * 40}ms`,
                              background: active
                                ? "linear-gradient(90deg,#00d4ff,#50ffaa)"
                                : "linear-gradient(90deg,#50ffaa,#00d4ff)",
                            }}
                            className={[
                              "stagger-item flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 hover:scale-105 hover:brightness-110 hover:shadow-lg active:scale-95",
                              active ? "scale-105 ring-2 ring-offset-1 ring-[#062019]/70 shadow-md" : "",
                            ].join(" ")}
                          >
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#062019" }} />
                            )}
                            <span style={{ color: "#062019" }}>{link.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Sections — single column on mobile, 2-column grid from sm up */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                      <MenuColumn title="What We Offer" items={WHAT_WE_OFFER} pathname={pathname} baseDelay={80} />
                      <MenuColumn title="Programs" items={Programs} pathname={pathname} baseDelay={110} />
                      <MenuColumn title="Resources" items={RESOURCES} pathname={pathname} baseDelay={140} />
                      <MenuColumn title="Support" items={SUPPORT} pathname={pathname} baseDelay={170} />
                    </div>

                    {/* Get the app — only shown here on mobile */}
                    <div
                      className="stagger-item sm:hidden mt-5 pt-4 border-t border-black/[0.07]"
                      style={{ animationDelay: "220ms" }}
                    >
                      <p className="text-[10.5px] text-teal-700/70 font-bold uppercase tracking-[0.08em] mb-1.5">
                        Get The App
                      </p>
                      <div className="flex flex-col">
                        {DOWNLOAD_LINKS.map((dl) => (
                          <a
                            key={dl.label}
                            href="#"
                            className="flex items-center gap-3 -mx-2 px-2 py-2 rounded-lg text-[14.5px] font-medium text-gray-700 hover:bg-black/[0.04] hover:text-gray-900 hover:translate-x-0.5 transition-all duration-150"
                          >
                            <span className="text-gray-500 shrink-0">{dl.icon}</span>
                            {dl.label}
                          </a>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Download button — desktop/tablet only */}
              <div className="hidden sm:block relative" ref={downloadRef}>
                <button
                  onClick={() => { setDownloadOpen((v) => !v); setMenuOpen(false); }}
                  className="flex items-center gap-2 text-base font-medium px-5 py-4.5 rounded-full transition-all duration-200 shadow-sm hover:scale-105 hover:brightness-110 hover:shadow-lg active:scale-95"
                  style={{
                    background: "linear-gradient(90deg,#50ffaa,#00d4ff)",
                    color: "#062019",
                  }}
                >
                  Get the App
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${downloadOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {downloadOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-panelIn">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide px-4 pt-1 pb-2">
                      Get the app
                    </p>
                    {DOWNLOAD_LINKS.map((dl, i) => (
                      <a
                        key={dl.label}
                        href="#"
                        style={{ animationDelay: `${i * 40}ms` }}
                        className="stagger-item flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:translate-x-0.5 transition-all duration-150"
                      >
                        <span className="text-gray-500">{dl.icon}</span>
                        {dl.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-panelIn { animation: panelIn 0.2s cubic-bezier(0.16, 1, 0.3, 1); }

        @keyframes staggerIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stagger-item {
          opacity: 0;
          animation: staggerIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}