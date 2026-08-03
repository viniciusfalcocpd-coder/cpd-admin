"use client";

import type { ReactNode } from "react";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Topbar />
      <main className="mx-auto flex min-h-0 w-full max-w-none flex-1 flex-col px-3 py-3 sm:px-4 lg:px-5">{children}</main>
    </div>
  );
}
