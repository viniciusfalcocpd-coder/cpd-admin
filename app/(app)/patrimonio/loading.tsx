import { TableLoadingRows } from "@/components/table-loading-rows";
export default function Loading() { return <div className="border border-border bg-card" aria-busy="true"><table className="w-full"><thead className="bg-muted"><tr>{Array.from({ length: 7 }).map((_, index) => <th key={index} className="h-9" />)}</tr></thead><tbody><TableLoadingRows columns={7} rows={8} /></tbody></table></div>; }
