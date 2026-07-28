"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { ModuleBrowser } from "@/components/module-browser";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";
import { listRequests } from "@/services/solicitacoes";
import type { RequestItem } from "@/types/cpd";

const requests = listRequests();

const columns: ColumnDef<RequestItem, unknown>[] = [
  { accessorKey: "number", header: "Identificador" },
  { accessorKey: "category", header: "Categoria" },
  { accessorKey: "item", header: "Item" },
  { accessorKey: "quantity", header: "Quantidade" },
  { accessorKey: "requester", header: "Solicitante" },
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
  { accessorKey: "justification", header: "Justificativa" },
  { accessorKey: "notes", header: "Observacoes" },
];

export function SolicitacoesModule() {
  return (
    <ModuleBrowser
      title="Solicitacoes"
      description="Pedidos de pecas, equipamentos, materiais e servicos externos."
      storageKey="cpd:solicitacoes"
      items={requests}
      getKey={(item) => item.id}
      columns={() => columns}
      searchText={(item) =>
        [item.number, item.category, item.item, item.requester, item.justification, item.notes, item.status]
          .filter(Boolean)
          .join(" ")
      }
      renderCard={(item) => (
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{item.number}</p>
              <p className="text-xs text-muted-foreground">{item.item}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-1">
              <PriorityBadge value={item.priority} />
              <StatusBadge value={item.status} />
            </div>
          </div>

          <div className="grid gap-1 text-sm">
            <p>
              <span className="text-muted-foreground">Categoria:</span> {item.category}
            </p>
            <p>
              <span className="text-muted-foreground">Quantidade:</span> {item.quantity}
            </p>
            <p>
              <span className="text-muted-foreground">Solicitante:</span> {item.requester}
            </p>
            <p>
              <span className="text-muted-foreground">Justificativa:</span> {item.justification}
            </p>
            <p>
              <span className="text-muted-foreground">Observacoes:</span> {item.notes}
            </p>
          </div>
          <Badge variant="outline">Fluxo interno</Badge>
        </div>
      )}
      onRowDoubleClick={(item) => toast.info(`Abrir solicitacao ${item.number}`)}
      onNew={() => toast.success("Nova solicitacao iniciada.")}
      onEdit={() => toast.info("Editar solicitacao selecionada.")}
      onDelete={() => toast.warning("Exclusao bloqueada nesta etapa.")}
      onRefresh={() => toast.success("Solicitacoes atualizadas.")}
      onFilter={() => toast.info("Filtro rapido em breve.")}
      emptyMessage="Nenhuma solicitacao localizada."
      searchPlaceholder="Pesquisar solicitacao, item, categoria ou texto..."
    />
  );
}
