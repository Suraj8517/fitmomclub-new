import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import male from '../assets/form/male.png'
import female from '../assets/form/female.png'

// Body-type result images — rename your files to match this pattern, or just
// change these import paths to point at your existing files.
import maleUnderweight from '../assets/form/male/male-underweight.png'
import maleNormal from '../assets/form/male/male-normal.png'
import maleOverweight from '../assets/form/male/male-overweight.png'
import maleObese from '../assets/form/male/male-obese.png'
import maleExtremeObese from '../assets/form/male/male-extreme-obese.png'
import femaleUnderweight from '../assets/form/female/female-underweight.png'
import femaleNormal from '../assets/form/female/female-normal.png'
import femaleOverweight from '../assets/form/female/female-overweight.png'
import femaleObese from '../assets/form/female/female-obese.png'
import femaleExtremeObese from '../assets/form/female/female-extreme-obese.png'

/**
 * BodyAssessmentForm (popup)
 * --------------------------
 * Multi-step onboarding flow shown in a modal:
 *   Age -> Gender -> Contact (name, email, phone, city) -> Primary goal
 *   -> Weight -> Height -> Result (BMI + body type)
 *
 * Every field is required.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <button onClick={() => setOpen(true)}>Free assessment</button>
 *   <BodyAssessmentForm
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     onSubmit={(payload) => { console.log(payload); setOpen(false); }}
 *   />
 */

// ---------------------------------------------------------------------------
// Config / data
// ---------------------------------------------------------------------------

const STEPS = ["age", "gender", "contact", "goal", "weight", "height", "result"];

const INITIAL_DATA = {
  age: "",
  gender: "",
  name: "",
  email: "",
  phoneCountry: "US",
  phone: "",
  city: "",
  goal: "",
  weightKg: "",
  heightCm: "",
};

const GENDER_IMAGES = { male, female };

const GENDER_OPTIONS = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
];

const GOAL_OPTIONS = [
  "Weight Management",
  "Health Issue Management",
  "Natural Conception/Fertility",
  "Currently Pregnant",
];

// Body-type result image per gender per BMI category
const BODY_IMAGES = {
  male: {
    underweight: maleUnderweight,
    normal: maleNormal,
    overweight: maleOverweight,
    obese: maleObese,
    extremeObese: maleExtremeObese,
  },
  female: {
    underweight: femaleUnderweight,
    normal: femaleNormal,
    overweight: femaleOverweight,
    obese: femaleObese,
    extremeObese: femaleExtremeObese,
  },
};

// Standard BMI breakpoints -> body type used to pick the result image and copy
const BODY_TYPES = [
  {
    id: "underweight",
    label: "Underweight",
    max: 18.5,
    accent: "#0891B2",
    blurb: "You're on the lighter end. A structured plan can help you build muscle and strength.",
  },
  {
    id: "normal",
    label: "Normal",
    max: 25,
    accent: "#0D9488",
    blurb: "You're in a healthy range. The right plan will help you build definition and maintain it.",
  },
  {
    id: "overweight",
    label: "Overweight",
    max: 30,
    accent: "#D97706",
    blurb: "You're carrying some extra weight. A tailored plan can help you lean out and feel stronger.",
  },
  {
    id: "obese",
    label: "Obese",
    max: 40,
    accent: "#EA580C",
    blurb: "A tailored plan can help you bring your weight down steadily and safely.",
  },
  {
    id: "extremeObese",
    label: "Extreme Obese",
    max: Infinity,
    accent: "#DC2626",
    blurb: "A consistent, guided plan can help you make real progress — one step at a time.",
  },
];

function getBodyType(bmi) {
  return BODY_TYPES.find((b) => bmi < b.max) ?? BODY_TYPES[BODY_TYPES.length - 1];
}

// ---------------------------------------------------------------------------
// Country dial codes (ISO 3166-1 alpha-2 -> name + calling code)
// ---------------------------------------------------------------------------

