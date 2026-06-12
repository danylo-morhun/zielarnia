import Image from "next/image";
import Link from "next/link";
import { QuickAddButton } from "@/features/cart/components/QuickAddButton";
import { formatPrice } from "@/lib/format";
import type { ProductListItem } from "../actions";

type Props = {
  product: ProductListItem;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: Props) {
  const defaultVariant = product.variants[0];
  const mainImage = product.images[0];
  const isOutOfStock = defaultVariant ? defaultVariant.stock <= 0 : true;
  const comparePrice = defaultVariant?.comparePricePln ?? null;
  const hasDiscount =
    defaultVariant != null && comparePrice != null && comparePrice > defaultVariant.pricePln;
  const discountPct =
    hasDiscount && comparePrice != null
      ? Math.round(((comparePrice - defaultVariant.pricePln) / comparePrice) * 100)
      : 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-200 hover:shadow-card-hover motion-reduce:transition-none">
      <Link href={`/produkt/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-card">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.altPl ?? product.namePl}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <span className="text-sm">Brak zdjęcia</span>
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {hasDiscount && (
              <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                -{discountPct}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                Nowość
              </span>
            )}
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <span className="rounded-md bg-background px-3 py-1 text-sm font-medium text-muted-foreground shadow-card-hover">
                Niedostępny
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col border-t border-border p-3.5">
        {product.brand && (
          <Link
            href={`/marki/${product.brand.slug}`}
            className="mb-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {product.brand.name}
          </Link>
        )}

        <Link href={`/produkt/${product.slug}`} className="flex-1">
          <h2 className="line-clamp-2 font-sans text-sm font-medium leading-snug text-foreground">
            {product.namePl}
          </h2>
        </Link>

        {product.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map(({ tag }) => (
              <span
                key={tag.slug}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag.namePl}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          {defaultVariant ? (
            <>
              <span className="text-base font-semibold text-foreground">
                {formatPrice(defaultVariant.pricePln)}
              </span>
              {hasDiscount && comparePrice != null && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Cena niedostępna</span>
          )}
        </div>

        {defaultVariant && (
          <div className="mt-3">
            <QuickAddButton variantId={defaultVariant.id} disabled={isOutOfStock} />
          </div>
        )}
      </div>
    </article>
  );
}
