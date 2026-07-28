"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PatrimonioFilters } from "@/components/modules/patrimonio/PatrimonioFilters";
import { PatrimonioTable } from "@/components/modules/patrimonio/PatrimonioTable";
import { usePatrimonio } from "@/hooks/use-patrimonio";
import { PatrimonioPreview } from "@/components/modules/patrimonio/PatrimonioPreview";
import type { PatrimonioPageData, PatrimonioRecord } from "@/types/patrimonio";

type PatrimonioModuleProps = {
  initialData: PatrimonioPageData;
};

function getStatusLabel(count: number) {
  return count === 1 ? "registro" : "registros";
}

export function PatrimonioModule({ initialData }: PatrimonioModuleProps) {
  const {
    items,
    filteredItems,
    query,
    setQuery,
    activeTab,
    setActiveTab,
    selectedItem,
    selectedId,
    setSelectedId,
    isPending,
    openCreate,
    openEdit,
    requestSelectedEdit,
    requestSelectedArchive,
    refresh,
  } = usePatrimonio(initialData);

  const activeCount = useMemo(() => items.filter((item) => !item.arquivado).length, [items]);
  const archivedCount = useMemo(() => items.filter((item) => item.arquivado).length, [items]);

  function handleRowSelect(item: PatrimonioRecord) {
    setSelectedId(item.id);
  }

  return (
    <div className="space-y-3">
      <PageHeader
        title="Patrimônio"
      />

      <div className="flex flex-col gap-2 border border-border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Patrimonio</p>
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} {getStatusLabel(filteredItems.length)} visiveis
          </p>
          <p className="text-xs text-muted-foreground">
            {activeCount} ativos e {archivedCount} arquivados
          </p>
        </div>
      </div>

      {selectedItem ? (
  <PatrimonioPreview
  item={selectedItem}
  equipamentos={initialData.equipamentos}
  tecnologias={initialData.tecnologias}
  secretarias={initialData.secretarias}
  onEdit={() => openEdit(selectedItem)}
  onArchive={requestSelectedArchive}
  onClose={() => setSelectedId(null)}
/>
) : null}

      <PatrimonioFilters
        query={query}
        onQueryChange={setQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalItems={items.length}
        visibleItems={filteredItems.length}
      />

      <PatrimonioTable
        items={filteredItems}
        secretarias={initialData.secretarias}
        equipamentos={initialData.equipamentos}
        tecnologias={initialData.tecnologias}
        selectedId={selectedId}
        onSelect={handleRowSelect}
        onOpen={openEdit}
      />
    </div>
  );
}
