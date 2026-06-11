import Image from "next/image";
import Link from "next/link";
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

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none">
      <Link href={`/produkt/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.altPl ?? product.namePl}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <span className="text-sm">Brak zdjęcia</span>
            </div>
          )}
          {product.isNewArrival && (
            <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              Nowość
            </span>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <span className="rounded bg-background px-3 py-1 text-sm font-medium text-muted-foreground shadow">
                Niedostępny
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        {product.brand && (
          <Link
            href={`/marki/${product.brand.slug}`}
            className="mb-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {product.brand.name}
          </Link>
        )}

        <Link href={`/produkt/${product.slug}`} className="flex-1">
          <h2 className="line-clamp-2 text-sm font-medium text-foreground leading-tight">
            {product.namePl}
          </h2>
        </Link>

        {product.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map(({ tag }) => (
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
              {defaultVariant.comparePricePln &&
                defaultVariant.comparePricePln > defaultVariant.pricePln && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(defaultVariant.comparePricePln)}
                  </span>
                )}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Cena niedostępna</span>
          )}
        </div>
      </div>
    </article>
  );
}
