import { useState } from "react";
import { Plus } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    question: "Who is this program not suitable for?",
    answer: [
      "Quick-fix seekers: If you're looking for instant results or magical pills, this program isn't for you. Sustainable health requires a commitment to lifestyle changes.",
      "People expecting to buy health: Just paying for a program won't work unless you're willing to follow the advice and put in the effort.",
      "Crash dieters: We focus on healthy, sustainable weight loss, not drastic or unhealthy diets.",
      "Those expecting overnight results: Our program promotes steady progress, with no promises of extreme weight loss in a short time.",
    ],
  },
  {
    question: "How much weight can I lose in a month?",
    answer:
      "On average, healthy weight loss ranges from 2 to 4 kg per month. This ensures you lose weight sustainably and safely, without negatively impacting your health.",
  },
  {
    question: "Can I try the program for a week?",
    answer:
      "We don't offer trial diets, but you can explore our success stories and transformation journeys on the FitMom Club Instagram page. Our team of experienced health professionals is committed to guiding you through a personalised program for the best results.",
  },
  {
    question: "How soon will I see results?",
    answer:
      "Results vary depending on your age, body type, genetics, and adherence to the program. Based on the experiences of over 1600+ clients, most individuals start noticing improvements in the first few weeks, but consistency is key to achieving lasting results.",
  },
  {
    question: "Are meal plans available for vegetarians and non-vegetarians?",
    answer:
      "Yes, we provide tailored meal plans that align with your dietary preferences, whether you're vegetarian, non-vegetarian, or vegan. Our goal is to ensure the plan is sustainable for you.",
  },
  {
    question: "What type of exercises are included in the program?",
    answer:
      "Depending on your goals, our fitness experts will recommend a combination of the following exercises:",
    programs: [
      "Yoga",
      "BollyFit (Dance Fitness)",
      "Zumba",
      "HIIT",
      "Low-Impact Mobility",
      "Fusion Fitness",
      "Functional Fitness",
    ],
  },
  {
    question: "Will the program accommodate my medical conditions like PCOS or thyroid issues?",
    answer:
      "Absolutely! Our program is designed to cater to various health conditions, including PCOD, thyroid, and others. The plan will be customised to ensure it aligns with your medical needs while helping you achieve your wellness goals.",
  },
 {
    question: "What kind of support will I receive during the program?",
    answer:
      "You will receive continuous support from certified experts, personalised progress tracking, and the motivation of a community of like-minded individuals.",
  },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-200 py-5 first:pt-0 last:border-b-0 ">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 text-left"
      >
        <span className="text-base font-medium text-slate-900 sm:text-lg">
          {faq.question}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-900 transition-transform duration-300 ${
            isOpen ? "rotate-45 border-teal-300 bg-teal-50" : ""
          }`}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </span>
      </button>

      <div
        className="grid overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0,
          marginTop: isOpen ? "0.75rem" : "0",
        }}
      >
        <div className="overflow-hidden">
          {Array.isArray(faq.answer) ? (
            <ul className="max-w-2xl list-disc space-y-2 pl-5 leading-relaxed text-slate-500 marker:text-teal-600">
              {faq.answer.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          ) : (
            <p className="max-w-2xl leading-relaxed text-slate-500">
              {faq.answer}
            </p>
          )}

          {faq.programs && (
            <div className="mt-3 flex flex-wrap gap-2">
              {faq.programs.map((program, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm text-teal-800"
                >
                  {program}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full pt-28 px-4 sm:px-8 bg-[#f6f4f0]" id="faq">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h2
            className="mt-4 text-3xl text-slate-900 sm:text-4xl"
            style={{
              fontFamily: "'Fraunces', serif",
              fontOpticalSizing: "auto",
              fontWeight: 600,
            }}
          >
            What people ask before joining
          </h2>
        </div>

        <div className="mt-12">
          {FAQS.map((faq, i) => (
            <FaqItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}