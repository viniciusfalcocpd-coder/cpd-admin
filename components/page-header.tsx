import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: HeaderAction[];
  className?: string;
};

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 border-b border-border pb-3 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">CPD Manager</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
      </div>

      {actions?.length ? (
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button key={action.label} asChild variant={action.variant === "secondary" ? "outline" : "default"}>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
