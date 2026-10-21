import { BODY_IMAGES } from "../Helper/Data/popupForm/popupFormData";

export default function StepResult({ bmi, bodyType, gender, status }) {
  const roundedBmi = Math.round(bmi * 10) / 10;
  const markerPct = Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100));
  const bodyImage = BODY_IMAGES[gender]?.[bodyType.id];

  return (
    <div className="flex flex-col sm:mx-auto sm:max-w-lg">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
        {bodyImage && (
          <div className="flex shrink-0 justify-center">
            <img
              src={bodyImage}
              alt={`${bodyType.label} body type`}
              className="h-36 w-auto object-contain drop-shadow-md sm:h-64"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col items-center sm:items-start">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-3xl">
            Your body type
          </h1>
          <p className="mt-1 text-sm text-stone-500">Based on your BMI</p>

          <div className="mt-3 flex flex-col items-center sm:items-start">
            <span className="text-5xl font-extrabold tracking-tight" style={{ color: bodyType.accent }}>
              {roundedBmi}
            </span>
            <span
              className="mt-2 rounded-full px-4 py-1 text-sm font-bold"
              style={{ backgroundColor: `${bodyType.accent}1A`, color: bodyType.accent }}
            >
              {bodyType.label}
            </span>
          </div>

          <p className="mx-auto mt-3 max-w-xs text-sm text-stone-500 sm:mx-0">{bodyType.blurb}</p>
        </div>
      </div>

      <div className="mt-6 w-full rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-500 via-40% to-red-500">
          <div
            className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-white shadow"
            style={{ left: `${markerPct}%`, backgroundColor: bodyType.accent }}
          />
        </div>
        <div className="mt-3 flex justify-between text-[11px] font-medium text-stone-400 sm:text-xs">
          <span>Underweight</span>
          <span>Normal</span>
          <span>Overweight</span>
          <span>Obese</span>
        </div>
      </div>

      {status === "error" && (
        <p className="mt-3 text-center text-xs font-medium text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}