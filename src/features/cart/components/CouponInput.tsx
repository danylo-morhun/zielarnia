"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { verifyCoupon } from "@/features/checkout/actions";
import { formatPrice } from "@/lib/format";

type CouponState = {
  valid: boolean;
  discountPln: number;
  message: string | null;
};

type Props = {
  subtotal: number;
  onDiscount: (discountPln: number) => void;
};

export function CouponInput({ subtotal, onDiscount }: Props) {
  const [code, setCode] = useState("");
  const [couponState, setCouponState] = useState<CouponState | null>(null);

  const { execute, isExecuting } = useAction(verifyCoupon, {
    onSuccess: ({ data }) => {
      if (!data) return;
      setCouponState(data);
      onDiscount(data.valid ? data.discountPln : 0);
    },
  });

  const handleVerify = () => {
    if (!code.trim()) return;
    execute({ code, subtotal });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.toUpperCase());
    if (couponState) {
      setCouponState(null);
      onDiscount(0);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
          placeholder="KOD RABATOWY"
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm uppercase tracking-wider"
        />
        <button
          type="button"
          onClick={handleVerify}
          disabled={isExecuting || !code.trim()}
          className="rounded-md border bg-secondary px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
        >
          {isExecuting ? "…" : "Zastosuj"}
        </button>
      </div>
      {couponState && (
        <p className={`text-sm ${couponState.valid ? "text-success" : "text-destructive"}`}>
          {couponState.valid
            ? `✓ Rabat: -${formatPrice(couponState.discountPln)}`
            : couponState.message}
        </p>
      )}
    </div>
  );
}
