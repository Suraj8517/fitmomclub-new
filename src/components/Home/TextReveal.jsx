import { useEffect, useRef } from "react";
import img1 from "../../assets/home/text reveal/img1.webp"
import img2 from "../../assets/home/text reveal/img2.webp"
import img3 from "../../assets/home/text reveal/img3.webp"
const ROTATE_ANCHORS = [-100, -78, -46, -16, 0];
const SCALE_ANCHORS = [0.05, 0.3, 0.6, 0.88, 1];
const STOPS = [0, 0.25, 0.5, 0.75, 1];

function interpolate(anchors, t) {
  if (t <= 0) return anchors[0];
  if (t >= 1) return anchors[anchors.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (t >= STOPS[i] && t <= STOPS[i + 1]) {
      const localT = (t - STOPS[i]) / (STOPS[i + 1] - STOPS[i]);
      return anchors[i] + (anchors[i + 1] - anchors[i]) * localT;
    }
  }
  return anchors[anchors.length - 1];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
const HEADLINE = ["healthy", "habits", "for","all", "moms"];
const LINES = [
  "science-backed weight",
  "loss wellness & nutrition ",
  "expert coaching ",
  "for moms"
];

// each line gets its own dedicated slice of the scroll, so line 1
// finishes forming before line 2 begins — with a small overlap so the
// cascade still feels continuous rather than stepped.
const BLOCK_COUNT = 1 + LINES.length;
const REVEAL_END = 0.78;
const BLOCK_WINDOW = 0.22;

// the last stretch of scroll (from FADE_START to 1) is reserved for the
// hero content to dissolve away as the overlay rises over it.
const FADE_START = 0.82;

function getBlockWindow(index) {
  const start =
    BLOCK_COUNT > 1
      ? (REVEAL_END - BLOCK_WINDOW) * (index / (BLOCK_COUNT - 1))
      : 0;
  return { start, end: start + BLOCK_WINDOW };
}

export default function HeroReveal() {
  const containerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRefs = useRef([]);
  const lineRefs = useRef(LINES.map(() => []));
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const img3Ref = useRef(null);
  const overlayRef = useRef(null);
  const overlayTextRef = useRef(null);
  const contentRef = useRef(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    function applyWord(el, blockProgress, wordIdx, wordCount, glowRgb) {
      if (!el) return;
      const delayFraction = wordCount > 1 ? (wordIdx / wordCount) * 0.5 : 0;
      const local = clamp(
        (blockProgress - delayFraction) / (1 - delayFraction),
        0,
        1
      );
      const rotate = interpolate(ROTATE_ANCHORS, local);
      const scale = interpolate(SCALE_ANCHORS, local);
      const reveal = clamp(local * 1.6, 0, 1);
      el.style.transform = `perspective(1000px) rotateX(${rotate}deg) scaleY(${scale}) translateZ(${20 * local}px)`;
    }

    function applyImage(el, progress, enterStart, enterEnd, exitVh, rotateDeg) {
      if (!el) return;
      const enterT = clamp((progress - enterStart) / (enterEnd - enterStart), 0, 1);
      const eased = easeOutBack(enterT);
      const enterOffset = (1 - eased) * 90;
      // once settled, the image keeps traveling upward for the rest of the
      // scroll (in viewport-height units, not its own size) so it fully
      // clears the top of the screen instead of just drifting in place.
      const exitT = clamp((progress - enterEnd) / (1 - enterEnd), 0, 1);
      const exitEased = exitT * exitT * (3 - 2 * exitT);
      const exitDrift = exitEased * exitVh;
      const settledScale = 0.85 + 0.15 * clamp(eased, 0, 1);
      el.style.transform = `translateY(calc(${enterOffset}% - ${exitDrift}vh)) rotate(${rotateDeg}deg) scale(${settledScale})`;
      const fadeOut = clamp((exitT - 0.65) / 0.35, 0, 1);
      el.style.opacity = String(clamp(enterT * 1.4, 0, 1) * (1 - fadeOut));
    }

    function render() {
      const p = currentRef.current;
      const textProgress = clamp(p / REVEAL_END, 0, 1) * REVEAL_END;

      if (eyebrowRef.current) {
        eyebrowRef.current.style.opacity = String(clamp(p / 0.08, 0, 1));
        eyebrowRef.current.style.transform = `translateY(${(1 - clamp(p / 0.08, 0, 1)) * 8}px)`;
      }

      // headline = block 0
      const headWin = getBlockWindow(0);
      const headBlockProgress = clamp(
        (textProgress - headWin.start) / (headWin.end - headWin.start),
        0,
        1
      );
      headlineRefs.current.forEach((el, i) => {
        applyWord(el, headBlockProgress, i, HEADLINE.length, "26,26,26");
      });

      // each line = block 1..N
      lineRefs.current.forEach((refs, li) => {
        const win = getBlockWindow(li + 1);
        const blockProgress = clamp(
          (textProgress - win.start) / (win.end - win.start),
          0,
          1
        );
        refs.forEach((el, wi) => {
          applyWord(el, blockProgress, wi, refs.length, "255,255,255");
        });
      });

      applyImage(img1Ref.current, p, 0.24, 0.42, 95, -7);
      applyImage(img2Ref.current, p, 0.34, 0.52, 120, 5);
      applyImage(img3Ref.current, p, 0.44, 0.62, 155, -4);

      // last stretch of scroll: hero content dissolves while the overlay
      // rises and fades in over it, so the handoff to the next section
      // reads as a soft cross-fade rather than a hard wipe.
      const fadeT = clamp((p - FADE_START) / (1 - FADE_START), 0, 1);
      const fadeEased = fadeT * fadeT * (3 - 2 * fadeT);

      if (contentRef.current) {
        contentRef.current.style.opacity = String(1 - fadeEased);
        contentRef.current.style.transform = `translateY(${-fadeEased * 24}px)`;
      }

      if (overlayRef.current) {
        overlayRef.current.style.transform = `translateY(${(1 - fadeEased) * 100}%)`;
        overlayRef.current.style.opacity = String(clamp(fadeEased * 1.6, 0, 1));
      }

      // the wordmark only starts appearing once the overlay is well into
      // view, then fades + rises + unblurs into place — a slower, softer
      // reveal than the word-by-word text above, plus a soft downward
      // fade mask on the glyphs themselves.
      if (overlayTextRef.current) {
        const textT = clamp((fadeEased - 0.35) / 0.65, 0, 1);
        const textEased = textT * textT * (3 - 2 * textT);
        overlayTextRef.current.style.opacity = String(textEased);
        overlayTextRef.current.style.transform = `translateY(${(1 - textEased) * 26}px)`;
        overlayTextRef.current.style.filter = `blur(${(1 - textEased) * 14}px)`;
      }
    }

    function loop() {
      currentRef.current += (targetRef.current - currentRef.current) * 0.08;
      render();
      frameRef.current = requestAnimationFrame(loop);
    }

    function onScroll() {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const totalH = rect.height - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, totalH);
      targetRef.current = totalH > 0 ? scrolled / totalH : 0;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    frameRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div ref={containerRef} className="relative h-[240vh] " style={{background: "linear-gradient( to bottom,transparent 0%,#E3F2EF 15%,#E3F2EF 35%,#E3F2EF 60%,#f6f5f1 100%)"
}}>
        <div className="sticky top-0 h-screen overflow-hidden  [perspective:1000px] [perspective-origin:center_top]">
          <div
            className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div
            ref={contentRef}
            className="relative z-10 flex h-full flex-col items-center justify-center gap-2 px-6 text-center will-change-transform"
          >

            <h1
              className="m-0 flex flex-wrap justify-center gap-x-4 uppercase leading-[0.8] tracking-tighter"
              style={{
                fontSize: "clamp(2.8rem, 5.8vw, 62.5px)",
                fontWeight: 700,
                fontFamily: '"Sora", sans-serif',
                color: "#0B3D3B",
              }}
            >
              {HEADLINE.map((word, i) => (
                <span
                  key={word}
                  ref={(el) => (headlineRefs.current[i] = el)}
                  className="inline-block origin-top backface-hidden will-change-transform"
                  style={{ transform: "perspective(1200px) rotateX(-100deg) scaleY(0.05)" }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <div className="mt-2 flex flex-col gap-2">
              {LINES.map((line, li) => (
                <p
                  key={line}
                  className="m-0 flex flex-wrap justify-center gap-x-4 uppercase leading-[1]"
                  style={{ fontSize: "3rem",fontWeight: 700,
                fontFamily: '"Sora", sans-serif', color: "#3C6E68", }}
                >
                  {line.split(" ").map((word, wi) => (
                    <span
                      key={word + wi}
                      ref={(el) => (lineRefs.current[li][wi] = el)}
                      className="inline-block origin-top backface-hidden will-change-transform"
                      style={{ transform: "perspective(1000px) rotateX(-100deg) scaleY(0.05)" }}
                    >
                      {word}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>

          <img
            ref={img1Ref}
            src={img1}
            alt=""
            className="pointer-events-none absolute right-[16%] top-0 z-20 sm:h-[16vw] sm:w-[16vw] max-h-48 max-w-48 object-cover opacity-0 shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
          />
          <img
            ref={img2Ref}
            src={img2}
            alt=""
            className="pointer-events-none absolute left-[6%] top-[30%] z-20 sm:h-[15vw] sm:w-[15vw] max-h-52 max-w-52 object-cover opacity-0 shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
          />
          <img
            ref={img3Ref}
            src={img3}
            alt=""
            className="pointer-events-none absolute bottom-[6%] right-[10%] z-20 sm:h-[14vw] sm:w-[14vw] max-h-44 max-w-44 object-cover opacity-0 shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
          />

          <div
            ref={overlayRef}
            className="pointer-events-none absolute inset-0 z-30 opacity-0"
            style={{
              transform: "translateY(100%)",
              background: "linear-gradient( to bottom,transparent 0%,#E3F2EF 15%,#E3F2EF 35%,#E3F2EF 60%,#f6f5f1 100%)"
              }}
          />

          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
           
          </div>
        </div>
      </div>

      <div className="flex h-[10vh] items-center justify-center text-[#0B3D3B]">
      </div>
    </div>
  );
}