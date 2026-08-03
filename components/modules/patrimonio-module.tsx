"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Building2, ClipboardPlus, Edit3, List, RefreshCcw, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContextTabs } from "@/components/context-tabs";
import { DialogShell } from "@/components/dialog-shell";
import { ModuleCommandBar } from "@/components/module-command-bar";
import { StatusBar } from "@/components/status-bar";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { PatrimonioFilters } from "@/components/modules/patrimonio/PatrimonioFilters";
import { PatrimonioTable } from "@/components/modules/patrimonio/PatrimonioTable";
import { PatrimonioDetails } from "@/components/modules/patrimonio/PatrimonioDetails";
import { PatrimonioAgentBadge } from "@/components/modules/patrimonio/PatrimonioAgentBadge";
import { usePatrimonio } from "@/hooks/use-patrimonio";
import { listDemands } from "@/services/demandas";
import type { PatrimonioPageData, PatrimonioRecord } from "@/types/patrimonio";
import { getInventarioAgenteStatus } from "@/types/inventario";
import { getStatusMetadata } from "@/lib/status-metadata";

const tabs = [
  { value: "equipamentos", label: "Equipamentos" },
  { value: "manutencoes", label: "Demandas / Manutenções" },
  { value: "inventario", label: "Inventário / Agente" },
  { value: "historico", label: "Histórico" },
];

function lookupName(items: Array<{ id: string; nome: string }>, id: string | null) {
  return id ? items.find((item) => item.id === id)?.nome ?? "Não informado" : "Não informado";
}

