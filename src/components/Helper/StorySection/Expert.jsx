import React, { useEffect, useRef, useState } from 'react'
import RunningSVG from './RunningSVG'
import RunningSVG1 from './running1svg'

function useCountUp(target, duration = 900, delay = 0, decimals = 0, enabled = true) {
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
        setValue(Number((target * eased).toFixed(decimals)))
        if (progress < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay, decimals, enabled])
  return value
}

// Fires once when the element is (almost) fully inside the viewport,
// then stops observing — animations should play on reveal via scroll,
// not immediately just because the section happens to already be in
// view at page load.
function useInFullView(ref, threshold = 0.98) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Synchronous measurement, taken the instant this effect runs —
    // not subject to the IntersectionObserver's own callback delay.
    // This lets us tell "already in view at page load" apart from
    // "scrolled into view very fast, before the observer's first
    // report arrived."
    const rect = el.getBoundingClientRect()
    const viewportH = window.innerHeight || document.documentElement.clientHeight
    const visibleH = Math.min(rect.bottom, viewportH) - Math.max(rect.top, 0)
    const ratioAtMount = rect.height > 0 ? Math.max(0, visibleH) / rect.height : 0
    const wasInViewAtMount = ratioAtMount >= threshold

    let firstCallback = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (firstCallback) {
          firstCallback = false
          // Only discard this callback if it's just confirming what
          // was already true synchronously at mount.
          if (wasInViewAtMount) {
            return
          }
        }
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

// A smooth, winding route path — like a real map route (roads and
// trails curve, they don't zig-zag in sharp peaks). Built with cubic
// beziers so it flows naturally from the start flag to the destination
// marker.
const TRAIL_PATH =
  "M40,190 " +
  "C70,150 55,105 95,95 " +
  "C130,87 145,130 120,160 " +
  "C98,186 140,205 175,180 " +
  "C205,158 190,110 225,90 " +
  "C255,73 275,100 250,125 " +
  "C230,145 250,168 280,150 " +
  "C310,132 300,95 335,80 " +
  "C360,69 375,85 365,105 " +
  "C358,120 375,118 390,108 " +
  "C400,101 405,106 410,112"

// Point along the winding path (near the first big bend) where the
// checkered "waypoint" marker sits.
const CHECKPOINT = { x: 175, y: 180 }

