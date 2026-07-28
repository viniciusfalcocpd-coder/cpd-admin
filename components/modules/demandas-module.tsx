"use client";

import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { ModuleBrowser } from "@/components/module-browser";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";
import { listDemands } from "@/services/demandas";
import type { DemandItem } from "@/types/cpd";

const demands = listDemands();

const columnsByTab: Record<string, ColumnDef<DemandItem, unknown>[]> = {
  internal: [
    { accessorKey: "number", header: "Identificador" },
    { accessorKey: "patrimony", header: "Patrimonio" },
    { accessorKey: "equipment", header: "Equipamento" },
    { accessorKey: "defect", header: "Defeito" },
    { accessorKey: "owner", header: "Tecnico" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge value={row.original.status} />,
    },
    {
      accessorKey: "date",
      header: "Entrada",
      cell: ({ row }) => format(new Date(row.original.date), "dd/MM/yyyy"),
    },
    { accessorKey: "notes", header: "Observacoes" },
  ],
  field: [
    { accessorKey: "number", header: "Identificador" },
    { accessorKey: "requester", header: "Secretaria" },
    { accessorKey: "location", header: "Local" },
    { accessorKey: "summary", header: "Problema informado" },
    { accessorKey: "openedBy", header: "Aberto por" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge value={row.original.status} />,
    },
    {
      accessorKey: "date",
      header: "Abertura",
      cell: ({ row }) => format(new Date(row.original.date), "dd/MM/yyyy"),
    },
    { accessorKey: "report", header: "Relatorio tecnico" },
  ],
};

const tabs = [
  { value: "internal", label: "Manutencao interna", filter: (item: DemandItem) => item.kind === "internal" },
  { value: "field", label: "Atendimento em campo", filter: (item: DemandItem) => item.kind === "field" },
];

export function DemandasModule() {
  return (
    <ModuleBrowser
      title="Demandas"
      description="Organizacao operacional das demandas internas e dos atendimentos em campo."
      storageKey="cpd:demandas"
      items={demands}
      getKey={(item) => item.id}
      tabs={tabs}
      columns={(tab) => columnsByTab[tab] ?? columnsByTab.internal}
      searchText={(item, tab) =>
        [
          item.number,
          item.requester,
          item.owner,
          item.summary,
          item.notes,
          item.patrimony,
          item.equipment,
          item.defect,
          item.location,
          item.openedBy,
          item.report,
          tab,
        ]
          .filter(Boolean)
          .join(" ")
      }
      renderCard={(item) => (
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{item.number}</p>
              <p className="text-xs text-muted-foreground">{item.summary}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-1">
              <PriorityBadge value={item.priority} />
              <StatusBadge value={item.status} />
            </div>
          </div>

          <div className="grid gap-1 text-sm">
            <p>
              <span className="text-muted-foreground">Responsavel:</span> {item.owner}
            </p>
            <p>
              <span className="text-muted-foreground">Solicitante:</span> {item.requester}
            </p>
            {item.kind === "internal" ? (
              <>
                <p>
                  <span className="text-muted-foreground">Patrimonio:</span> {item.patrimony}
                </p>
                <p>
                  <span className="text-muted-foreground">Equipamento:</span> {item.equipment}
                </p>
              </>
            ) : (
              <>
                <p>
                  <span className="text-muted-foreground">Local:</span> {item.location}
                </p>
                <p>
                  <span className="text-muted-foreground">Aberto por:</span> {item.openedBy}
                </p>
              </>
            )}
            <p>
              <span className="text-muted-foreground">Relatorio:</span> {item.report}
            </p>
          </div>
          <Badge variant="outline">{item.kind === "internal" ? "Interna" : "Campo"}</Badge>
        </div>
      )}
      onRowDoubleClick={(item) => toast.info(`Abrir demanda ${item.number}`)}
      onNew={() => toast.success("Nova demanda iniciada.")}
      onEdit={() => toast.info("Editar demanda selecionada.")}
      onDelete={() => toast.warning("Exclusao bloqueada nesta versao.")}
      onRefresh={() => toast.success("Demandas atualizadas.")}
      onFilter={() => toast.info("Filtro operacional em breve.")}
      emptyMessage="Nenhuma demanda localizada."
      searchPlaceholder="Pesquisar demanda, tecnico, patrimonio ou secretaria..."
    />
  );
}
