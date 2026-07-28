import {
  activities,
  assetItems,
  dashboardMetrics,
  demandItems,
  monthlyDemandData,
  requestByCategoryData,
  requestItems,
  topMaterialsData,
} from "@/lib/mock-data";
import { getStockPageData } from "@/services/estoque";

export async function getDashboardOverview() {
  const stock = await getStockPageData();

  return {
    metrics: dashboardMetrics,
    demandItems,
    requestItems,
    stockItems: stock.items,
    stockCategories: stock.categories,
    assetItems,
    activities,
    monthlyDemandData,
    requestByCategoryData,
    topMaterialsData,
  };
}
