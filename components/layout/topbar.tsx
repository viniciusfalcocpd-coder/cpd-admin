"use client";

import { Building2, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const navigation = [{ href: "/central", label: "Central de Trabalho" }, { href: "/patrimonio", label: "Patrimônio" }, { href: "/estoque", label: "Estoque" }, { href: "/administracao", label: "Administração" }, { href: "/laudo-tecnico", label: "Laudo Técnico" }];

export function Topbar() {
  const pathname = usePathname();
  const [refreshing, setRefreshing] = useState(false);
  function refresh() {
    if (refreshing) return;
    setRefreshing(true);
    window.location.reload();
  }
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="flex min-h-12 flex-wrap items-center gap-2 px-3 py-1">
        <Link href="/central" className="mr-2 flex items-center gap-2 border-r border-border pr-3 text-sm font-semibold"><Building2 className="h-4 w-4 text-primary" />CPD Manager</Link>
        <nav className="flex flex-1 flex-wrap items-center gap-1" aria-label="Módulos">
          {navigation.map((item) => <Link key={item.href} href={item.href} className={`border px-2.5 py-1.5 text-xs ${pathname.startsWith(item.href) ? "border-primary bg-primary text-primary-foreground" : "border-transparent text-muted-foreground hover:border-border hover:bg-muted"}`}>{item.label}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden lg:inline">{format(new Date(), "dd/MM/yyyy HH:mm")}</span>
          <Button variant="outline" size="sm" className="h-8 min-w-[6.5rem]" aria-label="Atualizar tela" onClick={refresh} disabled={refreshing}>
            <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Atualizando" : "Atualizar"}
          </Button>
        </div>
      </div>
    </header>
  );
}
