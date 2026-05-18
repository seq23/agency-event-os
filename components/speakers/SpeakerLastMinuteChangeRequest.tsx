export function SpeakerLastMinuteChangeRequest() {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide">Last-minute change request</p>
      <h2 className="mt-2 text-xl font-semibold">Need to change your script, deck, intro, or talking points?</h2>
      <p className="mt-2 text-sm">
        Submit the change here. Your currently approved version remains live until a producer approves and pushes the new version.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {["Script edit", "Deck replacement", "Intro update", "AV requirement"].map((label) => (
          <button key={label} className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-amber-900" type="button">
            Request {label}
          </button>
        ))}
      </div>
    </div>
  );
}
