import { fieldShell } from "../Helper/Data/popupForm/popupFormData";

export default function TextField({ value, onChange, type = "text", placeholder, autoFocus, inputMode, maxLength = 254 }) {
  return (
    <label className="block">
      <div className={`${fieldShell} px-5 py-3.5`}>
        <input
          type={type}
          inputMode={inputMode}
          autoFocus={autoFocus}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-lg font-semibold tracking-tight text-stone-900 outline-none placeholder:font-normal placeholder:text-stone-300"
        />
      </div>
    </label>
  );
}