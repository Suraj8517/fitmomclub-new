import React, { useRef, useState, useEffect } from "react";
import NavButton from "../Helper/navButton";
import VideoLoader from "../Helper/videoLoader";
import { TOKENS } from "../Helper/TOKENS";
import { MediaCard } from "../Helper/mediaCard";
const cardVideo1 ="https://res.cloudinary.com/q1vba78b/video/upload/v1783062275/04-04-2026_Transformation__1080X1920_yxwger.mp4";
const cardVideo2 ="https://res.cloudinary.com/q1vba78b/video/upload/v1783062271/AQMvXQbGWkouS2LYsfuxQyZ-q6QnIxzXL-bLMfIAU0w1e2aoamq3iXFnFxZ3BM71rpNWmG0VsagaoFZ2R5VAPwZ9MTR1_fnevNP97EE_skb5kx.mp4";
const cardVideo3 = "https://res.cloudinary.com/q1vba78b/video/upload/v1783062396/TR_4_vb92li.mp4";
const cardVideo4 = "https://res.cloudinary.com/q1vba78b/video/upload/v1783062401/TR_3_agpivc.mp4";
const cardVideo5 = "https://res.cloudinary.com/q1vba78b/video/upload/v1783398463/Video-409_vk8zri.mp4";
const cardVideo6 = "https://res.cloudinary.com/q1vba78b/video/upload/v1783398430/Video-578_zhnmma.mp4";
const cardVideo7 = "https://res.cloudinary.com/q1vba78b/video/upload/v1783398447/Video-878_oo3qlg.mp4";
const cardVideo8 = "https://res.cloudinary.com/q1vba78b/video/upload/v1783072122/Legacy_Award_Client_testimonial_Video_1_1_hu2wxn.mp4";

const CARDS = [
  { title: "FitMom Club Member's Journey", author: "", videoSrc: cardVideo1, titlePosition: "bottom" },
  { title: "17.6 kg down in 6 months", author: "FitMom Club Member", videoSrc: cardVideo2, titlePosition: "top" },
  { title: "Lost 5kg in 3 months", author: "FitMom Club Member", videoSrc: cardVideo3, titlePosition: "bottom" },
  { title: "Lost 10kg", author: "FitMom Club Member", videoSrc: cardVideo4, titlePosition: "top" },
  { title: "Postpartum fitness journey", author: "FitMom Club Member", videoSrc: cardVideo5, titlePosition: "bottom" },
  { title: "Lost 7.5kg in 45 days", author: "FitMom Club Member", videoSrc: cardVideo6, titlePosition: "top" },
  { title: "FitMom Club Member's Journey", author: "", videoSrc: cardVideo7, titlePosition: "bottom" },
  { title: "Lost 14kg", author: "FitMom Club Member", videoSrc: cardVideo8, titlePosition: "bottom" },
];

