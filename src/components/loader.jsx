import { useEffect, useState } from "react";
import "./css/loader.css"; 
// Eases to 90% over `minMs`, then finishes once the window has loaded.
function useProgress(minMs) {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    let ready = document.readyState === "complete";
    const onLoad = () => { ready = true; };
    if (!ready) window.addEventListener("load", onLoad);

    const tick = (now) => {
      const t = Math.min((now - start) / minMs, 1);
      const next = Math.min(t * t * (3 - 2 * t), ready ? 1 : 0.9);
      setP(next);
      if (next < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, [minMs]);

  return p;
}

export default function FitMomLoader({ minMs = 4200, onDone }) {
  const p = useProgress(minMs);
  const done = p >= 1;
  const pct = Math.round(p * 100);
  const [gone, setGone] = useState(false);

  // Unmount after the exit animation has finished
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      setGone(true);
      onDone?.();
    }, 2600);
    return () => clearTimeout(t);
  }, [done, onDone]);

  if (gone) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading FitMom Club ${pct} percent`}
      aria-hidden={done}
      className={`fixed inset-0 z-[99999] overflow-hidden bg-[var(--bg)] font-title text-[var(--ink)] transition-opacity duration-1000 ${
        done ? "pointer-events-none opacity-0 delay-[1000ms]" : "opacity-100"
      }`}
    >
      {/* Light leaks */}
      <div
        aria-hidden="true"
        className="absolute -left-1/4 top-0 h-full w-1/2 bg-[radial-gradient(closest-side,rgba(255,140,50,.5),transparent)] blur-2xl mix-blend-screen animate-leak motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="absolute -left-1/4 top-[20%] h-3/5 w-2/5 bg-[radial-gradient(closest-side,rgba(255,92,133,.4),transparent)] blur-3xl mix-blend-screen animate-leak motion-reduce:animate-none [animation-delay:-4s] [animation-duration:12s]"
      />

      {/* Soft flare behind the title, grows with progress */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-transparent via-[#2ec4c9]/60 to-transparent blur-2xl mix-blend-screen"
        style={{ width: `${20 + 80 * p}%`, opacity: 0.3 + 0.7 * p }}
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-transparent via-[#b9f6ff] to-transparent blur-[8px] mix-blend-screen"
        style={{ width: `${10 + 90 * p}%`, opacity: 0.25 + 0.45 * p }}
      />

      {/* Title card: wrapper handles the exit, h1 handles the entrance */}
      <div
        className={`absolute inset-0 grid place-items-center px-4 transition-all duration-[1400ms] ease-in ${
          done ? "scale-[1.4] opacity-0 blur-md" : "scale-100 opacity-100"
        }`}
      >
        <div className="text-center">
          <h1 className="m-0 animate-trackin text-[clamp(1.9rem,8.2vw,5.75rem)] font-medium leading-none motion-reduce:animate-none">
            FITMOM CLUB
          </h1>
          <p className="mb-0 mt-5 animate-fadeup text-[clamp(.95rem,2.4vw,1.35rem)] italic tracking-wide text-[var(--muted)] motion-reduce:animate-none [animation-delay:2.2s]">
            #1 Fitness & Wellness Community for Moms
          </p>
        </div>
      </div>

      {/* Percentage */}
      <div className="absolute inset-x-0 bottom-[16vh] z-10 grid justify-items-center">
        <span className="text-sm tabular-nums tracking-[.3em] text-[var(--muted)]">
          {pct}%
        </span>
      </div>

      {/* Vignette, grain, flash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,.85)_100%)]"
      />
      <div
        aria-hidden="true"
        className="grain pointer-events-none absolute -inset-1/2 opacity-[.14] mix-blend-overlay animate-grain motion-reduce:animate-none"
      />
      {done && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40 animate-flash bg-white motion-reduce:animate-none"
        />
      )}
    </div>
  );
}