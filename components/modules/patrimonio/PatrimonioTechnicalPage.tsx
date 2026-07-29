"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PatrimonioOperationalBadge } from "@/components/modules/patrimonio/PatrimonioOperationalBadge";
import { PatrimonioAgentBadge } from "@/components/modules/patrimonio/PatrimonioAgentBadge";
import type { PatrimonioRecord, SecretariaLookup, EquipamentoLookup, TecnologiaLookup } from "@/types/patrimonio";
import type { DemandaPatrimonio } from "@/types/demanda";

type Props = {
  item: PatrimonioRecord;
  secretarias: SecretariaLookup[];
  equipamentos: EquipamentoLookup[];
  tecnologias: TecnologiaLookup[];
  demandas: DemandaPatrimonio[];
};

type Tab = "geral" | "inventario" | "manutencoes";

function value(value: unknown) {
  return value === null || value === undefined || value === "" ? "—" : String(value);
}

function lookup<T extends { id: string; nome: string }>(items: T[], id: string | null) {
  return id ? items.find((item) => item.id === id)?.nome ?? "Nao informado" : "Nao informado";
}

function Field({ label, value: fieldValue }: { label: string; value: unknown }) {
  return <div className="border-b border-border py-2"><span className="text-xs text-muted-foreground">{label}</span><p className="text-sm font-medium">{value(fieldValue)}</p></div>;
}

function JsonTable({ title, rows, columns }: { title: string; rows: unknown[]; columns: string[] }) {
  if (!rows.length) return null;
  return (
    <section className="space-y-2 border border-border bg-card p-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">{title}</h3>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted"><tr>{columns.map((column) => <th key={column} className="px-2 py-2 font-medium">{column}</th>)}</tr></thead>
          <tbody>{rows.map((row, index) => {
            const record = typeof row === "object" && row !== null ? row as Record<string, unknown> : {};
            return <tr key={index} className="border-t border-border">{columns.map((column) => {
              const key = column.toLowerCase().replace(/ /g, "");
              const found = Object.entries(record).find(([entryKey]) => entryKey.toLowerCase().replace(/_/g, "").includes(key));
              return <td key={column} className="px-2 py-2">{value(found?.[1])}</td>;
            })}</tr>;
          })}</tbody>
        </table>
      </div>
    </section>
  );
}

