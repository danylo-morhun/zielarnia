"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { addToCart } from "../actions";

type Props = {
  variantId: string;
  disabled?: boolean;
};

export function QuickAddButton({ variantId, disabled = false }: Props) {
  const router = useRouter();
  const [succeeded, setSucceeded] = useState(false);

  const { execute, isExecuting } = useAction(addToCart, {
    onSuccess: () => {
      router.refresh();
      setSucceeded(true);
      setTimeout(() => setSucceeded(false), 1500);
      toast.success("Dodano do koszyka", { duration: 3000 });
    },
    onError: () => {
      toast.error("Błąd", { description: "Nie udało się dodać do koszyka" });
    },
  });

  return (
    <button
      type="button"
      disabled={disabled || isExecuting}
      onClick={(e) => {
        e.preventDefault();
        execute({ variantId, quantity: 1 });
      }}
      className="flex w-full items-center justify-center gap-1.5 rounded-full bg-secondary px-3 py-2.5 text-sm font-semibold text-secondary-foreground transition-[transform,background-color,color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-primary hover:text-primary-foreground active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      <ShoppingCart className="size-4" strokeWidth={1.75} />
      <span
        key={isExecuting ? "loading" : succeeded ? "success" : "idle"}
        className="animate-[btn-text-in_200ms_ease-out_both] motion-reduce:animate-none"
      >
        {isExecuting ? "Dodawanie…" : succeeded ? "✓ Dodano" : "Do koszyka"}
      </span>
    </button>
  );
}
