"use client";

import { Button } from "@/components/ui/button";
import type {
  PatrimonioRecord,
  EquipamentoLookup,
  TecnologiaLookup,
  SecretariaLookup,
} from "@/types/patrimonio";
import { getStatusMetadata } from "@/lib/status-metadata";

type PatrimonioPreviewProps = {
  item: PatrimonioRecord;

  equipamentos: EquipamentoLookup[];
  tecnologias: TecnologiaLookup[];
  secretarias: SecretariaLookup[];

  onEdit: () => void;
  onArchive: () => void;
  onClose: () => void;
};




function getLookupName<T extends { id: string; nome: string }>(
  items: T[],
  id: string | null
) {
  if (!id) {
    return "Não informado";
  }

  return (
    items.find((item) => item.id === id)?.nome ??
    "Não informado"
  );
}


function getSecretariaName(
  secretarias: SecretariaLookup[],
  id: string
) {
  const secretaria = secretarias.find(
    (item) => item.id === id
  );

  return secretaria
    ? `${secretaria.codigo} - ${secretaria.nome}`
    : "Não informado";
}


export function PatrimonioPreview({
  item,
  equipamentos,
  tecnologias,
  secretarias,
  onEdit,
  onArchive,
  onClose,
}: PatrimonioPreviewProps) {

  return (
    <div
      className="
        fixed
        right-6
        top-24
        z-50
        w-[360px]
        border
        border-border
        bg-card
        shadow-lg
      "
    >

      {/* Cabeçalho */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-border
          bg-muted
          px-4
          py-3
        "
      >

        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Patrimônio
          </p>

          <h2 className="font-semibold">
            {item.patrimonio}
          </h2>
        </div>


        <button
          onClick={onClose}
          className="
            text-sm
            text-muted-foreground
            hover:text-foreground
          "
        >
          ✕
        </button>

      </div>


      {/* Conteúdo */}
      <div className="space-y-3 p-4 text-sm">


        <div>
          <span className="text-muted-foreground">
            Equipamento:
          </span>

          <p className="font-medium">
            {getLookupName(
              equipamentos,
              item.equipamento_id
            )}
          </p>
        </div>



        <div>
          <span className="text-muted-foreground">
            Marca:
          </span>

          <p className="font-medium">
            {item.marca || "Não informado"}
          </p>
        </div>



        <div>
          <span className="text-muted-foreground">
            Tecnologia:
          </span>

          <p className="font-medium">
            {getLookupName(
              tecnologias,
              item.tecnologia_id
            )}
          </p>
        </div>



        <div>
          <span className="text-muted-foreground">
            Secretaria:
          </span>

          <p className="font-medium">
            {getSecretariaName(
              secretarias,
              item.secretaria_id
            )}
          </p>
        </div>



        <div>
          <span className="text-muted-foreground">
            Responsável:
          </span>

          <p className="font-medium">
            {item.responsavel || "Não informado"}
          </p>
        </div>



        <div>
          <span className="text-muted-foreground">
            Status:
          </span>

          <p className="font-medium">
            <span className={`border px-2 py-0.5 ${getStatusMetadata(item.status).className}`}>{getStatusMetadata(item.status).label}</span>
          </p>
        </div>


      </div>



      {/* Rodapé */}
      <div
  className="
    flex
    justify-between
    border-t
    border-border
    bg-muted/30
    px-4
    py-3
  "
>
  <Button
    variant="destructive"
    size="sm"
    onClick={onArchive}
  >
    Baixa Patrimonial
  </Button>

  <div className="flex gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={onClose}
    >
      Fechar
    </Button>

    <Button
      size="sm"
      onClick={onEdit}
    >
      Editar
    </Button>
  </div>
</div>

    </div>
  );
}
