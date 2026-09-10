import React, { useEffect, useRef, useState } from "react";

const stats = [
  { prefix: "Up to", value: "1 Lakh+", label: "Lives Transformed" },
  { prefix: "Up to", value: "98%", label: "Success Rate" },
  { prefix: "Up to", value: "70+", label: "Countries" },
  { prefix: "Up to", value: "40K+", label: "Members Community" },
  { prefix: "Up to", value: "400+", label: "Team Members" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  .cs-gradient-text {
    background: linear-gradient(90deg, #a78bfa, #6ee7b7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @keyframes csCardIn {
    0% { opacity: 0; transform: translateY(24px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes csHeadingIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes csStatIn {
    0% { opacity: 0; transform: translateY(16px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes csDividerIn {
    0% { opacity: 0; transform: scaleY(0); }
    100% { opacity: 1; transform: scaleY(1); }
  }
  @keyframes csShimmer {
    0% { background-position: -200px 0; }
    100% { background-position: 200px 0; }
  }
  .cs-skel {
    background: linear-gradient(90deg, #ececec 25%, #f6f6f6 37%, #ececec 63%);
    background-size: 400px 100%;
    animation: csShimmer 1.3s ease-in-out infinite;
    border-radius: 8px;
  }
  @media (prefers-reduced-motion: reduce) {
    .cs-card, .cs-heading, .cs-stat, .cs-divider {
      animation: none !important;
    }
  }
`;

// Fires once when the element is (almost) fully inside the viewport,
// then stops observing. Ignores the observer's very first callback,
// which just reports whatever the state already is at page load — so
// this only fires from a genuine scroll-driven entrance, never on load.
function useInFullView(ref, threshold = 0.9) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let skippedInitial = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!skippedInitial) {
          skippedInitial = true;
          return;
        }
        if (entry.intersectionRatio >= threshold) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, threshold, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}

// Splits "1 Lakh+", "98%", "40K+" etc. into a numeric part to count up
// and a trailing label/suffix to keep static.
function parseStatValue(value) {
  const match = value.match(/^([\d,.]+)(.*)$/);
  if (!match) return { num: null, suffix: value };
  return { num: parseFloat(match[1].replace(/,/g, "")), suffix: match[2] };
}

function useCountUp(target, duration, delay, enabled) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled || target == null) return;
    let raf;
    let start;
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts;
        const t = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(target * eased));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay, enabled]);
  return value;
}

function StatValue({ value, active, delay }) {
  const { num, suffix } = parseStatValue(value);
  const count = useCountUp(num, 1100, delay, active);
  if (num == null) return <>{value}</>;
  return (
    <>
      {active ? count.toLocaleString() : 0}
      {suffix}
    </>
  );
}

export default function CommunityStatsSection() {
  const containerRef = useRef(null);
  const inView = useInFullView(containerRef);

  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setLoading(true);
    const t = setTimeout(() => {
      setLoading(false);
      setRevealed(true);
    }, 600);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <>
      <style>{styles}</style>
      <div
        ref={containerRef}
        className="flex bg-[#F6F5F1] px-4 py-6 sm:px-6 sm:py-8 md:px-14 md:py-3 font-poppins min-h-[40vh] items-center"
      >
        <div
          className="cs-card bg-white rounded-3xl px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-16 w-full max-w-7xl mx-auto"
          style={{
            opacity: inView ? 1 : 0,
            animation: inView ? "csCardIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
          }}
        >
          {/* Heading 
          <h2
            className="cs-heading text-[20px] sm:text-[24px] md:text-[30px] font-semibold text-[#1a1a1a] leading-snug max-w-[520px] mb-8 md:mb-10 font-poppins"
            style={{
              opacity: 0,
              animation: inView ? "csHeadingIn 0.55s ease 0.1s forwards" : "none",
            }}
          >
            Feel Empowered and Supported
            <br />
            With Our Community of Strength
          </h2>
          */}

          {/*
            Mobile / tablet: flex-wrap + justify-center. Each stat gets a
            fixed basis of ~30% so exactly 3 fit per row — the wrap then
            naturally centers the leftover 2 on their own row.
            Desktop (md+): back to the original 5-column grid with dividers.
          */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-8 sm:gap-x-8 md:grid md:grid-cols-5 md:gap-0 md:flex-nowrap">
            {loading &&
              stats.map((_, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center sm:items-start gap-2 w-[28%] sm:w-[27%] md:w-auto ${
                    i < stats.length - 1 ? "md:pr-8" : ""
                  } ${i > 0 ? "md:pl-8" : ""}`}
                >
                  <div className="cs-skel" style={{ width: "60%", height: 10, animationDelay: `${i * 0.07}s` }} />
                  <div className="cs-skel" style={{ width: "85%", height: 32, animationDelay: `${i * 0.07}s` }} />
                  <div className="cs-skel" style={{ width: "95%", height: 10, animationDelay: `${i * 0.07}s` }} />
                </div>
              ))}

            {revealed &&
              stats.map((s, i) => (
                <div
                  key={i}
                  className="relative flex items-center w-[28%] sm:w-[27%] md:w-auto"
                >
                  {i > 0 && (
                    <div
                      className="cs-divider hidden md:block absolute left-0 top-0 bottom-0"
                      style={{
                        width: 1,
                        background: "rgba(0,0,0,0.08)",
                        transformOrigin: "top",
                        animation: `csDividerIn 0.5s ease ${i * 0.1}s backwards`,
                      }}
                    />
                  )}
                  <div
                    className={`cs-stat flex flex-col items-center text-center sm:items-start sm:text-left gap-1 w-full ${
                      i < stats.length - 1 ? "md:pr-8" : ""
                    } ${i > 0 ? "md:pl-8" : ""}`}
                    style={{
                      opacity: 0,
                      animation: `csStatIn 0.5s ease ${i * 0.1}s forwards`,
                    }}
                  >
                    <p className="text-[11px] sm:text-[12px] text-[#888888] font-normal font-poppins">
                      {s.prefix}
                    </p>
                    <p className="cs-gradient-text text-[20px] sm:text-[32px] md:text-[40px] font-medium leading-none font-poppins tabular-nums">
                      <StatValue value={s.value} active={revealed} delay={i * 100 + 150} />
                    </p>
                    <p className="text-[10px] sm:text-[12px] text-[#666666] font-normal font-poppins mt-1">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}