"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/form-modal";
import { getPecasPorEquipamento } from "@/components/modules/patrimonio/patrimonio-pieces";
import type {
  EquipamentoLookup,
  PatrimonioFormInput,
  PatrimonioFormValues,
  PatrimonioMode,
  PatrimonioRecord,
  SecretariaLookup,
  TecnologiaLookup,
} from "@/types/patrimonio";
import { patrimonioStatusOptions } from "@/types/patrimonio";

type PatrimonioModalProps = {
  open: boolean;
  mode: PatrimonioMode;
  item: PatrimonioRecord | null;
  patrimonios: PatrimonioRecord[];
  secretarias: SecretariaLookup[];
  equipamentos: EquipamentoLookup[];
  tecnologias: TecnologiaLookup[];
  isSubmitting?: boolean;
  onSubmit: (values: PatrimonioFormInput) => void;
  onCancel: () => void;
};

function getDefaultValues(item: PatrimonioRecord | null): PatrimonioFormValues {
  return {
    patrimonio: item?.patrimonio ?? "",
    secretaria_id: item?.secretaria_id ?? "",
    equipamento_id: item?.equipamento_id ?? "",
    tecnologia_id: item?.tecnologia_id ?? "",
    marca: item?.marca ?? "",
    responsavel: item?.responsavel ?? "",
    status: item?.status ?? "pending",
    problema: item?.problema ?? "",
    diagnostico: item?.diagnostico ?? "",
    solucao: item?.solucao ?? "",
    condenado: item?.condenado ?? false,
    pecas_retiradas: item?.pecas_retiradas ?? [],
  };
}

export function PatrimonioModal({
  open,
  mode,
  item,
  secretarias,
  equipamentos,
  tecnologias,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: PatrimonioModalProps) {
  const form = useForm<PatrimonioFormValues>({
    defaultValues: getDefaultValues(item),
  });

  const equipamentoId = useWatch({ control: form.control, name: "equipamento_id" });
  const condenado = useWatch({ control: form.control, name: "condenado" });
  const watchedPecasRetiradas = useWatch({ control: form.control, name: "pecas_retiradas" });
  const pecasRetiradas = useMemo(() => watchedPecasRetiradas ?? [], [watchedPecasRetiradas]);

  useEffect(() => {
    form.reset(getDefaultValues(item));
  }, [form, item, open]);

  const selectedEquipment = useMemo(
    () => equipamentos.find((entry) => entry.id === equipamentoId),
    [equipamentos, equipamentoId],
  );

  const availablePieces = useMemo(
    () => getPecasPorEquipamento(selectedEquipment?.nome ?? ""),
    [selectedEquipment?.nome],
  );

  useEffect(() => {
    if (!condenado || availablePieces.length === 0) {
      if (pecasRetiradas.length) {
        form.setValue("pecas_retiradas", [], { shouldDirty: true });
      }
      return;
    }

    const validPieces = pecasRetiradas.filter((piece) => availablePieces.includes(piece));
    if (validPieces.length !== pecasRetiradas.length) {
      form.setValue("pecas_retiradas", validPieces, { shouldDirty: true });
    }
  }, [availablePieces, condenado, form, pecasRetiradas]);

  const submit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      tecnologia_id: values.tecnologia_id.trim(),
      problema: values.problema.trim(),
      diagnostico: values.diagnostico.trim(),
      solucao: values.solucao.trim(),
      pecas_retiradas: values.condenado ? values.pecas_retiradas : [],
    });
  });

  return (
    <FormModal
      open={open}
      title={mode === "create" ? "Novo patrimonio" : "Detalhes do patrimonio"}
      description="Edite os dados cadastrais e o estado tecnico do bem patrimonial."
      onClose={onCancel}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="button" onClick={submit} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </>
      }
    >
      <form className="space-y-3" onSubmit={submit}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-muted-foreground">Patrimonio</span>
            <Input {...form.register("patrimonio")} placeholder="Ex.: 23123" />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Secretaria</span>
            <Select {...form.register("secretaria_id")}>
              <option value="">Selecione</option>
              {secretarias.map((secretaria) => (
                <option key={secretaria.id} value={secretaria.id}>
                  {secretaria.codigo} - {secretaria.nome}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Equipamento</span>
            <Select {...form.register("equipamento_id")}>
              <option value="">Selecione</option>
              {equipamentos.map((equipamento) => (
                <option key={equipamento.id} value={equipamento.id}>
                  {equipamento.nome}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Marca</span>
            <Input {...form.register("marca")} placeholder="Ex.: Dell" />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Tecnologia</span>
            <Select {...form.register("tecnologia_id")}>
              <option value="">Nao informado</option>
              {tecnologias.map((tecnologia) => (
                <option key={tecnologia.id} value={tecnologia.id}>
                  {tecnologia.nome}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-muted-foreground">Responsavel</span>
            <Input {...form.register("responsavel")} placeholder="Nome do responsavel" />
          </label>

          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-muted-foreground">Status</span>
            <Select {...form.register("status")}>
              {patrimonioStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Problema relatado</span>
          <Textarea {...form.register("problema")} placeholder="Descreva o defeito ou sintoma" />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Diagnostico tecnico</span>
          <Textarea {...form.register("diagnostico")} placeholder="Informe a analise tecnica" />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Solucao aplicada</span>
          <Textarea {...form.register("solucao")} placeholder="Informe a solucao aplicada" />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={condenado}
            onChange={(event) => form.setValue("condenado", event.target.checked, { shouldDirty: true })}
          />
          <span>Equipamento condenado</span>
        </label>

        {condenado && availablePieces.length ? (
          <div className="space-y-2 border border-border p-3">
            <div className="grid gap-2 md:grid-cols-2">
              {availablePieces.map((piece) => {
                const isChecked = pecasRetiradas.includes(piece);

                return (
                  <label key={piece} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(event) => {
                        const nextValue = event.target.checked
                          ? [...pecasRetiradas, piece]
                          : pecasRetiradas.filter((value) => value !== piece);

                        form.setValue("pecas_retiradas", nextValue, { shouldDirty: true });
                      }}
                    />
                    <span>{piece}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}
      </form>
    </FormModal>
  );
}
