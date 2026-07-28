import type { EquipamentoLookup, PatrimonioRecord, SecretariaLookup, TecnologiaLookup } from "@/types/patrimonio";
import { PatrimonioStatusBadge } from "@/components/modules/patrimonio/PatrimonioStatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PatrimonioTableProps = {
  items: PatrimonioRecord[];
  secretarias: SecretariaLookup[];
  equipamentos: EquipamentoLookup[];
  tecnologias: TecnologiaLookup[];
  selectedId: string | null;
  onSelect: (item: PatrimonioRecord) => void;
  onOpen: (item: PatrimonioRecord) => void;
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
  tecnologias,
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
            <TableHead>Marca</TableHead>
            <TableHead>Tecnologia</TableHead>
            <TableHead>Secretaria</TableHead>
            <TableHead>Responsavel</TableHead>
            <TableHead>Status</TableHead>
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
   ${isSelected ? "bg-muted/70" : ""}
 `}
 onClick={() => onSelect(item)}
>
                  <TableCell className="font-medium">{item.patrimonio}</TableCell>
                  <TableCell>{getLookupName(equipamentos, item.equipamento_id)}</TableCell>
                  <TableCell>{item.marca}</TableCell>
                  <TableCell>{getLookupName(tecnologias, item.tecnologia_id)}</TableCell>
                  <TableCell>{getSecretariaName(secretarias, item.secretaria_id)}</TableCell>
                  <TableCell>{item.responsavel}</TableCell>
                  <TableCell>
                    <PatrimonioStatusBadge value={item.status} />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                Nenhum patrimonio encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

