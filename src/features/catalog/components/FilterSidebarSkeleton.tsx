import { Skeleton } from "@/components/ui/skeleton";

export function FilterSidebarSkeleton() {
  return (
    <div className="space-y-6">
      {[3, 4, 5].map((count, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          {Array.from({ length: count }).map((_, j) => (
            <div key={j} className="flex items-center gap-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
