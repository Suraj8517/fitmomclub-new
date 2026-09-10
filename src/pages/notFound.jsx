import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowRight, Heart } from "lucide-react";

const C = {
  black: "#1d1d1f",
  blackHover: "#000000",
  pageBg: "#f5f5f7",
  border: "#e8e8ed",
  textMid: "#6e6e73",
  textMuted: "#424245",
  teal: "#0d9488",
};

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about-us" },
  { label: "Our Community", to: "/community" },
  { label: "FAQ", to: "/FAQs" },
];

export default function NotFound() {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <section
      className="min-h-screen flex items-center justify-center px-6 py-24"
      style={{ backgroundColor: C.pageBg }}
    >
      <div className="max-w-xl w-full text-center">

        {/* Icon badge, echoing the plan-card icon treatment */}
        <div
          className="mx-auto mb-8 w-20 h-20 rounded-full flex items-center justify-center bg-teal-600"
          style={{
            boxShadow: "0 10px 28px rgba(13,148,136,0.28)",
            animation: "floatIn 0.6s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          <Heart size={32} color="#fff" strokeWidth={1.75} />
        </div>

        <p
          className="text-[13px] font-semibold uppercase tracking-[0.08em] mb-3"
          style={{ color: C.teal, animation: "fadeUp 0.5s ease 0.05s both" }}
        >
          Error 404
        </p>

        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] mb-5"
          style={{ color: C.black, letterSpacing: "-0.02em", animation: "fadeUp 0.5s ease 0.1s both" }}
        >
          We couldn't find<br className="hidden sm:block" /> that page
        </h1>

        <p
          className="text-base sm:text-lg leading-relaxed mb-10"
          style={{ color: C.textMid, animation: "fadeUp 0.5s ease 0.15s both" }}
        >
          The page you're looking for may have moved, been renamed, or
          doesn't exist. Let's get you back on track.
        </p>

        {/* Primary action */}
        <div style={{ animation: "fadeUp 0.5s ease 0.2s both" }}>
          <Link
            to="/"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => { setHover(false); setActive(false); }}
            onMouseDown={() => setActive(true)}
            onMouseUp={() => setActive(false)}
            className="inline-flex items-center gap-2.5 rounded-full py-3.5 px-7 text-[15px] sm:text-base font-semibold"
            style={{
              backgroundColor: hover ? C.blackHover : C.black,
              color: "#fff",
              transform: active ? "scale(0.97)" : hover ? "scale(1.02)" : "scale(1)",
              boxShadow: hover && !active ? "0 12px 26px rgba(0,0,0,0.22)" : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
            }}
          >
            <Home size={17} strokeWidth={2} />
            Back to Home
            <ArrowRight
              size={15}
              style={{
                transform: hover ? "translateX(3px)" : "translateX(0)",
                transition: "transform 0.2s",
              }}
            />
          </Link>
        </div>

        {/* Quick links */}
        <div
          className="mt-12 pt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          style={{ borderTop: `1px solid ${C.border}`, animation: "fadeUp 0.5s ease 0.25s both" }}
        >
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm sm:text-[15px] font-medium transition-colors"
              style={{ color: C.textMuted }}
              onMouseEnter={e => e.currentTarget.style.color = C.teal}
              onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(-14px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}