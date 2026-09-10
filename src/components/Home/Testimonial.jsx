import React, { useRef, useState, useEffect, useCallback } from "react";

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

const AUTOPLAY_INTERVAL = 2500;

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function ArrowIcon({ direction = "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      style={{ transform: direction === "left" ? "rotate(180deg)" : undefined }}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function NavButton({ direction, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors
        ${
          disabled
            ? "border-slate-200 text-slate-300 cursor-not-allowed"
            : "border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900"
        }`}
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}

function VideoLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
      <div className="w-8 h-8 rounded-full border-2 border-slate-400/40 border-t-slate-600 animate-spin" />
    </div>
  );
}

function optimizeCloudinaryUrl(url, transformation = "q_auto,f_mp4,w_500") {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transformation}/`);
}

function MediaCard({ card, className = "" }) {
  const overlayPosition = card.titlePosition === "top" ? "top-6 items-start" : "bottom-6 items-end";
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false); // becomes true once near viewport
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const optimizedSrc = optimizeCloudinaryUrl(card.videoSrc);


  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "300px" } // start loading a bit before it scrolls into view
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

   useEffect(() => {
    const el = videoRef.current;
    if (el && el.readyState >= 3) {
      setIsLoaded(true);
    }
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className={`relative rounded-3xl overflow-hidden bg-slate-200 aspect-[9/16] ${className}`}>
      {card.videoSrc ? (
        <>
          {!isLoaded && !hasError && <VideoLoader />}

          {hasError ? (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500 text-sm text-center px-4">
              Video unavailable
            </div>
          ) : (
            shouldLoad && (
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                src={optimizedSrc}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onCanPlay={() => setIsLoaded(true)}
                onLoadedData={() => setIsLoaded(true)}
                onError={(e) => {
                  console.error("Video failed to load:", optimizedSrc, e.target.error);
                  setHasError(true);
                }}
              />
            )
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500 text-sm">
          FMC transformations
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

      <div className={`absolute inset-x-5 flex justify-between gap-3 ${overlayPosition}`}>
        <div>
          <p className="text-white font-medium leading-snug hidden sm:block">{card.title}</p>
          <p className="text-white/70 text-sm mt-0.5 hidden sm:block">{card.author}</p>
        </div>
      </div>
    </div>
  );
}


export default function Testimonial() {
  const mobilePages = chunk(CARDS, 4);
  const [pageIndex, setPageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isDragging = useRef(false);

  const lastPage = mobilePages.length - 1;
  const goTo = (i) => setPageIndex(Math.min(Math.max(i, 0), lastPage));
  const goPrev = () => goTo(pageIndex - 1);
  const goNext = () => goTo(pageIndex + 1);

  // Autoplay pause flags — paused while the user is actively interacting
  const [mobilePaused, setMobilePaused] = useState(false);
  const [desktopPaused, setDesktopPaused] = useState(false);

  const SWIPE_THRESHOLD = 50;
  const handleTouchStart = (e) => {
    isDragging.current = true;
    setMobilePaused(true);
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
    setMobilePaused(false);
  };

  // ---------- Mobile: auto-advance pages on a loop ----------
  useEffect(() => {
    if (mobilePaused || mobilePages.length <= 1) return;
    const timer = setInterval(() => {
      setPageIndex((prev) => (prev >= lastPage ? 0 : prev + 1));
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [mobilePaused, lastPage, mobilePages.length]);

  // ---------- Desktop: native scroll, 1 card per click, with edge detection ----------
  const desktopTrackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const track = desktopTrackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollLeft(scrollLeft > 2); // small buffer for rounding
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

  const scrollDesktop = useCallback((dir) => {
    const track = desktopTrackRef.current;
    if (!track) return;
    const firstCard = track.firstElementChild;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : track.clientWidth / 4;
    const gap = 20;
    track.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
  }, []);

  // ---------- Desktop: auto-advance the scroll track on a loop ----------
  useEffect(() => {
    if (desktopPaused) return;
    const timer = setInterval(() => {
      const track = desktopTrackRef.current;
      if (!track) return;
      const { scrollLeft, scrollWidth, clientWidth } = track;
      const atEnd = scrollLeft >= scrollWidth - clientWidth - 2;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollDesktop(1);
      }
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [desktopPaused, scrollDesktop]);

  return (
    <section className="w-full bg-[#F6F5F1] pt-26 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-start py-3">
          <h1 className="text-center sm:text-left text-5xl sm:text-6xl leading-[1.05] font-normal tracking-tight text-slate-900 font-serif">
            Short stories
            <br />
            <span className="text-teal-700">from members</span>
          </h1>
          <div className="lg:pt-4 lg:pl-22">
            <p className="text-slate-500 text-base leading-relaxed max-w-lg text-center sm:text-left">
              Real experiences from FitMom Club members, sharing their challenges, small wins, and
              transformations to inspire and support others on their fitness journey.
            </p>
          </div>
        </div>

        {/* ---------- MOBILE: paginated swiper, autoplays on a loop ---------- */}
        <div className="sm:hidden mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {mobilePages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === pageIndex ? "w-6 bg-slate-900" : "w-1.5 bg-slate-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <NavButton direction="left" onClick={goPrev} disabled={pageIndex === 0} />
              <NavButton direction="right" onClick={goNext} disabled={pageIndex === lastPage} />
            </div>
          </div>

          <div
            className="overflow-hidden select-none"
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
                  className="grid grid-cols-2 gap-5 flex-shrink-0"
                  style={{ width: `${100 / mobilePages.length}%` }}
                >
                  {group.map((card, i) => (
                    <MediaCard key={i} card={card} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- DESKTOP: native scroll, autoplays on a loop, edge-aware buttons ---------- */}
        <div
          className="hidden sm:block mt-8"
          onMouseEnter={() => setDesktopPaused(true)}
          onMouseLeave={() => setDesktopPaused(false)}
        >
          <div className="flex items-center justify-end gap-3 mb-4">
            <NavButton direction="left" onClick={() => scrollDesktop(-1)} disabled={!canScrollLeft} />
            <NavButton direction="right" onClick={() => scrollDesktop(1)} disabled={!canScrollRight} />
          </div>

          <div
            ref={desktopTrackRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-5 scroll-smooth no-scrollbar"
          >
            {CARDS.map((card, i) => (
              <MediaCard key={i} card={card} className="shrink-0 snap-start w-[calc(25%-15px)]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}