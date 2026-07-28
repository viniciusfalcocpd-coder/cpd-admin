"use client";

import { Select } from "@/components/ui/select";
import type { StockCategory } from "@/types/cpd";
import type { StockStatusValue } from "@/components/modules/estoque/EstoqueStatusBadge";

export type EstoqueStatusFilter = "all" | StockStatusValue;

type EstoqueFiltersProps = {
  categories: StockCategory[];
  types: string[];
  categoryId: string;
  type: string;
  status: EstoqueStatusFilter;
  highlighted?: boolean;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: EstoqueStatusFilter) => void;
};

export function EstoqueFilters({
  categories,
  types,
  categoryId,
  type,
  status,
  highlighted,
  onCategoryChange,
  onTypeChange,
  onStatusChange,
}: EstoqueFiltersProps) {
  return (
    <div
      className={`grid gap-2 border border-border bg-card p-2 md:grid-cols-3 ${
        highlighted ? "ring-1 ring-primary" : ""
      }`}
    >
      <Select value={categoryId} onChange={(event) => onCategoryChange(event.target.value)}>
        <option value="all">Todas as categorias</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>

      <Select value={type} onChange={(event) => onTypeChange(event.target.value)}>
        <option value="all">Todos os tipos</option>
        {types.map((entry) => (
          <option key={entry} value={entry}>
            {entry}
          </option>
        ))}
      </Select>

      <Select value={status} onChange={(event) => onStatusChange(event.target.value as EstoqueStatusFilter)}>
        <option value="all">Todos os status</option>
        <option value="empty">Sem estoque</option>
        <option value="low">Baixo</option>
        <option value="medium">Medio</option>
        <option value="high">Alto</option>
      </Select>
    </div>
  );
}
