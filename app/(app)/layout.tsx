import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

export default function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <Toaster position="top-right" richColors />
    </>
  );
}
