import { Input } from "@/components/ui/input";
import { Tabs, TabButton } from "@/components/ui/tabs";
import type { PatrimonioAgenteFilter, PatrimonioOperacionalFilter, PatrimonioTab } from "@/types/patrimonio";
import { patrimonioSituacaoOperacionalOptions } from "@/types/patrimonio";
import { Select } from "@/components/ui/select";

type PatrimonioFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  activeTab: PatrimonioTab;
  onTabChange: (value: PatrimonioTab) => void;
  totalItems: number;
  visibleItems: number;
  operationalFilter: PatrimonioOperacionalFilter;
  onOperationalFilterChange: (value: PatrimonioOperacionalFilter) => void;
  agentFilter: PatrimonioAgenteFilter;
  onAgentFilterChange: (value: PatrimonioAgenteFilter) => void;
};

export function PatrimonioFilters({
  query,
  onQueryChange,
  activeTab,
  onTabChange,
  totalItems,
  visibleItems,
  operationalFilter,
  onOperationalFilterChange,
  agentFilter,
  onAgentFilterChange,
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

        <Select value={operationalFilter} onChange={(event) => onOperationalFilterChange(event.target.value as PatrimonioOperacionalFilter)} className="w-full lg:w-44">
          <option value="all">Todas situacoes</option>
          {patrimonioSituacaoOperacionalOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>

        <Select value={agentFilter} onChange={(event) => onAgentFilterChange(event.target.value as PatrimonioAgenteFilter)} className="w-full lg:w-40">
          <option value="all">Todos os agentes</option>
          <option value="com_inventario">Com inventario</option>
          <option value="sem_inventario">Sem inventario</option>
          <option value="desatualizado">Desatualizado</option>
        </Select>
      </div>

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <span>{visibleItems} visiveis</span>
        <span>{totalItems} no total</span>
      </div>
    </div>
  );
}
