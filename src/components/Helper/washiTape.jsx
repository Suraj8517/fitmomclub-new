// Washi tape strip pinning the polaroid to the page
export default function WashiTape({ color, side = "left", rotate = -8 }) {
  return (
    <div
      aria-hidden
      className="absolute z-20"
      style={{
        top: -10,
        [side]: side === "left" ? 10 : 10,
        width: 40,
        height: 19,
        background: `repeating-linear-gradient(45deg, ${color}CC 0 6px, ${color}99 6px 12px)`,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        opacity: 0.92,
        borderRadius: 2,
      }}
    />
  );
}