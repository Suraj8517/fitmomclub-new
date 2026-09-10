
export function AnimatedOrb({ icon: Icon, orbit = [] }) {
  return (
    <div className="relative mx-auto mb-1 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
      <div className="absolute inset-0 rounded-full bg-[#0EA5A0]/10 blob1" />
     
      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#0A0A0A] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.45)] breathe sm:h-16 sm:w-16">
        <Icon size={24} className="text-white" strokeWidth={1.8} />
      </div>
      {orbit.map((OIcon, i) => (
        <div
          key={i}
          className="absolute flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 float-orbit"
          style={{ ...ORBIT_POS[i % ORBIT_POS.length], animationDelay: ORBIT_POS[i % ORBIT_POS.length].delay }}
        >
          <OIcon size={13} className="text-[#0EA5A0]" strokeWidth={2} />
        </div>
      ))}
    </div>
  );
}