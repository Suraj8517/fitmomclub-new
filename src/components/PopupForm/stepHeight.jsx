import NumberField from "./numberField";
import StepHeading from "./stepHeading";

export default function StepHeight({ value, unit, onChange, onUnitChange }) {
  return (
    <div className="flex flex-col">
      <StepHeading
        title="What's your height?"
        subtitle="We'll use this to calculate your BMI and body type."
      />
      <div className="mt-6 sm:max-w-sm">
        <NumberField
          value={value}
          onChange={onChange}
          unit={unit}
          units={["cm", "in"]}
          onUnitChange={onUnitChange}
          placeholder={unit === "cm" ? "170" : "67"}
          max={300}
          autoFocus
        />
      </div>
    </div>
  );
}
