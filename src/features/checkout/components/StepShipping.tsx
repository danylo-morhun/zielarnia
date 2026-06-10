"use client";

import { formatPrice } from "@/lib/format";
import type { CheckoutFormData } from "./CheckoutForm";

type Props = {
  data: CheckoutFormData;
  onChange: (updates: Partial<CheckoutFormData>) => void;
  onBack: () => void;
  onNext: () => void;
};

const SHIPPING_OPTIONS = [
  { value: "INPOST_PACZKOMAT" as const, label: "InPost Paczkomat", cost: 1299 },
  { value: "DHL" as const, label: "DHL Kurier", cost: 1999 },
  { value: "DPD" as const, label: "DPD Kurier", cost: 1999 },
];

export function StepShipping({ data, onChange, onBack, onNext }: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold">Metoda dostawy</h2>

      <div className="space-y-3">
        {SHIPPING_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
              data.shippingMethod === opt.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shippingMethod"
                value={opt.value}
                checked={data.shippingMethod === opt.value}
                onChange={() => onChange({ shippingMethod: opt.value })}
                className="accent-primary"
              />
              <span className="text-sm font-medium">{opt.label}</span>
            </div>
            <span className="text-sm font-semibold">{formatPrice(opt.cost)}</span>
          </label>
        ))}
      </div>

      {data.shippingMethod === "INPOST_PACZKOMAT" && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="mb-3 text-sm font-medium">Identyfikator paczkomatu</p>
          <p className="mb-3 text-xs text-muted-foreground">
            Podaj ID paczkomatu (np. WAW123M). Mapa paczkomatów dostępna wkrótce.
          </p>
          <input
            type="text"
            required
            placeholder="np. WAW123M"
            value={data.inpostMachineId}
            onChange={(e) => onChange({ inpostMachineId: e.target.value.toUpperCase() })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      <div className="border-t border-border pt-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={data.wantsFaktura}
            onChange={(e) => onChange({ wantsFaktura: e.target.checked })}
            className="accent-primary"
          />
          <span className="text-sm font-medium">Chcę fakturę VAT</span>
        </label>
      </div>

      {data.wantsFaktura && (
        <div className="space-y-4 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold">Dane do faktury</h3>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="billCompany">
              Nazwa firmy
            </label>
            <input
              id="billCompany"
              type="text"
              required
              value={data.billCompany}
              onChange={(e) => onChange({ billCompany: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="billNip">
              NIP (10 cyfr)
            </label>
            <input
              id="billNip"
              type="text"
              required
              maxLength={10}
              pattern="\d{10}"
              value={data.billNip}
              onChange={(e) => onChange({ billNip: e.target.value.replace(/\D/g, "") })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="billStreet">
              Ulica i numer
            </label>
            <input
              id="billStreet"
              type="text"
              required
              value={data.billStreet}
              onChange={(e) => onChange({ billStreet: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="billPostalCode">
                Kod pocztowy
              </label>
              <input
                id="billPostalCode"
                type="text"
                required
                placeholder="00-000"
                pattern="\d{2}-\d{3}"
                value={data.billPostalCode}
                onChange={(e) => onChange({ billPostalCode: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="billCity">
                Miasto
              </label>
              <input
                id="billCity"
                type="text"
                required
                value={data.billCity}
                onChange={(e) => onChange({ billCity: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-medium hover:bg-muted/50"
        >
          Wstecz
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Dalej: Płatność
        </button>
      </div>
    </form>
  );
}
