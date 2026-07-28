"use client";

import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/dialog-shell";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <DialogShell
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
