import { useState } from "react";
import IconChevron from "../Helper/iconChevron";
import IconCheck from "../Helper/iconCheck";



export default function SelectField({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-5 py-3.5 text-left text-lg shadow-sm transition ${
          open ? "border-teal-500 ring-2 ring-teal-100" : "border-stone-200 hover:border-stone-300"
        }`}
      >
        <span className={value ? "font-semibold tracking-tight text-stone-900" : "text-stone-300"}>
          {value || placeholder}
        </span>
        <IconChevron
          className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="overflow-hidden rounded-2xl border border-stone-200 bg-white py-1 shadow-sm"
        >
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <li key={opt} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-5 py-3 text-left text-base transition hover:bg-stone-50 ${
                    selected ? "bg-teal-50 font-semibold text-teal-700" : "text-stone-700"
                  }`}
                >
                  {opt}
                  {selected && <IconCheck className="h-4 w-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
