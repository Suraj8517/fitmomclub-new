import StepHeading from "./stepHeading";
import { GENDER_OPTIONS } from "../Helper/Data/popupForm/popupFormData";
import IconCheck from "../Helper/iconCheck"


export default function StepGender({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <StepHeading
        title="Choose your gender"
        subtitle="This helps us personalize your body-type results."
      />

      <div className="mt-6 grid grid-cols-2 gap-4 pt-6 sm:gap-6">
        {GENDER_OPTIONS.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className="group relative h-36 w-full text-left transition active:scale-[0.99] sm:h-40"
            >
              <div
                className={`absolute inset-0 rounded-2xl border shadow-sm transition ${
                  selected
                    ? "border-teal-500 bg-teal-50 ring-2 ring-teal-100"
                    : "border-stone-200 bg-white group-hover:border-stone-300"
                }`}
              />
              <div className="relative z-10 flex h-full w-1/2 flex-col justify-end p-4">
                <span className={`text-base font-bold ${selected ? "text-teal-900" : "text-stone-900"}`}>
                  {opt.label}
                </span>
              </div>
              <img
                src={opt.img}
                alt={opt.label}
                className="pointer-events-none absolute -top-6 bottom-0 right-3 z-20 h-[calc(100%+1.5rem)] w-auto max-w-[55%] object-contain object-bottom drop-shadow-md"
              />
              {selected && (
                <span className="absolute left-4 top-4 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 shadow-md shadow-teal-600/30">
                  <IconCheck className="h-4 w-4 text-white" strokeWidth="3" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}