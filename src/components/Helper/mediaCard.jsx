
import React, { useRef, useState, useEffect } from "react";
import { OptimizeCloudinaryUrl } from "./optimizeCloudinary";
import { TOKENS } from "./TOKENS";
import WashiTape from "./washiTape";
import VideoLoader from "./videoLoader";

const ROTATIONS = [2, 2.5, -1.5, 3, -2, 1.5, -3.5, 2];
const TAPE_COLORS = [TOKENS.sage, TOKENS.gold, TOKENS.berry];

export function MediaCard({ card, index, className = "" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const optimizedSrc = OptimizeCloudinaryUrl(card.videoSrc);
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const tapeColor = TAPE_COLORS[index % TAPE_COLORS.length];
  const tapeSide = card.titlePosition === "top" ? "right" : "left";
  const tapeRotate = card.titlePosition === "top" ? 8 : -8;
  const hasStat = /\d/.test(card.title);

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
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (el && el.readyState >= 3) setIsLoaded(true);
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: "transform 320ms cubic-bezier(.2,.8,.2,1), box-shadow 320ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "rotate(0deg) scale(1.045)";
        e.currentTarget.style.zIndex = 30;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1)`;
        e.currentTarget.style.zIndex = 1;
      }}
    >
      <WashiTape color={tapeColor} side={tapeSide} rotate={tapeRotate} />

      {/* Polaroid frame */}
      <div
        className="relative rounded-sm overflow-hidden"
        style={{
          background: TOKENS.card,
          padding: "7px 7px 11px 7px",
        }}
      >
        {/* photo/video window */}
        <div className="relative rounded-[2px] overflow-hidden aspect-[9/16]" style={{ background: TOKENS.paperDark }}>
          {card.videoSrc ? (
            <>
              {!isLoaded && !hasError && <VideoLoader />}
              {hasError ? (
                <div
                  className="absolute inset-0 flex items-center justify-center text-sm text-center px-4"
                  style={{ background: TOKENS.paperDark, color: TOKENS.inkSoft }}
                >
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
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(38,35,25,0.28), rgba(38,35,25,0) 45%)" }}
              />
            </>
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-sm"
              style={{ background: TOKENS.paperDark, color: TOKENS.inkSoft }}
            >
              FMC transformations
            </div>
          )}
        </div>

        {/* handwritten caption strip, like a journal note under the photo */}
        <div className="pt-2 px-1">
          <p
            className="leading-tight hidden sm:block"
            style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: TOKENS.ink, fontWeight: 600 }}
          >
            {hasStat ? (
              <span
                style={{
                  background: `#D8F8F3`,
                  padding: "0 4px",
                  borderRadius: 2,
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              >
                {card.title}
              </span>
            ) : (
              card.title
            )}
          </p>
          {card.author && (
            <p
              className="mt-1 hidden sm:block"
              style={{
                fontFamily: "'Work Sans', sans-serif",
                fontSize: 9,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: TOKENS.inkSoft,
              }}
            >
              {card.author}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}