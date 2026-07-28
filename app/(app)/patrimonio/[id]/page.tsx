import { notFound } from "next/navigation";
import { PatrimonioFormPage } from "@/components/modules/patrimonio/PatrimonioFormPage";
import { getPatrimonioPageData, getPatrimonioRecordById } from "@/services/patrimonio";

export const metadata = {
  title: "Editar patrimonio",
};

export const dynamic = "force-dynamic";

type EditPatrimonioPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPatrimonioPage({ params }: EditPatrimonioPageProps) {
  const { id } = await params;
  const [initialData, item] = await Promise.all([
    getPatrimonioPageData(),
    getPatrimonioRecordById(id),
  ]);

  if (!item) {
    notFound();
  }

  return <PatrimonioFormPage mode="edit" item={item} initialData={initialData} />;
}
