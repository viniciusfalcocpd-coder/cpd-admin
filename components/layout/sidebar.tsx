"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Boxes,
  ClipboardList,
  FileText,
  HardDrive,
  Home,
  Menu,
  Settings2,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/demandas", label: "Demandas", icon: ClipboardList },
  { href: "/solicitacoes", label: "Solicitacoes", icon: FileText },
  { href: "/estoque", label: "Estoque", icon: HardDrive },
  { href: "/patrimonio", label: "Patrimonio", icon: Boxes },
  { href: "/usuarios", label: "Usuarios", icon: Users2 },
];

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
};

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onCloseMobile}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-card p-3 transition-transform duration-300 md:sticky md:translate-x-0",
          collapsed ? "md:w-[84px]" : "md:w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted text-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            {!collapsed ? (
              <div>
                <p className="font-heading text-base font-semibold leading-none">CPD Manager</p>
                <p className="text-[11px] text-muted-foreground">ERP interno do CPD</p>
              </div>
            ) : null}
          </div>

          <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={onToggleCollapse}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 pt-3">
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 border px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "border-primary bg-muted text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
                  collapsed ? "md:justify-center md:px-2" : "",
                )}
                onClick={onCloseMobile}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-border pt-3">
          <Link
            href="/laudo-tecnico"
            className={cn(
              "flex items-center gap-2 border border-border bg-muted px-2.5 py-2 text-sm transition-colors hover:bg-muted/70",
              collapsed ? "md:justify-center md:px-2" : "",
            )}
            onClick={onCloseMobile}
          >
            <Settings2 className="h-4 w-4 shrink-0" />
            {!collapsed ? <span>Laudo tecnico</span> : null}
          </Link>
        </div>
      </aside>
    </>
  );
}
