export default function TestimonialCard({ card, width, height }) {
  return (
    <div
      className="relative rounded-3xl overflow-hidden bg-black select-none w-[300px] h-[550px] md:w-[var(--card-w)] md:h-[var(--card-h)]"
      style={{ "--card-w": width, "--card-h": height }}
    >
      {/* Background image */}
      <img
        src={card.image}
        alt={card.author}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Top gradient for text legibility */}
      <div className="absolute top-0 left-0 right-0 h-240 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

      {/* Text content */}
      <div className="relative z-10 p-6 pt-12">
        <p className="sm:text-lg font-medium text-teal-300 md:mb-2 text-md">
          {card.author}
        </p>
        <h3 className="md:text-2xl text-xl font-semibold text-white/70 md:leading-10 leading-8 md:pt-6 pt-2">
          {card.quote}
        </h3>
      </div>
    </div>
  );
}