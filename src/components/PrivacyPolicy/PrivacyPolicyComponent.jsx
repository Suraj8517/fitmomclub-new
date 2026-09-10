import {
  Info
} from "lucide-react";



export function P({ children }) {
  return (
    <p className="text-[13.5px] leading-[1.85] text-teal-950/80 mb-3">
      {children}
    </p>
  );
}

export function BulletList({ items }) {
  return (
    <ul className="list-none p-0 my-2 mb-4 space-y-1.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 text-[13.5px] leading-[1.75] text-teal-950/80"
        >
          <span className="w-[5px] h-[5px] rounded-full bg-teal-500 mt-[9px] flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Callout({ children }) {
  return (
    <div className="bg-teal-50 border-l-[3px] border-teal-500 rounded-r-xl px-4 py-3 my-4">
      <p className="text-[13px] text-teal-800 leading-relaxed m-0">{children}</p>
    </div>
  );
}

export function InfoBox({ children }) {
  return (
    <div className="bg-teal-50 rounded-xl px-4 py-3.5 my-4 flex gap-3">
      <Info size={14} className="text-teal-600 flex-shrink-0 mt-0.5" />
      <p className="text-[13px] text-teal-800 leading-relaxed m-0">{children}</p>
    </div>
  );
}

export function Divider() {
  return <hr className="border-0 border-t border-teal-100 my-8" />;
}

export function AddressBlock() {
  return (
    <div className="bg-teal-50 rounded-xl px-4 py-4 text-[13px] text-teal-800 leading-[1.8] mt-2">
      <p className="m-0">No.6/53, Ajay Complex, Urumandam Palayam,</p>
      <p className="m-0">G.N. Mills (Po), Coimbatore, Tamil Nadu,</p>
      <p className="m-0">India – 641029</p>
    </div>
  );
}

export function SectionBlock({ id, num, title, icon: Icon, sectionRefs, children }) {
  return (
    <section
      ref={(el) => { if (sectionRefs) sectionRefs.current[id] = el; }}
      id={id}
      className="mb-2"
    >
      <div className="flex items-start gap-3 mb-5 pb-4 border-b border-teal-100">
        <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Icon size={16} className="text-white" />
        </div>
        <div>
          <p className="text-[10.5px] text-teal-400 font-bold tracking-widest uppercase mb-0.5 m-0">
            Section {num}
          </p>
          <h2 className="text-[17px] font-semibold text-teal-900 m-0">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}