export default function RunningMap() {
  const containerRef = useRef(null)
  const inView = useInFullView(containerRef)

  const pathRef = useRef(null)
  const [pathLength, setPathLength] = useState(0)
  const [progress, setProgress] = useState(0)
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 })
  const [routeDone, setRouteDone] = useState(false)
  const [mounted, setMounted] = useState(false)

  // The checkered "X" waypoint marker travels from its resting spot to
  // the destination once the map has loaded, so it reads as reaching
  // the end point rather than sitting static.
  const [checkpointLen, setCheckpointLen] = useState(0)
  const [markerPos, setMarkerPos] = useState(CHECKPOINT)
  const [markerArrived, setMarkerArrived] = useState(false)

  const cardioLoad = useCountUp(15, 900, 1400, 0, inView)
  const distance = useCountUp(1.5, 900, 1550, 1, inView)

  // Compute the path's total length as soon as it's in the DOM (cheap,
  // doesn't need to wait for visibility) so it's ready the instant the
  // draw animation is allowed to start.
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength()
      setPathLength(len)
      const p0 = pathRef.current.getPointAtLength(0)
      setDotPos({ x: p0.x, y: p0.y })

      // Find the length along the path closest to the checkpoint's
      // resting position, so the marker can travel from there to the
      // very end of the route.
      let closestLen = 0
      let minDist = Infinity
      const samples = 150
      for (let i = 0; i <= samples; i++) {
        const l = (i / samples) * len
        const pt = pathRef.current.getPointAtLength(l)
        const d = Math.hypot(pt.x - CHECKPOINT.x, pt.y - CHECKPOINT.y)
        if (d < minDist) {
          minDist = d
          closestLen = l
        }
      }
      setCheckpointLen(closestLen)
    }
  }, [])

  useEffect(() => {
    if (!inView) return
    setMounted(true)
  }, [inView])

  useEffect(() => {
    if (!inView || !pathLength) return
    let raf
    let start
    const delay = 650
    const duration = 2200
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts
        const t = Math.min((ts - start) / duration, 1)
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        setProgress(eased)
        if (pathRef.current) {
          const pt = pathRef.current.getPointAtLength(eased * pathLength)
          setDotPos({ x: pt.x, y: pt.y })
        }
        if (t < 1) {
          raf = requestAnimationFrame(step)
        } else {
          setRouteDone(true)
        }
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [pathLength, inView])

  // Once the route has drawn in, send the checkered marker on its own
  // trip along the curve to the destination, so it visibly "arrives".
  useEffect(() => {
    if (!inView || !pathLength) return
    let raf
    let start
    const delay = 4100
    const duration = 10150
    const startLen = checkpointLen
    const endLen = pathLength
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts
        const t = Math.min((ts - start) / duration, 1)
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        const L = startLen + eased * (endLen - startLen)
        if (pathRef.current) {
          const pt = pathRef.current.getPointAtLength(L)
          setMarkerPos({ x: pt.x, y: pt.y })
        }
        if (t < 1) {
          raf = requestAnimationFrame(step)
        } else {
          setMarkerArrived(true)
        }
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [pathLength, inView, checkpointLen])

  return (
    <div ref={containerRef} className="absolute hidden lg:block z-30" style={{ right: "6%", top: "42%", transform: "translateY(-50%)" }}>
      <style>{`
        @keyframes runnerBounce {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-3px) rotate(4deg); }
        }
        @keyframes runnerTrailFade {
          0% { opacity: 0.9; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.4) translateY(6px); }
        }
        @keyframes mapFadeUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes mapFlagIn {
          0% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 1; transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes mapDotPulse {
          0% { transform: scale(0.6); opacity: 0.7; }
          70% { transform: scale(2.4); opacity: 0; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes mapBgPathBreathe {
          0%, 100% { opacity: 0.28; }
          50% { opacity: 0.5; }
        }
        @keyframes mapCheckpointIn {
          0% { opacity: 0; transform: scale(0.4) rotate(-20deg); }
          60% { opacity: 1; transform: scale(1.15) rotate(6deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes mapCheckpointPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @keyframes mapCheckpointArrive {
          0% { transform: scale(1); }
          40% { transform: scale(1.5); }
          70% { transform: scale(0.88); }
          100% { transform: scale(1); }
        }
        .map-stat {
          opacity: 0;
        }
        .map-stat.in {
          animation: mapFadeUp 0.5s ease forwards;
        }
      `}</style>

      <div style={{ width: 460, position: "relative" }}>
        <div className="flex items-center gap-3 mb-1">
          <div
            className={`map-stat${mounted ? " in" : ""}`}
            style={{ position: "relative", width: 34, height: 34, animationDelay: "0.1s" }}
          >
            {mounted && <RunningSVG1/>}
          </div>
          <div className={`map-stat${mounted ? " in" : ""}`} style={{ animationDelay: "0.18s" }}>
            <p className="text-lg font-semibold text-white leading-tight">Trail run</p>
            <p className="text-sm flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              14:40 PM &nbsp;&middot;&nbsp; 160 cal
            </p>
          </div>

          <div className={`map-stat${mounted ? " in" : ""}`} style={{ marginLeft: 32, animationDelay: "0.26s" }}>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Cardio load</p>
            <p className="text-2xl font-semibold tabular-nums" style={{ color: "#2DD4BF" }}>{cardioLoad}</p>
          </div>

          <div className={`map-stat${mounted ? " in" : ""}`} style={{ marginLeft: 24, animationDelay: "0.34s" }}>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Distance</p>
            <p className="text-2xl font-semibold tabular-nums" style={{ color: "#2DD4BF" }}>{distance.toFixed(1)} km</p>
          </div>
        </div>

        <svg width="460" height="220" viewBox="0 0 460 220" style={{ display: "block", marginTop: 10 }}>
          <path
            d={TRAIL_PATH}
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.5"
            fill="none"
            strokeLinejoin="round"
            style={{ animation: mounted ? "mapBgPathBreathe 3.4s ease-in-out infinite" : "none" }}
          />

          <path
            ref={pathRef}
            d={TRAIL_PATH}
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - progress)}
          />

          {/* Start flag */}
          <g transform="translate(40,190)" style={{ animation: mounted ? "mapFlagIn 0.5s ease 0.5s backwards" : "none" }}>
            <circle r="13" fill="#2DD4BF" />
            <path d="M-3,-5 v10 M-3,-5 l7,2.5 l-7,2.5" stroke="#0b0b0b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>

          {/* Checkered waypoint marker, like the reference image — it
              rests at the checkpoint after loading, then travels along
              the curve to the destination and bounces on arrival. */}
          <g
            transform={`translate(${markerPos.x},${markerPos.y})`}
            style={{
              transformOrigin: `${markerPos.x}px ${markerPos.y}px`,
              animation: !mounted
                ? "none"
                : markerArrived
                ? "mapCheckpointArrive 0.45s ease, mapCheckpointPulse 2s ease-in-out 0.45s infinite"
                : "mapCheckpointIn 0.5s ease 0.9s backwards, mapCheckpointPulse 2s ease-in-out 1.4s infinite",
            }}
          >
            <rect x="-5" y="-5" width="4.4" height="4.4" fill="#2DD4BF" transform="rotate(45 -2.8 -2.8)" />
            <rect x="0.6" y="-5" width="4.4" height="4.4" fill="#2DD4BF" transform="rotate(45 2.8 -2.8)" />
            <rect x="-5" y="0.6" width="4.4" height="4.4" fill="#2DD4BF" transform="rotate(45 -2.8 2.8)" />
            <rect x="0.6" y="0.6" width="4.4" height="4.4" fill="#2DD4BF" transform="rotate(45 2.8 2.8)" />
          </g>

          {routeDone && (
            <>
              <circle
                cx="410"
                cy="112"
                r="13"
                fill="none"
                stroke="#2DD4BF"
                strokeWidth="2"
                style={{ animation: "mapDotPulse 1.8s ease-out infinite", transformOrigin: "410px 112px" }}
              />
              <circle cx="410" cy="112" r="6" fill="#2DD4BF" stroke="white" strokeWidth="2" />
            </>
          )}

          {/* Live tracker dot riding the drawn line */}
          {!routeDone && <circle cx={dotPos.x || 40} cy={dotPos.y || 190} r="5.5" fill="#2DD4BF" stroke="white" strokeWidth="1.8" />}
        </svg>
      </div>
    </div>
  )
}