export function PatrimonioTechnicalPage({ item, secretarias, equipamentos, tecnologias, demandas }: Props) {
  const [tab, setTab] = useState<Tab>("geral");
  const inventory = item.inventario;
  const activeDemand = demandas.find((demand) => ["open", "in_progress", "waiting_material"].includes(demand.status));
  const secretaria = secretarias.find((entry) => entry.id === item.secretaria_id);

  return (
    <div className="space-y-4">
      <div className="border border-border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Patrimonio</p>
            <h1 className="text-2xl font-semibold">{item.patrimonio}</h1>
            <p className="text-sm text-muted-foreground">{lookup(equipamentos, item.equipamento_id)} · {secretaria ? `${secretaria.codigo} - ${secretaria.nome}` : "Nao informado"} · {item.responsavel}</p>
          </div>
          <div className="flex flex-wrap gap-2"><PatrimonioOperationalBadge value={item.situacao_operacional} /><PatrimonioAgentBadge inventory={inventory} /></div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>Ultima coleta: {inventory?.collected_at ? new Date(inventory.collected_at).toLocaleString("pt-BR") : "—"}</span>
          <span>Agente: {value(inventory?.agent_version)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border">
        {([ ["geral", "Visao geral"], ["inventario", "Inventario"], ["manutencoes", "Manutencoes"] ] as [Tab, string][]).map(([valueTab, label]) => <button key={valueTab} type="button" onClick={() => setTab(valueTab)} className={`border-b-2 px-3 py-2 text-sm ${tab === valueTab ? "border-primary font-semibold" : "border-transparent text-muted-foreground"}`}>{label}</button>)}
      </div>

      {tab === "geral" ? <div className="space-y-3">
        {activeDemand ? <section className="border border-sky-500/30 bg-sky-500/5 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">Manutencao ativa</p><p className="text-sm font-medium">{activeDemand.number} · {activeDemand.description}</p><p className="text-xs text-muted-foreground">Status: {activeDemand.status}</p></div><Button asChild size="sm" variant="outline"><Link href={`/demandas?demanda=${activeDemand.id}`}>Abrir demanda</Link></Button></div></section> : null}
        <section className="grid gap-x-6 gap-y-1 border border-border bg-card p-3 md:grid-cols-2"><Field label="Patrimonio" value={item.patrimonio}/><Field label="Equipamento" value={lookup(equipamentos, item.equipamento_id)}/><Field label="Secretaria" value={secretaria ? `${secretaria.codigo} - ${secretaria.nome}` : null}/><Field label="Responsavel" value={item.responsavel}/><Field label="Marca" value={item.marca}/><Field label="Tecnologia" value={lookup(tecnologias, item.tecnologia_id)}/><Field label="Situacao patrimonial" value={item.arquivado ? "Baixado" : "Ativo"}/><Field label="Situacao operacional" value={item.situacao_operacional}/></section>
        {inventory ? <section className="grid gap-3 border border-border bg-card p-3 md:grid-cols-3"><Field label="Hostname" value={inventory.hostname}/><Field label="Fabricante/modelo detectado" value={[inventory.computer_manufacturer, inventory.computer_model].filter(Boolean).join(" ")}/><Field label="Sistema operacional" value={[inventory.os_name, inventory.os_version].filter(Boolean).join(" ")}/></section> : <section className="border border-dashed border-border p-4 text-sm text-muted-foreground">Inventario automatico ainda nao disponivel para este patrimonio.</section>}
        <div className="flex flex-wrap gap-2"><Button asChild><Link href={`/patrimonio/${item.id}?edit=1`}>Editar patrimonio</Link></Button><Button asChild variant="outline"><Link href={`/demandas/nova?patrimonioId=${item.id}`}>Abrir manutencao</Link></Button></div>
      </div> : null}

      {tab === "inventario" ? (inventory ? <div className="space-y-3"><section className="grid gap-3 border border-border bg-card p-3 md:grid-cols-2 lg:grid-cols-3"><Field label="Hostname" value={inventory.hostname}/><Field label="Fabricante" value={inventory.computer_manufacturer}/><Field label="Modelo" value={inventory.computer_model}/><Field label="Numero de serie" value={inventory.serial_number}/><Field label="BIOS" value={inventory.bios_version}/><Field label="Sistema operacional" value={[inventory.os_name, inventory.os_version, inventory.os_architecture].filter(Boolean).join(" · ")}/><Field label="Kernel" value={inventory.os_kernel}/><Field label="CPU" value={[inventory.cpu_manufacturer, inventory.cpu_model].filter(Boolean).join(" ")}/><Field label="Nucleos" value={[inventory.cpu_physical_cores, inventory.cpu_logical_cores].filter((v) => v !== null).join(" fisicos · ")}/><Field label="Frequencia" value={inventory.cpu_frequency_mhz ? `${inventory.cpu_frequency_mhz} MHz` : null}/><Field label="Memoria instalada" value={inventory.memory_installed_capacity_gb ? `${inventory.memory_installed_capacity_gb} GB` : inventory.memory_total_gb ? `${inventory.memory_total_gb} GB` : null}/><Field label="Slots" value={inventory.memory_total_slots !== null ? `${inventory.memory_used_slots ?? 0} de ${inventory.memory_total_slots} ocupados · ${inventory.memory_free_slots ?? 0} livres` : null}/></section><JsonTable title="Memoria" rows={inventory.memory_modules} columns={["Slot", "Capacidade", "Frequencia", "Fabricante"]}/><JsonTable title="Armazenamento" rows={inventory.disks} columns={["Modelo", "Tipo", "Capacidade", "Serial"]}/><JsonTable title="Rede" rows={inventory.networks} columns={["Interface", "Endereco", "Mac", "Tipo"]}/><JsonTable title="GPU" rows={inventory.gpu} columns={["Modelo", "Fabricante", "Memoria"]}/></div> : <section className="border border-dashed border-border p-4 text-sm text-muted-foreground">Inventario automatico ainda nao disponivel para este patrimonio.</section>) : null}

      {tab === "manutencoes" ? <section className="border border-border bg-card"><div className="border-b border-border bg-muted px-3 py-2 text-sm font-semibold">Historico de manutencoes</div>{demandas.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-muted/50 text-xs"><tr><th className="px-3 py-2">Numero</th><th className="px-3 py-2">Data</th><th className="px-3 py-2">Resumo</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Responsavel</th></tr></thead><tbody>{demandas.map((demand) => <tr key={demand.id} className="border-t border-border"><td className="px-3 py-2 font-medium"><Link className="underline" href={`/demandas?demanda=${demand.id}`}>{demand.number}</Link></td><td className="px-3 py-2">{new Date(demand.request_date).toLocaleDateString("pt-BR")}</td><td className="px-3 py-2">{demand.description}</td><td className="px-3 py-2"><Badge variant="outline">{demand.status}</Badge></td><td className="px-3 py-2">{demand.owner}</td></tr>)}</tbody></table></div> : <p className="p-4 text-sm text-muted-foreground">Nenhuma manutencao vinculada a este patrimonio.</p>}</section> : null}
    </div>
  );
}
