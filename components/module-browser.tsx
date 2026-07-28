"use client";

import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Toolbar } from "@/components/toolbar";
import { ViewToggle } from "@/components/view-toggle";
import { Tabs, TabButton } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { usePersistedState } from "@/hooks/use-persisted-state";

type ModuleTab<T> = {
  value: string;
  label: string;
  filter: (item: T) => boolean;
};

type ModuleBrowserProps<T> = {
  title: string;
  description?: string;
  storageKey: string;
  items: T[];
  getKey: (item: T) => string;
  columns: (tab: string) => ColumnDef<T, unknown>[];
  renderCard: (item: T, tab: string) => ReactNode;
  searchText: (item: T, tab: string) => string;
  tabs?: ModuleTab<T>[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  toolbarContent?: ReactNode;
  selectedKey?: string | null;
  onSelect?: (item: T) => void;
  onNew?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
  onFilter?: () => void;
  onRowDoubleClick?: (item: T) => void;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  showTableSelection?: boolean;
};

export function ModuleBrowser<T>({
  title,
  description,
  storageKey,
  items,
  getKey,
  columns,
  renderCard,
  searchText,
  tabs,
  searchPlaceholder,
  emptyMessage,
  toolbarContent,
  selectedKey,
  onSelect,
  onNew,
  onEdit,
  onDelete,
  onRefresh,
  onFilter,
  onRowDoubleClick,
  showEditAction,
  showDeleteAction,
  showTableSelection,
}: ModuleBrowserProps<T>) {
  const [viewMode, setViewMode] = usePersistedState<"list" | "cards">(
    `${storageKey}:view`,
    "list",
  );
  const [query, setQuery] = usePersistedState(`${storageKey}:query`, "");
  const [activeTab, setActiveTab] = usePersistedState(
    `${storageKey}:tab`,
    tabs?.[0]?.value ?? "all",
  );

  const visibleItems = tabs
    ? items.filter((item) => {
        const tab = tabs.find((entry) => entry.value === activeTab) ?? tabs[0];
        return tab ? tab.filter(item) : true;
      })
    : items;

  const filteredItems = visibleItems.filter((item) =>
    searchText(item, activeTab).toLowerCase().includes(query.toLowerCase()),
  );

  const currentTab = tabs?.find((entry) => entry.value === activeTab) ?? tabs?.[0];

  return (
    <div className="space-y-3">
      <PageHeader title={title} description={description} />

      <Toolbar
        query={query}
        onQueryChange={setQuery}
        onNew={onNew ?? (() => toast.info("Novo registro sera disponibilizado nesta fase."))}
        onEdit={onEdit ?? (() => toast.info("Selecione uma linha para editar."))}
        onDelete={onDelete ?? (() => toast.info("Selecione uma linha para excluir."))}
        onRefresh={onRefresh ?? (() => toast.success("Lista atualizada."))}
        onFilter={onFilter ?? (() => toast.info("Filtro rapido em construcao."))}
        showEdit={showEditAction}
        showDelete={showDeleteAction}
      />

      {toolbarContent ? <div>{toolbarContent}</div> : null}

      <div className="flex flex-col gap-2 border-b border-border pb-2 lg:flex-row lg:items-center lg:justify-between">
        {tabs?.length ? (
          <Tabs>
            {tabs.map((tab) => (
              <TabButton key={tab.value} active={activeTab === tab.value} onClick={() => setActiveTab(tab.value)}>
                {tab.label}
              </TabButton>
            ))}
          </Tabs>
        ) : (
          <div />
        )}

        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "list" ? (
        <DataTable
          columns={columns(currentTab?.value ?? "all")}
          data={filteredItems}
          getRowKey={getKey}
          selectedRowKey={selectedKey}
          onRowClick={onSelect}
          globalFilter=""
          onGlobalFilterChange={setQuery}
          showSearch={false}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          onRowDoubleClick={onRowDoubleClick}
          showSelection={showTableSelection}
        />
      ) : (
        <Card className="border-border">
          <CardContent className="p-3">
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <button
                  key={getKey(item)}
                  type="button"
                  className={`block w-full appearance-none border border-border p-3 text-left transition-colors hover:bg-muted/50 ${
                    selectedKey === getKey(item)
                      ? "border-primary bg-primary/10 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.35)]"
                      : "bg-background"
                  }`}
                  onClick={() => onSelect?.(item)}
                  onDoubleClick={() => onRowDoubleClick?.(item)}
                >
                  {renderCard(item, currentTab?.value ?? "all")}
                </button>
              ))}
            </div>

            {!filteredItems.length ? (
              <div className="border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
