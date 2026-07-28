import { EstoqueModule } from "@/components/modules/estoque-module";
import { getStockPageData } from "@/services/estoque";

export const metadata = {
  title: "Estoque",
};

export const dynamic = "force-dynamic";

export default async function EstoquePage() {
  const initialData = await getStockPageData();

  return <EstoqueModule initialData={initialData} />;
}
