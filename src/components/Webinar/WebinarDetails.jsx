import { useState, useEffect, useRef, useCallback } from "react";
import diet from "../../assets/webinar/img1.jpg"
import expert from "../../assets/webinar/img2.jpg"
import session from "../../assets/webinar/img3.jpg"
import support from "../../assets/webinar/img4.jpg"
import { Link } from "react-router-dom";
const DURATION = 6000;
const TICK_MS = 50;
const features = [
  {
    label: "Live Workouts",
    title: "Interactive Fitness Classes",
    description:
      "Join live workout sessions led by certified trainers designed for every fitness level.",
    image: diet,
    bg: "#E9E3E0",
    text: "#4B4540",
  },
  {
    label: "Ask the Experts",
    title: "Expert Q&A Sessions",
    description:
      "Get your health, fitness, and nutrition questions answered by certified experts.",
    image: expert,
    bg: "#cfe7ee",
    text: "#1F3A52",
  },
  {
    label: "Wellness Education",
    title: "Live Wellness Webinars",
    description:
      "Learn practical strategies for nutrition, stress management, and healthy living.",
    image: support,
    bg: "#d9e8d3",
    text: "#2F4A35",
  },
  {
    label: "Expert Tips",
    title: "Exclusive Coaching Insights",
    description:
      "Receive actionable tips and guidance from fitness and nutrition experts for moms.",
    image: session,
    bg: "#fee5dd",
    text: "#7A4434",
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
      className="bg-white px-5 pb-26 pt-10 sm:px-10 md:px-16 lg:px-20 xl:px-24 2xl:px-32"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div className="mx-auto mb-10 md:mb-16 max-w-4xl text-center">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-medium leading-snug ">
                   What You Can Expect
        </h1>
      
      </div>

      {/* Card */}
      <div className="2xl:max-w-7xl max-w-6xl mx-auto">

        {/* ── MOBILE LAYOUT ── */}
        <div className="flex flex-col rounded-[24px] overflow-hidden md:hidden">

          {/* Image – fixed aspect ratio on mobile */}
          <div className="relative w-full" style={{ paddingBottom: "62%" }}>
            {features.map((f, i) => (
              <img
                key={f.title}
                src={f.image}
                alt={f.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "scale(1)" : "scale(1.06)",
                  transition:
                    "opacity 0.9s ease-in-out, transform 1.2s cubic-bezier(0.25,0.1,0.25,1)",
                  zIndex: i === active ? 1 : 0,
                }}
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
        <div className="hidden md:grid grid-cols-2 gap-6">

          {/* Image */}
          <div className="relative rounded-[28px] overflow-hidden min-h-[520px] 2xl:min-h-[640px]">
            {features.map((f, i) => (
              <img
                key={f.title}
                src={f.image}
                alt={f.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "scale(1)" : "scale(1.08)",
                  transition:
                    "opacity 1s ease-in-out, transform 1.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
                  zIndex: i === active ? 1 : 0,
                }}
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