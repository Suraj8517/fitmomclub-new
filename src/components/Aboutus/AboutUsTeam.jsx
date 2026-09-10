import React, { useEffect, useRef, useState } from "react";
import pritika from "../../assets/aboutus/pritika-team.webp"
import sarvesh from "../../assets/aboutus/sarvesh.webp"
import vignesh from "../../assets/aboutus/vignesh.webp"

const cards = [
  {
    title: "Mr. Vignesh Prabakaran",
    description:
      "Founder & Chief Business Director",
    img: vignesh,
  },
  {
    title: "Mr. Sarvesh Prabakaran",
    description:
      "Co Founder & CEO",
    img: sarvesh,
  },
  {
    title: "Ms. Pritika Srinivasan",
    description:
      "Co-Founder and Chief Evangelist",
    img: pritika,
  },
];

/** Fires whenever the ref'd element enters/exits the viewport,
 *  so the reveal animation replays each time it scrolls back into view. */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function Card({ card, inView, delay }) {
  return (
    <div
      className="team-reveal flex flex-col flex-1 min-w-0"
      style={{ animationDelay: inView ? delay : "0s", opacity: inView ? undefined : 0 }}
      data-inview={inView}
    >
      {/* Image */}
      <div className="rounded-xl overflow-hidden xl:h-[82vh] md:h-[420px] h-[260px]">
        <img
          src={card.img}
          alt={card.title}
          className="w-full h-full object-cover object-top block"
        />
      </div>
      {/* Text */}
      <div className="pt-5">
        <h3 className="text-[18px] font-semibold text-[#111111] mb-2 leading-snug font-poppins">
          {card.title}
        </h3>
        <p className="text-[13.5px] text-[#555555] leading-relaxed font-poppins font-normal">
          {card.description}
        </p>
      </div>
    </div>
  );
}

export default function PopulationHealthSection() {
  const [headerRef, headerInView] = useInView();
  const [cardsRef, cardsInView] = useInView({ threshold: 0.1 });

  return (
    <section className="w-full lg:px-16 lg:py-34 px-6 py-12 font-poppins">
      <style>{`
        @keyframes teamRiseUp {
          from { opacity: 0; transform: translate3d(0, 32px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .team-header {
          opacity: 0;
        }
        .team-header[data-inview="true"] {
          animation: teamRiseUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .team-reveal {
          opacity: 0;
        }
        .team-reveal[data-inview="true"] {
          animation: teamRiseUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .team-header, .team-reveal {
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div
        ref={headerRef}
        data-inview={headerInView}
        className="team-header flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-10"
      >
        <h2 className="text-[28px] md:text-[46px] font-normal text-[#111111] leading-tight tracking-tight max-w-[760px]">
          Meet Our
          <br />
Management Team
        </h2>
        <p className="text-lg text-[#555555] leading-relaxed max-w-[500px] pt-1 font-normal">
          Meet the visionary leaders behind our mission, each dedicated to ensuring that FitMom Club continues to uplift and support women around the world.
        </p>
      </div>

      {/* Cards */}
      <div ref={cardsRef} className="flex flex-col md:flex-row gap-6 w-full">
        {cards.map((card, i) => (
          <Card
            key={i}
            card={card}
            inView={cardsInView}
            delay={`${i * 0.15}s`}
          />
        ))}
      </div>
    </section>
  );
}