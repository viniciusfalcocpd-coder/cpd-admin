import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PatrimonioDemandaForm } from "@/components/modules/demandas/PatrimonioDemandaForm";
import { getPatrimonioRecordById } from "@/services/patrimonio";

export const dynamic = "force-dynamic";

export default async function NovaDemandaPage({ searchParams }: { searchParams: Promise<{ patrimonioId?: string }> }) {
  const { patrimonioId } = await searchParams;
  if (!patrimonioId) notFound();
  const patrimonio = await getPatrimonioRecordById(patrimonioId);
  if (!patrimonio) notFound();
  return <div className="space-y-4"><PageHeader title="Abrir manutencao" actions={[{ label: "Voltar para demandas", href: "/demandas", variant: "secondary" }]} /><PatrimonioDemandaForm patrimonio={patrimonio} /></div>;
}
