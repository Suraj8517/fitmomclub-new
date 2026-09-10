import { useState, useEffect, useRef, useCallback } from "react";
import challenge from "../../assets/aboutus/pritika-mobile.webp"
import pritikaimg1 from "../../assets/aboutus/pritikaimg.jpg"
import handleConsultation from "../Helper/handleClick";
import { HashLink } from "react-router-hash-link";
const DURATION = 6000;
const TICK_MS = 50;

const features = [
  {
    label: "Chapter 01",
    title: "The Challenge",
    description:
      "Motherhood brought immense joy, but it also came with postpartum weight gain and a struggle to regain confidence—both physically and mentally.",
    bg: "#F7E8E3",
    text: "#6B4A3F",
  },
  {
    label: "Chapter 02",
    title: "The Comeback",
    description:
      "Through disciplined workouts and balanced nutrition, Pritika rebuilt her strength, confidence, and discovered the life-changing power of a healthy lifestyle.",
    bg: "#DCEEF3",
    text: "#25485C",
  },
  {
    label: "Chapter 03",
    title: "From One Mom to Millions",
    description:
      "What began as helping friends and family soon grew into FitMom Club—a thriving community dedicated to empowering women around the world.",
    bg: "#E3F0DD",
    text: "#35523A",
  },
  {
    label: "Chapter 04",
    title: "A Community That Cares",
    description:
      "Today, FitMom Club combines personalized fitness, nutrition, and mental wellness support to help every woman build a healthier, happier life.",
    bg: "#FDE8E1",
    text: "#7B4635",
  },
];

export default function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const total = DURATION * features.length;
      const elapsed = Date.now() - startRef.current;
      const cyclePos = ((elapsed % total) + total) % total;
      const index = Math.floor(cyclePos / DURATION);
      const pct = ((cyclePos % DURATION) / DURATION) * 100;

      setActive((prev) => (prev === index ? prev : index));
      setProgress(pct);
    }, TICK_MS);

    return () => clearInterval(id);
  }, []);

  const goTo = useCallback((index) => {
    startRef.current = Date.now() - index * DURATION;
    setActive(index);
    setProgress(0);
  }, []);

  const current = features[active];

  return (
    <section
      className=" px-5 py-10 lg:py-22 sm:px-10 md:px-16 lg:px-20 xl:px-24 2xl:px-32"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div className="mx-auto mb-10 md:mb-16 max-w-4xl text-center">
        <p className="text-xs sm:text-sm 2xl:text-lg text-[#5a5855] mb-3">
          Our Story 
        </p>
        <h1 className="text-xl sm:text-2xl md:text-4xl font-medium leading-snug ">
          From One Mom's Journey to a <br/>Community of Strong Women
        </h1>
      
      <button
        onClick={handleConsultation}
        className=" flex lg:w-[20%] w-[30%] mt-6 mx-auto items-center justify-center gap-2 rounded-full px-4 py-[15px] text-sm font-bold transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_15px_40px_rgba(0,212,255,0.35)] active:scale-[0.98]"
        style={{
          background: "linear-gradient(90deg,#50ffaa,#00d4ff)",
          color: "#062019",
          letterSpacing: "0.02em",
          textDecoration: "none",
        }}
      >
        Join Now
      </button>
      </div>

      {/* Card */}
      <div className="2xl:max-w-7xl max-w-6xl mx-auto ">

        {/* ── MOBILE LAYOUT ── */}
        <div className="flex flex-col rounded-[24px] overflow-hidden md:hidden">

          {/* Image – fixed aspect ratio on mobile */}
          <div className="relative w-full" style={{ paddingBottom: "62%" }}>
            {features.map((f, i) => (
              <img
                key={f.title}
                src={pritikaimg1}
                alt={f.title}
                className="absolute inset-0 w-full h-full object-cover"
               
              />
            ))}
          </div>

          {/* Content */}
          <div
            className="p-6 flex flex-col gap-5"
            style={{ backgroundColor: current.bg, transition: "background-color 0.6s ease" }}
          >
            {/* Tab dots / pills — top of card on mobile */}
            <div className="flex gap-2">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="relative h-[3px] rounded-full overflow-hidden flex-1"
                  style={{ backgroundColor: "rgba(0,0,0,0.12)" }}
                  aria-label={features[i].label}
                >
                  <span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      backgroundColor: current.text,
                      width:
                        i < active ? "100%" : i === active ? `${progress}%` : "0%",
                      transition: i === active ? "none" : "width 0.3s ease",
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Label */}
            <p
              className="text-[10px] font-semibold tracking-[0.18em] uppercase opacity-60"
              style={{ color: current.text }}
            >
              {current.label}
            </p>

            {/* Title */}
            <h2
              className="text-2xl font-normal leading-snug"
              style={{ color: current.text }}
            >
              {current.title}
            </h2>

            {/* Description */}
            <p
              className="text-sm leading-relaxed opacity-80"
              style={{ color: current.text }}
            >
              {current.description}
            </p>

            {/* Feature labels row */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
              {features.map((f, i) => (
                <button
                  key={f.label}
                  onClick={() => goTo(i)}
                  className="text-[10px] font-medium text-left"
                  style={{
                    color: current.text,
                    opacity: i === active ? 1 : 0.45,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT (original) ── */}
        <div className="hidden md:grid grid-cols-2 gap-6 ">

          {/* Image */}
          <div className="relative rounded-[28px] overflow-hidden min-h-[520px] 2xl:min-h-[640px]">
            {features.map((f, i) => (
              <img
                key={f.title}
                src={pritikaimg1}
                alt={f.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ))}
          </div>

          {/* Content panel */}
          <div
            className="rounded-[28px] p-10 md:p-10 2xl:p-12 flex flex-col min-h-[520px] 2xl:min-h-[600px]"
            style={{ backgroundColor: current.bg }}
          >
            <h2
              className="text-3xl sm:text-4xl font-normal"
              style={{ color: current.text }}
            >
              {current.title}
            </h2>

            <div className="mt-auto">
              <p
                className="text-2xl leading-relaxed font-medium max-w-lg mb-16"
                style={{ color: current.text, opacity: 0.8 }}
              >
                {current.description}
              </p>

              <div className="flex flex-wrap gap-3">
                {features.map((f, i) => (
                  <button
                    key={f.label}
                    onClick={() => goTo(i)}
                    className="flex flex-col items-start 2xl:gap-2 gap-1 text-left"
                  >
                    <span
                      className="2xl:text-sm text-[11px] font-medium transition-colors duration-300"
                      style={{ color: current.text }}
                    >
                      {f.label}
                    </span>
                    <span className="w-22 2xl:w-28 h-[2px] bg-white/50 rounded-full overflow-hidden">
                      <span
                        className="block h-full rounded-full"
                        style={{
                          backgroundColor: current.text,
                          width:
                            i < active ? "100%" : i === active ? `${progress}%` : "0%",
                          transition: i === active ? "none" : "width 0.3s ease",
                        }}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}