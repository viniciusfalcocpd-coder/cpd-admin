import { PatrimonioModule } from "@/components/modules/patrimonio-module";
import { getPatrimonioPageData } from "@/services/patrimonio";

export const metadata = {
  title: "Patrimonio",
};

export const dynamic = "force-dynamic";

export default async function PatrimonioPage() {
  const initialData = await getPatrimonioPageData();

  return <PatrimonioModule initialData={initialData} />;
}
