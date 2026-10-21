export default function ProgressBar({ stepIndex, total }) {
  const pct = (stepIndex / (total - 1)) * 100;
  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
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