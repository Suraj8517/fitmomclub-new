import React, { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'

function useCountUp(target, duration = 1200, delay = 0, enabled = true) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!enabled) return
    let raf
    let start
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(target * eased))
        if (progress < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay, enabled])
  return value
}

// Fires once when the element is (almost) fully inside the viewport,
// then stops observing — animations should play once on reveal, not on
// every scroll pass.
function useInFullView(ref, threshold = 0.98) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= threshold) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 0.9, threshold, 1] }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])
  return inView
}

export default function Fitness() {
  const containerRef = useRef(null)
  const inView = useInFullView(containerRef)

  const [mounted, setMounted] = useState(false)
  const [beat, setBeat] = useState(false)
  const [liveBpm, setLiveBpm] = useState(142)
  const [barsIn, setBarsIn] = useState(false)
  const baseBpm = 142

  const bpm = useCountUp(baseBpm, 1300, 150, inView)
  const resting = useCountUp(62, 1000, 500, inView)
  const peak = useCountUp(168, 1000, 650, inView)

  useEffect(() => {
    if (!inView) return
    setMounted(true)
    const t = setTimeout(() => setBarsIn(true), 500)
    return () => clearTimeout(t)
  }, [inView])

  // Heartbeat pulse synced to bpm (real double-thump timing)
  useEffect(() => {
    if (!inView) return
    const interval = 60000 / baseBpm
    const id = setInterval(() => {
      setBeat(true)
      setLiveBpm(baseBpm + Math.round(Math.sin(Date.now() / 900) * 2))
      setTimeout(() => setBeat(false), 180)
    }, interval)
    return () => clearInterval(id)
  }, [inView])

  const zones = [
    ["#3B82F6", "Zone 1"],
    ["#22C55E", "Zone 2"],
    ["#EAB308", "Zone 3"],
    ["#F97316", "Zone 4"],
    ["#EF4444", "Zone 5"],
  ]
  const activeZone = 3

  const circumference = 389.6
  const targetOffset = 116
  const startOffset = circumference

  return (
    <div ref={containerRef} className="absolute hidden lg:block z-30" style={{ right: "7%", top: "50%", transform: "translateY(-50%)" }}>
      <style>{`
        @keyframes fitnessCardIn {
          0% { opacity: 0; transform: translateY(24px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fitnessGlowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.0); }
          50% { box-shadow: 0 0 26px 4px rgba(239,68,68,0.18); }
        }
        @keyframes fitnessRingDraw {
          0% { stroke-dashoffset: ${startOffset}; }
          100% { stroke-dashoffset: ${targetOffset}; }
        }
        @keyframes fitnessDotFloat {
          0%, 100% { transform: translateY(0); opacity: 0.9; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes fitnessZoneGlow {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.75; filter: brightness(1.25); }
        }
        @keyframes fitnessBeatHeart {
          0% { transform: scale(1); }
          25% { transform: scale(1.35); }
          40% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes fitnessTextPop {
          0% { transform: scale(1); }
          30% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .fitness-bar {
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .fitness-bar.in {
          transform: scaleX(1);
        }
      `}</style>

      <div
        className="rounded-3xl p-7 shadow-2xl text-center"
        style={{
          width: 260,
          background: "rgba(28,28,30,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          opacity: mounted ? 1 : 0,
          animation: mounted
            ? "fitnessCardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards, fitnessGlowPulse 2.4s ease-in-out infinite"
            : "none",
        }}
      >
        <p className="text-sm mb-4 flex items-center justify-center gap-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
          <Heart
            size={13}
            fill="#EF4444"
            color="#EF4444"
            style={{
              animation: beat ? "fitnessBeatHeart 0.5s ease-out" : "none",
            }}
          />
          Heart Rate
        </p>

        <div className="relative flex items-center justify-center mx-auto" style={{ width: 150, height: 150 }}>
          <svg width="150" height="150" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            <circle cx="75" cy="75" r="62" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="10" />
            <circle
              cx="75"
              cy="75"
              r="62"
              fill="none"
              stroke="#EF4444"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={mounted ? targetOffset : startOffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1.3s cubic-bezier(0.22, 1, 0.36, 1) 0.15s",
                filter: beat ? "drop-shadow(0 0 5px rgba(239,68,68,0.7))" : "none",
              }}
            />
          </svg>
          <div style={{ animation: beat ? "fitnessTextPop 0.5s ease-out" : "none" }}>
            <p className="text-4xl font-extrabold text-white tabular-nums">{bpm === baseBpm ? liveBpm : bpm}</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>BPM</p>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-5">
          <div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Resting</p>
            <p className="text-lg font-semibold text-white tabular-nums">{resting}</p>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
          <div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Peak</p>
            <p className="text-lg font-semibold tabular-nums" style={{ color: "#EF4444" }}>{peak}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            <span>Zone 1</span><span>Zone 5</span>
          </div>
          <div className="flex gap-1 h-2.5 rounded-full overflow-hidden">
            {zones.map(([c], i) => (
              <div
                key={i}
                className={`fitness-bar${barsIn ? " in" : ""}`}
                style={{
                  flex: 1,
                  background: c,
                  opacity: i === activeZone ? 1 : 0.45,
                  transitionDelay: `${i * 90}ms`,
                  animation: i === activeZone && barsIn ? "fitnessZoneGlow 1.8s ease-in-out infinite" : "none",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
          <p
            className="text-xs mt-1.5 text-left flex items-center gap-1"
            style={{ color: "#F97316", opacity: barsIn ? 1 : 0, transition: "opacity 0.5s ease 0.6s" }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#F97316",
                display: "inline-block",
                animation: "fitnessDotFloat 1.4s ease-in-out infinite",
              }}
            />
            Cardio Zone
          </p>
        </div>
      </div>
    </div>
  )
}