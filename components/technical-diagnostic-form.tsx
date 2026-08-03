"use client";

import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import {
  CheckSquare,
  FileDown,
  Printer,
  Save,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const parts = [
  "Fonte",
  "HD",
  "SSD",
  "Memoria RAM",
  "Processador",
  "Placa-Mae",
  "Gabinete",
  "Cooler",
  "Fonte Notebook",
] as const;

const technicianOptions = ["Vinicius", "Tiago", "Larissa", "Fabricio", "Ronildo", "Renato", "Pedro", "Fernanda", "Marcos"];

const schema = z.object({
  patrimony: z.string().min(2, "Informe o patrimonio."),
  secretaria: z.string().min(2, "Informe a secretaria."),
  origin: z.string().min(2, "Informe a origem."),
  responsible: z.string().min(2, "Informe o responsavel."),
  technicians: z.array(z.string()).min(1, "Selecione pelo menos um tecnico."),
  date: z.string().min(1, "Informe a data."),
  brand: z.string().min(1, "Informe a marca."),
  model: z.string().min(1, "Informe o modelo."),
  cpu: z.string().min(1, "Informe o processador."),
  ram: z.string().min(1, "Informe a memoria."),
  storage: z.string().min(1, "Informe o armazenamento."),
  os: z.string().min(1, "Informe o sistema operacional."),
  issue: z.string().min(10, "Descreva o problema."),
  diagnosis: z.string().min(10, "Descreva o diagnostico."),
  procedures: z.string().min(10, "Descreva os procedimentos."),
  status: z.string().min(1, "Selecione o status."),
  notes: z.string().optional(),
});

type DiagnosticFormValues = z.infer<typeof schema>;

const defaultValues: DiagnosticFormValues = {
  patrimony: "",
  secretaria: "",
  origin: "",
  responsible: "",
  technicians: ["Vinicius"],
  date: format(new Date(), "yyyy-MM-dd"),
  brand: "",
  model: "",
  cpu: "",
  ram: "",
  storage: "",
  os: "",
  issue: "",
  diagnosis: "",
  procedures: "",
  status: "Equipamento Reparado",
  notes: "",
};

export function TechnicalDiagnosticForm() {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  const form = useForm<DiagnosticFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const watched = form.watch();

  const title = useMemo(() => {
    const patrimony = watched.patrimony || "Novo laudo";
    return `Laudo ${patrimony}`.trim();
  }, [watched.patrimony]);

  async function generatePdf(values: DiagnosticFormValues) {
    const pdf = new jsPDF("p", "mm", "a4");
    const logoPath = "/brand/logo.png";
    const logo = new Image();
    logo.src = logoPath;

    try {
      await new Promise<void>((resolve) => {
        logo.onload = () => resolve();
        logo.onerror = () => resolve();
      });
    } catch {
      // Continue without logo.
    }

    if (logo.complete && logo.naturalWidth > 0) {
      pdf.addImage(logo, "PNG", 12, 10, 30, 18);
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(17);
    pdf.text("RELATORIO DE DIAGNOSTICO TECNICO", 105, 18, { align: "center" });
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text("Centro de Processamento de Dados - CPD", 105, 25, { align: "center" });
    pdf.line(10, 32, 200, 32);

    let y = 40;
    const numero = `LAU-${Math.floor(Math.random() * 90000) + 10000}`;

    const line = (text: string) => {
      pdf.text(text, 15, y);
      y += 7;
    };

    const paragraph = (label: string, value: string) => {
      pdf.setFont("helvetica", "bold");
      line(label);
      pdf.setFont("helvetica", "normal");
      const lines = pdf.splitTextToSize(value || "-", 180) as string[];
      pdf.text(lines, 15, y);
      y += lines.length * 6 + 4;
    };

    pdf.setFont("helvetica", "bold");
    line("IDENTIFICACAO");
    pdf.setFont("helvetica", "normal");
    line(`Laudo Numero: ${numero}`);
    line(`Data: ${format(new Date(`${values.date}T00:00:00`), "dd/MM/yyyy")}`);
    line(`Patrimonio: ${values.patrimony}`);
    line(`Secretaria: ${values.secretaria}`);
    line(`Origem da demanda: ${values.origin}`);
    line(`Responsavel pelo equipamento: ${values.responsible}`);
    line(`Tecnicos responsaveis: ${values.technicians.join(", ")}`);
    y += 3;

    pdf.setFont("helvetica", "bold");
    line("CONFIGURACAO DO COMPUTADOR");
    pdf.setFont("helvetica", "normal");
    line(`Marca: ${values.brand}`);
    line(`Modelo: ${values.model}`);
    line(`Processador: ${values.cpu}`);
    line(`Memoria RAM: ${values.ram}`);
    line(`Armazenamento: ${values.storage}`);
    line(`Sistema Operacional: ${values.os}`);
    y += 3;

    paragraph("PROBLEMA RELATADO", values.issue);
    paragraph("DIAGNOSTICO TECNICO", values.diagnosis);
    paragraph("PROCEDIMENTOS REALIZADOS", values.procedures);
    paragraph(
      "COMPONENTES REUTILIZAVEIS",
      selectedParts.length ? selectedParts.join(", ") : "Nenhum componente reutilizavel.",
    );
    paragraph("STATUS DO EQUIPAMENTO", values.status);
    paragraph("OBSERVACOES", values.notes || "");

    pdf.setDrawColor(180);
    pdf.line(10, 285, 200, 285);
    pdf.setFontSize(9);
    pdf.text("Documento gerado automaticamente pelo sistema CPD Manager.", 105, 290, {
      align: "center",
    });
    pdf.save(`${numero}.pdf`);
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await generatePdf(values);
      toast.success("PDF gerado com sucesso.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nao foi possivel gerar o PDF.");
    }
  });

  return (
    <div className="grid w-full gap-4 2xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.72fr)]">
      <Card className="border-border">
        <CardContent className="space-y-6 p-5 sm:p-6">
          <div className="flex items-start gap-3 border border-border bg-muted/30 p-3">
            <div className="border border-border bg-muted p-2 text-foreground">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Formulario de laudo</h2>
              <p className="text-sm text-muted-foreground">
                Baseado no prototipo atual, agora integrado a estrutura do CPD Manager.
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <Section title="Identificacao" icon={ShieldAlert}>
              <Grid>
                <Field label="Numero patrimonio" error={form.formState.errors.patrimony?.message}>
                  <Input {...form.register("patrimony")} />
                </Field>
                <Field label="Numero secretaria" error={form.formState.errors.secretaria?.message}>
                  <Input {...form.register("secretaria")} />
                </Field>
                <Field label="Origem da demanda" error={form.formState.errors.origin?.message}>
                  <Input {...form.register("origin")} />
                </Field>
                <Field label="Responsavel pelo equipamento" error={form.formState.errors.responsible?.message}>
                  <Input {...form.register("responsible")} />
                </Field>
                <Field label="Tecnicos responsaveis" error={form.formState.errors.technicians?.message}>
                  <div className="grid grid-cols-2 gap-2 border border-border bg-background p-2 md:grid-cols-3">
                    {technicianOptions.map((person) => {
                      const checked = form.watch("technicians").includes(person);

                      return (
                        <label key={person} className="flex items-center gap-2 border border-border bg-muted/30 px-2 py-1.5 text-sm">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(event) => {
                              const current = form.getValues("technicians");
                              form.setValue(
                                "technicians",
                                event.target.checked
                                  ? [...current, person]
                                  : current.filter((technician) => technician !== person),
                                { shouldValidate: true, shouldDirty: true },
                              );
                            }}
                          />
                          {person}
                        </label>
                      );
                    })}
                  </div>
                </Field>
                <Field label="Data" error={form.formState.errors.date?.message}>
                  <Input type="date" {...form.register("date")} />
                </Field>
              </Grid>
            </Section>

            <Section title="Configuracao do computador" icon={Printer}>
              <Grid>
                <Field label="Marca" error={form.formState.errors.brand?.message}>
                  <Input {...form.register("brand")} />
                </Field>
                <Field label="Modelo" error={form.formState.errors.model?.message}>
                  <Input {...form.register("model")} />
                </Field>
                <Field label="Processador" error={form.formState.errors.cpu?.message}>
                  <Input {...form.register("cpu")} />
                </Field>
                <Field label="Memoria RAM" error={form.formState.errors.ram?.message}>
                  <Input {...form.register("ram")} />
                </Field>
                <Field label="HD / SSD" error={form.formState.errors.storage?.message}>
                  <Input {...form.register("storage")} />
                </Field>
                <Field label="Sistema operacional" error={form.formState.errors.os?.message}>
                  <Input {...form.register("os")} />
                </Field>
              </Grid>
            </Section>

            <Section title="Diagnostico" icon={CheckSquare}>
              <div className="grid gap-4 xl:grid-cols-2">
                <Field label="Problema relatado" error={form.formState.errors.issue?.message}>
                  <Textarea {...form.register("issue")} />
                </Field>
                <Field label="Diagnostico tecnico" error={form.formState.errors.diagnosis?.message}>
                  <Textarea {...form.register("diagnosis")} />
                </Field>
                <Field className="xl:col-span-2" label="Procedimentos realizados" error={form.formState.errors.procedures?.message}>
                  <Textarea {...form.register("procedures")} />
                </Field>
              </div>
            </Section>

            <Section title="Componentes reutilizaveis" icon={Save}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {parts.map((part) => {
                  const active = selectedParts.includes(part);

                  return (
                    <button
                      key={part}
                      type="button"
                      className={cn(
                        "flex items-center gap-2 border px-3 py-2 text-left text-sm transition-colors",
                        active
                          ? "border-primary bg-muted text-foreground"
                          : "border-border bg-background hover:bg-muted",
                      )}
                      onClick={() =>
                        setSelectedParts((current) =>
                          current.includes(part)
                            ? current.filter((item) => item !== part)
                            : [...current, part],
                        )
                      }
                    >
                      <span
                        className={cn(
                          "inline-flex h-5 w-5 items-center justify-center border",
                          active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                        )}
                      >
                        <CheckSquare className="h-3 w-3" />
                      </span>
                      {part}
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section title="Status e observacoes" icon={FileDown}>
              <Grid>
                <Field label="Status do equipamento" error={form.formState.errors.status?.message}>
                  <Select {...form.register("status")}>
                    <option>Equipamento Reparado</option>
                    <option>Aguardando Pecas</option>
                    <option>Em Manutencao</option>
                    <option>Equipamento Condenado</option>
                    <option>Solicitar Baixa Patrimonial</option>
                  </Select>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Observacoes" error={form.formState.errors.notes?.message}>
                    <Textarea {...form.register("notes")} />
                  </Field>
                </div>
              </Grid>
            </Section>

            <div className="flex flex-wrap gap-3">
              <Button type="submit">
                Gerar PDF
                <FileDown className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" onClick={() => toast.info("Funcionalidade de salvamento sera integrada na proxima iteracao.")}>
                Salvar rascunho
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Previa</p>
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>

          <div className="space-y-3 border border-border bg-muted/30 p-3 text-sm">
            <Row label="Patrimonio" value={watched.patrimony || "-"} />
            <Row label="Secretaria" value={watched.secretaria || "-"} />
            <Row label="Tecnicos" value={watched.technicians?.join(", ") || "-"} />
            <Row label="Data" value={watched.date || "-"} />
            <Row label="Equipamento" value={[watched.brand, watched.model].filter(Boolean).join(" ") || "-"} />
            <Row label="Status" value={watched.status || "-"} />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Itens selecionados</p>
            <div className="flex flex-wrap gap-2">
              {selectedParts.length ? (
                selectedParts.map((part) => (
                  <span key={part} className="border border-border bg-muted px-2 py-1 text-xs font-medium">
                    {part}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">Nenhum item selecionado.</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("space-y-2 block", className)}>
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
