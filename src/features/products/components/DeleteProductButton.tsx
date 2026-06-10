"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProduct } from "../actions";

interface Props {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { execute, isPending } = useAction(deleteProduct, {
    onSuccess: () => {
      router.refresh();
      toast.success(`Usunięto: ${productName}`);
    },
    onError: ({ error }) => {
      const msg = error?.serverError ?? "Błąd usuwania produktu";
      toast.error(msg);
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-destructive px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-3.5" />
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń produkt</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć „{productName}"? Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => execute({ id: productId })}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Usuwanie…" : "Usuń"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
