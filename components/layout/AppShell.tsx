import type { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Topbar } from "@/components/navigation/Topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-ash text-brand-black">
      <div className="flex min-w-0 flex-col lg:flex-row">
        <Sidebar />
        <main className="min-h-screen min-w-0 flex-1">
          <Topbar />
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
