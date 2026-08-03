"use client";

import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Link2, RefreshCcw } from "lucide-react";
import { ModuleCommandBar } from "@/components/module-command-bar";
import { StatusBar } from "@/components/status-bar";
import { StatusBadge } from "@/components/status-badge";
import { PatrimonioAgentBadge } from "@/components/modules/patrimonio/PatrimonioAgentBadge";
import { EstoqueStatusBadge } from "@/components/modules/estoque/EstoqueStatusBadge";
import { getInventarioAgenteStatus } from "@/types/inventario";
import type { DemandItem, StockPageData } from "@/types/cpd";
import type { PatrimonioPageData } from "@/types/patrimonio";

type QueueRow = { id: string };
type QueueProps<T extends QueueRow> = { title: string; rows: T[]; columns: string[]; empty: string; selectedId: string | null; onSelect: (item: T) => void; onOpen: (item: T) => void; render: (item: T) => ReactNode[] };

function QueueTable<T extends QueueRow>({ title, rows, columns, empty, selectedId, onSelect, onOpen, render }: QueueProps<T>) {
  const selectedIndex = rows.findIndex((row) => row.id === selectedId);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLTableRowElement>, item: T) {
    if (event.key === "Enter") onOpen(item);
    if (event.key === "ArrowDown" && rows.length) { event.preventDefault(); onSelect(rows[Math.min(selectedIndex + 1, rows.length - 1)]); }
    if (event.key === "ArrowUp" && rows.length) { event.preventDefault(); onSelect(rows[Math.max(selectedIndex - 1, 0)]); }
  }

  return <section className="flex min-h-0 flex-col border border-border bg-card"><div className="flex items-center justify-between border-b border-border bg-muted px-3 py-2"><h2 className="text-sm font-semibold">{title}</h2><span className="text-xs text-muted-foreground">{rows.length} itens</span></div>{rows.length ? <div className="max-h-64 overflow-auto"><table className="w-full text-xs" aria-label={title} aria-rowcount={rows.length}><thead className="sticky top-0 z-10 bg-muted"><tr>{columns.map((column) => <th key={column} className="border-b border-border px-3 py-2 text-left font-semibold text-muted-foreground">{column}</th>)}<th className="border-b border-border px-3 py-2 text-right"><button type="button" className="text-primary hover:underline" onClick={() => onOpen(rows[0])}>Abrir fila</button></th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} tabIndex={0} aria-selected={selectedId === item.id} onClick={() => onSelect(item)} onDoubleClick={() => onOpen(item)} onKeyDown={(event) => handleKeyDown(event, item)} className={`border-b border-border outline-none focus-visible:ring-1 focus-visible:ring-primary ${selectedId === item.id ? "bg-[var(--classic-selection)] text-[var(--classic-selection-text)]" : "hover:bg-muted/60"}`}>{render(item).map((cell, index) => <td key={index} className="max-w-[20rem] truncate px-3 py-2">{cell}</td>)}<td className="px-3 py-2 text-right">{selectedId === item.id ? <button type="button" className="inline-flex items-center gap-1 underline" onClick={() => onOpen(item)}><Link2 className="h-3 w-3" />Abrir</button> : null}</td></tr>)}</tbody></table></div> : <div className="flex min-h-20 items-center justify-center p-4 text-xs text-muted-foreground">{empty}</div>}</section>;
}