const COUNTRY_CODES = [
  { iso: "AF", name: "Afghanistan", dial: "+93" },
  { iso: "AL", name: "Albania", dial: "+355" },
  { iso: "DZ", name: "Algeria", dial: "+213" },
  { iso: "AS", name: "American Samoa", dial: "+1684" },
  { iso: "AD", name: "Andorra", dial: "+376" },
  { iso: "AO", name: "Angola", dial: "+244" },
  { iso: "AI", name: "Anguilla", dial: "+1264" },
  { iso: "AG", name: "Antigua and Barbuda", dial: "+1268" },
  { iso: "AR", name: "Argentina", dial: "+54" },
  { iso: "AM", name: "Armenia", dial: "+374" },
  { iso: "AW", name: "Aruba", dial: "+297" },
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "AT", name: "Austria", dial: "+43" },
  { iso: "AZ", name: "Azerbaijan", dial: "+994" },
  { iso: "BS", name: "Bahamas", dial: "+1242" },
  { iso: "BH", name: "Bahrain", dial: "+973" },
  { iso: "BD", name: "Bangladesh", dial: "+880" },
  { iso: "BB", name: "Barbados", dial: "+1246" },
  { iso: "BY", name: "Belarus", dial: "+375" },
  { iso: "BE", name: "Belgium", dial: "+32" },
  { iso: "BZ", name: "Belize", dial: "+501" },
  { iso: "BJ", name: "Benin", dial: "+229" },
  { iso: "BM", name: "Bermuda", dial: "+1441" },
  { iso: "BT", name: "Bhutan", dial: "+975" },
  { iso: "BO", name: "Bolivia", dial: "+591" },
  { iso: "BA", name: "Bosnia and Herzegovina", dial: "+387" },
  { iso: "BW", name: "Botswana", dial: "+267" },
  { iso: "BR", name: "Brazil", dial: "+55" },
  { iso: "IO", name: "British Indian Ocean Territory", dial: "+246" },
  { iso: "BN", name: "Brunei", dial: "+673" },
  { iso: "BG", name: "Bulgaria", dial: "+359" },
  { iso: "BF", name: "Burkina Faso", dial: "+226" },
  { iso: "BI", name: "Burundi", dial: "+257" },
  { iso: "KH", name: "Cambodia", dial: "+855" },
  { iso: "CM", name: "Cameroon", dial: "+237" },
  { iso: "CA", name: "Canada", dial: "+1" },
  { iso: "CV", name: "Cape Verde", dial: "+238" },
  { iso: "KY", name: "Cayman Islands", dial: "+1345" },
  { iso: "CF", name: "Central African Republic", dial: "+236" },
  { iso: "TD", name: "Chad", dial: "+235" },
  { iso: "CL", name: "Chile", dial: "+56" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "CO", name: "Colombia", dial: "+57" },
  { iso: "KM", name: "Comoros", dial: "+269" },
  { iso: "CG", name: "Congo", dial: "+242" },
  { iso: "CD", name: "Congo (DRC)", dial: "+243" },
  { iso: "CK", name: "Cook Islands", dial: "+682" },
  { iso: "CR", name: "Costa Rica", dial: "+506" },
  { iso: "HR", name: "Croatia", dial: "+385" },
  { iso: "CU", name: "Cuba", dial: "+53" },
  { iso: "CW", name: "Curaçao", dial: "+599" },
  { iso: "CY", name: "Cyprus", dial: "+357" },
  { iso: "CZ", name: "Czech Republic", dial: "+420" },
  { iso: "DK", name: "Denmark", dial: "+45" },
  { iso: "DJ", name: "Djibouti", dial: "+253" },
  { iso: "DM", name: "Dominica", dial: "+1767" },
  { iso: "DO", name: "Dominican Republic", dial: "+1809" },
  { iso: "EC", name: "Ecuador", dial: "+593" },
  { iso: "EG", name: "Egypt", dial: "+20" },
  { iso: "SV", name: "El Salvador", dial: "+503" },
  { iso: "GQ", name: "Equatorial Guinea", dial: "+240" },
  { iso: "ER", name: "Eritrea", dial: "+291" },
  { iso: "EE", name: "Estonia", dial: "+372" },
  { iso: "SZ", name: "Eswatini", dial: "+268" },
  { iso: "ET", name: "Ethiopia", dial: "+251" },
  { iso: "FK", name: "Falkland Islands", dial: "+500" },
  { iso: "FO", name: "Faroe Islands", dial: "+298" },
  { iso: "FJ", name: "Fiji", dial: "+679" },
  { iso: "FI", name: "Finland", dial: "+358" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "GF", name: "French Guiana", dial: "+594" },
  { iso: "PF", name: "French Polynesia", dial: "+689" },
  { iso: "GA", name: "Gabon", dial: "+241" },
  { iso: "GM", name: "Gambia", dial: "+220" },
  { iso: "GE", name: "Georgia", dial: "+995" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "GH", name: "Ghana", dial: "+233" },
  { iso: "GI", name: "Gibraltar", dial: "+350" },
  { iso: "GR", name: "Greece", dial: "+30" },
  { iso: "GL", name: "Greenland", dial: "+299" },
  { iso: "GD", name: "Grenada", dial: "+1473" },
  { iso: "GP", name: "Guadeloupe", dial: "+590" },
  { iso: "GU", name: "Guam", dial: "+1671" },
  { iso: "GT", name: "Guatemala", dial: "+502" },
  { iso: "GN", name: "Guinea", dial: "+224" },
  { iso: "GW", name: "Guinea-Bissau", dial: "+245" },
  { iso: "GY", name: "Guyana", dial: "+592" },
  { iso: "HT", name: "Haiti", dial: "+509" },
  { iso: "HN", name: "Honduras", dial: "+504" },
  { iso: "HK", name: "Hong Kong", dial: "+852" },
  { iso: "HU", name: "Hungary", dial: "+36" },
  { iso: "IS", name: "Iceland", dial: "+354" },
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "ID", name: "Indonesia", dial: "+62" },
  { iso: "IR", name: "Iran", dial: "+98" },
  { iso: "IQ", name: "Iraq", dial: "+964" },
  { iso: "IE", name: "Ireland", dial: "+353" },
  { iso: "IL", name: "Israel", dial: "+972" },
  { iso: "IT", name: "Italy", dial: "+39" },
  { iso: "CI", name: "Ivory Coast", dial: "+225" },
  { iso: "JM", name: "Jamaica", dial: "+1876" },
  { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "JO", name: "Jordan", dial: "+962" },
  { iso: "KZ", name: "Kazakhstan", dial: "+7" },
  { iso: "KE", name: "Kenya", dial: "+254" },
  { iso: "KI", name: "Kiribati", dial: "+686" },
  { iso: "XK", name: "Kosovo", dial: "+383" },
  { iso: "KW", name: "Kuwait", dial: "+965" },
  { iso: "KG", name: "Kyrgyzstan", dial: "+996" },
  { iso: "LA", name: "Laos", dial: "+856" },
  { iso: "LV", name: "Latvia", dial: "+371" },
  { iso: "LB", name: "Lebanon", dial: "+961" },
  { iso: "LS", name: "Lesotho", dial: "+266" },
  { iso: "LR", name: "Liberia", dial: "+231" },
  { iso: "LY", name: "Libya", dial: "+218" },
  { iso: "LI", name: "Liechtenstein", dial: "+423" },
  { iso: "LT", name: "Lithuania", dial: "+370" },
  { iso: "LU", name: "Luxembourg", dial: "+352" },
  { iso: "MO", name: "Macau", dial: "+853" },
  { iso: "MG", name: "Madagascar", dial: "+261" },
  { iso: "MW", name: "Malawi", dial: "+265" },
  { iso: "MY", name: "Malaysia", dial: "+60" },
  { iso: "MV", name: "Maldives", dial: "+960" },
  { iso: "ML", name: "Mali", dial: "+223" },
  { iso: "MT", name: "Malta", dial: "+356" },
  { iso: "MH", name: "Marshall Islands", dial: "+692" },
  { iso: "MQ", name: "Martinique", dial: "+596" },
  { iso: "MR", name: "Mauritania", dial: "+222" },
  { iso: "MU", name: "Mauritius", dial: "+230" },
  { iso: "MX", name: "Mexico", dial: "+52" },
  { iso: "FM", name: "Micronesia", dial: "+691" },
  { iso: "MD", name: "Moldova", dial: "+373" },
  { iso: "MC", name: "Monaco", dial: "+377" },
  { iso: "MN", name: "Mongolia", dial: "+976" },
  { iso: "ME", name: "Montenegro", dial: "+382" },
  { iso: "MS", name: "Montserrat", dial: "+1664" },
  { iso: "MA", name: "Morocco", dial: "+212" },
  { iso: "MZ", name: "Mozambique", dial: "+258" },
  { iso: "MM", name: "Myanmar", dial: "+95" },
  { iso: "NA", name: "Namibia", dial: "+264" },
  { iso: "NR", name: "Nauru", dial: "+674" },
  { iso: "NP", name: "Nepal", dial: "+977" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "NC", name: "New Caledonia", dial: "+687" },
  { iso: "NZ", name: "New Zealand", dial: "+64" },
  { iso: "NI", name: "Nicaragua", dial: "+505" },
  { iso: "NE", name: "Niger", dial: "+227" },
  { iso: "NG", name: "Nigeria", dial: "+234" },
  { iso: "NU", name: "Niue", dial: "+683" },
  { iso: "NF", name: "Norfolk Island", dial: "+672" },
  { iso: "KP", name: "North Korea", dial: "+850" },
  { iso: "MK", name: "North Macedonia", dial: "+389" },
  { iso: "MP", name: "Northern Mariana Islands", dial: "+1670" },
  { iso: "NO", name: "Norway", dial: "+47" },
  { iso: "OM", name: "Oman", dial: "+968" },
  { iso: "PK", name: "Pakistan", dial: "+92" },
  { iso: "PW", name: "Palau", dial: "+680" },
  { iso: "PS", name: "Palestine", dial: "+970" },
  { iso: "PA", name: "Panama", dial: "+507" },
  { iso: "PG", name: "Papua New Guinea", dial: "+675" },
  { iso: "PY", name: "Paraguay", dial: "+595" },
  { iso: "PE", name: "Peru", dial: "+51" },
  { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "PL", name: "Poland", dial: "+48" },
  { iso: "PT", name: "Portugal", dial: "+351" },
  { iso: "PR", name: "Puerto Rico", dial: "+1787" },
  { iso: "QA", name: "Qatar", dial: "+974" },
  { iso: "RE", name: "Réunion", dial: "+262" },
  { iso: "RO", name: "Romania", dial: "+40" },
  { iso: "RU", name: "Russia", dial: "+7" },
  { iso: "RW", name: "Rwanda", dial: "+250" },
  { iso: "WS", name: "Samoa", dial: "+685" },
  { iso: "SM", name: "San Marino", dial: "+378" },
  { iso: "ST", name: "São Tomé and Príncipe", dial: "+239" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "SN", name: "Senegal", dial: "+221" },
  { iso: "RS", name: "Serbia", dial: "+381" },
  { iso: "SC", name: "Seychelles", dial: "+248" },
  { iso: "SL", name: "Sierra Leone", dial: "+232" },
  { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "SK", name: "Slovakia", dial: "+421" },
  { iso: "SI", name: "Slovenia", dial: "+386" },
  { iso: "SB", name: "Solomon Islands", dial: "+677" },
  { iso: "SO", name: "Somalia", dial: "+252" },
  { iso: "ZA", name: "South Africa", dial: "+27" },
  { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "SS", name: "South Sudan", dial: "+211" },
  { iso: "ES", name: "Spain", dial: "+34" },
  { iso: "LK", name: "Sri Lanka", dial: "+94" },
  { iso: "SD", name: "Sudan", dial: "+249" },
  { iso: "SR", name: "Suriname", dial: "+597" },
  { iso: "SE", name: "Sweden", dial: "+46" },
  { iso: "CH", name: "Switzerland", dial: "+41" },
  { iso: "SY", name: "Syria", dial: "+963" },
  { iso: "TW", name: "Taiwan", dial: "+886" },
  { iso: "TJ", name: "Tajikistan", dial: "+992" },
  { iso: "TZ", name: "Tanzania", dial: "+255" },
  { iso: "TH", name: "Thailand", dial: "+66" },
  { iso: "TL", name: "Timor-Leste", dial: "+670" },
  { iso: "TG", name: "Togo", dial: "+228" },
  { iso: "TO", name: "Tonga", dial: "+676" },
  { iso: "TT", name: "Trinidad and Tobago", dial: "+1868" },
  { iso: "TN", name: "Tunisia", dial: "+216" },
  { iso: "TR", name: "Turkey", dial: "+90" },
  { iso: "TM", name: "Turkmenistan", dial: "+993" },
  { iso: "TC", name: "Turks and Caicos Islands", dial: "+1649" },
  { iso: "TV", name: "Tuvalu", dial: "+688" },
  { iso: "UG", name: "Uganda", dial: "+256" },
  { iso: "UA", name: "Ukraine", dial: "+380" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
  { iso: "US", name: "United States", dial: "+1" },
  { iso: "UY", name: "Uruguay", dial: "+598" },
  { iso: "UZ", name: "Uzbekistan", dial: "+998" },
  { iso: "VU", name: "Vanuatu", dial: "+678" },
  { iso: "VA", name: "Vatican City", dial: "+379" },
  { iso: "VE", name: "Venezuela", dial: "+58" },
  { iso: "VN", name: "Vietnam", dial: "+84" },
  { iso: "VG", name: "British Virgin Islands", dial: "+1284" },
  { iso: "VI", name: "U.S. Virgin Islands", dial: "+1340" },
  { iso: "YE", name: "Yemen", dial: "+967" },
  { iso: "ZM", name: "Zambia", dial: "+260" },
  { iso: "ZW", name: "Zimbabwe", dial: "+263" },
].sort((a, b) => a.name.localeCompare(b.name));

