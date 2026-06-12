"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { saveAddress } from "../actions";
import type { AddressInput } from "../schema";

type Props = {
  initial?: Partial<AddressInput> & { id?: string };
  onDone: () => void;
};

const EMPTY: AddressInput = {
  firstName: "",
  lastName: "",
  company: "",
  street: "",
  apartment: "",
  city: "",
  postalCode: "",
  phone: "",
  type: "shipping",
  isDefault: false,
};

export function AddressForm({ initial, onDone }: Props) {
  const [form, setForm] = useState<AddressInput & { id?: string }>({
    ...EMPTY,
    ...initial,
  });

  const { execute, isPending, result, hasErrored } = useAction(saveAddress, {
    onSuccess: onDone,
  });

  const error = result?.serverError ?? (hasErrored ? "Wystąpił błąd" : null);
  const fieldErrors = result?.validationErrors;

  function update(field: keyof AddressInput) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    execute(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border p-4">
      <h3 className="font-medium">{form.id ? "Edytuj adres" : "Nowy adres"}</h3>

      {error && (
        <p className="rounded bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="addr-firstName">
            Imię
          </label>
          <input
            id="addr-firstName"
            type="text"
            required
            value={form.firstName}
            onChange={update("firstName")}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {fieldErrors?.firstName?._errors?.[0] && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.firstName._errors[0]}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="addr-lastName">
            Nazwisko
          </label>
          <input
            id="addr-lastName"
            type="text"
            required
            value={form.lastName}
            onChange={update("lastName")}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="addr-company">
          Firma (opcjonalnie)
        </label>
        <input
          id="addr-company"
          type="text"
          value={form.company ?? ""}
          onChange={update("company")}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="addr-street">
          Ulica i numer
        </label>
        <input
          id="addr-street"
          type="text"
          required
          value={form.street}
          onChange={update("street")}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {fieldErrors?.street?._errors?.[0] && (
          <p className="mt-1 text-xs text-destructive">{fieldErrors.street._errors[0]}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="addr-apartment">
          Numer lokalu (opcjonalnie)
        </label>
        <input
          id="addr-apartment"
          type="text"
          value={form.apartment ?? ""}
          onChange={update("apartment")}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="addr-postalCode">
            Kod pocztowy
          </label>
          <input
            id="addr-postalCode"
            type="text"
            required
            placeholder="00-000"
            pattern="\d{2}-\d{3}"
            value={form.postalCode}
            onChange={update("postalCode")}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {fieldErrors?.postalCode?._errors?.[0] && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.postalCode._errors[0]}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="addr-city">
            Miasto
          </label>
          <input
            id="addr-city"
            type="text"
            required
            value={form.city}
            onChange={update("city")}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="addr-phone">
          Telefon (opcjonalnie)
        </label>
        <input
          id="addr-phone"
          type="tel"
          value={form.phone ?? ""}
          onChange={update("phone")}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
        />
        Ustaw jako domyślny
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary-deep motion-reduce:transition-none disabled:opacity-50"
        >
          {isPending ? "Zapisywanie..." : "Zapisz"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-border px-5 py-2 text-sm font-medium hover:bg-muted"
        >
          Anuluj
        </button>
      </div>
    </form>
  );
}
