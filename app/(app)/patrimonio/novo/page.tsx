import { PatrimonioFormPage } from "@/components/modules/patrimonio/PatrimonioFormPage";
import { getPatrimonioPageData } from "@/services/patrimonio";

export const metadata = {
  title: "Novo patrimonio",
};

export const dynamic = "force-dynamic";

export default async function NovoPatrimonioPage() {
  const initialData = await getPatrimonioPageData();

  return <PatrimonioFormPage mode="create" item={null} initialData={initialData} />;
}

