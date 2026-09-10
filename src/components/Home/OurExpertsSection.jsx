import { Link } from "react-router-dom";
export default function OurExpertSection() {
  return (
    <section className="bg-[#F6F5F1] px-6 py-16 md:px-16 md:py-24 lg:px-20 lg:py-28 min-h-[40vh] items-center">
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-16">

        {/* Left — heading */}
        <h2 className="text-[1.6rem] md:text-4xl lg:text-[3.2rem] font-normal text-[#2C2C2C] leading-snug tracking-tight md:max-w-sm lg:max-w-lg flex-1">
Guidance You Can Trust, Expertise You Can Rely On
        </h2>

        {/* Right — body + link */}
        <div className="flex-1 max-w-xl">
          <p className="text-sm md:text-base lg:text-[24px] text-[#3C3C3C] leading-relaxed mb-7">
Our certified fitness and health experts provide personalized support for women’s wellness, including prenatal and postnatal care.
          </p>

          <Link
            to="book-consultation"
            className="inline-flex items-center gap-1.5 text-sm md:text-base font-medium text-[#2C2C2C]  pb-0.5 hover:opacity-60 transition-opacity duration-200 no-underline"
          >
            Book A Consultation
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}