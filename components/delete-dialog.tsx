"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";

type DeleteDialogProps = {
  open: boolean;
  entityLabel: string;
  onDelete: () => void;
  onClose: () => void;
};

export function DeleteDialog({ open, entityLabel, onDelete, onClose }: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title={`Excluir ${entityLabel}`}
      description="Esta acao nao pode ser desfeita."
      confirmLabel="Excluir"
      onConfirm={onDelete}
      onClose={onClose}
    />
  );
}
