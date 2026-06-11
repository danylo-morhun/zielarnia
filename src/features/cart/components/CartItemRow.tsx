"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { removeFromCart, updateQuantity } from "../actions";
import type { CartItem } from "../lib/session";

type Props = {
  item: CartItem;
  onRemove?: () => void;
};

export function CartItemRow({ item, onRemove }: Props) {
  const router = useRouter();
  const { execute: doRemove, isExecuting: removing } = useAction(removeFromCart, {
    onSuccess: () => {
      router.refresh();
      if (!onRemove) toast.success("Usunięto z koszyka");
    },
    onError: () => {
      toast.error("Błąd", { description: "Nie udało się usunąć produktu" });
    },
  });
  const { execute: doUpdate, isExecuting: updating } = useAction(updateQuantity, {
    onSuccess: () => router.refresh(),
    onError: () => {
      toast.error("Błąd", { description: "Nie udało się zaktualizować ilości" });
    },
  });

  const pending = removing || updating;
  const image = item.variant.product.images[0];

  return (
    <div className="flex gap-4 py-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.altPl ?? item.variant.product.namePl}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-xs text-muted-foreground">
            Brak
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{item.variant.product.namePl}</p>
        {item.variant.optionValue && (
          <p className="text-xs text-muted-foreground">{item.variant.optionValue}</p>
        )}
        <p className="text-sm font-semibold">
          {formatPrice(item.variant.pricePln * item.quantity)}
        </p>
        <div className="mt-auto flex items-center gap-2">
          <button
            type="button"
            disabled={pending || item.quantity <= 1}
            onClick={() => doUpdate({ cartItemId: item.id, quantity: item.quantity - 1 })}
            className="flex size-10 items-center justify-center rounded border border-border transition-[transform,background-color,border-color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-muted active:scale-[0.97] disabled:opacity-40 motion-reduce:active:scale-100"
            aria-label="Zmniejsz ilość"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-6 text-center text-sm">{item.quantity}</span>
          <button
            type="button"
            disabled={pending || item.quantity >= item.variant.stock}
            onClick={() => doUpdate({ cartItemId: item.id, quantity: item.quantity + 1 })}
            className="flex size-10 items-center justify-center rounded border border-border transition-[transform,background-color,border-color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-muted active:scale-[0.97] disabled:opacity-40 motion-reduce:active:scale-100"
            aria-label="Zwiększ ilość"
          >
            <Plus className="size-4" />
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (onRemove) {
                onRemove();
                doRemove({ cartItemId: item.id });
              } else {
                doRemove({ cartItemId: item.id });
              }
            }}
            className="ml-auto flex size-10 items-center justify-center rounded transition-[transform,color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] text-muted-foreground hover:text-destructive active:scale-[0.97] disabled:opacity-40 motion-reduce:active:scale-100"
            aria-label="Usuń z koszyka"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
