import { CentralModule } from "@/components/modules/central-module";
import { getPatrimonioPageData } from "@/services/patrimonio";
import { getStockPageData } from "@/services/estoque";
import { listDemands } from "@/services/demandas";

export const metadata = { title: "Central de Trabalho" };
export const dynamic = "force-dynamic";

export default async function CentralPage() {
  const [patrimonio, stock] = await Promise.all([getPatrimonioPageData(), getStockPageData()]);
  return <CentralModule demands={listDemands()} patrimonio={patrimonio} stock={stock} />;
}
