import type { EquipamentoLookup, PatrimonioRecord, SecretariaLookup } from "@/types/patrimonio";
import { PatrimonioOperationalBadge } from "@/components/modules/patrimonio/PatrimonioOperationalBadge";
import { PatrimonioAgentBadge } from "@/components/modules/patrimonio/PatrimonioAgentBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PatrimonioTableProps = {
  items: PatrimonioRecord[];
  secretarias: SecretariaLookup[];
  equipamentos: EquipamentoLookup[];
  selectedId: string | null;
  onSelect: (item: PatrimonioRecord) => void;
  onOpen?: (item: PatrimonioRecord) => void;
};

function getLookupName<T extends { id: string; nome: string }>(items: T[], id: string | null) {
  if (!id) {
    return "Nao informado";
  }

  return items.find((item) => item.id === id)?.nome ?? "Nao informado";
}

function getSecretariaName(secretarias: SecretariaLookup[], id: string) {
  const secretaria = secretarias.find((item) => item.id === id);
  return secretaria ? `${secretaria.codigo} - ${secretaria.nome}` : "Nao informado";
}

export function PatrimonioTable({
  items,
  secretarias,
  equipamentos,
  selectedId,
  onSelect,
  onOpen,
}: PatrimonioTableProps) {
  return (
    <div className="border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patrimonio</TableHead>
            <TableHead>Equipamento</TableHead>
            <TableHead>Secretaria</TableHead>
            <TableHead>Responsavel</TableHead>
            <TableHead>Situacao</TableHead>
            <TableHead>Agente</TableHead>
            <TableHead>Ultima coleta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length ? (
            items.map((item) => {
              const isSelected = item.id === selectedId;

              return (
                <TableRow
 key={item.id}
 className={`
   cursor-pointer
   hover:bg-muted/50
   ${isSelected ? "bg-[var(--classic-selection)] text-[var(--classic-selection-text)]" : ""}
 `}
 onClick={() => onSelect(item)}
 onDoubleClick={() => onOpen?.(item)}
 onKeyDown={(event) => {
   if (event.key === "Enter") onOpen?.(item);
 }}
 tabIndex={0}
>
                  <TableCell className="font-medium">{item.patrimonio}</TableCell>
                  <TableCell>{getLookupName(equipamentos, item.equipamento_id)}</TableCell>
                  <TableCell>{getSecretariaName(secretarias, item.secretaria_id)}</TableCell>
                  <TableCell>{item.responsavel}</TableCell>
                  <TableCell><PatrimonioOperationalBadge value={item.situacao_operacional} /></TableCell>
                  <TableCell><PatrimonioAgentBadge inventory={item.inventario} /></TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {item.inventario?.collected_at ? new Date(item.inventario.collected_at).toLocaleString("pt-BR") : "—"}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                Nenhum patrimonio encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
