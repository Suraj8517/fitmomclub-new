import NumberField from "./numberField";
import StepHeading from "./stepHeading";

export default function StepWeight({ value, unit, onChange, onUnitChange }) {
  return (
    <div className="flex flex-col">
      <StepHeading
        title="What's your current weight?"
        subtitle="Be honest — this is just the starting point."
      />
      <div className="mt-6 sm:max-w-sm">
        <NumberField
          value={value}
          onChange={onChange}
          unit={unit}
          units={["kg", "lb"]}
          onUnitChange={onUnitChange}
          placeholder={unit === "kg" ? "75" : "165"}
          max={999}
          autoFocus
        />
      </div>
    </div>
  );
}