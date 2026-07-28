"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  getRowKey?: (row: TData) => string;
  selectedRowKey?: string | null;
  onRowClick?: (row: TData) => void;
  onRowDoubleClick?: (row: TData) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  showSearch?: boolean;
  showSelection?: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Pesquisar...",
  emptyMessage = "Sem resultados.",
  getRowKey,
  selectedRowKey,
  onRowClick,
  onRowDoubleClick,
  globalFilter,
  onGlobalFilterChange,
  showSearch = true,
  showSelection = true,
}: DataTableProps<TData, TValue>) {
  const [internalFilter, setInternalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const filterValue = globalFilter ?? internalFilter;
  const setFilterValue = onGlobalFilterChange ?? setInternalFilter;

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: filterValue,
      sorting,
      rowSelection,
    },
    onGlobalFilterChange: setFilterValue,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    enableRowSelection: showSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card className="border-border">
      <CardContent className="space-y-3 p-3">
        {showSearch ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              className="max-w-md"
              placeholder={searchPlaceholder}
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
            />
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {table.getFilteredRowModel().rows.length} registros
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {table.getFilteredRowModel().rows.length} registros
            </p>
          </div>
        )}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {showSelection ? (
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      aria-label="Selecionar todos"
                      checked={table.getIsAllPageRowsSelected()}
                      ref={(node) => {
                        if (node) {
                          node.indeterminate = table.getIsSomePageRowsSelected();
                        }
                      }}
                      onChange={table.getToggleAllPageRowsSelectedHandler()}
                    />
                  </TableHead>
                ) : null}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 text-left font-medium"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ArrowUpDown className="h-4 w-4 rotate-180" />,
                          desc: <ArrowUpDown className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  onDoubleClick={() => onRowDoubleClick?.(row.original)}
                  className={
                    row.getIsSelected() || (getRowKey && selectedRowKey === getRowKey(row.original))
                      ? "border-l-4 border-l-primary bg-primary/10 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.35)]"
                      : "cursor-pointer hover:bg-muted/50"
                  }
                >
                  {showSelection ? (
                    <TableCell className="w-10">
                      <input
                        type="checkbox"
                        aria-label="Selecionar linha"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                      />
                    </TableCell>
                  ) : null}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showSelection ? 1 : 0)}
                  className="py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Pagina {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Proxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
