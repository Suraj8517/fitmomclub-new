import male from "../../../../assets/form/male.png";
import female from "../../../../assets/form/female.png";

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
  "Weight Gain",
  "Weight Loss",
  "Health Issue Management",
  "Prenatal Care",
  "Postpartum Recovery",
  "Toned Body",
  "Stay Fit/Regular Maintenance",
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
export const STEPS = ["age", "gender", "contact", "goal", "weight", "height", "result"];

export const ALLOWED_GENDERS = ["Male", "Female"];
export const ALLOWED_WEIGHT_UNITS = ["kg", "lb"];
export const ALLOWED_HEIGHT_UNITS = ["cm", "in"];

export const GENDER_OPTIONS = [
  { id: "Male", label: "Male", img: male },
  { id: "Female", label: "Female", img: female },
];

/* ── 10-stage body images ──
   Expected files:
   assets/form/male/male-stage-1.png ... male-stage-10.png
   assets/form/female/female-stage-1.png ... female-stage-10.png
   Missing files do not break the build; that stage's image is simply undefined. */
const collectStages = (modules) =>
  Object.entries(modules).reduce((acc, [path, url]) => {
    const m = path.match(/stage-(\d+)\.png$/);
    if (m) acc[Number(m[1])] = url;
    return acc;
  }, {});

export const BODY_IMAGES = {
  Male: collectStages(
    import.meta.glob("../../../../assets/form/male/male-stage-*.png", { eager: true, import: "default" })
  ),
  Female: collectStages(
    import.meta.glob("../../../../assets/form/female/female-stage-*.png", { eager: true, import: "default" })
  ),
};

/* min inclusive, max exclusive */
export const BODY_TYPES = [
  { stage: 1,  label: "Underweight",       min: 0,    max: 16,       accent: "#0891B2", blurb: "You're on the lighter end. A structured plan can help you build strength and energy." },
  { stage: 2,  label: "Lean",              min: 16,   max: 18.5,     accent: "#0E9AA7", blurb: "You have a lean frame. The right training and nutrition can help you build strength and definition." },
  { stage: 3,  label: "Athletic",          min: 18.5, max: 20,       accent: "#0D9488", blurb: "You're in a light, active range. A good plan can help you keep building performance and tone." },
  { stage: 4,  label: "Muscular",          min: 20,   max: 21.5,     accent: "#0F9D6E", blurb: "You're in a strong, well-balanced range. A smart plan can help you maintain and sharpen it." },
  { stage: 5,  label: "Normal",            min: 21.5, max: 23,       accent: "#16A34A", blurb: "You're in a healthy range. Consistent habits will help you stay there and feel your best." },
  { stage: 6,  label: "Soft",              min: 23,   max: 25,       accent: "#65A30D", blurb: "You're at the upper end of a healthy range. Small, steady changes can help you tone up." },
  { stage: 7,  label: "Overweight",        min: 25,   max: 27.5,     accent: "#D97706", blurb: "You're carrying some extra weight. A tailored plan can help you lean out and feel stronger." },
  { stage: 8,  label: "Obese - Class I",   min: 27.5, max: 30,       accent: "#EA580C", blurb: "A tailored plan can help you bring your weight down steadily and sustainably." },
  { stage: 9,  label: "Obese - Class II",  min: 30,   max: 35,       accent: "#DC2626", blurb: "A guided, consistent plan can help you make real progress, one step at a time." },
  { stage: 10, label: "Obese - Class III", min: 35,   max: Infinity, accent: "#B91C1C", blurb: "You deserve proper support. A guided plan, ideally alongside your doctor, can help you move forward safely." },
];

export const BMI_DISCLAIMER =
  "These stages are a visual guide based on BMI, not medical diagnoses. BMI can't measure muscle mass or body-fat distribution, so an athletic person may land in a higher stage.";

export const LB_PER_KG = 2.20462262;
export const CM_PER_IN = 2.54;

export const fieldShell =
  "flex items-center gap-2 rounded-2xl border border-stone-200 bg-white shadow-sm transition focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100";

  console.log("BODY_IMAGES", BODY_IMAGES);