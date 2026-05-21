"use client";
import { useState } from "react";

export function CopyToClipboardButton({ value, label }: { value?: string; label: string }) {
  const [status, setStatus] = useState("idle");
  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1600);
    } catch {
      setStatus("failed");
      window.setTimeout(() => setStatus("idle"), 2200);
    }
  }
  return (
    <button type="button" onClick={copy} disabled={!value} className="mt-3 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">
      {status === "copied" ? `Copied ${label}` : status === "failed" ? "Copy failed" : `Click to Copy ${label}`}
    </button>
  );
}
