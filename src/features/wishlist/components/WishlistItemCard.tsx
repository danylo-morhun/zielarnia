"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { formatPrice } from "@/lib/format";
import { removeFromWishlist } from "../actions";
import type { WishlistItem } from "../lib/session";

type Props = {
  item: WishlistItem;
};

export function WishlistItemCard({ item }: Props) {
  const router = useRouter();
  const { execute: doRemove, isExecuting: removing } = useAction(removeFromWishlist, {
    onSuccess: () => router.refresh(),
  });

  const image = item.product.images[0];
  const variant = item.product.variants[0];

  return (
    <div className="flex gap-4 py-4">
      <Link
        href={`/produkt/${item.product.slug}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.altPl ?? item.product.namePl}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-xs text-muted-foreground">
            Brak
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1">
        <Link
          href={`/produkt/${item.product.slug}`}
          className="text-sm font-medium text-foreground hover:text-primary"
        >
          {item.product.namePl}
        </Link>
        {variant && (
          <p className="text-sm font-semibold">{formatPrice(variant.pricePln)}</p>
        )}
        <p className={`text-xs ${variant && variant.stock > 0 ? "text-green-600" : "text-muted-foreground"}`}>
          {variant && variant.stock > 0 ? "Dostępny" : "Niedostępny"}
        </p>
        <button
          type="button"
          disabled={removing}
          onClick={() => doRemove({ wishlistItemId: item.id })}
          className="mt-auto flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-destructive disabled:opacity-40"
          aria-label="Usuń z ulubionych"
        >
          <Trash2 className="size-3" />
          Usuń
        </button>
      </div>
    </div>
  );
}
