"use client";

import { Badge } from "@/components/ui/badge";
import { getStatusMetadata } from "@/lib/status-metadata";

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
      className: getStatusMetadata("canceled").className,
    };
  }

  if (quantity <= 5) {
    return {
      value: "low",
      label: "Baixo",
      className: getStatusMetadata("open").className,
    };
  }

  if (quantity <= 20) {
    return {
      value: "medium",
      label: "Medio",
      className: getStatusMetadata("in_progress").className,
    };
  }

  return {
    value: "high",
    label: "Alto",
      className: getStatusMetadata("done").className,
  };
}

type EstoqueStatusBadgeProps = {
  quantity: number;
};

export function EstoqueStatusBadge({ quantity }: EstoqueStatusBadgeProps) {
  const status = getStockStatus(quantity);

  return (
    <Badge variant="outline" className={`border ${status.className}`}>
      {status.label}
    </Badge>
  );
}
