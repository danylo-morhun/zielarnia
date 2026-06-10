"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { addToCart } from "../actions";

type Variant = {
  id: string;
  optionLabel: string | null;
  optionValue: string | null;
  pricePln: number;
  comparePricePln: number | null;
  stock: number;
  isDefault: boolean;
};

type Props = {
  variants: Variant[];
};

export function AddToCartSection({ variants }: Props) {
  const router = useRouter();
  const defaultVariant = variants.find((v) => v.isDefault) ?? variants[0];
  const [selectedId, setSelectedId] = useState(defaultVariant?.id ?? "");
  const [added, setAdded] = useState(false);

  const { execute, isExecuting } = useAction(addToCart, {
    onSuccess: () => {
      router.refresh();
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    },
  });

  const selected = variants.find((v) => v.id === selectedId) ?? defaultVariant;
  if (!selected) return null;

  const hasOptions = variants.some((v) => v.optionValue);
  const isMultiVariant = variants.length > 1;
  const comparePrice = selected.comparePricePln;
  const hasDiscount = comparePrice && comparePrice > selected.pricePln;
  const discountPct = hasDiscount
    ? Math.round(((comparePrice - selected.pricePln) / comparePrice) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {isMultiVariant && hasOptions && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            {selected.optionLabel ?? "Wariant"}
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedId(v.id)}
                disabled={v.stock <= 0}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors disabled:opacity-40 ${
                  v.id === selectedId
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary hover:bg-muted"
                }`}
              >
                {v.optionValue}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-foreground">{formatPrice(selected.pricePln)}</span>
        {hasDiscount && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(comparePrice)}
            </span>
            <span className="rounded bg-destructive/10 px-2 py-0.5 text-sm font-medium text-destructive">
              -{discountPct}%
            </span>
          </>
        )}
      </div>

      <p className={`text-sm ${selected.stock > 0 ? "text-success" : "text-muted-foreground"}`}>
        {selected.stock > 0
          ? selected.stock <= 5
            ? `Ostatnie ${selected.stock} szt.`
            : "Dostępny"
          : "Niedostępny"}
      </p>

      <button
        type="button"
        disabled={isExecuting || selected.stock <= 0 || added}
        onClick={() => execute({ variantId: selected.id, quantity: 1 })}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {added ? (
          <>
            <Check className="size-4" />
            Dodano do koszyka
          </>
        ) : (
          <>
            <ShoppingCart className="size-4" />
            {isExecuting ? "Dodawanie..." : "Dodaj do koszyka"}
          </>
        )}
      </button>
    </div>
  );
}
