import type {
  EquipamentoLookup,
  PatrimonioRecord,
  SecretariaLookup,
  TecnologiaLookup,
} from "@/types/patrimonio";
import { PatrimonioStatusBadge } from "@/components/modules/patrimonio/PatrimonioStatusBadge";

type PatrimonioDetailsProps = {
  item: PatrimonioRecord;
  secretarias: SecretariaLookup[];
  equipamentos: EquipamentoLookup[];
  tecnologias: TecnologiaLookup[];
};

function findName<T extends { id: string; nome: string }>(items: T[], id: string | null) {
  if (!id) {
    return "Nao informado";
  }

  return items.find((entry) => entry.id === id)?.nome ?? "Nao informado";
}

function findSecretaria(secretarias: SecretariaLookup[], id: string) {
  return secretarias.find((entry) => entry.id === id);
}

export function PatrimonioDetails({
  item,
  secretarias,
  equipamentos,
  tecnologias,
}: PatrimonioDetailsProps) {
  const secretaria = findSecretaria(secretarias, item.secretaria_id);
  const equipamento = findName(equipamentos, item.equipamento_id);
  const tecnologia = findName(tecnologias, item.tecnologia_id);

  return (
    <div className="grid gap-3 rounded-none border border-border bg-muted/30 p-3 md:grid-cols-2">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Patrimonio</p>
        <p className="text-lg font-semibold">{item.patrimonio}</p>
        {secretaria ? <p className="text-sm text-muted-foreground">{secretaria.codigo} - {secretaria.nome}</p> : null}
      </div>

      <div className="flex items-start justify-start gap-2 md:justify-end">
        <PatrimonioStatusBadge value={item.status} />
        {item.arquivado ? (
          <span className="rounded-none border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-700 dark:text-rose-300">
            Arquivado
          </span>
        ) : null}
        {item.condenado ? (
          <span className="rounded-none border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
            Condenado
          </span>
        ) : null}
      </div>

      <div className="space-y-1 text-sm">
        <p>
          <span className="text-muted-foreground">Equipamento:</span> {equipamento}
        </p>
        <p>
          <span className="text-muted-foreground">Marca:</span> {item.marca}
        </p>
        <p>
          <span className="text-muted-foreground">Tecnologia:</span> {tecnologia}
        </p>
        <p>
          <span className="text-muted-foreground">Responsavel:</span> {item.responsavel}
        </p>
      </div>

      <div className="space-y-1 text-sm">
        <p>
          <span className="text-muted-foreground">Criado em:</span>{" "}
          {new Date(item.created_at).toLocaleString("pt-BR")}
        </p>
        <p>
          <span className="text-muted-foreground">Atualizado em:</span>{" "}
          {new Date(item.updated_at).toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="space-y-1 md:col-span-2">
        <p className="text-sm font-medium">Problema relatado</p>
        <p className="text-sm text-muted-foreground">{item.problema || "Nao informado"}</p>
      </div>

      <div className="space-y-1 md:col-span-2">
        <p className="text-sm font-medium">Diagnostico tecnico</p>
        <p className="text-sm text-muted-foreground">{item.diagnostico || "Nao informado"}</p>
      </div>

      <div className="space-y-1 md:col-span-2">
        <p className="text-sm font-medium">Solucao aplicada</p>
        <p className="text-sm text-muted-foreground">{item.solucao || "Nao informado"}</p>
      </div>
    </div>
  );
}

