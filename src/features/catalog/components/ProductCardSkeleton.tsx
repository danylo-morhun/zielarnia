import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-2 px-1">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="mt-2 h-5 w-1/4" />
      </div>
    </div>
  );
}
