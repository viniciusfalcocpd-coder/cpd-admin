import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-80 w-full" />
    </div>
  );
}
