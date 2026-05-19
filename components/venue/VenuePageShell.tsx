import type { ReactNode } from "react";
import type { VirtualVenueModel } from "@/types/virtualVenue";
import { VenueHeader } from "./VenueHeader";

export function VenuePageShell({ model, children }: { model: VirtualVenueModel; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <VenueHeader model={model} />
        {children}
      </div>
    </main>
  );
}
