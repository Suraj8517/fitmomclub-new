import { TOKENS } from "./TOKENS";

export default function VideoLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: TOKENS.paperDark }}>
      <div
        className="w-6 h-6 rounded-full animate-spin"
        style={{ border: `2px solid ${TOKENS.sage}44`, borderTopColor: TOKENS.sage }}
      />
    </div>
  );
}