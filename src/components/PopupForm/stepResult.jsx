import React, { useState, useEffect } from "react";
import { BODY_TYPES, BMI_DISCLAIMER } from "../Helper/Data/popupForm/popupFormData";
import { getBodyImage } from "../Helper/popupFormHelpers/popupFormValidations";

/* Adjust the two import paths above to match where this file lives.
   Layout is deliberately compact so the whole result fits inside the popup
   without any scrolling: illustration and score sit side by side, the stage
   strip runs underneath, then the blurb and disclaimer. */
export default function StepResult({ bmi, bodyType, gender }) {
  const src = getBodyImage(gender, bodyType.stage);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Score on the left, larger illustration on the right */}
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 sm:gap-6">
        <div className="min-w-0 text-left">
          <p className="text-xs font-semibold text-stone-400">Your stage</p>
          <p
            className="text-5xl font-extrabold leading-none sm:text-6xl"
            style={{ color: bodyType.accent }}
          >
            {bodyType.stage}
            <span className="text-xl text-stone-300 sm:text-3xl">/6</span>
          </p>
          <h3 className="mt-2 break-words text-lg font-bold leading-tight text-stone-800 sm:text-2xl">
            {bodyType.label}
          </h3>
          <p className="mt-1 text-sm text-stone-500 sm:text-base">
            BMI <strong className="text-stone-700">{bmi.toFixed(1)}</strong>
          </p>
        </div>

        {/* Height also capped by viewport so short phones never scroll */}
        <div className="flex h-[min(14rem,30vh)] w-36 items-center justify-center sm:h-72 sm:w-52">
          {src && !failed ? (
            <img
              src={src}
              alt={`${gender} body illustration, stage ${bodyType.stage}: ${bodyType.label}`}
              className="h-full w-full object-contain"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-stone-300 px-2 py-6 text-center text-xs text-stone-400">
              Illustration coming soon
            </div>
          )}
        </div>
      </div>

      {/* Stage strip */}
      <div className="flex gap-1" role="list" aria-label="Body stages">
        {BODY_TYPES.map((t) => {
          const active = t.stage === bodyType.stage;
          return (
            <div
              key={t.stage}
              role="listitem"
              title={`${t.stage}. ${t.label}`}
              aria-current={active ? "true" : undefined}
              className={`flex-1 rounded-full py-0.5 text-center text-[10px] font-bold transition sm:text-xs ${
                active ? "scale-110 text-white shadow" : "bg-stone-200 text-stone-400"
              }`}
              style={active ? { background: t.accent } : undefined}
            >
              {t.stage}
            </div>
          );
        })}
      </div>

      {/* Blurb + disclaimer */}
      <p className="text-sm leading-snug text-stone-600">{bodyType.blurb}</p>
      <p className="text-[10px] leading-tight text-stone-400">{BMI_DISCLAIMER}</p>
    </div>
  );
}