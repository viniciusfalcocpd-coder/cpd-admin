"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { PatrimonioStatusBadge } from "@/components/modules/patrimonio/PatrimonioStatusBadge";
import { getPecasPorEquipamento } from "@/components/modules/patrimonio/patrimonio-pieces";
import { createPatrimonioAction, updatePatrimonioAction } from "@/services/patrimonio-actions";
import type {
  PatrimonioFormInput,
  PatrimonioFormValues,
  PatrimonioMode,
  PatrimonioPageData,
  PatrimonioRecord,
} from "@/types/patrimonio";
import { patrimonioStatusOptions } from "@/types/patrimonio";

type PatrimonioFormPageProps = {
  mode: PatrimonioMode;
  item: PatrimonioRecord | null;
  initialData: PatrimonioPageData;
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

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 border border-border bg-card p-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">{title}</h3>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`space-y-1 ${className}`.trim()}>
      <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string | ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export function PatrimonioFormPage({ mode, item, initialData }: PatrimonioFormPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [writeOffConfirmed, setWriteOffConfirmed] = useState(mode === "edit" && item?.status === "written_off");

  const form = useForm<PatrimonioFormValues>({
    defaultValues: getDefaultValues(item),
  });

  const secretariaId = useWatch({ control: form.control, name: "secretaria_id" });
  const equipamentoId = useWatch({ control: form.control, name: "equipamento_id" });
  const tecnologiaId = useWatch({ control: form.control, name: "tecnologia_id" });
  const condenado = useWatch({ control: form.control, name: "condenado" });
  const responsavel = useWatch({ control: form.control, name: "responsavel" });
  const status = useWatch({ control: form.control, name: "status" });
  const watchedPecasRetiradas = useWatch({ control: form.control, name: "pecas_retiradas" });
  const pecasRetiradas = useMemo(() => watchedPecasRetiradas ?? [], [watchedPecasRetiradas]);

  useEffect(() => {
    form.reset(getDefaultValues(item));
    setWriteOffConfirmed(mode === "edit" && item?.status === "written_off");
  }, [form, item, mode]);

  const selectedEquipment = useMemo(
    () => initialData.equipamentos.find((entry) => entry.id === equipamentoId) ?? null,
    [equipamentoId, initialData.equipamentos],
  );

  const selectedTecnologia = useMemo(
    () => initialData.tecnologias.find((entry) => entry.id === tecnologiaId) ?? null,
    [initialData.tecnologias, tecnologiaId],
  );

  const selectedSecretaria = useMemo(
    () => initialData.secretarias.find((entry) => entry.id === secretariaId) ?? null,
    [initialData.secretarias, secretariaId],
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

  const onSubmit = form.handleSubmit((values) => {
    if (values.status === "written_off" && !writeOffConfirmed) {
      toast.info("Confirme a baixa patrimonial antes de salvar.");
      return;
    }

    const payload: PatrimonioFormInput = {
      ...values,
      tecnologia_id: values.tecnologia_id.trim(),
      problema: values.problema.trim(),
      diagnostico: values.diagnostico.trim(),
      solucao: values.solucao.trim(),
      pecas_retiradas: values.condenado ? values.pecas_retiradas : [],
    };

    startTransition(async () => {
      try {
        const result =
          mode === "edit" && item ? await updatePatrimonioAction(item.id, payload) : await createPatrimonioAction(payload);

        toast.success(mode === "edit" ? "Patrimonio atualizado." : "Patrimonio cadastrado.");

        if (mode === "create") {
          router.replace(`/patrimonio/${result.id}`);
          router.refresh();
          return;
        }

        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Nao foi possivel salvar o patrimonio.";
        toast.error(message);
      }
    });
  });

  return (
    <div className="w-full space-y-4">
      <PageHeader
        title={mode === "create" ? "Novo patrimonio" : "Editar patrimonio"}
        actions={[{ label: "Voltar para a lista", href: "/patrimonio", variant: "secondary" }]}
      />

      <div className="space-y-4">
        <Card className="border-border">
          <CardContent className="space-y-4 p-4 xl:p-6">
            <form className="space-y-4" onSubmit={onSubmit}>
              <Section title="Dados gerais">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  

                  <Field label="Secretaria" className="xl:col-span-2">
                    <Select {...form.register("secretaria_id")}>
                      <option value="">Selecione</option>
                      {initialData.secretarias.map((secretaria) => (
                        <option key={secretaria.id} value={secretaria.id}>
                          {secretaria.codigo} - {secretaria.nome}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Patrimônio" className="xl:col-span-1">
                    <Input {...form.register("patrimonio")} placeholder="Ex.: 32123" />
                  </Field>

                  <Field label="Equipamento">
                    <Select {...form.register("equipamento_id")}>
                      <option value="">Selecione</option>
                      {initialData.equipamentos.map((equipamento) => (
                        <option key={equipamento.id} value={equipamento.id}>
                          {equipamento.nome}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Marca">
                    <Input {...form.register("marca")} placeholder="Ex.: Dell" />
                  </Field>

                  <Field label="Tecnologia" className="xl:col-span-1">
                    <Select {...form.register("tecnologia_id")}>
                      <option value="">Nao informado</option>
                      {initialData.tecnologias.map((tecnologia) => (
                        <option key={tecnologia.id} value={tecnologia.id}>
                          {tecnologia.nome}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Responsavel do equipamento" className="xl:col-span-2">
                    <Input {...form.register("responsavel")} placeholder="Nome do responsavel" />
                  </Field>

                  <Field label="Status">
                    <Select {...form.register("status")}>
                      {patrimonioStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
              </Section>

              <Section title="Informacoes tecnicas">
                <div className="grid gap-3 xl:grid-cols-2">
                  <Field label="Problema relatado">
                    <Textarea {...form.register("problema")} className="min-h-[140px]" />
                  </Field>

                  <Field label="Diagnostico tecnico">
                    <Textarea {...form.register("diagnostico")} className="min-h-[140px]" />
                  </Field>

                  <Field label="Solucao aplicada" className="xl:col-span-2">
                    <Textarea {...form.register("solucao")} className="min-h-[120px]" />
                  </Field>
                </div>
              </Section>

              <Section title="Baixa patrimonial">
                <div className="space-y-4">
                  <label className="flex items-start gap-3 rounded-none border border-border bg-muted/20 p-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={condenado}
                      onChange={(event) =>
                        form.setValue("condenado", event.target.checked, { shouldDirty: true })
                      }
                    />
                    <span>
                      <span className="block font-medium">Equipamento condenado</span>
                    </span>
                  </label>

                  {condenado ? (
                    <div className="space-y-3 border border-border p-3">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {availablePieces.length ? (
                          availablePieces.map((piece) => {
                            const isChecked = pecasRetiradas.includes(piece);
                            return (
                              <label
                                key={piece}
                                className="flex items-center gap-2 border border-border bg-background px-3 py-2 text-sm"
                              >
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
                          })
                        ) : (
                          <div className="md:col-span-2 xl:col-span-4 rounded-none border border-dashed border-border p-4 text-sm text-muted-foreground">
                            Selecione um equipamento para listar as pecas disponiveis.
                          </div>
                        )}
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={writeOffConfirmed}
                            onChange={(event) => setWriteOffConfirmed(event.target.checked)}
                          />
                          <span>Confirmo a baixa patrimonial deste equipamento</span>
                        </label>
                        <p className="text-xs text-muted-foreground md:text-right">
                          O registro sera mantido no banco e marcado como arquivado.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Section>

              <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-3">
                <Button type="button" variant="outline" onClick={() => router.push("/patrimonio")}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>


        {/* Resumo */}
        <Card className="border-border">
          <CardContent className="space-y-4 p-4 xl:p-6">
            <div className="space-y-1">
              <p className="text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">Resumo do equipamento</p>
            </div>

            <div className="space-y-3 border border-border bg-muted/20 p-3 text-sm">
              <Row label="Patrimonio" value={form.watch("patrimonio") || "Selecione"} />
              <Row
                label="Secretaria"
                value={selectedSecretaria ? `${selectedSecretaria.codigo} - ${selectedSecretaria.nome}` : "Selecione"}
              />
              <Row label="Equipamento" value={selectedEquipment?.nome ?? "Selecione"} />
              <Row label="Tecnologia" value={selectedTecnologia?.nome ?? "Nao informado"} />
              <Row label="Responsavel" value={responsavel || "Selecione"} />
              <Row label="Status" value={<PatrimonioStatusBadge value={status} />} />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Pecas selecionadas</p>
              <div className="flex flex-wrap gap-2">
                {pecasRetiradas.length ? (
                  pecasRetiradas.map((piece) => (
                    <span key={piece} className="border border-border bg-muted px-2 py-1 text-xs font-medium">
                      {piece}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">Nenhuma peca selecionada.</span>
                )}
              </div>
            </div>

            <div className="rounded-none border border-dashed border-border p-3 text-sm text-muted-foreground">
              O patrimonio deve ser informado exatamente como consta no equipamento.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
