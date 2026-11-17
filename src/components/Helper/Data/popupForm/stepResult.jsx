import React, { useState, useEffect } from "react";
import { BODY_TYPES, BMI_DISCLAIMER } from "./Data/popupForm/popupFormData";
import { getBodyImage } from "./popupFormHelpers/popupFormValidations";

/* Adjust the two import paths above to match where this file lives.
   If your existing StepResult has extra layout/classes, merge them in. */
export default function StepResult({ bmi, bodyType, gender }) {
  const src = getBodyImage(gender, bodyType.stage);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
console.log("StepResult render", { gender, stage: bodyType.stage, src });
  return (
    <div className="text-center">
      <div className="mx-auto flex h-56 items-center justify-center sm:h-72">
        {src && !failed ? (
          <img
            src={src}
            alt={`${gender} body illustration, stage ${bodyType.stage}: ${bodyType.label}`}
            className="max-h-full w-auto object-contain"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 px-6 py-10 text-sm text-stone-400">
            Illustration coming soon
          </div>
        )}
      </div>

      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-stone-400">Stage</p>
      <p className="text-5xl font-extrabold" style={{ color: bodyType.accent }}>
        {bodyType.stage}
        <span className="text-2xl text-stone-300">/10</span>
      </p>
      <h3 className="mt-1 text-xl font-bold text-stone-800">{bodyType.label}</h3>
      <p className="text-sm text-stone-500">
        Your BMI: <strong>{bmi.toFixed(1)}</strong>
      </p>

      <div className="mt-4 flex gap-1" role="list" aria-label="Body stages">
        {BODY_TYPES.map((t) => {
          const active = t.stage === bodyType.stage;
          return (
            <div
              key={t.stage}
              role="listitem"
              title={`${t.stage}. ${t.label}`}
              aria-current={active ? "true" : undefined}
              className={`flex-1 rounded-full py-1 text-[10px] font-bold transition sm:text-xs ${
                active ? "scale-110 text-white shadow" : "bg-stone-200 text-stone-400"
              }`}
              style={active ? { background: t.accent } : undefined}
            >
              {t.stage}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-stone-600">{bodyType.blurb}</p>
      <p className="mt-3 text-[11px] leading-snug text-stone-400">{BMI_DISCLAIMER}</p>
    </div>
  );
}