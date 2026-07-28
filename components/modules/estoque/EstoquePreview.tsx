"use client";

import { Button } from "@/components/ui/button";
import type { StockCategory, StockItem } from "@/types/cpd";
import { EstoqueStatusBadge } from "@/components/modules/estoque/EstoqueStatusBadge";

type EstoquePreviewProps = {
  item: StockItem;
  categories: StockCategory[];
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

function getCategoryName(categories: StockCategory[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? "Sem categoria";
}

function PreviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-2 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export function EstoquePreview({ item, categories, onEdit, onDelete, onClose }: EstoquePreviewProps) {
  return (
    <div className="fixed right-6 top-24 z-50 w-[380px] border border-border bg-card shadow-lg">
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-3">
        <div>
          <p className="text-xs uppercase text-muted-foreground">Estoque</p>
          <h2 className="font-semibold">{item.name}</h2>
        </div>

        <button type="button" onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">
          X
        </button>
      </div>

      <div className="space-y-3 p-4 text-sm">
        <PreviewRow label="Item" value={item.name} />
        <PreviewRow label="Especificacao" value={item.specification} />
        <PreviewRow label="Tipo" value={item.type} />
        <PreviewRow label="Categoria" value={getCategoryName(categories, item.categoryId)} />
        <PreviewRow label="Quantidade atual" value={item.quantity} />
        <PreviewRow label="Status" value={<EstoqueStatusBadge quantity={item.quantity} />} />
      </div>

      <div className="flex justify-end gap-2 border-t border-border bg-muted/30 px-4 py-3">
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Excluir
        </Button>
        <Button variant="outline" size="sm" onClick={onClose}>
          Fechar
        </Button>
        <Button size="sm" onClick={onEdit}>
          Editar
        </Button>
      </div>
    </div>
  );
}