export function PatrimonioModule({ initialData }: { initialData: PatrimonioPageData }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [section, setSection] = useState(params.get("tab") ?? "equipamentos");
  const [view, setView] = usePersistedState<"list" | "secretarias">("cpd:patrimonio:view", "list");
  const [secretariaFilter, setSecretariaFilter] = useState("all");
  const [selected, setSelected] = useState<PatrimonioRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const state = usePatrimonio(initialData);
  const demands = listDemands();

  const filteredItems = useMemo(
    () => state.filteredItems.filter((item) => secretariaFilter === "all" || item.secretaria_id === secretariaFilter),
    [secretariaFilter, state.filteredItems],
  );
  const filteredDemands = useMemo(
    () => (selected ? demands.filter((item) => item.patrimony === selected.patrimonio) : demands),
    [demands, selected],
  );
  const secretaryName = (id: string) => {
    const secretary = initialData.secretarias.find((item) => item.id === id);
    return secretary ? `${secretary.codigo} - ${secretary.nome}` : "Não informado";
  };

  function select(item: PatrimonioRecord) {
    setSelected(item);
    state.setSelectedId(item.id);
    setDetailOpen(true);
  }

  function changeSection(value: string) {
    setSection(value);
    router.replace(`${pathname}?tab=${value}`, { scroll: false });
  }

  function editSelected() {
    if (!selected) return;
    setDetailOpen(false);
    state.openEdit(selected);
  }

  function archiveSelected() {
    if (selected) state.requestSelectedArchive();
  }

  function openMaintenance() {
    setDetailOpen(false);
    changeSection("manutencoes");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div>
        <h1 className="text-xl font-semibold">Patrimônio</h1>
        <p className="text-xs text-muted-foreground">Equipamentos, manutenção e inventário em um único fluxo</p>
      </div>

      <ContextTabs tabs={tabs} value={section} onChange={changeSection} />

      {secretariaFilter !== "all" ? (
        <div className="flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
          <strong>Secretaria filtrada:</strong> {secretaryName(secretariaFilter)}
          <button type="button" className="ml-auto underline" onClick={() => setSecretariaFilter("all")}>Limpar</button>
        </div>
      ) : null}

      <ModuleCommandBar actions={[
        { label: "Novo patrimônio", icon: ClipboardPlus, variant: "primary", onClick: state.openCreate },
        { label: "Atualizar", icon: RefreshCcw, onClick: state.refresh },
        { label: "Lista", icon: List, variant: view === "list" ? "primary" : "default", onClick: () => setView("list") },
        { label: "Secretarias", icon: Building2, variant: view === "secretarias" ? "primary" : "default", onClick: () => setView("secretarias") },
      ]} />

      {section === "equipamentos" ? (
        <>
          <PatrimonioFilters
            query={state.query}
            onQueryChange={state.setQuery}
            activeTab={state.activeTab}
            onTabChange={state.setActiveTab}
            totalItems={state.items.length}
            visibleItems={filteredItems.length}
            operationalFilter={state.operationalFilter}
            onOperationalFilterChange={state.setOperationalFilter}
            agentFilter={state.agentFilter}
            onAgentFilterChange={state.setAgentFilter}
          />
          {view === "list" ? (
            <PatrimonioTable
              items={filteredItems}
              secretarias={initialData.secretarias}
              equipamentos={initialData.equipamentos}
              selectedId={state.selectedId}
              onSelect={select}
              onOpen={select}
            />
          ) : (
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {initialData.secretarias
                .map((secretaria) => ({ secretary: secretaria, items: filteredItems.filter((item) => item.secretaria_id === secretaria.id) }))
                .filter(({ items }) => items.length > 0)
                .map(({ secretary, items }) => {
                  const count = (value: PatrimonioRecord["situacao_operacional"]) => items.filter((item) => item.situacao_operacional === value).length;
                  const attention = items.filter((item) => getInventarioAgenteStatus(item.inventario) !== "sincronizado").length;
                  return <section key={secretary.id} tabIndex={0} className="border border-border bg-card p-3 outline-none focus-visible:ring-1 focus-visible:ring-primary">
                    <div className="flex items-center gap-2 border-b border-border pb-2"><Building2 className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold">{secretary.codigo} — {secretary.nome}</h2></div>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-1 py-2 text-xs"><dt className="text-muted-foreground">Total</dt><dd className="text-right font-semibold">{items.length}</dd><dt className="text-muted-foreground">Em uso</dt><dd className="text-right">{count("em_uso")}</dd><dt className="text-muted-foreground">Em manutenção</dt><dd className="text-right">{count("em_manutencao")}</dd><dt className="text-muted-foreground">Reserva</dt><dd className="text-right">{count("reserva")}</dd><dt className="text-muted-foreground">Inoperante</dt><dd className="text-right">{count("inoperante")}</dd><dt className="text-muted-foreground">Agentes com atenção</dt><dd className="text-right">{attention}</dd></dl>
                    <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => { setSecretariaFilter(secretary.id); setView("list"); }}>Abrir equipamentos</Button>
                  </section>;
                })}
            </div>
          )}
        </>
      ) : section === "manutencoes" ? (
        <div className="overflow-auto border border-border bg-card"><table className="w-full text-xs"><thead className="bg-muted"><tr className="border-b border-border text-left"><th className="px-3 py-2">Número</th><th className="px-3 py-2">Patrimônio</th><th className="px-3 py-2">Equipamento</th><th className="px-3 py-2">Responsável</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Abertura</th></tr></thead><tbody>{filteredDemands.map((item) => <tr key={item.id} className="border-b border-border"><td className="px-3 py-2 font-medium">{item.number}</td><td className="px-3 py-2">{item.patrimony ?? "—"}</td><td className="px-3 py-2">{item.equipment ?? "—"}</td><td className="px-3 py-2">{item.owner}</td><td className="px-3 py-2"><span className={`border px-2 py-0.5 ${getStatusMetadata(item.status).className}`}>{getStatusMetadata(item.status).label}</span></td><td className="px-3 py-2">{new Date(item.date).toLocaleDateString("pt-BR")}</td></tr>)}</tbody></table>{!filteredDemands.length ? <p className="p-6 text-xs text-muted-foreground">Nenhuma demanda relacionada ao patrimônio selecionado.</p> : null}</div>
      ) : section === "inventario" ? (
        <div className="overflow-auto border border-border bg-card"><table className="w-full text-xs"><thead className="bg-muted"><tr className="border-b border-border text-left"><th className="px-3 py-2">Patrimônio</th><th className="px-3 py-2">Agente</th><th className="px-3 py-2">Última coleta</th><th className="px-3 py-2">Hostname</th><th className="px-3 py-2">Sistema</th><th className="px-3 py-2">Processador</th><th className="px-3 py-2">Memória</th></tr></thead><tbody>{(selected ? [selected] : state.items).map((item) => <tr key={item.id} className="border-b border-border"><td className="px-3 py-2 font-medium">{item.patrimonio}</td><td className="px-3 py-2"><PatrimonioAgentBadge inventory={item.inventario} /></td><td className="px-3 py-2">{item.inventario?.collected_at ? new Date(item.inventario.collected_at).toLocaleString("pt-BR") : "—"}</td><td className="px-3 py-2">{item.inventario?.hostname ?? "—"}</td><td className="px-3 py-2">{item.inventario?.os_name ?? "—"}</td><td className="px-3 py-2">{item.inventario?.cpu_model ?? "—"}</td><td className="px-3 py-2">{item.inventario?.memory_total_gb ? `${item.inventario.memory_total_gb} GB` : "—"}</td></tr>)}</tbody></table></div>
      ) : <div className="border border-dashed border-border bg-card p-6 text-xs text-muted-foreground">Nenhum evento de histórico disponível para exibição nesta etapa.</div>}

      <StatusBar selected={selected ? 1 : 0} visible={section === "equipamentos" ? filteredItems.length : section === "manutencoes" ? filteredDemands.length : state.items.length} filters={state.query || state.operationalFilter !== "all" || state.agentFilter !== "all" || secretariaFilter !== "all" ? 1 : 0} />

      <DialogShell open={detailOpen && Boolean(selected)} title={selected ? `Patrimônio ${selected.patrimonio}` : "Detalhes do patrimônio"} description={selected ? `${lookupName(initialData.equipamentos, selected.equipamento_id)} — ${secretaryName(selected.secretaria_id)} — ${selected.responsavel}` : undefined} onClose={() => setDetailOpen(false)} className="max-w-3xl">
        {selected ? <>
          <PatrimonioDetails item={selected} secretarias={initialData.secretarias} equipamentos={initialData.equipamentos} tecnologias={initialData.tecnologias} />
          <div className="flex flex-wrap gap-2 border-t border-border pt-3"><Button type="button" size="sm" onClick={editSelected}><Edit3 className="h-4 w-4" />Editar</Button><Button type="button" size="sm" variant="outline" onClick={openMaintenance} disabled={selected.arquivado}><Wrench className="h-4 w-4" />Abrir manutenção</Button><Button type="button" size="sm" variant="destructive" onClick={archiveSelected} disabled={selected.arquivado}>Arquivar</Button></div>
        </> : null}
      </DialogShell>
    </div>
  );
}
