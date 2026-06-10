import { FilterSidebarSkeleton } from "@/features/catalog/components/FilterSidebarSkeleton";
import { ProductGridSkeleton } from "@/features/catalog/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <FilterSidebarSkeleton />
        </aside>
        <div className="flex-1">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}
