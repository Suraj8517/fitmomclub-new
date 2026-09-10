export default function AboutUsHero() {

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        .hero-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        .hero-root { font-family: 'Poppins', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.05s both; }
        .anim-2 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.22s both; }
        .anim-3 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.38s both; }
        .anim-4 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.52s both; }

       .hero-gradient-text {
  background: linear-gradient(
    90deg,
    #14b8a6 0%,
    #0d9488 25%,
    #0f766e 50%,
    #115e59 75%,
    #134e4a 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

       .hero-cta {
  background: linear-gradient(
    90deg,
    #14b8a6 0%,
    #0d9488 35%,
    #0f766e 80%,
    #115e59 100%
  );
  transition: box-shadow 0.2s ease, transform 0.15s ease;
  box-shadow: 0 4px 20px rgba(20,184,166,0.28);
}

.hero-cta:hover {
  box-shadow: 0 8px 32px rgba(20,184,166,0.45);
}

        .hero-bg-glow {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: min(1000px, 140vw);
          height: min(700px, 90vw);
          background: radial-gradient(ellipse at 50% 10%, rgba(224,210,255,0.28) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

       <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #3a93d6 0%, #3a93d6 20%, #6db8f0 40%, #a8d4f5 60%, #dbeeff 80%, #ffffff 96%)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-10px",
            right: "-200px",
            width: "840px",
            height: "740px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0) 75%)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "-60px",
            width: "720px",
            height: "320px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 75%)",
            filter: "blur(35px)",
            pointerEvents: "none",
          }}
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 py-10 sm:py-16 flex flex-col min-h-[580px] sm:min-h-[780px]">
          <div className="self-end max-w-xl text-left mb-auto pt-42 sm:pt-28 lg:pt-44 ">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-900 leading-tight mb-3 sm:mb-4" style={{ letterSpacing: "-0.5px" }}>
              Who We Are
            </h1>
            <p className="text-lg sm:text-xl md:text-lg text-neutral-600 leading-relaxed max-w-xl ml-auto">
Created by women, for women, FitMom Club provides personalized fitness, nutrition, and wellness guidance, with expertise in prenatal and postnatal care.
</p>
          </div>
        </div>
      </section>
    </>
  );
}