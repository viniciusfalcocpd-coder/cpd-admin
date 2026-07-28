"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { StockCategory, StockFormInput, StockItem } from "@/types/cpd";

type EstoqueFormValues = {
  name: string;
  specification: string;
  type: string;
  categoryId: string;
  quantity: number;
};

type EstoqueFormProps = {
  open: boolean;
  mode: "create" | "edit";
  item: StockItem | null;
  categories: StockCategory[];
  types: string[];
  pending?: boolean;
  onSubmit: (item: StockFormInput) => void;
  onClose: () => void;
};

function getDefaultValues(item: StockItem | null): EstoqueFormValues {
  return {
    name: item?.name ?? "",
    specification: item?.specification ?? "",
    type: item?.type ?? "",
    categoryId: item?.categoryId ?? "",
    quantity: item?.quantity ?? 0,
  };
}

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`space-y-1 ${className}`.trim()}>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {children}
      {error ? <span className="block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

export function EstoqueForm({ open, mode, item, categories, types, pending, onSubmit, onClose }: EstoqueFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EstoqueFormValues>({
    defaultValues: getDefaultValues(item),
  });

  useEffect(() => {
    reset(getDefaultValues(item));
  }, [item, reset]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col border border-border bg-card shadow-lg">
        <div className="border-b border-border bg-muted px-4 py-3">
          <h2 className="text-base font-semibold">
            {mode === "create" ? "Novo item de estoque" : "Editar item de estoque"}
          </h2>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit((values) => {
            onSubmit({
              name: values.name.trim(),
              specification: values.specification.trim(),
              type: values.type.trim(),
              categoryId: values.categoryId,
              quantity: Number(values.quantity),
            });
          })}
        >
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Item" error={errors.name?.message}>
                <Input
                  {...register("name", {
                    required: "Informe o item.",
                    validate: (value) => value.trim().length > 0 || "Informe o item.",
                  })}
                />
              </Field>

              <Field label="Especificacao" error={errors.specification?.message}>
                <Input
                  {...register("specification", {
                    required: "Informe a especificacao.",
                    validate: (value) => value.trim().length > 0 || "Informe a especificacao.",
                  })}
                />
              </Field>

              <Field label="Tipo" error={errors.type?.message}>
                <Select
                  {...register("type", {
                    required: "Selecione o tipo.",
                  })}
                >
                  <option value="">Selecione</option>
                  {types.map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Categoria" error={errors.categoryId?.message}>
                <Select
                  {...register("categoryId", {
                    required: "Selecione a categoria.",
                  })}
                >
                  <option value="">Selecione</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Quantidade" error={errors.quantity?.message}>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  {...register("quantity", {
                    valueAsNumber: true,
                    required: "Informe a quantidade.",
                    validate: (value) =>
                      Number.isFinite(value) && value >= 0 ? true : "Informe uma quantidade valida.",
                  })}
                />
              </Field>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border bg-muted/30 px-4 py-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || pending}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
