"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { toggleWishlist } from "../actions";

type Props = {
  productId: string;
  initialInWishlist: boolean;
};

export function WishlistButton({ productId, initialInWishlist }: Props) {
  const router = useRouter();
  const [inWishlist, setInWishlist] = useState(initialInWishlist);

  const { execute, isExecuting } = useAction(toggleWishlist, {
    onSuccess: ({ data }) => {
      if (data) {
        if (data.added) toast.success("Dodano do ulubionych");
        else toast("Usunięto z ulubionych");
      }
      router.refresh();
    },
    onError: () => {
      setInWishlist((prev) => !prev); // revert optimistic update
      toast.error("Błąd", { description: "Nie udało się zaktualizować ulubionych" });
    },
  });

  return (
    <button
      type="button"
      disabled={isExecuting}
      onClick={() => {
        setInWishlist((prev) => !prev); // optimistic
        execute({ productId });
      }}
      aria-label={inWishlist ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      className={`flex size-10 items-center justify-center rounded-full border transition-colors disabled:opacity-50 ${
        inWishlist
          ? "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "border-border bg-background text-muted-foreground hover:border-destructive hover:text-destructive"
      }`}
    >
      <Heart className={`size-5 ${inWishlist ? "fill-current" : ""}`} />
    </button>
  );
}
