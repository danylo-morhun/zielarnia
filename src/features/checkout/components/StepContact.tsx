"use client";

import type { CheckoutFormData } from "./CheckoutForm";

type Props = {
  data: CheckoutFormData;
  onChange: (updates: Partial<CheckoutFormData>) => void;
  onNext: () => void;
};

export function StepContact({ data, onChange, onNext }: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Dane kontaktowe i adres dostawy</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="firstName">
            Imię
          </label>
          <input
            id="firstName"
            type="text"
            required
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="lastName">
            Nazwisko
          </label>
          <input
            id="lastName"
            type="text"
            required
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          required
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="phone">
          Telefon
        </label>
        <input
          id="phone"
          type="tel"
          required
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="street">
          Ulica i numer
        </label>
        <input
          id="street"
          type="text"
          required
          value={data.street}
          onChange={(e) => onChange({ street: e.target.value })}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="apartment">
          Numer lokalu (opcjonalnie)
        </label>
        <input
          id="apartment"
          type="text"
          value={data.apartment}
          onChange={(e) => onChange({ apartment: e.target.value })}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="postalCode">
            Kod pocztowy
          </label>
          <input
            id="postalCode"
            type="text"
            required
            placeholder="00-000"
            pattern="\d{2}-\d{3}"
            value={data.postalCode}
            onChange={(e) => onChange({ postalCode: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="city">
            Miasto
          </label>
          <input
            id="city"
            type="text"
            required
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-2 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
      >
        Dalej: Dostawa
      </button>
    </form>
  );
}
