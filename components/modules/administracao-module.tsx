"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContextTabs } from "@/components/context-tabs";
import { StatusBar } from "@/components/status-bar";
import { UsuariosModule } from "@/components/modules/usuarios-module";
import { ModuleCommandBar } from "@/components/module-command-bar";
import type { PatrimonioPageData } from "@/types/patrimonio";

function LookupTable({ title, columns, rows }: { title: string; columns: string[]; rows: Array<Array<string | number>> }) {
  return <section className="border border-border bg-card"><div className="flex items-center justify-between border-b border-border bg-muted px-3 py-2"><h2 className="text-sm font-semibold">{title}</h2><span className="text-xs text-muted-foreground">{rows.length} registros</span></div>{rows.length ? <div className="overflow-auto"><table className="w-full text-xs"><thead><tr>{columns.map((column) => <th key={column} className="border-b border-border px-3 py-2 text-left font-semibold text-muted-foreground">{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-b border-border hover:bg-muted/60">{row.map((value, valueIndex) => <td key={valueIndex} className="px-3 py-2">{value}</td>)}</tr>)}</tbody></table></div> : <p className="p-6 text-xs text-muted-foreground">Nenhum registro disponível nesta fonte.</p>}</section>;
}

export function AdministracaoModule({ initialTab, lookupData }: { initialTab: string; lookupData: PatrimonioPageData }) {
  const router = useRouter();
  const [lookup, setLookup] = useState("secretarias");
  const tab = ["cadastros", "usuarios", "configuracoes"].includes(initialTab) ? initialTab : "cadastros";
  const secretaryRows = lookupData.secretarias.map((item) => [String(item.codigo), item.nome, String(lookupData.patrimonios.filter((asset) => asset.secretaria_id === item.id).length), "Ativa"]);
  const equipmentRows = lookupData.equipamentos.map((item) => [item.nome, String(lookupData.patrimonios.filter((asset) => asset.equipamento_id === item.id).length)]);
  const technologyRows = lookupData.tecnologias.map((item) => [item.nome, String(lookupData.patrimonios.filter((asset) => asset.tecnologia_id === item.id).length)]);
  return <div className="flex min-h-0 flex-1 flex-col gap-3"><div><h1 className="text-xl font-semibold">Administração</h1><p className="text-xs text-muted-foreground">Cadastros auxiliares, usuários e configurações existentes</p></div><ContextTabs tabs={[{ value: "cadastros", label: "Cadastros" }, { value: "usuarios", label: "Usuários" }, { value: "configuracoes", label: "Configurações" }]} value={tab} onChange={(value) => router.push(`/administracao?tab=${value}`)} />{tab === "cadastros" ? <><ContextTabs tabs={[{ value: "secretarias", label: "Secretarias" }, { value: "equipamentos", label: "Tipos de equipamento" }, { value: "tecnologias", label: "Tecnologias" }]} value={lookup} onChange={setLookup} /><ModuleCommandBar actions={[{ label: "Novo", onClick: () => undefined, enabled: false }, { label: "Atualizar", onClick: () => router.refresh() }]} />{lookup === "secretarias" ? <LookupTable title="Secretarias" columns={["Código", "Nome", "Patrimônios vinculados", "Status"]} rows={secretaryRows} /> : lookup === "equipamentos" ? <LookupTable title="Tipos de equipamento" columns={["Nome", "Patrimônios vinculados"]} rows={equipmentRows} /> : <LookupTable title="Tecnologias" columns={["Nome", "Patrimônios vinculados"]} rows={technologyRows} />}</> : tab === "usuarios" ? <UsuariosModule /> : <div className="border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">Nenhuma configuração adicional disponível nesta etapa.</div>}<StatusBar visible={tab === "cadastros" ? lookup === "secretarias" ? secretaryRows.length : lookup === "equipamentos" ? equipmentRows.length : technologyRows.length : 0} /></div>;
}
