"use client";

import { Filter, PencilLine, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onNew?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
  onFilter?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  className?: string;
};

export function Toolbar({
  query,
  onQueryChange,
  onNew,
  onEdit,
  onDelete,
  onRefresh,
  onFilter,
  showEdit = true,
  showDelete = true,
  className,
}: ToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-2 border border-border bg-card p-2 lg:flex-row lg:items-center lg:justify-between", className)}>
      <div className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Pesquisar..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onFilter}>
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onRefresh}>
            <RotateCcw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={onNew}>
          <Plus className="h-4 w-4" />
          Novo
        </Button>
        {showEdit ? (
          <Button type="button" variant="outline" size="sm" onClick={onEdit}>
            <PencilLine className="h-4 w-4" />
            Editar
          </Button>
        ) : null}
        {showDelete ? (
          <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        ) : null}
      </div>
    </div>
  );
}
