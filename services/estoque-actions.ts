"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createStockItemRecord,
  deleteStockItemRecord,
  updateStockItemRecord,
} from "@/services/estoque";

const stockItemFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o item."),
  specification: z.string().trim().min(1, "Informe a especificacao."),
  type: z.string().trim().min(1, "Selecione o tipo."),
  categoryId: z.string().trim().min(1, "Selecione a categoria."),
  quantity: z.number().int("Informe uma quantidade inteira.").min(0, "Informe uma quantidade valida."),
});

export async function createStockItemAction(values: unknown) {
  const parsed = stockItemFormSchema.parse(values);
  const result = await createStockItemRecord(parsed);
  revalidatePath("/estoque");
  revalidatePath("/dashboard");
  return result;
}

export async function updateStockItemAction(id: string, values: unknown) {
  const parsed = stockItemFormSchema.parse(values);
  const result = await updateStockItemRecord(id, parsed);
  revalidatePath("/estoque");
  revalidatePath("/dashboard");
  return result;
}

export async function deleteStockItemAction(id: string) {
  await deleteStockItemRecord(id);
  revalidatePath("/estoque");
  revalidatePath("/dashboard");
}
