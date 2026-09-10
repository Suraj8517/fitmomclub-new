import React, { useState, useEffect, useCallback, useRef } from "react";
import { Trophy, Star, Flame, Plus, X, ArrowUpRight } from "lucide-react";

const CARDS = [
  {
    id: "success",
    icon: Trophy,
    accent: "#7C5CFC",
    accentSoft: "#F1EEFE",
    eyebrow: "Community Wins",
    headlinePre: "Success Stories from Our ",
    headlineHi: "FitMom",
    headlinePost: " Community",
    teaser: "Real transformations, real members.",
    modalTitle: "Success Stories from Our FitMom Community",
    body: "See how FitMom Club is transforming their health, fitness, and wellbeing. Their success is proof that with the right guidance and support, anything is possible.",
    linkLabel: "View more success stories",
    linkHref: "https://fitmomclub.co/success-stories/",
  },
  {
    id: "reviews",
    icon: Star,
    accent: "#FF4D6D",
    accentSoft: "#FFEBEF",
    eyebrow: "Reviews & Ratings",
    headlinePre: "Hear from Our ",
    headlineHi: "FitMom Community",
    headlinePost: "",
    teaser: "Honest feedback, straight from members.",
    modalTitle: "Hear from Our Community",
    body: "See what our members are saying about their experiences at FitMom Club. Real reviews, honest feedback, and personal testimonials about our programs, trainers, and community.",
    linkLabel: "Read the Reviews",
    linkHref: "https://www.google.com/search?sca_esv=3926efc4ae7c8dc3&sxsrf=APpeQnv6lxE3Nuc5w-6f--gcR87hlbqh3Q:1783326023099&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_xiUktYNqhFFAEToXbnQTEpkbwZ8eHTUSzXMOydKjhVpQfhyJlY6XuCsY_MOCABU_7nHrp0yYmU32UsPCMv47NQoHQcL&q=FitMom+Club+Reviews&sa=X&ved=2ahUKEwjokYCRz72VAxVKbmwGHYncEIAQ0bkNegQILhAF&biw=1280&bih=551&dpr=1.5#lrd=0x3ba8f7ae88f23111:0x590c0b3b8586d660,1,,,,",
  },
  {
    id: "challenges",
    icon: Flame,
    accent: "#1FA98D",
    accentSoft: "#E6F7F3",
    eyebrow: "Fitness Challenges",
    headlinePre: "Challenge Yourself and Stay ",
    headlineHi: "Motivated",
    headlinePost: "",
    teaser: "Weekly goals. Real leaderboards.",
    modalTitle: "Challenge Yourself and Stay Motivated",
    body: "Get ready for engaging fitness challenges designed to keep you on track. Whether you\u2019re competing in a weekly strength challenge or joining a group wellness goal, you\u2019ll have the support of your peers\u2014and a leaderboard to keep things exciting.",
    linkLabel: "Contact Us",
    linkHref: "https://fitmomclub.co/contact/",
  },
];

/** Fires once the ref'd element enters the viewport and stays true afterward.
 *  Only ever triggered by an actual scroll intersection — no timer fallback,
 *  so the animation never plays on page load if the section is off-screen. */
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
      { threshold: 0, rootMargin: "0px 0px -10% 0px", ...options }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function Modal({ card, onClose }) {
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!card) return null;
  const Icon = card.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fitmom-modal-title"
    >
      <div
        className="absolute inset-0 bg-[#1B1523]/60 backdrop-blur-sm animate-[fadein_.18s_ease-out]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-[28px] bg-white shadow-[0_30px_80px_-20px_rgba(27,21,35,0.45)] animate-[popin_.22s_cubic-bezier(0.16,1,0.3,1)]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#1B1523] text-white transition-transform hover:scale-105 active:scale-95"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="px-8 pb-9 pt-10 sm:px-10 sm:pb-10 sm:pt-11">
          <div
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: card.accentSoft, color: card.accent }}
          >
            <Icon size={26} strokeWidth={2} />
          </div>

          <p
            className="mb-2 text-[13px] font-medium uppercase tracking-[0.14em]"
            style={{ color: card.accent }}
          >
            {card.eyebrow}
          </p>

          <h3
            id="fitmom-modal-title"
            className="mb-5 font-display text-[30px] font-bold leading-[1.12] text-[#1B1523] sm:text-[34px]"
          >
            {card.modalTitle}
          </h3>

          <p className="text-[16px] leading-relaxed text-[#4A4356]">
            {card.body}
          </p>

          {card.linkLabel && (
            <a
              href={card.linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[12px] font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{ backgroundColor: card.accent }}
            >
              {card.linkLabel}
              <ArrowUpRight
                size={15}
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ card, onOpen, inView, delay }) {
  const Icon = card.icon;
  return (
    <div
      className="fms-card flex h-full flex-col rounded-[26px] bg-white p-7 shadow-[0_2px_10px_rgba(27,21,35,0.06)] ring-1 ring-[#1B1523]/[0.04] transition-shadow hover:shadow-[0_10px_30px_rgba(27,21,35,0.1)] sm:py-4 sm:px-8"
      style={{
        opacity: inView ? undefined : 0,
        animation: inView
          ? `fmsCardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both`
          : "none",
        animationDelay: inView ? delay : "0s",
      }}
    >
      <div
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ color: card.accent }} 
      >
        <Icon size={32} strokeWidth={2} />
      </div>

      

      <h3 className="font-display text-[28px] font-bold leading-[1.2] text-[#1B1523] font-serif">
        {card.headlinePre}
        <span style={{ color: card.accent }}>{card.headlineHi}</span>
        {card.headlinePost}
      </h3>

     
      <div className="mt-auto flex justify-end pt-8">
        <button
          onClick={() => onOpen(card)}
          aria-label={`Learn more: ${card.modalTitle}`}
          className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform hover:scale-110 active:scale-95"
          style={{
            backgroundColor: "#1B1523",
            transitionDuration: "260ms",
          }}
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default function FitMomSuccessSection() {
  const [activeCard, setActiveCard] = useState(null);
  const [sectionRef, sectionInView] = useInView();

  return (
    <section
      ref={sectionRef}
      className=" w-full bg-[#F6F5F1] px-5 py-16 sm:px-10 sm:py-20"
    >
      <style>{`
     @keyframes fadein { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popin { from { opacity: 0; transform: translateY(14px) scale(.97) } to { opacity: 1; transform: translateY(0) scale(1) } }

        @keyframes fmsCardIn {
          from { opacity: 0; transform: translate3d(0, 36px, 0) scale(0.96); }
          to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .fms-card {
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
      

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card, i) => (
            <InfoCard
              key={card.id}
              card={card}
              onOpen={setActiveCard}
              inView={sectionInView}
              delay={`${i * 0.14}s`}
            />
          ))}
        </div>
      </div>

      <Modal card={activeCard} onClose={() => setActiveCard(null)} />
    </section>
  );
}