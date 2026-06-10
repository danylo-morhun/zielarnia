import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/features/catalog/components/Breadcrumbs";
import { FilterSidebar } from "@/features/catalog/components/FilterSidebar";
import { FilterDrawerButton } from "@/features/catalog/components/FilterDrawerButton";
import { ActiveFilterChips } from "@/features/catalog/components/ActiveFilterChips";
import { Pagination } from "@/features/catalog/components/Pagination";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { parseCatalogFilters } from "@/features/catalog/lib/filters";
import { getBrands, getCategories, getProducts, getTags } from "../../../features/catalog/actions";

export const metadata: Metadata = {
  title: "Katalog produktów",
  description:
    "Przeglądaj nasz szeroki wybór suplementów diety, witamin i produktów bio. Filtruj według kategorii, marki i cech.",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function KatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseCatalogFilters(params);

  const [{ items, total }, categories, brands, tags] = await Promise.all([
    getProducts(filters),
    getCategories(),
    getBrands(),
    getTags(),
  ]);

  const breadcrumbs = [
    { name: "Strona główna", href: "/" },
    { name: "Katalog", href: "/katalog" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="mt-4 text-2xl font-bold text-foreground">Katalog produktów</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {total} {total === 1 ? "produkt" : total < 5 ? "produkty" : "produktów"}
      </p>

      <div className="mt-6 flex gap-8">
        <div className="hidden w-56 shrink-0 lg:block">
          <Suspense>
            <FilterSidebar categories={categories} brands={brands} tags={tags} />
          </Suspense>
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <div className="lg:hidden">
            <div className="mb-3 flex items-center gap-3">
              <Suspense>
                <FilterDrawerButton categories={categories} brands={brands} tags={tags} />
              </Suspense>
            </div>
            <Suspense>
              <ActiveFilterChips categories={categories} brands={brands} tags={tags} />
            </Suspense>
          </div>

          <ProductGrid products={items} />
          <Pagination filters={filters} total={total} />
        </div>
      </div>
    </div>
  );
}