const TAPE_COLORS = [TOKENS.sage, TOKENS.gold, TOKENS.berry];

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// A little hand-drawn squiggle used as an underline / accent
function Squiggle({ color = TOKENS.berry, className = "" }) {
  return (
    <svg viewBox="0 0 220 16" className={className} preserveAspectRatio="none" style={{ width: "100%", height: 12 }}>
      <path
        d="M2 10 C 30 2, 55 14, 85 7 C 115 0, 140 14, 170 6 C 190 1, 205 9, 218 5"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}


export default function SuccessStoriesVideoSection() {
  const mobilePages = chunk(CARDS, 4);
  const [pageIndex, setPageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isDragging = useRef(false);

  const lastPage = mobilePages.length - 1;
  const goTo = (i) => setPageIndex(Math.min(Math.max(i, 0), lastPage));
  const goPrev = () => goTo(pageIndex - 1);
  const goNext = () => goTo(pageIndex + 1);

  const SWIPE_THRESHOLD = 50;
  const handleTouchStart = (e) => {
    isDragging.current = true;
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (touchDeltaX.current > SWIPE_THRESHOLD) goPrev();
    else if (touchDeltaX.current < -SWIPE_THRESHOLD) goNext();
    touchDeltaX.current = 0;
  };

  const desktopTrackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const track = desktopTrackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  };

  useEffect(() => {
    updateScrollState();
    const track = desktopTrackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollDesktop = (dir) => {
    const track = desktopTrackRef.current;
    if (!track) return;
    const firstCard = track.firstElementChild;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : track.clientWidth / 4;
    const gap = 20;
    track.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
  };

  // --- scroll-triggered reveal ---
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node); // animate only once
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full sm:py-16 px-6 sm:px-10 lg:px-16 relative overflow-hidden"
      style={{ background:"#EBEAEA" }}
    >
      {/* fonts — move these into your global stylesheet/layout head for production */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500;1,600&family=Work+Sans:wght@400;500;600&family=Caveat:wght@600;700&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* subtle paper grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Headline */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-start py-3">
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h1
              className="text-center sm:text-left text-5xl sm:text-6xl leading-[1.05] tracking-tight"
              style={{ color: TOKENS.ink, fontFamily: "'Fraunces', serif", fontWeight: 500, fontStyle: "italic" }}
            >
              Short stories
              <br />
              <span className="text-teal-800">from members</span>
              <Squiggle color={TOKENS.sageDark} className="mt-1 max-w-[220px] 2xl:max-w-[380px] mx-auto sm:mx-0" />
            </h1>
          </div>
          <div
            className={`lg:pt-4 lg:pl-22 transition-all duration-700 ease-out delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p
              className="text-center sm:text-left max-w-lg"
              style={{ color: TOKENS.inkSoft, fontFamily: "'Work Sans', sans-serif", fontSize: 16, lineHeight: 1.7 }}
            >
              Real experiences from FitMom Club members, sharing their challenges, small wins, and
              transformations to inspire and support others on their fitness journey.
            </p>
          </div>
        </div>

        {/* ---------- MOBILE ---------- */}
        <div className="sm:hidden mt-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {mobilePages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{
                    height: 6,
                    width: i === pageIndex ? 26 : 10,
                    borderRadius: 3,
                    background: i === pageIndex ? TOKENS.sage : "#D8CDB0",
                    transform: i === pageIndex ? "rotate(-2deg)" : "none",
                    transition: "all 200ms ease",
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <NavButton direction="left" onClick={goPrev} disabled={pageIndex === 0} TOKENS={TOKENS}/>
              <NavButton direction="right" onClick={goNext} disabled={pageIndex === lastPage} TOKENS={TOKENS}/>
            </div>
          </div>

          <div
            className="overflow-hidden select-none px-3"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                width: `${mobilePages.length * 100}%`,
                transform: `translateX(-${pageIndex * (100 / mobilePages.length)}%)`,
              }}
            >
              {mobilePages.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="grid grid-cols-2 gap-x-3 gap-y-6 flex-shrink-0 py-3 px-1"
                  style={{ width: `${100 / mobilePages.length}%` }}
                >
                  {group.map((card, i) => (
                    <div
                      key={i}
                      className={`transition-all duration-700 ease-out ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                      }`}
                      style={{ transitionDelay: isVisible ? `${(gIdx * 4 + i) * 80}ms` : "0ms" }}
                    >
                      <MediaCard card={card} index={gIdx * 4 + i} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center justify-end gap-3 mt-10 mb-5">
          <NavButton direction="left" onClick={() => scrollDesktop(-1)} disabled={!canScrollLeft} />
          <NavButton direction="right" onClick={() => scrollDesktop(1)} disabled={!canScrollRight} />
        </div>
      </div>

      <div className="hidden sm:block w-screen relative left-1/2 -translate-x-1/2">
        <div
          ref={desktopTrackRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 scroll-smooth no-scrollbar py-10 pl-44"
          
        >
          {CARDS.map((card, i) => (
            <div
              key={i}
              className={`shrink-0 transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 90}ms` : "0ms" }}
            >
              <MediaCard
                card={card}
                index={i}
                className={`snap-start w-[clamp(200px,14vw,250px)] ${
                  i === 0 ? "pl-4" : "pl-0"
                } ${
                  i === 7 ? "pr-4" : "pr-0"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}