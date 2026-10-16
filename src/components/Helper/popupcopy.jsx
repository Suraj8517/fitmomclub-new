
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

const COUNTRY_CODES = [
  { code: "+91", label: "India" },
  { code: "+1", label: "United States" },
  { code: "+44", label: "United Kingdom" },
  { code: "+61", label: "Australia" },
  { code: "+971", label: "United Arab Emirates" },
  { code: "+65", label: "Singapore" },
  { code: "+49", label: "Germany" },
  { code: "+33", label: "France" },
  { code: "+39", label: "Italy" },
  { code: "+81", label: "Japan" },
  { code: "+60", label: "Malaysia" },
  { code: "+66", label: "Thailand" },
  { code: "+62", label: "Indonesia" },
  { code: "+94", label: "Sri Lanka" },
  { code: "+92", label: "Pakistan" },
  { code: "+880", label: "Bangladesh" },
  { code: "+27", label: "South Africa" },
  { code: "+254", label: "Kenya" },
  { code: "+34", label: "Spain" },
  { code: "+46", label: "Sweden" },
  { code: "+31", label: "Netherlands" },
  { code: "+41", label: "Switzerland" },
  { code: "+52", label: "Mexico" },
  { code: "+55", label: "Brazil" },
  { code: "+63", label: "Philippines" },
  { code: "+84", label: "Vietnam" },
  { code: "+90", label: "Turkey" },
  { code: "+20", label: "Egypt" },
  { code: "+974", label: "Qatar" },
  { code: "+968", label: "Oman" },
  { code: "+973", label: "Bahrain" },
];

const GOALS = [
  "Weight Management",
  "Health Issue Management",
  "Natural Conception/Fertility",
  "Currently Pregnant",
];

