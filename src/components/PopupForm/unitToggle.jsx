export default function UnitToggle({ options, value, onChange }) {
  return (
    <div className="flex shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-white text-xs font-semibold">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          onClick={() => onChange(opt)}
          className={[
            "px-2.5 py-1.5 transition-colors",
            value === opt ? "bg-teal-600 text-white" : "text-stone-500 hover:bg-teal-50",
          ].join(" ")}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}