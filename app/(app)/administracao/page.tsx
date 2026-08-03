import { AdministracaoModule } from "@/components/modules/administracao-module";
import { getPatrimonioPageData } from "@/services/patrimonio";

export const metadata = { title: "Administração" };

export default async function AdministracaoPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  const lookupData = await getPatrimonioPageData();
  return <AdministracaoModule initialTab={params.tab ?? "cadastros"} lookupData={lookupData} />;
}
