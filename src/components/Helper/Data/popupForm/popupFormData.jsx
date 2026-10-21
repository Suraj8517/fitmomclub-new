import male from "../../../../assets/form/male.png";
import female from "../../../../assets/form/female.png";
import maleUnderweight from "../../../../assets/form/male/male-underweight.png";
import maleNormal from "../../../../assets/form/male/male-normal.png";
import maleOverweight from "../../../../assets/form/male/male-overweight.png";
import maleObese from "../../../../assets/form/male/male-obese.png";
import maleExtremeObese from "../../../../assets/form/male/male-extreme-obese.png";
import femaleUnderweight from "../../../../assets/form/female/female-underweight.png";
import femaleNormal from "../../../../assets/form/female/female-normal.png";
import femaleOverweight from "../../../../assets/form/female/female-overweight.png";
import femaleObese from "../../../../assets/form/female/female-obese.png";
import femaleExtremeObese from "../../../../assets/form/female/female-extreme-obese.png";

export const COUNTRY_CODES = [
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

export const GOALS = [
  "Weight Management",
  "Health Issue Management",
  "Natural Conception/Fertility",
  "Currently Pregnant",
];

export const EMPTY_FORM = {
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
  website: "", 
};
export const STEPS = ["age", "gender", "contact", "goal", "weight", "height", "result"]

export const ALLOWED_GENDERS = ["Male", "Female"];
export const ALLOWED_WEIGHT_UNITS = ["kg", "lb"];
export const ALLOWED_HEIGHT_UNITS = ["cm", "in"];

export const GENDER_OPTIONS = [
  { id: "Male", label: "Male", img: male },
  { id: "Female", label: "Female", img: female },
];
export const BODY_IMAGES = {
  Male: {
    underweight: maleUnderweight,
    normal: maleNormal,
    overweight: maleOverweight,
    obese: maleObese,
    extremeObese: maleExtremeObese,
  },
  Female: {
    underweight: femaleUnderweight,
    normal: femaleNormal,
    overweight: femaleOverweight,
    obese: femaleObese,
    extremeObese: femaleExtremeObese,
  },
};


export const BODY_TYPES = [
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

export const LB_PER_KG = 2.20462262;
export const CM_PER_IN = 2.54;

export const fieldShell =
  "flex items-center gap-2 rounded-2xl border border-stone-200 bg-white shadow-sm transition focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100";
