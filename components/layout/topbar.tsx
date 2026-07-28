"use client";

import { PanelLeft, RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

type TopbarProps = {
  onOpenMobileMenu: () => void;
};

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="flex items-center gap-2 px-3 py-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMobileMenu}>
          <PanelLeft className="h-4 w-4" />
        </Button>

        <div className="relative hidden w-full max-w-md md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-8" placeholder="Pesquisar registros, usuarios, itens..." />
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Operacao local</span>
          <span className="hidden md:inline">{format(new Date(), "dd/MM/yyyy HH:mm")}</span>
          <Button variant="outline" size="sm" className="h-8" aria-label="Atualizar tela" onClick={() => window.location.reload()}>
            <RefreshCcw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>
    </header>
  );
}
