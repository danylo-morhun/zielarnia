import { Skeleton } from "@/components/ui/skeleton";

const SECTIONS = [
  { id: "kategorie", rows: ["a", "b", "c"] },
  { id: "marki", rows: ["a", "b", "c", "d"] },
  { id: "tagi", rows: ["a", "b", "c", "d", "e"] },
];

export function FilterSidebarSkeleton() {
  return (
    <div className="space-y-6">
      {SECTIONS.map((section) => (
        <div key={section.id} className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          {section.rows.map((row) => (
            <div key={row} className="flex items-center gap-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