export function CentralModule({ demands, patrimonio, stock }: { demands: DemandItem[]; patrimonio: PatrimonioPageData; stock: StockPageData }) {
  const router = useRouter();
  const [selected, setSelected] = useState<{ type: string; id: string } | null>(null);
  const maintenance = useMemo(() => patrimonio.patrimonios.filter((item) => item.situacao_operacional === "em_manutencao"), [patrimonio.patrimonios]);
  const attention = useMemo(() => patrimonio.patrimonios.filter((item) => getInventarioAgenteStatus(item.inventario) !== "sincronizado"), [patrimonio.patrimonios]);
  const criticalStock = useMemo(() => stock.items.filter((item) => item.quantity <= 5), [stock.items]);
  const pendingDemands = demands.filter((item) => item.status !== "done" && item.status !== "canceled");

  useEffect(() => { const clear = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") setSelected(null); }; window.addEventListener("keydown", clear); return () => window.removeEventListener("keydown", clear); }, []);

  const equipmentName = (id: string) => patrimonio.equipamentos.find((item) => item.id === id)?.nome ?? "Não informado";
  const secretaryName = (id: string) => { const item = patrimonio.secretarias.find((entry) => entry.id === id); return item ? `${item.codigo} - ${item.nome}` : "Não informado"; };
  const open = (type: string, id: string) => { if (type === "demanda") router.push(`/patrimonio?tab=manutencoes&demanda=${id}`); else if (type === "estoque") router.push(`/estoque?item=${id}`); else if (type === "agente") router.push(`/patrimonio?tab=inventario&patrimonio=${id}`); else router.push(`/patrimonio?patrimonio=${id}`); };
  const select = (type: string, id: string) => setSelected({ type, id });

  return <div className="flex min-h-0 flex-1 flex-col gap-3"><div><h1 className="text-xl font-semibold">Central de Trabalho</h1><p className="text-xs text-muted-foreground">Filas operacionais do CPD</p></div><div className="flex flex-wrap items-center gap-x-4 gap-y-1 border border-border bg-card px-3 py-2 text-xs"><span>Demandas pendentes: <strong>{pendingDemands.length}</strong></span><span>Equipamentos em manutenção: <strong>{maintenance.length}</strong></span><span>Agentes com atenção: <strong>{attention.length}</strong></span><span>Itens com estoque crítico: <strong>{criticalStock.length}</strong></span></div><ModuleCommandBar actions={[{ label: "Atualizar", icon: RefreshCcw, onClick: () => router.refresh() }]} /><div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-2"><QueueTable title="Demandas que precisam de atendimento" rows={pendingDemands.slice(0, 20)} columns={["Número", "Secretaria / patrimônio", "Status", "Abertura"]} empty="Nenhuma demanda pendente." selectedId={selected?.type === "demanda" ? selected.id : null} onSelect={(item) => select("demanda", item.id)} onOpen={(item) => open("demanda", item.id)} render={(item) => [<strong key="number">{item.number}</strong>, <span key="sector">{item.sector ?? item.patrimony ?? "—"}</span>, <StatusBadge key="status" value={item.status} />, <span key="date">{new Date(item.date).toLocaleDateString("pt-BR")}</span>]} /><QueueTable title="Equipamentos em manutenção" rows={maintenance.slice(0, 20)} columns={["Patrimônio", "Equipamento", "Secretaria", "Responsável", "Situação"]} empty="Nenhum equipamento em manutenção." selectedId={selected?.type === "patrimonio" ? selected.id : null} onSelect={(item) => select("patrimonio", item.id)} onOpen={(item) => open("patrimonio", item.id)} render={(item) => [<strong key="patrimonio">{item.patrimonio}</strong>, <span key="equipment">{equipmentName(item.equipamento_id)}</span>, <span key="secretary">{secretaryName(item.secretaria_id)}</span>, <span key="owner">{item.responsavel}</span>, <StatusBadge key="status" value={item.situacao_operacional} />]} /><QueueTable title="Agentes desatualizados ou sem coleta" rows={attention.slice(0, 20)} columns={["Patrimônio", "Hostname", "Secretaria", "Status", "Última coleta"]} empty="Todos os agentes estão sincronizados." selectedId={selected?.type === "agente" ? selected.id : null} onSelect={(item) => select("agente", item.id)} onOpen={(item) => open("agente", item.id)} render={(item) => [<strong key="patrimonio">{item.patrimonio}</strong>, <span key="hostname">{item.inventario?.hostname ?? "—"}</span>, <span key="secretary">{secretaryName(item.secretaria_id)}</span>, <PatrimonioAgentBadge key="agent" inventory={item.inventario} />, <span key="date">{item.inventario?.collected_at ? new Date(item.inventario.collected_at).toLocaleString("pt-BR") : "—"}</span>]} /><QueueTable title="Itens com estoque baixo ou zerado" rows={criticalStock.slice(0, 20)} columns={["Item", "Especificação", "Categoria", "Quantidade", "Status"]} empty="Nenhum alerta de estoque." selectedId={selected?.type === "estoque" ? selected.id : null} onSelect={(item) => select("estoque", item.id)} onOpen={(item) => open("estoque", item.id)} render={(item) => [<strong key="name">{item.name}</strong>, <span key="specification">{item.specification}</span>, <span key="category">{stock.categories.find((category) => category.id === item.categoryId)?.name ?? "—"}</span>, <span key="quantity">{item.quantity}</span>, <EstoqueStatusBadge key="status" quantity={item.quantity} />]} /></div><StatusBar selected={selected ? 1 : 0} visible={pendingDemands.length + maintenance.length + attention.length + criticalStock.length} /></div>;
}
