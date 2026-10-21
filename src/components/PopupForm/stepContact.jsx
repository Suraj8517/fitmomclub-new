import { COUNTRY_CODES, fieldShell } from "../Helper/Data/popupForm/popupFormData";
import IconChevron from "../Helper/iconChevron";
import StepHeading from "./stepHeading";
import TextField from "./textField";
import {getBodyType,cleanText,cleanEmail,cleanCode,cleanUrl,cleanUtm,FORMULA_START,safeCell,toCm,toKg} from "../Helper/popupFormHelpers/popupFormValidations"

export default function StepContact({ form, setField }) {
  return (
    <div className="relative flex flex-col">
      <StepHeading
        title="A few details about you"
        subtitle="We'll use this to save your results and send your plan. All fields are required."
      />

      <div className="mt-6 flex flex-col gap-3 sm:max-w-md">
        <TextField
          value={form.name}
          onChange={(v) => setField("name")(cleanText(v))}
          placeholder="Full name *"
          maxLength={60}
          autoFocus
        />
        <TextField
          value={form.email}
          onChange={(v) => setField("email")(cleanEmail(v))}
          type="email"
          inputMode="email"
          placeholder="Email address *"
        />

        {/* Phone: country code select (+ custom "Other") + number */}
        <div>
          <div className={`${fieldShell} p-1.5`}>
            <div className="relative w-[42%] shrink-0">
              <select
                value={form.countryCode}
                onChange={(e) => setField("countryCode")(e.target.value)}
                className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-3 pr-7 text-sm font-semibold text-stone-900 outline-none"
                aria-label="Country code"
              >
                <option value="" disabled>
                  Code *
                </option>
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.label})
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
              <IconChevron className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </div>
            <div className="h-6 w-px shrink-0 bg-stone-200" />
            <input
              type="tel"
              inputMode="numeric"
              maxLength={12}
              value={form.phone}
              placeholder="Phone number *"
              onChange={(e) =>
                setField("phone")(e.target.value.replace(/[^0-9]/g, "").slice(0, 12))
              }
              className="w-full min-w-0 bg-transparent px-1 py-2 text-lg font-semibold tracking-tight text-stone-900 outline-none placeholder:font-normal placeholder:text-stone-300"
            />
          </div>

          {form.countryCode === "other" && (
            <div className="mt-3">
              <TextField
                value={form.customCode}
                onChange={(v) => setField("customCode")(cleanCode(v))}
                placeholder="Enter your country code (e.g. +49) *"
                maxLength={5}
              />
            </div>
          )}
        </div>

        <TextField
          value={form.city}
          onChange={(v) => setField("city")(cleanText(v))}
          placeholder="City *"
          maxLength={60}
        />

        {/* Honeypot: hidden from humans, bots tend to fill it */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={form.website || ""}
          onChange={(e) => setField("website")(e.target.value)}
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />
      </div>
    </div>
  );
}