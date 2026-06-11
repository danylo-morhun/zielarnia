"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { addToCart } from "@/features/cart/actions";

type Props = {
  productName: string;
  selectedVariantId: string;
  price: number;
  stock: number;
  anchorRef: RefObject<HTMLElement | null>;
};

export function StickyAddToCart({ productName, selectedVariantId, price, stock, anchorRef }: Props) {
  const [visible, setVisible] = useState(false);

  const { execute, isExecuting } = useAction(addToCart, {
    onSuccess: () => toast.success("Dodano do koszyka"),
    onError: () => toast.error("Błąd dodawania"),
  });

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [anchorRef]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div>
          <p className="line-clamp-1 text-sm font-semibold">{productName}</p>
          <p className="text-lg font-bold text-primary">{formatPrice(price)}</p>
        </div>
        <button
          onClick={() => execute({ variantId: selectedVariantId, quantity: 1 })}
          disabled={isExecuting || stock <= 0}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-[oklch(0.40_0.14_145)] disabled:opacity-50 motion-reduce:transition-none"
        >
          {stock <= 0 ? "Brak" : isExecuting ? "…" : "Dodaj do koszyka"}
        </button>
      </div>
    </div>
  );
}
