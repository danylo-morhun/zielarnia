import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/features/catalog/components/Breadcrumbs";
import { Pagination } from "@/features/catalog/components/Pagination";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { parseCatalogFilters } from "@/features/catalog/lib/filters";
import { getBrandBySlug, getProducts } from "../../../../features/catalog/actions";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return {};

  return {
    title: brand.name,
    description: brand.description ?? `Produkty marki ${brand.name}`,
  };
}

export default async function MarkiSlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const rawParams = await searchParams;

  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const filters = parseCatalogFilters({ ...rawParams, marka: slug });
  const { items, total } = await getProducts(filters);

  const breadcrumbs = [
    { name: "Strona główna", href: "/" },
    { name: "Marki", href: "/marki" },
    { name: brand.name, href: `/marki/${brand.slug}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6 flex items-start gap-6">
        {brand.logo && (
          <Image
            src={brand.logo}
            alt={`Logo ${brand.name}`}
            width={64}
            height={64}
            className="rounded-lg object-contain"
          />
        )}
        <div>
          <h1 className="text-balance text-2xl text-foreground">{brand.name}</h1>
          {brand.description && <p className="mt-1 text-muted-foreground">{brand.description}</p>}
          {brand.website && (
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-muted-foreground hover:text-foreground"
            >
              {brand.website}
            </a>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {total} {total === 1 ? "produkt" : total < 5 ? "produkty" : "produktów"}
      </p>

      <div className="mt-6 space-y-6">
        <ProductGrid products={items} />
        <Pagination filters={filters} total={total} basePath={`/marki/${slug}`} />
      </div>
    </div>
  );
}
