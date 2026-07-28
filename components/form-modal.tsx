"use client";

import type { ReactNode } from "react";
import { DialogShell } from "@/components/dialog-shell";

type FormModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

export function FormModal({
  open,
  title,
  description,
  children,
  footer,
  onClose,
}: FormModalProps) {
  return (
    <DialogShell open={open} title={title} description={description} onClose={onClose} footer={footer}>
      {children}
    </DialogShell>
  );
}
