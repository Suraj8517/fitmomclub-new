import { Info, X } from "lucide-react";


export function P({ children }) {
  return <p className="text-[15px] leading-7 text-zinc-800 mb-3.5">{children}</p>;
}

export function BulletList({ items }) {
  return (
    <ul className="pl-5 mb-3.5 space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-[15px] leading-7 text-zinc-800 list-disc">{item}</li>
      ))}
    </ul>
  );
}

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function AlphaBulletList({ items }) {
  return (
    <ul className="list-none p-0 mb-3.5 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-[15px] leading-7 text-zinc-800">
          <span className="min-w-[22px] h-[22px] rounded-[4px] bg-zinc-100 text-zinc-600 text-[11px] font-bold flex items-center justify-center shrink-0 mt-[3px]">
            {ALPHA[i]}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Callout({ children }) {
  return (
    <div className="bg-zinc-50 border-l-[3px] border-zinc-400 rounded-r-md px-4 py-3 my-3.5">
      <p className="text-sm text-zinc-700 m-0 leading-7">{children}</p>
    </div>
  );
}

export function InfoBox({ children }) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 my-3.5 flex gap-2.5">
      <Info size={15} className="text-zinc-500 shrink-0 mt-[3px]" />
      <p className="text-sm text-zinc-700 m-0 leading-7">{children}</p>
    </div>
  );
}

export function Divider() {
  return <hr className="border-none border-t border-zinc-200 my-8" />;
}

export function PauseTable() {
  const rows = [
    ["3 months", "14 days"], ["6 months", "28 days"], ["9 months", "42 days"],
    ["12 months", "56 days"], ["18 months", "84 days"], ["24 months", "112 days"],
    ["36 months", "168 days"],
  ];
  return (
    <div className="overflow-x-auto my-3.5 rounded-lg border border-zinc-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-zinc-50">
            <th className="text-left px-4 py-2.5 font-semibold text-zinc-800 border-b border-zinc-200">Program Duration</th>
            <th className="text-left px-4 py-2.5 font-semibold text-zinc-800 border-b border-zinc-200">Pause Days</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([d, p], i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-zinc-50"}>
              <td className="px-4 py-2 text-zinc-700">{d}</td>
              <td className="px-4 py-2 text-zinc-500 font-semibold">{p}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SectionBlock({ id, num, title, icon: Icon, children, sectionRefs }) {
  return (
    <section id={id} ref={el => { sectionRefs.current[id] = el; }} className="mb-10">
      <div className="flex items-start gap-3.5 mb-4 pb-3.5 border-b border-zinc-200">
        <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
          <Icon size={17} className="text-white" />
        </div>
        <div>
          <p className="text-[11px] text-zinc-400 font-semibold m-0 mb-0.5 uppercase tracking-widest">Section {num}</p>
          <h2 className="text-xl font-bold text-zinc-900 m-0">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 md:p-8 relative shadow-2xl shadow-black/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full border-none bg-zinc-100 text-zinc-500 cursor-pointer flex items-center justify-center hover:bg-zinc-200 transition-colors"
        >
          <X size={16} />
        </button>
        <h2 className="text-[22px] font-bold text-zinc-900 mb-6">{title}</h2>
        <div className="text-sm leading-7 text-zinc-700">{children}</div>
        <button
          onClick={onClose}
          className="mt-7 w-full bg-zinc-900 text-white border-none rounded-xl py-3.5 text-[15px] font-semibold cursor-pointer hover:bg-zinc-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}