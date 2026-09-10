import img1 from "../../assets/success stories/transformations/1.png";
import img2 from "../../assets/success stories/transformations/2.png";
import img3 from "../../assets/success stories/transformations/3.png";
import img4 from "../../assets/success stories/transformations/4.png";
import img5 from "../../assets/success stories/transformations/5.png";
import img6 from "../../assets/success stories/transformations/6.png";
import img7 from "../../assets/success stories/transformations/7.png";
import img8 from "../../assets/success stories/transformations/8.png";
import img9 from "../../assets/success stories/transformations/9.png";
import img10 from "../../assets/success stories/transformations/10.png";
import img11 from "../../assets/success stories/transformations/11.png";
import img12 from "../../assets/success stories/transformations/12.png";
import img13 from "../../assets/success stories/transformations/13.png";
import img14 from "../../assets/success stories/transformations/14.png";
import img15 from "../../assets/success stories/transformations/15.png";
import img16 from "../../assets/success stories/transformations/16.png";
import img17 from "../../assets/success stories/transformations/17.png";
import { useState, useEffect, useRef } from "react";
const allImages = [
  { name: "client1",   before: 74, after: 58, loss: 0, duration: "3 months", image: img1 },
  { name: "client2",  before: 77, after: 63, loss: 0,  duration: "2 months", image: img2 },
  { name: "client3",   before: 80, after: 65, loss: 15, duration: "4 months", image: img3 },
  { name: "client4",   before: 85, after: 72, loss: 18, duration: "5 months", image: img4 },
  { name: "client5", before: 75, after: 64, loss: 11, duration: "12 months", image: img5 },
  { name: "client6",   before: 92, after: 74, loss: 9,  duration: "2 months", image: img6 },
  { name: "client7",   before: 75, after: 70, loss: 14, duration: "4 months", image: img7 },
  { name: "client8",  before: 72, after: 62, loss: 10, duration: "3 months", image: img8 },
  { name: "client9",   before: 64, after: 54, loss: 10,  duration: "2 months", image: img9 },
  { name: "client10",   before: 93, after: 61, loss: 20, duration: "6 months", image: img10 },
  { name: "client11",    before: 94, after: 87, loss: 8,  duration: "2 months", image: img11 },
  { name: "client12",   before: 66, after: 56, loss: 13, duration: "3 months", image: img12 },
  { name: "client13",    before: 62, after: 53, loss: 16, duration: "5 months", image: img13 },
  { name: "client14",    before: 82, after: 75, loss: 6,  duration: "6 weeks",  image: img14 },
  { name: "client15",    before: 96, after: 78, loss: 17, duration: "5 months", image: img15 },
  { name: "client16",    before: 72, after: 62, loss: 17, duration: "5 months", image: img16 },
  { name: "client17",    before: 83, after: 73, loss: 17, duration: "5 months", image: img17 },

];

const CARDS = 6;
const INTERVAL = 2500;

export default function TransformationSection() {
  const [slots, setSlots] = useState(() =>
    Array.from({ length: CARDS }, (_, i) => i)
  );
  const [fadingCard, setFadingCard] = useState(null);
  const nextIndexRef = useRef(CARDS);

  useEffect(() => {
    const interval = setInterval(() => {
      const cardToSwap = Math.floor(Math.random() * CARDS);
      const incoming = nextIndexRef.current % allImages.length;

      setFadingCard(cardToSwap);

      setTimeout(() => {
        setSlots((prev) => {
          const updated = [...prev];
          updated[cardToSwap] = incoming;
          return updated;
        });
        nextIndexRef.current = (nextIndexRef.current + 1) % allImages.length;
        setFadingCard(null);
      }, 400);
    }, INTERVAL);

    return () => clearInterval(interval);
  }, []); // runs once, never restarts

  // --- scroll-triggered reveal (runs once, independent of the image-swap interval) ---
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#ebeaea]">
    <div
      className="px-5 md:py-10 py-8 sm:px-10 md:px-16 lg:px-20 xl:px-24 2xl:px-32"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div
        className={`text-center my-2 max-w-2xl mx-auto transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-2">
          Real results, real moms
        </p>
        <h2 className="text-2xl md:text-4xl font-medium leading-snug text-neutral-900">
          Their transformation,{" "}
          <span className="text-[#00d1b8]">your inspiration</span>
        </h2>
      </div>

      {/* Grid */}
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {slots.map((imgIndex, cardIndex) => {
          const item = allImages[imgIndex];
          const isFading = fadingCard === cardIndex;
          return (
            <div
              key={cardIndex}
              className={`relative rounded-2xl overflow-hidden group aspect-[4/3] transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.96]"
              }`}
              style={{ transitionDelay: isVisible ? `${cardIndex * 100}ms` : "0ms" }}
            >
              <img
                src={item.image}
                alt={`${item.name} transformation`}
                className="w-full h-full object-cover object-top transition-transform duration-500"
                style={{
                  opacity: isFading ? 0 : 1,
                  transition: "opacity 0.4s ease, transform 0.5s ease",
                }}
              />

              {/* Bottom gradient overlay */}
              <div
                className="absolute bottom-0 inset-x-0 pt-10 pb-3 px-3"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
                  opacity: isFading ? 0 : 1,
                  transition: "opacity 0.4s ease",
                }}
              >
                <div className="flex items-end justify-between">
                  <div className="text-left">
                    <p className="text-white/60 text-[9px] uppercase tracking-wider leading-none mb-0.5">Before</p>
                    <p className={`text-white text-sm font-semibold leading-none ${item.before === 0 ? "hidden" : "visible" }`}>{item.before} kg</p>
                  </div>

                  <div className="text-center">
                    <p className={`text-[#00d1b8] text-base md:text-lg font-bold leading-none ${item.before === 0 ? "hidden" : "visible" }`}>−{item.before - item.after} kg</p>
                  </div>

                  <div className="text-right">
                    <p className="text-white/60 text-[9px] uppercase tracking-wider leading-none mb-0.5">After</p>
                    <p className={`text-white text-sm font-semibold leading-none ${item.before === 0 ? "hidden" : "visible" }`}>{item.after} kg</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
    
    </section>
  );
}