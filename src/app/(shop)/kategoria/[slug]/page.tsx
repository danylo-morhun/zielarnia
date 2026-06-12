import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/features/catalog/components/Breadcrumbs";
import { FilterSidebar } from "@/features/catalog/components/FilterSidebar";
import { Pagination } from "@/features/catalog/components/Pagination";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { parseCatalogFilters } from "@/features/catalog/lib/filters";
import {
  getBrands,
  getCategoryBySlug,
  getProducts,
  getTags,
} from "../../../../features/catalog/actions";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.namePl,
    description: category.descriptionPl ?? `Produkty w kategorii ${category.namePl}`,
  };
}

export default async function KategoriaSlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const rawParams = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const filters = parseCatalogFilters({ ...rawParams, kategoria: slug });

  const [{ items, total }, brands, tags] = await Promise.all([
    getProducts(filters),
    getBrands(),
    getTags(),
  ]);

  const breadcrumbs = [
    { name: "Strona główna", href: "/" },
    { name: "Katalog", href: "/katalog" },
    ...(category.parent
      ? [
          {
            name: category.parent.namePl,
            href: `/kategoria/${category.parent.slug}`,
          },
        ]
      : []),
    { name: category.namePl, href: `/kategoria/${category.slug}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="mt-4 text-balance text-2xl text-foreground">{category.namePl}</h1>
      {category.descriptionPl && (
        <p className="mt-2 text-muted-foreground">{category.descriptionPl}</p>
      )}
      <p className="mt-1 text-sm text-muted-foreground">
        {total} {total === 1 ? "produkt" : total < 5 ? "produkty" : "produktów"}
      </p>

      <div className="mt-6 flex gap-8">
        <div className="hidden w-56 shrink-0 lg:block">
          <Suspense>
            <FilterSidebar
              categories={[]}
              brands={brands}
              tags={tags}
              basePath={`/kategoria/${slug}`}
            />
          </Suspense>
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <ProductGrid products={items} />
          <Pagination filters={filters} total={total} basePath={`/kategoria/${slug}`} />
        </div>
      </div>
    </div>
  );
}
