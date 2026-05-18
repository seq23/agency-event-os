import type { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Topbar } from "@/components/navigation/Topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex">
        <Sidebar />
        <main className="min-h-screen flex-1">
          <Topbar />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