const EMPTY_FORM = {
  name: "",
  email: "",
  countryCode: "",
  customCode: "",
  phone: "",
  gender: "",
  age: "",
  height: "",
  heightUnit: "cm",
  weight: "",
  weightUnit: "kg",
  city: "",
  goal: "",
};

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconChevron(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function PopupForm({
  scriptURL = "",
  title = "Get a plan built around you",
  subtitle = "Share a few details and our health consultant will reach out personally.",
  enablePageLoadTrigger = true,
  pageLoadDelay = 10000,
  buttonTriggerSelector = "[data-cpf-trigger]",
  buttonDelay = 3000,
  enableRouteChangeTrigger = true,
  routeChangeDelay = 10000,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const dialogRef = useRef(null);
  const pendingTimers = useRef([]);
  const isFirstRoute = useRef(true);
  const location = useLocation();
  const routeKey = location.pathname + location.search;

  // ---- Capture UTM params + landing page URL once, on first mount ----
  const trackingRef = useRef(null);
  if (trackingRef.current === null) {
    const params = new URLSearchParams(window.location.search);
    trackingRef.current = {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_term: params.get("utm_term") || "",
      utm_content: params.get("utm_content") || "",
      page_url: window.location.href,
    };
  }

  const openPopup = useCallback(() => setIsOpen(true), []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    // reset after the close animation finishes
    window.setTimeout(() => {
      setForm(EMPTY_FORM);
      setStatus("idle");
      setTouched(false);
    }, 250);
  }, []);

  // ---- Triggers: page load (once) + any element with data-cpf-trigger ----
  useEffect(() => {
    if (enablePageLoadTrigger) {
      const t = window.setTimeout(openPopup, pageLoadDelay);
      pendingTimers.current.push(t);
    }

    const handleClick = (e) => {
      const trigger = e.target.closest(buttonTriggerSelector);
      if (!trigger) return;
      const t = window.setTimeout(openPopup, buttonDelay);
      pendingTimers.current.push(t);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      pendingTimers.current.forEach(window.clearTimeout);
      pendingTimers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Trigger: react-router-dom navigation change ----
  // Skips the very first render (that's already covered by the page-load
  // trigger above) and fires again every time the route changes after that.
  useEffect(() => {
    if (!enableRouteChangeTrigger) return;

    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }

    const t = window.setTimeout(openPopup, routeChangeDelay);
    pendingTimers.current.push(t);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  // ---- Escape to close + body scroll lock ----
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && closePopup();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closePopup]);

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const isValid = () => {
    const codeOk =
      form.countryCode === "other" ? form.customCode.trim().length > 0 : !!form.countryCode;
    const ageNum = Number(form.age);
    const heightNum = Number(form.height);
    const weightNum = Number(form.weight);
    return (
      form.name.trim().length > 0 &&
      /^\S+@\S+\.\S+$/.test(form.email) &&
      codeOk &&
      /^[0-9]{7,12}$/.test(form.phone) &&
      !!form.gender &&
      ageNum > 0 && ageNum <= 120 &&
      heightNum > 0 &&
      weightNum > 0 &&
      !!form.goal
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid()) return;

    setStatus("submitting");
    const code = form.countryCode === "other" ? form.customCode : form.countryCode;

    try {
      if (scriptURL) {
        const body = new FormData();
        body.append("name", form.name);
        body.append("email", form.email);
        body.append("phone", `${code}${form.phone}`);
        body.append("gender", form.gender);
        body.append("age", form.age);
        body.append("height", `${form.height}${form.heightUnit}`);
        body.append("weight", `${form.weight}${form.weightUnit}`);
        body.append("city", form.city);
        body.append("goal", form.goal);
        body.append("date", new Date().toISOString());
        body.append("utm_source", trackingRef.current.utm_source);
        body.append("utm_medium", trackingRef.current.utm_medium);
        body.append("utm_campaign", trackingRef.current.utm_campaign);
        body.append("utm_term", trackingRef.current.utm_term);
        body.append("utm_content", trackingRef.current.utm_content);
        body.append("page_url", trackingRef.current.page_url);


        await fetch(scriptURL, { method: "POST", mode: "no-cors", body });
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cpf-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#0B3B36]/90 backdrop-blur-md animate-cpf-fade"
        onClick={closePopup}
      />

      {/* Card */}
      <div
        ref={dialogRef}
        className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-[#FEFDFB] shadow-[0_30px_60px_-15px_rgba(11,59,54,0.35)] animate-cpf-scale"
      >
        {/* top accent bar */}
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-[#0E7C74] via-[#3FA79A] to-[#E8A33D]" />

        <button
          onClick={closePopup}
          aria-label="Close popup"
          className="absolute right-2.5 top-3 rounded-full p-1.5 text-[#5B6B68] hover:bg-[#F1F8F6] hover:text-[#0B3B36] transition-colors"
        >
          <IconX className="h-4 w-4" />
        </button>

        <div className="overflow-y-auto px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-3.5">
          {status === "success" ? (
            <div className="flex flex-col items-center py-3 text-center">
              <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#0E7C74]/10 text-[#0E7C74]">
                <IconCheck className="h-5 w-5" />
              </div>
              <h3 className="font-[var(--cpf-display)] text-base text-[#0B3B36]">
                Thank you — you're all set
              </h3>
              <p className="mt-1 text-[12.5px] leading-snug text-[#5B6B68]">
                Our health consultant will reach out to you shortly. Please keep an
                eye on your phone and inbox.
              </p>
              <button
                onClick={closePopup}
                className="mt-4 rounded-full bg-[#0B3B36] px-6 py-1.5 text-sm font-medium text-white hover:bg-[#0E7C74] transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-start gap-3 pr-5">
                <div>
                  <h2
                    id="cpf-title"
                    className="font-[var(--cpf-display)] text-base leading-snug text-[#0B3B36] sm:text-lg"
                  >
                    {title}
                  </h2>
                  <p className="mt-0.5 text-[12px] leading-snug text-[#5B6B68]">
                    {subtitle}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-1.5">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Field label="Full name" required>
                    <input
                      type="text"
                      value={form.name}
                      onChange={setField("name")}
                      placeholder="Enter your full name"
                      className={inputClass(touched && !form.name.trim())}
                    />
                  </Field>

                  <Field label="Age" required>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={form.age}
                      onChange={setField("age")}
                      placeholder="Age"
                      className={inputClass(touched && !(Number(form.age) > 0 && Number(form.age) <= 120)) + " w-20"}
                    />
                  </Field>
                </div>
<div className="grid grid-cols-[2fr_1fr] gap-2">
   <Field label="Email" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={setField("email")}
                    placeholder="Enter your email"
                    className={inputClass(touched && !/^\S+@\S+\.\S+$/.test(form.email))}
                  />
                </Field>
                  <Field label="City" required>
                  <input
                    type="text"
                    value={form.city}
                    onChange={setField("city")}
                    placeholder="Enter your city"
                    className={inputClass(false)}
                  />
                </Field>
</div>

                <Field label="Phone number" required>
                  <div className="flex gap-2">
                    <div className="relative w-[42%] shrink-0">
                      <select
                        value={form.countryCode}
                        onChange={setField("countryCode")}
                        className={selectClass(touched && !form.countryCode)}
                      >
                        <option value="" disabled>
                          Code
                        </option>
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} ({c.label})
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                      <IconChevron className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B68]" />
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      minLength={7}
                      maxLength={12}
                      value={form.phone}
                      onChange={setField("phone")}
                      placeholder="Phone number"
                      className={inputClass(touched && !/^[0-9]{7,12}$/.test(form.phone))}
                    />
                  </div>
                  {form.countryCode === "other" && (
                    <input
                      type="text"
                      maxLength={5}
                      value={form.customCode}
                      onChange={setField("customCode")}
                      placeholder="Enter your country code"
                      className={inputClass(touched && !form.customCode.trim()) + " mt-1.5"}
                    />
                  )}
                </Field>

                <Field label="Gender" required>
                  <div className="flex gap-5 pt-0.5">
                    {["Male", "Female"].map((g) => (
                      <label
                        key={g}
                        className="flex cursor-pointer items-center gap-2 text-sm text-[#33413E]"
                      >
                        <input
                          type="radio"
                          name="cpf-gender"
                          value={g}
                          checked={form.gender === g}
                          onChange={setField("gender")}
                          className="h-4 w-4 accent-[#0E7C74]"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-2">
                  <Field label="Height" required>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={1}
                        value={form.height}
                        onChange={setField("height")}
                        placeholder={form.heightUnit === "cm" ? "cm" : "in"}
                        className={inputClass(touched && !(Number(form.height) > 0)) + " min-w-0"}
                      />
                      <UnitToggle
                        options={["cm", "in"]}
                        value={form.heightUnit}
                        onChange={(v) => setForm((f) => ({ ...f, heightUnit: v }))}
                      />
                    </div>
                  </Field>

                  <Field label="Weight" required>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={1}
                        value={form.weight}
                        onChange={setField("weight")}
                        placeholder={form.weightUnit === "kg" ? "kg" : "lb"}
                        className={inputClass(touched && !(Number(form.weight) > 0)) + " min-w-0"}
                      />
                      <UnitToggle
                        options={["kg", "lb"]}
                        value={form.weightUnit}
                        onChange={(v) => setForm((f) => ({ ...f, weightUnit: v }))}
                      />
                    </div>
                  </Field>
                </div>

                <Field label="What is your primary goal?" required>
                  <div className="relative">
                    <select
                      value={form.goal}
                      onChange={setField("goal")}
                      className={selectClass(touched && !form.goal)}
                    >
                      <option value="" disabled>
                        Select primary goal
                      </option>
                      {GOALS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <IconChevron className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B68]" />
                  </div>
                </Field>

                {touched && !isValid() && (
                  <p className="text-xs font-medium text-[#C4453B]">
                    Please fill all required fields correctly.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-xs font-medium text-[#C4453B]">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-0.5 flex w-full items-center justify-center gap-2 rounded-full bg-[#0B3B36] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0E7C74] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "submitting" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Submitting…
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        :root { --cpf-display: 'Fraunces', ui-serif, Georgia, serif; }
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        @keyframes cpf-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes cpf-scale { from { opacity: 0; transform: translateY(8px) scale(.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes cpf-pulse { 0% { transform: scale(1); opacity: .55 } 70% { transform: scale(1.8); opacity: 0 } 100% { opacity: 0 } }

        .animate-cpf-fade { animation: cpf-fade .25s ease-out both; }
        .animate-cpf-scale { animation: cpf-scale .28s cubic-bezier(.16,1,.3,1) both; }
        .animate-cpf-pulse { animation: cpf-pulse 2.2s ease-out infinite; }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[12px] font-medium text-[#33413E]">
        {label} {required && <span className="text-[#C4453B]">*</span>}
      </span>
      {children}
    </label>
  );
}

function UnitToggle({ options, value, onChange }) {
  return (
    <div className="flex shrink-0 overflow-hidden rounded-lg border border-[#DCE6E3] bg-white text-[11px] font-medium">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          onClick={() => onChange(opt)}
          className={[
            "px-1.5 py-1.5 transition-colors",
            value === opt
              ? "bg-[#0E7C74] text-white"
              : "text-[#5B6B68] hover:bg-[#F1F8F6]",
          ].join(" ")}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function inputClass(invalid) {
  return [
    "w-full rounded-lg border bg-white px-3 py-1.5 text-sm text-[#1A2624] placeholder:text-[#9AA8A5]",
    "outline-none transition-colors focus:border-[#0E7C74] focus:ring-2 focus:ring-[#0E7C74]/20",
    invalid ? "border-[#E29892]" : "border-[#DCE6E3]",
  ].join(" ");
}

function selectClass(invalid) {
  return [
    "w-full appearance-none rounded-lg border bg-white px-3 py-1.5 text-sm text-[#1A2624]",
    "outline-none transition-colors focus:border-[#0E7C74] focus:ring-2 focus:ring-[#0E7C74]/20",
    invalid ? "border-[#E29892]" : "border-[#DCE6E3]",
  ].join(" ");
}