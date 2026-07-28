import { Card, CardContent } from "@/components/ui/card";
import type { ActivityItem } from "@/types/cpd";
import { format } from "date-fns";

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <Card className="border-border">
      <CardContent className="space-y-3 p-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Atividades recentes</p>
          <h2 className="text-base font-semibold">Historico de movimentacoes</h2>
        </div>

        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="border border-border p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.actor} em {activity.target}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(activity.timestamp), "dd/MM HH:mm")}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                De <span className="font-medium text-foreground">{activity.previousValue}</span> para{" "}
                <span className="font-medium text-foreground">{activity.currentValue}</span>
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
