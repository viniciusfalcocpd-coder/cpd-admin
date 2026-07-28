import { Input } from "@/components/ui/input";
import { Tabs, TabButton } from "@/components/ui/tabs";
import type { PatrimonioTab } from "@/types/patrimonio";

type PatrimonioFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  activeTab: PatrimonioTab;
  onTabChange: (value: PatrimonioTab) => void;
  totalItems: number;
  visibleItems: number;
};

export function PatrimonioFilters({
  query,
  onQueryChange,
  activeTab,
  onTabChange,
  totalItems,
  visibleItems,
}: PatrimonioFiltersProps) {
  return (
    <div className="flex flex-col gap-3 border border-border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
        <div className="w-full max-w-md">
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Pesquisar patrimonio, responsavel, secretaria, equipamento ou marca..."
          />
        </div>

        <Tabs>
          <TabButton active={activeTab === "ativos"} onClick={() => onTabChange("ativos")}>
            Ativos
          </TabButton>
          <TabButton active={activeTab === "arquivados"} onClick={() => onTabChange("arquivados")}>
            Arquivados
          </TabButton>
        </Tabs>
      </div>

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <span>{visibleItems} visiveis</span>
        <span>{totalItems} no total</span>
      </div>
    </div>
  );
}

