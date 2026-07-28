"use client";

import { Badge } from "@/components/ui/badge";

export type StockStatusValue = "empty" | "low" | "medium" | "high";

export type StockStatus = {
  value: StockStatusValue;
  label: string;
  className: string;
};

export function getStockStatus(quantity: number): StockStatus {
  if (quantity <= 0) {
    return {
      value: "empty",
      label: "Sem estoque",
      className: "border-red-300 bg-red-100 text-red-800",
    };
  }

  if (quantity <= 5) {
    return {
      value: "low",
      label: "Baixo",
      className: "border-amber-300 bg-amber-100 text-amber-900",
    };
  }

  if (quantity <= 20) {
    return {
      value: "medium",
      label: "Medio",
      className: "border-blue-300 bg-blue-100 text-blue-800",
    };
  }

  return {
    value: "high",
    label: "Alto",
    className: "border-emerald-300 bg-emerald-100 text-emerald-800",
  };
}

type EstoqueStatusBadgeProps = {
  quantity: number;
};

export function EstoqueStatusBadge({ quantity }: EstoqueStatusBadgeProps) {
  const status = getStockStatus(quantity);

  return (
    <Badge variant="outline" className={status.className}>
      {status.label}
    </Badge>
  );
}
