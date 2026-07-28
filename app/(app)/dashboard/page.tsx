import { ActivityFeed } from "@/components/activity-feed";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardOverview } from "@/services/dashboard";
import type { StockCategory } from "@/types/cpd";
import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";

export const metadata = {
  title: "Dashboard",
};

function getCategoryName(categories: StockCategory[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? "Sem categoria";
}

export default async function DashboardPage() {
  const overview = await getDashboardOverview();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        description="Resumo operacional do CPD com foco em pendencias e atendimento."
      />

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {overview.metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.3fr_0.9fr]">
        <Card className="border-border">
          <CardContent className="space-y-3 p-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Demandas abertas</p>
                <h2 className="text-base font-semibold">Fila operacional</h2>
              </div>
              <Badge variant="outline">{overview.demandItems.length}</Badge>
            </div>

            <div className="space-y-2">
              {overview.demandItems.map((item) => (
                <div key={item.id} className="grid gap-2 border border-border p-2 lg:grid-cols-[1fr_auto]">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{item.number}</span>
                      <PriorityBadge value={item.priority} />
                      <StatusBadge value={item.status} />
                      <Badge variant="outline">{item.kind === "internal" ? "Interna" : "Campo"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.summary}</p>
                  </div>

                  <div className="text-right text-xs text-muted-foreground">
                    <p>{item.requester}</p>
                    <p>{item.owner}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="border-border">
            <CardContent className="space-y-3 p-3">
              <div className="border-b border-border pb-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Estoque abaixo do minimo</p>
                <h2 className="text-base font-semibold">Alertas</h2>
              </div>

              <div className="space-y-2">
                {overview.stockItems
                  .filter((item) => item.quantity <= 5)
                  .map((item) => (
                    <div key={item.id} className="border border-border p-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.specification}</p>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <p>{item.quantity} unidades</p>
                          <p>{getCategoryName(overview.stockCategories, item.categoryId)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <ActivityFeed activities={overview.activities} />
        </div>
      </div>
    </div>
  );
}
