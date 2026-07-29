import { notFound } from "next/navigation";
import { PatrimonioFormPage } from "@/components/modules/patrimonio/PatrimonioFormPage";
import { PatrimonioTechnicalPage } from "@/components/modules/patrimonio/PatrimonioTechnicalPage";
import { getPatrimonioPageData, getPatrimonioRecordById } from "@/services/patrimonio";
import { getDemandasByPatrimonioId } from "@/services/demandas-patrimonio";

export const metadata = {
  title: "Editar patrimonio",
};

export const dynamic = "force-dynamic";

type EditPatrimonioPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
};

export default async function EditPatrimonioPage({ params, searchParams }: EditPatrimonioPageProps) {
  const { id } = await params;
  const { edit } = await searchParams;
  const [initialData, item] = await Promise.all([
    getPatrimonioPageData(),
    getPatrimonioRecordById(id),
  ]);

  if (!item) {
    notFound();
  }

  if (edit === "1") {
    return <PatrimonioFormPage mode="edit" item={item} initialData={initialData} />;
  }

  const demandas = await getDemandasByPatrimonioId(item.id);
  const hasActiveDemand = demandas.some((demand) => ["open", "in_progress", "waiting_material"].includes(demand.status));
  return <PatrimonioTechnicalPage item={hasActiveDemand ? { ...item, situacao_operacional: "em_manutencao" } : item} {...initialData} demandas={demandas} />;
}
