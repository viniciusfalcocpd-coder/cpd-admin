"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DialogShellProps = {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  className?: string;
};

export function DialogShell({
  open,
  title,
  description,
  children,
  footer,
  onClose,
  className,
}: DialogShellProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus.current?.focus();
    };
  }, [onClose, open]);
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="dialog-title" className={`w-full max-h-[85vh] overflow-y-auto border-border ${className ?? "max-w-lg"}`}>
        <CardContent className="space-y-3 p-4">
          <div className="space-y-1">
            <h2 id="dialog-title" className="text-xl font-semibold">{title}</h2>
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
