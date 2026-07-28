import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";
import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <Card className="border-dashed border-border/70">
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="border border-border bg-muted p-3 text-muted-foreground">
          <Inbox className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
        {actionLabel && actionHref ? (
          <Button asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
