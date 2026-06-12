"use client";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { BrandItem, CategoryItem, TagItem } from "../actions";
import { FilterSidebar } from "./FilterSidebar";

type Props = {
  categories: CategoryItem[];
  brands: BrandItem[];
  tags: TagItem[];
  basePath?: string;
};

export function FilterDrawerButton({ categories, brands, tags, basePath }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted lg:hidden"
      >
        <SlidersHorizontal className="size-4" />
        Filtruj
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[320px] overflow-y-auto p-0">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="text-base">Filtry</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <FilterSidebar
              categories={categories}
              brands={brands}
              tags={tags}
              basePath={basePath}
              onFilterChange={() => setOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
