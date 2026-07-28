"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { archivePatrimonioAction } from "@/services/patrimonio-actions";
import type { PatrimonioPageData, PatrimonioRecord, PatrimonioTab } from "@/types/patrimonio";

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function getLookupName<T extends { id: string; nome: string }>(items: T[], id: string | null) {
  if (!id) {
    return "";
  }

  return items.find((entry) => entry.id === id)?.nome ?? "";
}

function getSecretariaLabel(data: PatrimonioPageData, secretariaId: string) {
  const secretaria = data.secretarias.find((entry) => entry.id === secretariaId);
  return secretaria ? `${secretaria.codigo} ${secretaria.nome}` : "";
}

function matchesSearch(data: PatrimonioPageData, item: PatrimonioRecord, query: string) {
  if (!query) {
    return true;
  }

  const haystack = normalizeSearch(
    [
      item.patrimonio,
      item.responsavel,
      item.marca,
      getSecretariaLabel(data, item.secretaria_id),
      getLookupName(data.equipamentos, item.equipamento_id),
      getLookupName(data.tecnologias, item.tecnologia_id),
    ]
      .filter(Boolean)
      .join(" "),
  );

  return haystack.includes(query);
}

export function usePatrimonio(initialData: PatrimonioPageData) {
  const router = useRouter();
  const [items, setItems] = useState(initialData.patrimonios);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<PatrimonioTab>("ativos");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setItems(initialData.patrimonios);
  }, [initialData.patrimonios]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const filteredItems = useMemo(() => {
    const queryValue = normalizeSearch(query.trim());

    return items.filter((item) => {
      const tabMatch = activeTab === "ativos" ? !item.arquivado : item.arquivado;
      return tabMatch && matchesSearch(initialData, item, queryValue);
    });
  }, [activeTab, initialData, items, query]);

  useEffect(() => {
    if (selectedId && !filteredItems.some((item) => item.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filteredItems, selectedId]);

  function openCreate() {
    router.push("/patrimonio/novo");
  }

  function openEdit(item: PatrimonioRecord) {
    router.push(`/patrimonio/${item.id}`);
  }

  function requestSelectedEdit() {
    if (!selectedItem) {
      toast.info("Selecione um patrimonio para editar.");
      return;
    }

    openEdit(selectedItem);
  }

  function requestSelectedArchive() {
    if (!selectedItem) {
      toast.info("Selecione um patrimonio para aplicar a baixa.");
      return;
    }

    const confirmed = window.confirm(
      "Confirma a baixa patrimonial? O registro sera arquivado sem exclusao fisica.",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await archivePatrimonioAction(selectedItem.id);
        setItems((current) =>
          [result, ...current.filter((item) => item.id !== result.id)].sort(
            (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
          ),
        );
        setSelectedId(result.id);
        toast.success("Patrimonio arquivado.");
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Nao foi possivel arquivar o patrimonio.";
        toast.error(message);
      }
    });
  }

  function refresh() {
    router.refresh();
  }

  return {
    items,
    filteredItems,
    query,
    setQuery,
    activeTab,
    setActiveTab,
    selectedItem,
    selectedId,
    setSelectedId,
    isPending,
    openCreate,
    openEdit,
    requestSelectedEdit,
    requestSelectedArchive,
    refresh,
  };
}