// Small styled chip showing the ISO code. Flag emoji rendering is inconsistent
// across OSes (Windows in particular falls back to plain letters), so a
// deliberately-styled chip looks intentional everywhere instead of looking
// like a broken emoji.
function CountryChip({ iso }) {
  return (
    <span
      className="inline-flex h-5 min-w-[1.75rem] items-center justify-center rounded-md
                 bg-teal-50 px-1 text-[10px] font-bold tracking-wide text-teal-700"
    >
      {iso}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Small UI helpers
// ---------------------------------------------------------------------------

function ProgressBar({ stepIndex, total }) {
  const pct = (stepIndex / (total - 1)) * 100;
  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="h-1.5 flex-1 rounded-full bg-stone-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-semibold tabular-nums text-stone-400">
        {stepIndex + 1}/{total}
      </span>
    </div>
  );
}

function TextField({ value, onChange, type = "text", placeholder, autoFocus, inputMode }) {
  return (
    <label className="block">
      <div
        className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white
                   px-5 py-3.5 shadow-sm transition focus-within:border-teal-500
                   focus-within:ring-2 focus-within:ring-teal-100"
      >
        <input
          type={type}
          inputMode={inputMode}
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          required
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-lg font-semibold tracking-tight text-stone-900
                     outline-none placeholder:font-normal placeholder:text-stone-300"
        />
      </div>
    </label>
  );
}

function NumberField({ value, onChange, unit, placeholder, autoFocus, min, max, step = 1 }) {
  function bump(delta) {
    const current = Number(value || placeholder || min || 0);
    const next = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, current + delta));
    onChange(String(next));
  }

  return (
    <div
      className="flex items-center gap-1 rounded-2xl border border-stone-200 bg-white
                 p-1.5 shadow-sm transition focus-within:border-teal-500
                 focus-within:ring-2 focus-within:ring-teal-100"
    >
      <button
        type="button"
        onClick={() => bump(-step)}
        aria-label={`Decrease ${unit}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-50
                   text-stone-500 transition hover:bg-teal-50 hover:text-teal-700 active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>

      <label className="flex flex-1 items-baseline justify-center gap-2 px-1">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^0-9]/g, "");
            onChange(digits);
          }}
          className="w-full min-w-0 bg-transparent text-center text-3xl font-extrabold tracking-tight
                     text-stone-900 outline-none placeholder:text-stone-300"
        />
        <span className="shrink-0 text-sm font-medium text-stone-400">{unit}</span>
      </label>

      <button
        type="button"
        onClick={() => bump(step)}
        aria-label={`Increase ${unit}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-50
                   text-stone-500 transition hover:bg-teal-50 hover:text-teal-700 active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// Dropdown for a short list of options. The list expands inline (pushing the
// content down) instead of floating, so it can never be clipped by the
// popup's scroll container.
function SelectField({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white
                    px-5 py-3.5 text-left text-lg shadow-sm transition
                    ${open ? "border-teal-500 ring-2 ring-teal-100" : "border-stone-200 hover:border-stone-300"}`}
      >
        <span className={value ? "font-semibold tracking-tight text-stone-900" : "text-stone-300"}>
          {value || placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className={`shrink-0 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
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
                  className={`flex w-full items-center justify-between px-5 py-3 text-left text-base transition
                    hover:bg-stone-50 ${selected ? "bg-teal-50 font-semibold text-teal-700" : "text-stone-700"}`}
                >
                  {opt}
                  {selected && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const DROPDOWN_WIDTH = 288; // px, keep in sync with the w-72 panel below
const DROPDOWN_MAX_HEIGHT = 320; // px

// Country-code picker: a button showing the ISO chip + dial code that opens a
// searchable list. Pass the selected ISO code and get the ISO code back.
//
// The panel uses position:fixed with coordinates computed from the button's
// own bounding box, instead of position:absolute, so it isn't clipped by the
// popup card's overflow-y-auto. It sits above the modal (z-[60] > z-50).
function CountryCodeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);

  const selected = COUNTRY_CODES.find((c) => c.iso === value) ?? COUNTRY_CODES.find((c) => c.iso === "US");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_CODES;
    return COUNTRY_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.replace("+", "").includes(q.replace("+", ""))
    );
  }, [query]);

  // Recompute where the panel should sit, flipping above the button if there
  // isn't enough room below, and keeping it inside the viewport horizontally.
  const positionPanel = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < DROPDOWN_MAX_HEIGHT + 12 && rect.top > spaceBelow;
    const left = Math.min(rect.left, window.innerWidth - DROPDOWN_WIDTH - 12);
    setCoords({
      left: Math.max(12, left),
      top: openUpward ? undefined : rect.bottom + 8,
      bottom: openUpward ? window.innerHeight - rect.top + 8 : undefined,
      maxHeight: openUpward ? rect.top - 20 : window.innerHeight - rect.bottom - 20,
    });
  };

  useLayoutEffect(() => {
    if (open) positionPanel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e) {
      if (
        buttonRef.current?.contains(e.target) ||
        panelRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
      setQuery("");
    }
    function onScrollOrResize() {
      positionPanel();
    }
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        className="flex h-full shrink-0 items-center gap-1.5 rounded-xl border border-stone-200
                   bg-stone-50 px-3 py-3.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
        aria-label="Select country code"
        aria-expanded={open}
      >
        <CountryChip iso={selected.iso} />
        <span>{selected.dial}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-stone-400">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && coords && (
        <div
          ref={panelRef}
          style={{
            position: "fixed",
            left: coords.left,
            top: coords.top,
            bottom: coords.bottom,
            width: DROPDOWN_WIDTH,
            maxHeight: DROPDOWN_MAX_HEIGHT,
          }}
          className="z-[60] flex flex-col overflow-hidden rounded-2xl border border-stone-200
                     bg-white shadow-xl shadow-stone-300/40"
        >
          <div className="shrink-0 border-b border-stone-100 p-2">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code"
              className="w-full rounded-lg bg-stone-100 px-3 py-2 text-sm text-stone-900
                         outline-none placeholder:text-stone-400"
            />
          </div>
          <ul
            className="overflow-y-auto py-1"
            style={{ maxHeight: Math.min(DROPDOWN_MAX_HEIGHT, coords.maxHeight ?? DROPDOWN_MAX_HEIGHT) - 52 }}
          >
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-stone-400">No matches</li>
            )}
            {filtered.map((c) => (
              <li key={c.iso}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c.iso);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition
                    hover:bg-stone-50 ${c.iso === selected.iso ? "bg-teal-50 font-semibold text-teal-700" : "text-stone-700"}`}
                >
                  <CountryChip iso={c.iso} />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="shrink-0 text-stone-400">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component (popup)
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BodyAssessmentForm({ open = false, onClose, onSubmit }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);

  const step = STEPS[stepIndex];

  // Lock page scroll while the popup is open, and always restore it on close
  // or unmount (so the page can never get stuck unscrollable).
  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Start fresh every time the popup is closed.
  useEffect(() => {
    if (!open) {
      setStepIndex(0);
      setData(INITIAL_DATA);
    }
  }, [open]);

  const bmi = useMemo(() => {
    const w = Number(data.weightKg);
    const hM = Number(data.heightCm) / 100;
    if (!w || !hM) return null;
    return w / (hM * hM);
  }, [data.weightKg, data.heightCm]);

  const bodyType = bmi ? getBodyType(bmi) : null;

  if (!open) return null;

  // Every field is required.
  const canAdvance = {
    age: Number(data.age) >= 10 && Number(data.age) <= 99,
    gender: !!data.gender,
    contact:
      data.name.trim().length >= 2 &&
      EMAIL_RE.test(data.email.trim()) &&
      data.phone.replace(/\D/g, "").length >= 7 &&
      data.city.trim().length >= 2,
    goal: GOAL_OPTIONS.includes(data.goal),
    weight: Number(data.weightKg) >= 30 && Number(data.weightKg) <= 300,
    height: Number(data.heightCm) >= 100 && Number(data.heightCm) <= 250,
    result: true,
  }[step];

  function goNext() {
    if (!canAdvance) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function set(field, value) {
    setData((d) => ({ ...d, [field]: value }));
  }

  function handleSubmit() {
    onSubmit?.({
      ...data,
      name: data.name.trim(),
      email: data.email.trim(),
      city: data.city.trim(),
      bmi: bmi ? Math.round(bmi * 10) / 10 : null,
      bodyType: bodyType?.id ?? null,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => {
        // close only when the dark backdrop itself is clicked
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Body assessment"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-y-auto rounded-[2rem]
                   border border-stone-200 bg-stone-50 shadow-2xl shadow-stone-900/20"
      >
        {/* Header: back + progress + close */}
        <div className="sticky top-0 z-10 flex items-center gap-3 bg-stone-50/95 px-5 pt-5 pb-3 backdrop-blur sm:px-8 sm:pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="text-stone-400 hover:text-stone-600 disabled:opacity-0 transition"
            aria-label="Back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <ProgressBar stepIndex={stepIndex} total={STEPS.length} />
          <button
            type="button"
            onClick={() => onClose?.()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-400
                       transition hover:bg-stone-200 hover:text-stone-700"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-5 pt-4 pb-4 sm:px-8">
          {step === "age" && <StepAge value={data.age} onChange={(v) => set("age", v)} />}

          {step === "gender" && (
            <StepGender value={data.gender} onChange={(v) => set("gender", v)} />
          )}

          {step === "contact" && (
            <StepContact
              name={data.name}
              email={data.email}
              phone={data.phone}
              phoneCountry={data.phoneCountry}
              city={data.city}
              onChangeName={(v) => set("name", v)}
              onChangeEmail={(v) => set("email", v)}
              onChangePhone={(v) => set("phone", v)}
              onChangePhoneCountry={(v) => set("phoneCountry", v)}
              onChangeCity={(v) => set("city", v)}
            />
          )}

          {step === "goal" && <StepGoal value={data.goal} onChange={(v) => set("goal", v)} />}

          {step === "weight" && (
            <StepWeight value={data.weightKg} onChange={(v) => set("weightKg", v)} />
          )}

          {step === "height" && (
            <StepHeight value={data.heightCm} onChange={(v) => set("heightCm", v)} />
          )}

          {step === "result" && bmi && bodyType && (
            <StepResult
              bmi={bmi}
              bodyType={bodyType}
              gender={data.gender}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        {/* Footer CTA */}
        {step !== "result" && (
          <div className="sticky bottom-0 bg-stone-50/95 px-5 pb-5 pt-2 backdrop-blur sm:px-8 sm:pb-6">
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-teal-600
                         py-3.5 text-center text-base font-bold text-white shadow-lg shadow-teal-600/20
                         transition hover:bg-teal-700 hover:shadow-teal-600/30 disabled:bg-stone-200
                         disabled:text-stone-400 disabled:shadow-none active:scale-[0.98]"
            >
              Continue
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                className="transition group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

function StepAge({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
        How old are you?
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        We'll use this to tailor your plan to your age group.
      </p>

      <div className="mt-6 sm:max-w-sm">
        <NumberField
          value={value}
          onChange={onChange}
          unit="years"
          placeholder="28"
          min={10}
          max={99}
          step={1}
          autoFocus
        />
      </div>
    </div>
  );
}

function StepGender({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
        Choose your gender
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        This helps us personalize your body-type results.
      </p>

      {/* pt-6 gives the bleeding head room to sit above the row without being clipped by the page */}
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
              {/* Card background — this is the only element that clips, so the border stays a clean rounded rect */}
              <div
                className={`absolute inset-0 rounded-2xl border shadow-sm transition
                  ${selected ? "border-teal-500 bg-teal-50 ring-2 ring-teal-100" : "border-stone-200 bg-white group-hover:border-stone-300"}
                `}
              />

              {/* Label */}
              <div className="relative z-10 flex h-full w-1/2 flex-col justify-end p-4">
                <span className={`text-base font-bold ${selected ? "text-teal-900" : "text-stone-900"}`}>
                  {opt.label}
                </span>
              </div>

              {/* Image — sits outside the card's clip box, so the head bleeds above the top edge */}
              <img
                src={GENDER_IMAGES[opt.id]}
                alt={opt.label}
                className="pointer-events-none absolute -top-6 bottom-0 right-3 z-20 h-[calc(100%+1.5rem)]
                           w-auto max-w-[55%] object-contain object-bottom drop-shadow-md"
              />

              {/* Selected check badge */}
              {selected && (
                <span className="absolute left-4 top-4 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 shadow-md shadow-teal-600/30">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepContact({
  name,
  email,
  phone,
  phoneCountry,
  city,
  onChangeName,
  onChangeEmail,
  onChangePhone,
  onChangePhoneCountry,
  onChangeCity,
}) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
        A few details about you
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        We'll use this to save your results and send your plan. All fields are required.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:max-w-md">
        <TextField
          value={name}
          onChange={onChangeName}
          type="text"
          placeholder="Full name *"
          autoFocus
        />
        <TextField
          value={email}
          onChange={onChangeEmail}
          type="email"
          inputMode="email"
          placeholder="Email address *"
        />

        {/* Phone: country-code dropdown + national number, same field styling as TextField */}
        <div
          className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white
                     p-1.5 shadow-sm transition focus-within:border-teal-500
                     focus-within:ring-2 focus-within:ring-teal-100"
        >
          <CountryCodeSelect value={phoneCountry} onChange={onChangePhoneCountry} />
          <div className="h-6 w-px shrink-0 bg-stone-200" />
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            required
            placeholder="Phone number *"
            onChange={(e) => onChangePhone(e.target.value.replace(/[^0-9\s-]/g, ""))}
            className="w-full min-w-0 bg-transparent px-1 py-2 text-lg font-semibold tracking-tight
                       text-stone-900 outline-none placeholder:font-normal placeholder:text-stone-300"
          />
        </div>

        <TextField
          value={city}
          onChange={onChangeCity}
          type="text"
          placeholder="City *"
        />
      </div>
    </div>
  );
}

function StepGoal({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
        What is your primary goal? <span className="text-teal-600">*</span>
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Pick the one that matters most right now — we'll shape your plan around it.
      </p>

      <div className="mt-6 sm:max-w-md">
        <SelectField
          value={value}
          onChange={onChange}
          options={GOAL_OPTIONS}
          placeholder="Select primary goal"
        />
      </div>
    </div>
  );
}

function StepWeight({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
        What's your current weight?
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Be honest — this is just the starting point.
      </p>

      <div className="mt-6 sm:max-w-sm">
        <NumberField
          value={value}
          onChange={onChange}
          unit="kg"
          placeholder="75"
          min={30}
          max={300}
          step={1}
          autoFocus
        />
      </div>
    </div>
  );
}

function StepHeight({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
        What's your height?
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        We'll use this to calculate your BMI and body type.
      </p>

      <div className="mt-6 sm:max-w-sm">
        <NumberField
          value={value}
          onChange={onChange}
          unit="cm"
          placeholder="178"
          min={100}
          max={250}
          step={1}
          autoFocus
        />
      </div>
    </div>
  );
}

function StepResult({ bmi, bodyType, gender, onSubmit }) {
  const roundedBmi = Math.round(bmi * 10) / 10;
  // position of the marker along a 15–40 BMI scale, clamped 0–100%
  const markerPct = Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100));
  const bodyImage = BODY_IMAGES[gender]?.[bodyType.id];

  return (
    <div className="flex flex-col sm:mx-auto sm:max-w-lg">
      {/* Top: image + headline/number side-by-side on larger screens to save height */}
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
          <h1 className="text-2xl font-extrabold tracking-tight leading-tight sm:text-3xl">
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

      {/* BMI gauge */}
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

      <div className="mt-6 w-full">
        <button
          type="button"
          onClick={onSubmit}
          className="group flex w-full items-center justify-center gap-2 rounded-full bg-teal-600
                     py-3.5 text-center text-base font-bold text-white shadow-lg shadow-teal-600/20
                     transition hover:bg-teal-700 hover:shadow-teal-600/30 active:scale-[0.98]"
        >
          Get my plan
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            className="transition group-hover:translate-x-0.5"
          >
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}