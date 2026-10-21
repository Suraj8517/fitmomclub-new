import { GOALS } from "../Helper/Data/popupForm/popupFormData";
import SelectField from "./selectField";
import StepHeading from "./stepHeading";

export default function StepGoal({ value, onChange, gender }) {
  const filteredGoals = gender?.toLowerCase() === "male" ? GOALS.slice(0, 2) : GOALS;
  return (
    <div className="flex flex-col">
      <StepHeading
        title={
          <>
            What is your primary goal? <span className="text-teal-600">*</span>
          </>
        }
        subtitle="Pick the one that matters most right now — we'll shape your plan around it."
      />
      <div className="mt-6 sm:max-w-md">
        <SelectField
          value={value}
          onChange={onChange}
          options={filteredGoals}
          placeholder="Select primary goal"
        />
      </div>
    </div>
  );
}
