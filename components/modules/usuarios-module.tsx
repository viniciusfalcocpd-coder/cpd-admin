"use client";

import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { ModuleBrowser } from "@/components/module-browser";
import { Badge } from "@/components/ui/badge";
import { listUsers } from "@/services/usuarios";
import type { TeamMember } from "@/types/cpd";

const users = listUsers();

const roleLabel: Record<TeamMember["role"], string> = {
  administrator: "Administrador",
  coordinator: "Coordenador CPD",
  technician: "Tecnico",
  purchasing: "Compras",
  viewer: "Visualizacao",
};

const columns: ColumnDef<TeamMember, unknown>[] = [
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "role", header: "Perfil" },
  { accessorKey: "email", header: "E-mail" },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => <Badge variant={row.original.active ? "default" : "secondary"}>{row.original.active ? "Ativo" : "Inativo"}</Badge>,
  },
  {
    accessorKey: "lastAccess",
    header: "Ultimo acesso",
    cell: ({ row }) => format(new Date(row.original.lastAccess), "dd/MM/yyyy HH:mm"),
  },
];

export function UsuariosModule() {
  return (
    <ModuleBrowser
      title="Usuarios"
      description="Perfis de acesso, ativacao e controle operacional."
      storageKey="cpd:usuarios"
      items={users}
      getKey={(item) => item.id}
      columns={() => columns}
      searchText={(item) =>
        [item.name, item.email, roleLabel[item.role], item.lastAccess, item.active ? "ativo" : "inativo"]
          .filter(Boolean)
          .join(" ")
      }
      renderCard={(item) => (
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.email}</p>
            </div>
            <Badge variant={item.active ? "default" : "secondary"}>{item.active ? "Ativo" : "Inativo"}</Badge>
          </div>
          <div className="grid gap-1 text-sm">
            <p>
              <span className="text-muted-foreground">Perfil:</span> {roleLabel[item.role]}
            </p>
            <p>
              <span className="text-muted-foreground">Ultimo acesso:</span> {format(new Date(item.lastAccess), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
        </div>
      )}
      onRowDoubleClick={(item) => toast.info(`Abrir usuario ${item.name}`)}
      onNew={() => toast.success("Novo usuario.")}
      onEdit={() => toast.info("Editar usuario selecionado.")}
      onDelete={() => toast.warning("Exclusao bloqueada nesta etapa.")}
      onRefresh={() => toast.success("Usuarios atualizados.")}
      onFilter={() => toast.info("Filtro rapido em breve.")}
      emptyMessage="Nenhum usuario localizado."
      searchPlaceholder="Pesquisar nome, e-mail ou perfil..."
    />
  );
}
