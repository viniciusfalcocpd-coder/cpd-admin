"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChartPoint } from "@/types/cpd";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DashboardChartsProps = {
  monthlyDemandData: ChartPoint[];
  requestByCategoryData: ChartPoint[];
  topMaterialsData: ChartPoint[];
};

const colors = ["#2563eb", "#0f766e", "#d97706", "#7c3aed", "#e11d48"];

export function DashboardCharts({
  monthlyDemandData,
  requestByCategoryData,
  topMaterialsData,
}: DashboardChartsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card className="xl:col-span-2 border-border/70 shadow-soft">
        <CardContent className="space-y-4 p-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Demandas por mes</p>
            <h2 className="text-lg font-semibold">Volume recente de chamados</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDemandData}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-soft">
        <CardContent className="space-y-4 p-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Solicitacoes por categoria</p>
            <h2 className="text-lg font-semibold">Mix do fluxo</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={requestByCategoryData} dataKey="value" nameKey="label" innerRadius={52} outerRadius={92} paddingAngle={4}>
                  {requestByCategoryData.map((entry, index) => (
                    <Cell key={entry.label} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-3 border-border/70 shadow-soft">
        <CardContent className="space-y-4 p-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Materiais mais solicitados</p>
            <h2 className="text-lg font-semibold">Top itens</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {topMaterialsData.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "rounded-2xl border border-border/70 p-4",
                  "bg-gradient-to-br from-muted/70 to-transparent",
                )}
              >
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">Posicao #{index + 1}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
