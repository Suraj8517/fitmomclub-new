import { fieldShell } from "../Helper/Data/popupForm/popupFormData";
import UnitToggle from "./unitToggle";


export default function NumberField({
  value,
  onChange,
  unit,
  units,
  onUnitChange,
  placeholder,
  autoFocus,
  max = 999,
}) {
  function bump(delta) {
    const current = Number(value || placeholder || 0);
    const next = Math.min(max, Math.max(1, current + delta));
    onChange(String(next));
  }

  return (
    <div className={`${fieldShell} gap-1 p-1.5`}>
      <button
        type="button"
        onClick={() => bump(-1)}
        aria-label="Decrease"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-50 text-stone-500 transition hover:bg-teal-50 hover:text-teal-700 active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 px-1">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={3}
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
            // clamp to max so values like 999 can't exceed the field's limit
            onChange(digits && Number(digits) > max ? String(max) : digits);
          }}
          className="w-full min-w-0 bg-transparent text-center text-3xl font-extrabold tracking-tight text-stone-900 outline-none placeholder:text-stone-300"
        />
        {units ? (
          <UnitToggle options={units} value={unit} onChange={onUnitChange} />
        ) : (
          <span className="shrink-0 text-sm font-medium text-stone-400">{unit}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => bump(1)}
        aria-label="Increase"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-50 text-stone-500 transition hover:bg-teal-50 hover:text-teal-700 active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}