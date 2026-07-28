"use client";

import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";
import type { DemandItem } from "@/types/cpd";

const columns: ColumnDef<DemandItem>[] = [
  {
    accessorKey: "number",
    header: "Numero",
  },
  {
    accessorKey: "requester",
    header: "Solicitante",
  },
  {
    accessorKey: "sector",
    header: "Setor",
  },
  {
    accessorKey: "summary",
    header: "Descricao",
    cell: ({ row }) => <span className="max-w-[360px] truncate">{row.original.summary}</span>,
  },
  {
    accessorKey: "priority",
    header: "Prioridade",
    cell: ({ row }) => <PriorityBadge value={row.original.priority} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.status} />,
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => format(new Date(row.original.date), "dd/MM/yyyy"),
  },
];

export function DemandasTable({ data }: { data: DemandItem[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Pesquisar demandas..."
      emptyMessage="Nenhuma demanda encontrada."
    />
  );
}
