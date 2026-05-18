export function ErrorState({ title = "Something went wrong", body = "This shell is ready for real error handling later." }: { title?: string; body?: string }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
      <h3 className="font-semibold text-rose-950">{title}</h3>
      <p className="mt-1 text-sm text-rose-700">{body}</p>
    </div>
  );
}
