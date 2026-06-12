"use client";

import Link from "next/link";
import { useState } from "react";
import { CouponInput } from "./CouponInput";
import { formatPrice } from "@/lib/format";

type Props = { subtotal: number };

export function CartSummary({ subtotal }: Props) {
  const [discount, setDiscount] = useState(0);
  const total = subtotal - discount;

  return (
    <div className="space-y-4 rounded-lg border border-border p-6">
      <h2 className="font-semibold">Podsumowanie</h2>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Wartość produktów</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Rabat</span>
          <span className="text-success">-{formatPrice(discount)}</span>
        </div>
      )}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Dostawa</span>
        <span className="text-muted-foreground">Wkrótce</span>
      </div>
      <div className="flex justify-between border-t border-border pt-4 font-semibold">
        <span>Razem</span>
        <span>{formatPrice(total)}</span>
      </div>
      <CouponInput subtotal={subtotal} onDiscount={setDiscount} />
      <Link
        href="/zamowienie"
        className="block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-[transform,background-color,color,border-color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-primary-deep active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        Przejdź do kasy
      </Link>
    </div>
  );
}
