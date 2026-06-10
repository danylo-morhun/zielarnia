"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { addToCart } from "../actions";
import { CartItemRow } from "./CartItemRow";
import type { CartItem } from "../lib/session";

type Props = { items: CartItem[] };

export function CartList({ items: initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  const { execute: restoreItem } = useAction(addToCart, {
    onSuccess: () => router.refresh(),
  });

  const handleRemove = (item: CartItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    toast("Produkt usunięty", {
      action: {
        label: "Cofnij",
        onClick: () => {
          setItems((prev) => [...prev, item]);
          restoreItem({ variantId: item.variantId, quantity: item.quantity });
        },
      },
      duration: 5000,
    });
  };

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">Koszyk jest pusty</p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <CartItemRow key={item.id} item={item} onRemove={() => handleRemove(item)} />
      ))}
    </div>
  );
}
