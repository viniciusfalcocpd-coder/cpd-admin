"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ModuleBrowser } from "@/components/module-browser";
import type { StockFormInput, StockItem, StockPageData } from "@/types/cpd";
import { EstoqueFilters, type EstoqueStatusFilter } from "@/components/modules/estoque/EstoqueFilters";
import { EstoqueForm } from "@/components/modules/estoque/EstoqueForm";
import { EstoquePreview } from "@/components/modules/estoque/EstoquePreview";
import { EstoqueStatusBadge, getStockStatus } from "@/components/modules/estoque/EstoqueStatusBadge";
import {
  createStockItemAction,
  deleteStockItemAction,
  updateStockItemAction,
} from "@/services/estoque-actions";

const defaultTypes = ["Armazenamento", "Energia", "Perifericos", "Rede", "Componentes", "Outros"];

type EstoqueModuleProps = {
  initialData: StockPageData;
};

function getCategoryName(data: StockPageData, categoryId: string) {
  return data.categories.find((category) => category.id === categoryId)?.name ?? "Sem categoria";
}

function createColumns(data: StockPageData): ColumnDef<StockItem, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "Item",
    },
    {
      accessorKey: "specification",
      header: "Especificacao",
    },
    {
      accessorKey: "type",
      header: "Tipo",
    },
    {
      id: "category",
      header: "Categoria",
      cell: ({ row }) => getCategoryName(data, row.original.categoryId),
    },
    {
      accessorKey: "quantity",
      header: "Quantidade",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <EstoqueStatusBadge quantity={row.original.quantity} />,
    },
  ];
}

function getSearchText(data: StockPageData, item: StockItem) {
  const status = getStockStatus(item.quantity);

  return [
    item.name,
    item.specification,
    item.type,
    getCategoryName(data, item.categoryId),
    String(item.quantity),
    status.label,
  ]
    .filter(Boolean)
    .join(" ");
}

export function EstoqueModule({ initialData }: EstoqueModuleProps) {
  const router = useRouter();
  const [items, setItems] = useState<StockItem[]>(initialData.items);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formItem, setFormItem] = useState<StockItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [filtersHighlighted, setFiltersHighlighted] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<EstoqueStatusFilter>("all");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setItems(initialData.items);
  }, [initialData.items]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const typeOptions = useMemo(
    () => Array.from(new Set([...defaultTypes, ...items.map((item) => item.type)])).filter(Boolean),
    [items],
  );

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const status = getStockStatus(item.quantity);
        const categoryMatch = categoryFilter === "all" || item.categoryId === categoryFilter;
        const typeMatch = typeFilter === "all" || item.type === typeFilter;
        const statusMatch = statusFilter === "all" || status.value === statusFilter;

        return categoryMatch && typeMatch && statusMatch;
      }),
    [categoryFilter, items, statusFilter, typeFilter],
  );

  function selectItem(item: StockItem) {
    setSelectedId(item.id);
    setPreviewOpen(true);
  }

  function openCreate() {
    setFormMode("create");
    setFormItem(null);
    setFormOpen(true);
  }

  function openEdit(item: StockItem) {
    setFormMode("edit");
    setFormItem(item);
    setFormOpen(true);
  }

  function requestDelete() {
    if (!selectedItem) {
      toast.info("Selecione um item para excluir.");
      return;
    }

    setDeleteOpen(true);
  }

  function confirmDelete() {
    if (!selectedItem) {
      setDeleteOpen(false);
      return;
    }

    startTransition(async () => {
      try {
        await deleteStockItemAction(selectedItem.id);
        setItems((current) => current.filter((item) => item.id !== selectedItem.id));
        setSelectedId(null);
        setPreviewOpen(false);
        setDeleteOpen(false);
        toast.success("Item removido do estoque.");
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Nao foi possivel excluir o item.";
        toast.error(message);
      }
    });
  }

  function handleFormSubmit(input: StockFormInput) {
    startTransition(async () => {
      try {
        const result =
          formMode === "edit" && formItem
            ? await updateStockItemAction(formItem.id, input)
            : await createStockItemAction(input);

        if (formMode === "create") {
          setItems((current) => [result, ...current]);
          toast.success("Item cadastrado.");
        } else {
          setItems((current) => current.map((entry) => (entry.id === result.id ? result : entry)));
          toast.success("Item atualizado.");
        }

        setSelectedId(result.id);
        setPreviewOpen(true);
        setFormOpen(false);
        setFormItem(null);
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Nao foi possivel salvar o item.";
        toast.error(message);
      }
    });
  }

  function highlightFilters() {
    setFiltersHighlighted((current) => !current);
  }

  return (
    <>
      {selectedItem && previewOpen ? (
        <EstoquePreview
          item={selectedItem}
          categories={initialData.categories}
          onEdit={() => openEdit(selectedItem)}
          onDelete={requestDelete}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}

      <ModuleBrowser
        title="Estoque"
        description="Controle simples com entrada, saida e ajuste."
        storageKey="cpd:estoque"
        items={filteredItems}
        getKey={(item) => item.id}
        selectedKey={selectedId}
        onSelect={selectItem}
        columns={() => createColumns(initialData)}
        searchPlaceholder="Pesquisar item, especificacao, tipo ou categoria..."
        emptyMessage="Nenhum item de estoque encontrado."
        searchText={(item) => getSearchText(initialData, item)}
        toolbarContent={
          <EstoqueFilters
            categories={initialData.categories}
            types={typeOptions}
            categoryId={categoryFilter}
            type={typeFilter}
            status={statusFilter}
            highlighted={filtersHighlighted}
            onCategoryChange={setCategoryFilter}
            onTypeChange={setTypeFilter}
            onStatusChange={setStatusFilter}
          />
        }
        onNew={openCreate}
        onRefresh={() => {
          router.refresh();
          toast.success("Estoque atualizado.");
        }}
        onFilter={highlightFilters}
        onRowDoubleClick={openEdit}
        showEditAction={false}
        showDeleteAction={false}
        showTableSelection={false}
        renderCard={(item) => (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.specification}</p>
              </div>

              <EstoqueStatusBadge quantity={item.quantity} />
            </div>

            <div className="grid gap-1 text-sm">
              <p>
                <span className="text-muted-foreground">Tipo:</span> {item.type}
              </p>
              <p>
                <span className="text-muted-foreground">Categoria:</span> {getCategoryName(initialData, item.categoryId)}
              </p>
              <p>
                <span className="text-muted-foreground">Quantidade:</span> {item.quantity}
              </p>
            </div>
          </div>
        )}
      />

      <EstoqueForm
        open={formOpen}
        mode={formMode}
        item={formItem}
        categories={initialData.categories}
        types={typeOptions}
        pending={isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Excluir item do estoque"
        description="Confirma a exclusao deste item do estoque?"
        confirmLabel="Excluir"
        onConfirm={confirmDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
