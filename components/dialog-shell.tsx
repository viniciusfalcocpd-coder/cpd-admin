"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DialogShellProps = {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

export function DialogShell({
  open,
  title,
  description,
  children,
  footer,
  onClose,
}: DialogShellProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-lg border-border">
        <CardContent className="space-y-3 p-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{title}</h2>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>

          {children}

          <div className="flex justify-end gap-3">
            {footer ?? (
              <Button type="button" variant="outline" onClick={onClose}>
                Fechar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
