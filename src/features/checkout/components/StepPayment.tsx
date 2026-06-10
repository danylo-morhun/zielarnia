"use client";

import type { CartItem } from "@/features/cart/lib/session";
import { formatPrice } from "@/lib/format";
import { SHIPPING_COSTS, SHIPPING_LABELS } from "../lib/shipping";
import type { CheckoutFormData } from "./CheckoutForm";

type Props = {
  data: CheckoutFormData;
  onChange: (updates: Partial<CheckoutFormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  items: CartItem[];
  subtotal: number;
  pending: boolean;
  error: string | null;
};

const PAYMENT_OPTIONS = [
  { value: "BLIK" as const, label: "BLIK" },
  { value: "PRZELEWY24" as const, label: "Przelew online (Przelewy24)" },
  { value: "APPLE_PAY" as const, label: "Apple Pay" },
  { value: "GOOGLE_PAY" as const, label: "Google Pay" },
];

export function StepPayment({
  data,
  onChange,
  onBack,
  onSubmit,
  items,
  subtotal,
  pending,
  error,
}: Props) {
  const shippingCost = SHIPPING_COSTS[data.shippingMethod as keyof typeof SHIPPING_COSTS] ?? 1999;
  const shippingLabel =
    SHIPPING_LABELS[data.shippingMethod as keyof typeof SHIPPING_LABELS] ?? data.shippingMethod;
  const total = subtotal + shippingCost;
  const hasCoupon = data.couponCode.trim().length > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Płatność i podsumowanie</h2>

      {/* Order summary */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold">Produkty</h3>
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between py-2 text-sm">
              <span className="text-muted-foreground">
                {item.variant.product.namePl}
                {item.variant.optionValue ? ` (${item.variant.optionValue})` : ""} × {item.quantity}
              </span>
              <span>{formatPrice(item.variant.pricePln * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Produkty</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Dostawa ({shippingLabel})</span>
            <span>{formatPrice(shippingCost)}</span>
          </div>
          {hasCoupon && (
            <div className="flex justify-between text-green-600">
              <span>Rabat ({data.couponCode})</span>
              <span>zostanie naliczony</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-2 font-semibold">
            <span>Łącznie{hasCoupon ? " (przed rabatem)" : ""}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Coupon */}
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="couponCode">
          Kod rabatowy (opcjonalnie)
        </label>
        <input
          id="couponCode"
          type="text"
          value={data.couponCode}
          onChange={(e) => onChange({ couponCode: e.target.value.toUpperCase() })}
          placeholder="RABAT10"
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Payment method */}
      <div>
        <p className="mb-3 text-sm font-medium">Metoda płatności</p>
        <div className="space-y-2">
          {PAYMENT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                data.paymentMethod === opt.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={opt.value}
                checked={data.paymentMethod === opt.value}
                onChange={() => onChange({ paymentMethod: opt.value })}
                className="accent-primary"
              />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={pending}
          className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-medium hover:bg-muted/50 disabled:opacity-50"
        >
          Wstecz
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={pending}
          className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
        >
          {pending ? "Składam zamówienie…" : `Złóż zamówienie — ${formatPrice(total)}`}
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Składając zamówienie akceptujesz regulamin sklepu i politykę prywatności.
      </p>
    </div>
  );
}
