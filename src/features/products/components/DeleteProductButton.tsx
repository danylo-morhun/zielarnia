"use client";

import { useAction } from "next-safe-action/hooks";
import { deleteProduct } from "../actions";

interface Props {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: Props) {
  const { execute, isPending } = useAction(deleteProduct);

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(`Usunąć produkt "${productName}"?`)) {
          execute({ id: productId });
        }
      }}
      className="rounded border border-destructive px-2 py-1 text-xs text-destructive disabled:opacity-50"
    >
      {isPending ? "…" : "Usuń"}
    </button>
  );
}
