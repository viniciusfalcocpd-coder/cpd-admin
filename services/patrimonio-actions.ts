"use server";

import { revalidatePath } from "next/cache";
import {
  archivePatrimonioRecord,
  createPatrimonioRecord,
  updatePatrimonioRecord,
} from "@/services/patrimonio";
import { patrimonioFormSchema } from "@/types/patrimonio";

export async function createPatrimonioAction(values: unknown) {
  const parsed = patrimonioFormSchema.parse(values);
  const result = await createPatrimonioRecord(parsed);
  revalidatePath("/patrimonio");
  return result;
}

export async function updatePatrimonioAction(id: string, values: unknown) {
  const parsed = patrimonioFormSchema.parse(values);
  const result = await updatePatrimonioRecord(id, parsed);
  revalidatePath("/patrimonio");
  return result;
}

export async function archivePatrimonioAction(id: string) {
  const result = await archivePatrimonioRecord(id);
  revalidatePath("/patrimonio");
  return result;
}

