"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PatrimonioRecord } from "@/types/patrimonio";
import { openPatrimonioDemandaAction } from "@/services/demandas-patrimonio-actions";

export function PatrimonioDemandaForm({ patrimonio }: { patrimonio: PatrimonioRecord }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [requester, setRequester] = useState(patrimonio.responsavel);
  const [sector, setSector] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const demand = await openPatrimonioDemandaAction({ patrimonioId: patrimonio.id, requester, sector, owner, description, priority });
        toast.success(`Demanda ${demand.number} aberta.`);
        router.push(`/patrimonio/${patrimonio.id}`);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Nao foi possivel abrir a demanda.");
      }
    });
  }

  return <form onSubmit={submit} className="max-w-3xl space-y-4 border border-border bg-card p-4"><div className="grid gap-3 md:grid-cols-2"><label className="space-y-1 text-sm"><span className="text-muted-foreground">Patrimonio</span><Input value={`${patrimonio.patrimonio} · ${patrimonio.marca}`} disabled /></label><label className="space-y-1 text-sm"><span className="text-muted-foreground">Solicitante</span><Input value={requester} onChange={(event) => setRequester(event.target.value)} required /></label><label className="space-y-1 text-sm"><span className="text-muted-foreground">Setor</span><Input value={sector} onChange={(event) => setSector(event.target.value)} required /></label><label className="space-y-1 text-sm"><span className="text-muted-foreground">Tecnico responsavel</span><Input value={owner} onChange={(event) => setOwner(event.target.value)} required /></label><label className="space-y-1 text-sm"><span className="text-muted-foreground">Prioridade</span><Select value={priority} onChange={(event) => setPriority(event.target.value)}><option value="low">Baixa</option><option value="medium">Media</option><option value="high">Alta</option><option value="urgent">Urgente</option></Select></label></div><label className="block space-y-1 text-sm"><span className="text-muted-foreground">Problema relatado</span><Textarea value={description} onChange={(event) => setDescription(event.target.value)} required className="min-h-[120px]" /></label><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button><Button type="submit" disabled={isPending}>{isPending ? "Abrindo..." : "Abrir manutencao"}</Button></div></form>;
}
