import IconCheck from "../Helper/iconCheck";


export default function SuccessView({ onDone }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600/10 text-teal-600">
        <IconCheck className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-extrabold tracking-tight text-stone-900">
        Thank you — you're all set
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-snug text-stone-500">
        Our health consultant will reach out to you shortly. Please keep an eye on your
        phone and inbox.
      </p>
      <button
        type="button"
        onClick={onDone}
        className="mt-6 rounded-full bg-teal-600 px-8 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
      >
        Done
      </button>
    </div>
  );
}