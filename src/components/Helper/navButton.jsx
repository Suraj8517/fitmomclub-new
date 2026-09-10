import ArrowIcon from "./arrowIcon";
import { TOKENS } from "./TOKENS";
export default function NavButton({ direction, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
      style={{
        border: `2px solid ${disabled ? "#D8CDB0" : TOKENS.ink}`,
        color: disabled ? "#C9BE9F" : TOKENS.ink,
        background: TOKENS.card,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = TOKENS.sageDark;
        e.currentTarget.style.borderColor = TOKENS.sageDark;
        e.currentTarget.style.color = TOKENS.card;
        e.currentTarget.style.transform = "rotate(-6deg) scale(1.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = TOKENS.card;
        e.currentTarget.style.borderColor = disabled ? "#D8CDB0" : TOKENS.ink;
        e.currentTarget.style.color = disabled ? "#C9BE9F" : TOKENS.ink;
        e.currentTarget.style.transform = "rotate(0deg) scale(1)";
      }}
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}