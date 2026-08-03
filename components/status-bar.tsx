export function StatusBar({ selected = 0, visible, filters = 0 }: { selected?: number; visible: number; filters?: number }) {
  return <footer className="flex min-h-7 flex-wrap items-center gap-x-4 gap-y-1 border border-border bg-muted px-2 py-1 text-[11px] text-muted-foreground"><span>{selected} {selected === 1 ? "registro selecionado" : "registros selecionados"}</span><span>{visible} visível(is)</span><span>Filtros ativos: {filters}</span><span className="ml-auto">Operação local</span></footer>;
}
