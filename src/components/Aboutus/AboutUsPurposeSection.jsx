import React, { useEffect, useRef, useState } from "react";
import heroPhoto from "../../assets/aboutus/pritika.webp";
import mobileimg from "../../assets/aboutus/pritika-mobile.webp"
import { HashLink } from "react-router-hash-link";
import { ArrowRight } from "lucide-react";
import handleConsultation from "../Helper/handleClick";
// ─────────────────────────────────────────────
// MOBILE VERSION
// ─────────────────────────────────────────────
function AboutUsPurposeMobile({ imageUrl, content }) {
  return (
    <section className="relative w-full bg-[#F6F4F0] overflow-hidden">
      {/* Hero image – full width, portrait crop */}
      <div className="relative w-full" style={{ height: "30svh" }}>
        <img
          src={imageUrl}
          alt="Pritika, founder of FitMom Club"
          className="w-full h-full object-cover object-top-right"
        />
 
       

        {/* Gradient fade into content below */}

        {/* Eyebrow pill – top-left of image */}
        <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-1.5">
          <span className="block w-6 h-px bg-[#F6F4F0]" />
          <p
            className="text-white/80 text-[10px] tracking-[0.22em] uppercase"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
              A Journey That Inspired Thousands
          </p>
        </div>
      </div>

      {/* Text card */}
      <div className="px-6 pt-2 pb-14">
        {/* Accent label */}
        <p
          className="text-[10px] tracking-[0.22em] uppercase mt-4 mb-3"
          style={{
            fontFamily: "'Poppins', sans-serif",
            color: "#111111",
          }}
        >
A Quest for Well-being that Sparked a Lifelong purpose        </p>

        {/* Divider */}
        <div className="w-8 h-px bg-neutral-300 mb-4" />

       

        {/* Body */}
        <p
          className="text-neutral-600 text-sm leading-relaxed text-justify"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {content}
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// DESKTOP VERSION
// ─────────────────────────────────────────────
function AboutUsPurposeDesktop({ imageUrl, content }) {
  const sectionRef = useRef(null);
  const imgFrameRef = useRef(null);
  const overlayRef = useRef(null);
  const textRef = useRef(null);
  const titleRef = useRef(null);

  const MX = 120;
  const MY = 60;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;

      const frame = imgFrameRef.current;
      const overlay = overlayRef.current;
      const textEl = textRef.current;
      const titleEl = titleRef.current;
      if (!frame) return;

      const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
      const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);

      const vh = window.innerHeight;
      const P1 = vh * 0.5;
      const P2 = vh * 1.0;
      const P3 = vh * 1.7;

      if (scrolled < 0) {
        Object.assign(frame.style, {
          top: `${MY}px`, left: `${MX}px`,
          width: `calc(100% - ${MX * 2}px)`,
          height: `calc(100vh - ${MY * 2}px)`,
          borderRadius: "14px",
        });
        if (overlay) overlay.style.opacity = "0";
        if (textEl) { textEl.style.opacity = "0"; textEl.style.transform = "translateY(28px)"; }
        if (titleEl) { titleEl.style.opacity = "1"; titleEl.style.transform = "translateY(0px)"; }

      } else if (scrolled < P1) {
        const t = scrolled / P1;
        const mx = lerp(MX, 0, t);
        const my = lerp(MY, 0, t);
        Object.assign(frame.style, {
          top: `${my}px`, left: `${mx}px`,
          width: `calc(100% - ${mx * 2}px)`,
          height: `calc(100vh - ${my * 2}px)`,
          borderRadius: `${lerp(14, 0, t)}px`,
        });
        if (overlay) overlay.style.opacity = String(lerp(0, 0.15, t));
        if (textEl) { textEl.style.opacity = "0"; textEl.style.transform = "translateY(28px)"; }
        if (titleEl) {
          titleEl.style.opacity = String(lerp(1, 0, t));
          titleEl.style.transform = `translateY(${lerp(0, -16, t)}px)`;
        }

      } else if (scrolled < P2) {
        Object.assign(frame.style, {
          top: "0", left: "0",
          width: "100%", height: "100vh",
          borderRadius: "0",
        });
        if (overlay) overlay.style.opacity = "0.15";
        if (textEl) { textEl.style.opacity = "0"; }
        if (titleEl) { titleEl.style.opacity = "0"; }

      } else if (scrolled < P3) {
        const t = (scrolled - P2) / (P3 - P2);
        Object.assign(frame.style, {
          top: "0", left: "0",
          width: "100%", height: "100vh",
          borderRadius: "0",
        });
        if (overlay) overlay.style.opacity = String(lerp(0.15, 0.6, t));
        if (textEl) {
          textEl.style.opacity = String(lerp(0, 1, t));
          textEl.style.transform = `translateY(${lerp(28, 0, t)}px)`;
        }

      } else {
        Object.assign(frame.style, {
          top: "0", left: "0",
          width: "100%", height: "100vh",
          borderRadius: "0",
        });
        if (overlay) overlay.style.opacity = "0.6";
        if (textEl) { textEl.style.opacity = "1"; textEl.style.transform = "translateY(0)"; }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [MX, MY]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ minHeight: "280vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden ">

        {/* Image frame */}
        <div
          ref={imgFrameRef}
          className="absolute overflow-hidden"
          style={{
            top: MY,
            left: MX,
            width: `calc(100% - ${MX * 2}px)`,
            height: `calc(100vh - ${MY * 2}px)`,
            borderRadius: 14,
          }}
        >
          <img
            src={imageUrl}
            alt="Pritika, founder of FitMom Club"
            className="h-full w-full object-cover object-top"
          />
        </div>

        {/* "Meet Your Mentor" title — sits above image, fades out on scroll */}
        <div
          ref={titleRef}
          className="absolute pointer-events-none z-10"
          style={{
            top: MY,
            left: MX,
            width: `calc(100% - ${MX * 2}px)`,
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <div className="flex items-center gap-4 px-8 pt-8">
            {/* Decorative line */}
            <span className="block h-px w-10 bg-white/60" />
            <p className="text-white/70 text-xs 2xl:text-lg tracking-[0.2em] uppercase font-[Poppins] font-medium">
              A Journey That Inspired Thousands
            </p>
            
          </div>
        </div>

        {/* Dark overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0, transition: "opacity 0.08s linear" }}
        />

        {/* Text content — right-aligned */}
        <div className="absolute inset-0 flex items-end justify-start pb-16 2xl:pb-20 pl-16 2xl:pl-20 pointer-events-none">
          <div
            ref={textRef}
            className="w-full max-w-lg 2xl:max-w-2xl"
            style={{
              opacity: 0,
              transform: "translateY(28px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <p className="text-white/60 text-xs 2xl:text-lg tracking-[0.2em] uppercase mb-2"
            style={
                {fontFamily: "'Story Script', sans-serif"}
            }>
              A Quest for Well-being that Sparked a {" "}
              <span className="font-bold text-[#00d1b8]">Lifelong Purpose</span>!
            </p>
            <div className="w-8 h-px bg-white/50 mb-8 mt-2" />
           
            <p className="text-white/80 2xl:text-lg text-sm leading-relaxed font-[Poppins]">
              {content}
            </p>

            <button
             onClick={handleConsultation}
              className="pointer-events-auto inline-flex items-center gap-2 h-12 2xl:h-14 px-6 mt-6 rounded-full text-white text-sm 2xl:text-base font-semibold bg-teal-500 shadow-lg shadow-black/30 transition-all duration-200 hover:bg-teal-600 hover:scale-[1.02] active:scale-[0.97]"
            >
              Join Now
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}


export default function AboutUsPurpose({
  imageUrl = heroPhoto,
   imageUrlMobile = mobileimg,
  content = `FitMom Club’s journey began with Ms. Pritika, a young mother striving to lose her postnatal weight and reclaim her strength. With relentless dedication to fitness and a disciplined diet, she transformed from feeling weighed down to becoming super-fit.
What started as a personal goal evolved into a deeper purpose. Ms. Pritika’s transformation fueled her desire to help women of all ages achieve the same level of health and confidence. From humble beginnings, helping friends and family, FitMom Club has now grown into a global community of over 40,000 members in 70+ countries. With a mission to impact 1 million lives, our passion only grows stronger each day.`,
}) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile
    ? <AboutUsPurposeMobile imageUrl={imageUrlMobile} content={content} />
    : <AboutUsPurposeDesktop imageUrl={imageUrl} content={content} />;
}