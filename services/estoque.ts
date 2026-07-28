import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StockCategory, StockFormInput, StockItem, StockPageData } from "@/types/cpd";

type StockCategoryRow = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

type StockItemRow = {
  id: string;
  name: string;
  specification: string;
  type: string;
  category_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

type StockItemPayload = {
  name: string;
  specification: string;
  type: string;
  category_id: string;
  quantity: number;
};

function mapStockCategoryRow(row: StockCategoryRow): StockCategory {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
  };
}

function mapStockItemRow(row: StockItemRow): StockItem {
  return {
    id: row.id,
    name: row.name,
    specification: row.specification,
    type: row.type,
    categoryId: row.category_id,
    quantity: row.quantity,
  };
}

function mapInputToPayload(input: StockFormInput): StockItemPayload {
  return {
    name: input.name.trim(),
    specification: input.specification.trim(),
    type: input.type.trim(),
    category_id: input.categoryId,
    quantity: input.quantity,
  };
}

async function getClient() {
  return createSupabaseServerClient();
}

async function fetchStockCategories(): Promise<StockCategory[]> {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("stock_categories")
    .select("id, name, description, created_at, updated_at")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Falha ao carregar categorias do estoque: ${error.message}`);
  }

  return ((data ?? []) as StockCategoryRow[]).map(mapStockCategoryRow);
}

async function fetchStockItems(): Promise<StockItem[]> {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("stock_items")
    .select("id, name, specification, type, category_id, quantity, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Falha ao carregar itens do estoque: ${error.message}`);
  }

  return ((data ?? []) as StockItemRow[]).map(mapStockItemRow);
}

export async function getStockPageData(): Promise<StockPageData> {
  const [categories, items] = await Promise.all([fetchStockCategories(), fetchStockItems()]);

  return {
    categories,
    items,
  };
}

export async function createStockItemRecord(input: StockFormInput): Promise<StockItem> {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("stock_items")
    .insert(mapInputToPayload(input))
    .select("id, name, specification, type, category_id, quantity, created_at, updated_at")
    .single();

  if (error || !data) {
    throw new Error(`Falha ao criar item do estoque: ${error?.message ?? "registro nao retornado"}`);
  }

  return mapStockItemRow(data as StockItemRow);
}

export async function updateStockItemRecord(id: string, input: StockFormInput): Promise<StockItem> {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("stock_items")
    .update(mapInputToPayload(input))
    .eq("id", id)
    .select("id, name, specification, type, category_id, quantity, created_at, updated_at")
    .single();

  if (error || !data) {
    throw new Error(`Falha ao atualizar item do estoque: ${error?.message ?? "registro nao retornado"}`);
  }

  return mapStockItemRow(data as StockItemRow);
}

export async function deleteStockItemRecord(id: string) {
  const supabase = await getClient();
  const { error } = await supabase.from("stock_items").delete().eq("id", id);

  if (error) {
    throw new Error(`Falha ao excluir item do estoque: ${error.message}`);
  }
}
