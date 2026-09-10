import { useEffect, useRef } from "react";
import screen1 from "../../assets/home/mobile/img1.png";
import screen2 from "../../assets/home/mobile/img2.png";
import useDeviceType from "../../components/Helper/DeviceType";
import AppleIcon  from "../../components/Helper/AppleIcon";
import  PlayStoreIcon  from "../../components/Helper/PlayStoreIcon";

import { Link } from "react-router-dom";

export default function HealthCoachSection() {
  const phone1Ref = useRef(null);
  const phone2Ref = useRef(null);
  const sectionRef = useRef(null);

  const mobilePhone1Ref = useRef(null);
  const mobilePhone2Ref = useRef(null);
  const mobileSectionRef = useRef(null);

  const deviceType = useDeviceType();

  useEffect(() => {
    const handleScroll = () => {
      // ── Desktop parallax ──
      if (sectionRef.current) {
        const section = sectionRef.current;
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const progress = Math.max(
          0,
          Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height))
        );

        if (phone1Ref.current) {
          const rotateZ = -progress * 30;
          const rotateX = progress * 12;
          const translateY = progress * 80;
          const translateX = -progress * 40;
          phone1Ref.current.style.transform = `perspective(1400px) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg) translateY(${translateY}px) translateX(${translateX}px)`;
        }

        if (phone2Ref.current) {
          const rotateZ = progress * 32;
          const rotateX = progress * 10;
          const translateY = -progress * 40;
          const translateX = progress * 20;
          phone2Ref.current.style.transform = `perspective(1400px) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg) translateY(${translateY}px) translateX(${translateX}px)`;
        }
      }

      // ── Mobile parallax ──
      if (mobileSectionRef.current) {
        const section = mobileSectionRef.current;
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const progress = Math.max(
          0,
          Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height))
        );

        if (mobilePhone1Ref.current) {
          const rotateZ = -8 - progress * 14;
          const rotateX = progress * 6;
          const translateY = progress * 20;
          const translateX = -progress * 18;
          mobilePhone1Ref.current.style.transform = `perspective(1000px) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg) translateY(${translateY}px) translateX(${translateX}px)`;
        }

        if (mobilePhone2Ref.current) {
          const rotateZ = 8 + progress * 14;
          const rotateX = progress * 6;
          const translateY = -progress * 16;
          const translateX = progress * 18;
          mobilePhone2Ref.current.style.transform = `perspective(1000px) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg) translateY(${translateY}px) translateX(${translateX}px)`;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── MOBILE VERSION (< lg) ── */}
      <section
        ref={mobileSectionRef}
        className="lg:hidden bg-[#F6F5F1] px-6 py-2 overflow-hidden"
      >
        <div className="text-center mb-10 max-w-xs mx-auto">
          <h1 className="text-3xl sm:text-4xl font-normal text-[#2C2C2C] leading-[1.2] tracking-tight mb-4">
            Your Fitness Journey, <br />
            Anywhere, Anytime
          </h1>
          <p className="text-base sm:text-lg text-[#4A4A4A] leading-relaxed mb-5">
            Personalised workouts, progress tracking,
            and expert support,{" "}
            <span className="text-teal-800">all in one app.</span>
          </p>

          <Link
            to="our-app"
            className="inline-flex items-center gap-1.5 text-[#2C2C2C] text-base font-medium hover:underline underline-offset-4 transition-all"
          >
            See how it works
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Phone images — two images, parallax on scroll */}
        <div className="relative flex items-center justify-center mb-10 h-[340px] sm:h-[400px]">
          <div
            ref={mobilePhone1Ref}
            className="absolute left-[2%] top-[25%] w-[55%] max-w-[220px] z-10"
            style={{
              transform: "perspective(1000px) rotateZ(-8deg)",
              transition: "transform 0.08s linear",
              willChange: "transform",
            }}
          >
            <img
              src={screen1}
              alt="Health Coach chat interface"
              className="w-full drop-shadow-xl rounded-[2rem]"
            />
          </div>

          <div
            ref={mobilePhone2Ref}
            className="absolute right-[4%] -top-6 w-[55%] max-w-[220px] z-20"
            style={{
              transform: "perspective(1000px) rotateZ(8deg)",
              transition: "transform 0.08s linear",
              willChange: "transform",
            }}
          >
            <img
              src={screen2}
              alt="fitmom club interface"
              className="w-full drop-shadow-xl rounded-[2rem]"
            />
          </div>
        </div>

        {/* Body copy + CTA */}
        <div className="text-center max-w-xs mx-auto">
          <h2 className="text-2xl sm:text-3xl font-normal text-[#1C1B1F] leading-[1.2] tracking-tight mb-4">
            Have a question about your health and wellness?
          </h2>
          <p className="text-sm sm:text-base text-[#3C3C3C] leading-relaxed mb-6">
            Ask anything, anytime. Get evidence-backed answers and tailored
            insights based on your data.
          </p>
        </div>
      </section>

      {/* ── DESKTOP VERSION (lg+) — original design unchanged ── */}
      <section
        ref={sectionRef}
        className="relative w-full 2xl:min-h-[275vh] min-h-[275vh] bg-[#F6F5F1] overflow-hidden hidden lg:block"
      >
        <div className="w-full flex flex-col items-center justify-center text-center px-6 pt-14 pb-2">
          <h1 className="text-4xl lg:text-5xl xl:text-[3rem] 2xl:text-[4rem] font-normal text-[#2C2C2C] leading-[1.2] tracking-tight 2xl:max-w-6xl max-w-5xl mb-5">
            Your Fitness Journey, <br />
            Anywhere, Anytime
          </h1>
          <p className="text-lg lg:text-3xl text-[#4A4A4A] leading-relaxed mb-6">
            Personalised workouts, progress tracking,<br />
            and expert support, <span className="text-teal-800">all in one app.</span>
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-[#2C2C2C] text-lg font-medium hover:underline underline-offset-4 transition-all"
          >
            See how it works
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="relative w-full 2xl:max-w-8xl mx-auto px-18 2xl:px-40 min-h-screen flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-shrink-0 w-full 2xl:w-[42%] lg:w-[52%] pt-22 lg:pt-0 z-30">
            <h2 className="text-4xl lg:text-5xl 2xl:text-[4rem] xl:text-[3rem] font-normal text-[#1C1B1F] leading-[1.15] tracking-tight mb-6">
              Your complete<br />
              fitness companion<br />
            </h2>

            <p className="text-base lg:text-lg 2xl:text-xl text-[#3C3C3C] leading-relaxed mb-8 max-w-lg">
              Access personalized workout plans, nutrition guidance, live classes, progress tracking, and expert support, all in one app designed to help you achieve lasting results.
            </p>
           
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <a
                    href="#"
                    className="hero-fade-up hero-cta inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-100"
                    style={{ animationDelay: "0.38s" }}
                  >
                    <PlayStoreIcon />
                    Google Play
                  </a>
                  <a
                    href="#"
                    className="hero-fade-up hero-cta inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-100"
                    style={{ animationDelay: "0.46s" }}
                  >
                    <AppleIcon />
                    App Store
                  </a>
                </div>
          </div>

          {/* Phones with parallax */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              ref={phone2Ref}
              className="absolute pointer-events-auto w-[260px] sm:w-[320px] md:w-[400px] lg:w-[550px] xl:w-[550px] 2xl:w-[680px]  2xl:bottom-[-350px] 2xl:right-[80px] right-[150px] bottom-[-280px] xl:right-[60px] xl:bottom-[-280px] lg:right-[80px] lg:bottom-[-280px]"
              style={{
                transform: "perspective(1400px) rotateZ(0deg) rotateX(0deg)",
                transition: "transform 0.08s linear",
                willChange: "transform",
              }}
            >
              <img
                src={screen2}
                alt="fitmom club interface"
                className="w-full drop-shadow-2xl rounded-[2.8rem]"
              />
            </div>

            <div
              ref={phone1Ref}
              className=" absolute pointer-events-auto w-[260px] sm:w-[320px] md:w-[400px] lg:w-[480px] xl:w-[590px] 2xl:w-[680px] 2xl:bottom-[-730px] 2xl:left-[100px] left-[60px] bottom-[-500px] lg:left-[60px] lg:bottom-[-500px] xl:left-[60px] xl:bottom-[-550px]"
              style={{
                transform: "perspective(1400px) rotateZ(0deg) rotateX(0deg)",
                transition: "transform 0.08s linear",
                willChange: "transform",
              }}
            >
              <img
                src={screen1}
                alt="fitmom club interface"
                className="w-full drop-shadow-2xl rounded-[2.8rem] "
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}