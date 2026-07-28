"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground md:grid md:grid-cols-[auto_1fr]">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed((value) => !value)}
      />

      <div className="min-w-0">
        <Topbar onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-none px-3 py-3 sm:px-4 lg:px-5">{children}</main>
      </div>
    </div>
  );
}
