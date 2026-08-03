export function TableLoadingRows({ columns = 5, rows = 4 }: { columns?: number; rows?: number }) {
  return <>{Array.from({ length: rows }).map((_, row) => <tr key={row} className="border-b border-border" aria-hidden="true">{Array.from({ length: columns }).map((__, column) => <td key={column} className="px-3 py-3"><span className="block h-3 animate-pulse bg-muted" /></td>)}</tr>)}</>;
}
