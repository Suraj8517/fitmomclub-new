export default function StepHeading({ title, subtitle }) {
  return (
    <>
      <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-sm text-stone-500">{subtitle}</p>}
    </>
  );
}
