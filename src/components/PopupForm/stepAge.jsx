import NumberField from "./numberField";
import StepHeading from "./stepHeading";

export default function StepAge({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <StepHeading
        title="How old are you?"
        subtitle="We'll use this to tailor your plan to your age group."
      />
      <div className="mt-6 sm:max-w-sm">
        <NumberField
          value={value}
          onChange={onChange}
          unit="years"
          placeholder="28"
          max={120}
          autoFocus
        />
      </div>
    </div>
  );
}