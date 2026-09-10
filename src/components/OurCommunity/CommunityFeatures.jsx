import { useEffect, useRef, useState } from "react";
import { Trophy, Flame, Video, MessageCircle } from "lucide-react";

const FEATURES = [
  {
    icon: Trophy,
    title: "Success Stories",
    description: "Real transformations from moms like you.",
  },
  {
    icon: Flame,
    title: "Challenges",
    description: "Weekly fitness challenges with leaderboards to push you further.",
  },
  {
    icon: Video,
    title: "Live Events",
    description: "Webinars and expert Q&A sessions.",
  },
  {
    icon: MessageCircle,
    title: "Member Discussions",
    description: "Engage with other moms in live discussions and forums.",
  },
];

/** Fires once the ref'd element enters the viewport and stays true afterward.
 *  Unobserves after the first reveal — animation only ever triggers from
 *  an actual scroll intersection, never from a timer or on page load. */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px", ...options }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

export default function CommunityFeatures() {
  const [headerRef, headerInView] = useInView();
  const [panelRef, panelInView] = useInView();

  return (
    
    <section className="w-full bg-[#F6F5F1] px-6 py-6 sm:px-10 lg:px-16">
        <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient
            id="icon-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00D1B8" />
            <stop offset="100%" stopColor="#017265" />
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        .cf-sans {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", ui-sans-serif, system-ui, sans-serif;
        }

        @keyframes cfRiseUp {
          from { opacity: 0; transform: translate3d(0, 28px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes cfPanelIn {
          from { opacity: 0; transform: translate3d(0, 40px, 0) scale(0.97); }
          to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes cfIconIn {
          from { opacity: 0; transform: translate3d(0, 22px, 0) scale(0.9); }
          to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }

        .cf-header {
          opacity: 0;
        }
        .cf-header[data-inview="true"] {
          animation: cfRiseUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .cf-panel {
          opacity: 0;
        }
        .cf-panel[data-inview="true"] {
          animation: cfPanelIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .cf-feature {
          opacity: 0;
        }
        .cf-panel[data-inview="true"] .cf-feature {
          animation: cfIconIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .cf-panel[data-inview="true"] .cf-feature:nth-child(1) { animation-delay: 0.15s; }
        .cf-panel[data-inview="true"] .cf-feature:nth-child(2) { animation-delay: 0.28s; }
        .cf-panel[data-inview="true"] .cf-feature:nth-child(3) { animation-delay: 0.41s; }
        .cf-panel[data-inview="true"] .cf-feature:nth-child(4) { animation-delay: 0.54s; }

        @media (prefers-reduced-motion: reduce) {
          .cf-header, .cf-panel, .cf-feature {
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
      <div
        ref={headerRef}
        data-inview={headerInView}
        className="cf-header mx-auto max-w-3xl text-center mb-6 sm:mb-8"
      >
<h2 className="text-center text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] mb-4 sm:mb-6" >
    What You’ll Find in Our Community
</h2>
<p className="mx-auto max-w-3xl text-center text-[15px] font-normal leading-relaxed text-[#4b5468] sm:text-[16px]">
    Our community is more than just a space to share stories—it’s a hub of activities, challenges, and resources to help you stay motivated on your fitness journey. Here’s what you’ll discover:
</p>
      </div>

      <div
        ref={panelRef}
        data-inview={panelInView}
        className="cf-panel mx-auto bg-white max-w-4xl py-6 px-6 rounded-[2rem] sm:py-10 sm:px-10 lg:py-12 lg:px-12  "
      >
        <div className="grid grid-cols-2 gap-y-16 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="cf-feature flex flex-col items-center text-center">
              <Icon
                className="h-10 w-10 text-[#1d1d1f] sm:h-14 sm:w-14"
                strokeWidth={1.25}
                stroke="url(#icon-gradient)"
                fill="none"
              />

              <h3 className="cf-sans mt-2 text-[15px] font-medium leading-snug text-[#3c4257] sm:mt-4 sm:text-[14px]">
                {title}
              </h3>

              <p className="cf-sans mt-2 max-w-[150px] text-[12px] font-normal leading-relaxed text-[#4b5468] sm:max-w-[240px] sm:text-[12px]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}