import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartSection } from "@/features/cart/components/AddToCartSection";
import { Breadcrumbs } from "@/features/catalog/components/Breadcrumbs";
import { ProductGallery } from "@/features/catalog/components/ProductGallery";
import { buildProductJsonLd } from "@/lib/seo";
import { getProduct } from "../../../../features/catalog/actions";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const title = product.metaTitlePl ?? product.namePl;
  const description = product.metaDescPl ?? product.shortDescPl ?? undefined;
  const mainImage = product.images.find((img) => img.isMain)?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: mainImage ? [{ url: mainImage }] : undefined,
    },
  };
}

export default async function ProduktPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const jsonLd = buildProductJsonLd({
    name: product.namePl,
    description: product.descriptionPl,
    images: product.images.map((img) => img.url),
    brandName: product.brand?.name,
    variants: product.variants,
    slug: product.slug,
  });

  const breadcrumbs = [
    { name: "Strona główna", href: "/" },
    { name: "Katalog", href: "/katalog" },
    ...(product.category
      ? [
          ...(product.category.parent
            ? [
                {
                  name: product.category.parent.namePl,
                  href: `/kategoria/${product.category.parent.slug}`,
                },
              ]
            : []),
          {
            name: product.category.namePl,
            href: `/kategoria/${product.category.slug}`,
          },
        ]
      : []),
    { name: product.namePl, href: `/produkt/${product.slug}` },
  ];

  const healthWarnings = product.healthWarnings as string[] | null;
  const ingredients = product.ingredients as {
    pl?: string;
    en?: string;
  } | null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ProductGallery images={product.images} productName={product.namePl} />

          <div className="space-y-6">
            {product.brand && (
              <a
                href={`/marki/${product.brand.slug}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {product.brand.name}
              </a>
            )}

            <h1 className="text-2xl font-bold text-foreground leading-tight">{product.namePl}</h1>

            {product.shortDescPl && <p className="text-muted-foreground">{product.shortDescPl}</p>}

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag.namePl}
                  </span>
                ))}
              </div>
            )}

            <AddToCartSection variants={product.variants} />

            {product.netWeight && (
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-muted-foreground">Masa netto</dt>
                <dd className="font-medium">{product.netWeight}</dd>
                {product.servingSize && (
                  <>
                    <dt className="text-muted-foreground">Porcja</dt>
                    <dd className="font-medium">{product.servingSize}</dd>
                  </>
                )}
                {product.servingsPerContainer && (
                  <>
                    <dt className="text-muted-foreground">Porcji w opakowaniu</dt>
                    <dd className="font-medium">{product.servingsPerContainer}</dd>
                  </>
                )}
              </dl>
            )}
          </div>
        </div>

        <div className="mt-12 space-y-8">
          {product.descriptionPl && (
            <section>
              <h2 className="text-lg font-semibold text-foreground">Opis</h2>
              <div
                className="prose prose-sm mt-3 max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.descriptionPl }}
              />
            </section>
          )}

          {ingredients?.pl && (
            <section>
              <h2 className="text-lg font-semibold text-foreground">Skład</h2>
              <p className="mt-3 text-sm text-muted-foreground">{ingredients.pl}</p>
            </section>
          )}

          {product.storageInfo && (
            <section>
              <h2 className="text-lg font-semibold text-foreground">Przechowywanie</h2>
              <p className="mt-3 text-sm text-muted-foreground">{product.storageInfo}</p>
            </section>
          )}

          {healthWarnings && healthWarnings.length > 0 && (
            <section className="rounded-lg border border-border bg-muted/30 p-4">
              <h2 className="text-sm font-semibold text-foreground">Informacje regulacyjne</h2>
              <ul className="mt-2 space-y-1">
                {healthWarnings.map((warning) => (
                  <li key={warning} className="text-xs text-muted-foreground">
                    {warning}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
