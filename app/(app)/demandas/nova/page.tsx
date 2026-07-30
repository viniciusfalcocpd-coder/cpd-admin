import { z } from "zod";
import { PageHeader } from "@/components/page-header";
import { PatrimonioDemandaForm } from "@/components/modules/demandas/PatrimonioDemandaForm";
import { getPatrimonioRecordById } from "@/services/patrimonio";

export const dynamic = "force-dynamic";

type NovaDemandaSearchParams = Promise<{
  patrimonioId?: string | string[];
}>;

function ControlledMessage({ children }: { children: string }) {
  return <div className="border border-border bg-card p-6 text-sm text-muted-foreground">{children}</div>;
}

export default async function NovaDemandaPage({ searchParams }: { searchParams: NovaDemandaSearchParams }) {
  const params = await searchParams;
  const patrimonioId = typeof params.patrimonioId === "string" ? params.patrimonioId.trim() : undefined;

  if (!patrimonioId) {
    return <ControlledMessage>Informe um patrimônio para abrir uma manutenção.</ControlledMessage>;
  }

  if (!z.string().uuid().safeParse(patrimonioId).success) {
    return <ControlledMessage>Patrimônio não encontrado.</ControlledMessage>;
  }

  let patrimonio;
  try {
    patrimonio = await getPatrimonioRecordById(patrimonioId);
  } catch (error) {
    console.error("[demandas/nova] Falha ao carregar patrimônio", { patrimonioId, error });
    return <ControlledMessage>Não foi possível carregar o patrimônio. Tente novamente mais tarde.</ControlledMessage>;
  }

  if (!patrimonio) {
    return <ControlledMessage>Patrimônio não encontrado.</ControlledMessage>;
  }

  return <div className="space-y-4"><PageHeader title="Abrir manutencao" actions={[{ label: "Voltar para demandas", href: "/demandas", variant: "secondary" }]} /><PatrimonioDemandaForm patrimonio={patrimonio} /></div>;
}
