import type { ReactNode } from "react";
import type { VirtualVenueModel } from "@/types/virtualVenue";
import { VenueHeader } from "./VenueHeader";

export function VenuePageShell({ model, children }: { model: VirtualVenueModel; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-brand-ash px-4 py-4 text-brand-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
        <VenueHeader model={model} />
        {children}
      </div>
    </main>
  );
}
