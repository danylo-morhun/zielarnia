"use client";

import { useState } from "react";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";
import type { AddressInput } from "../schema";

type Address = {
  id: string;
  firstName: string;
  lastName: string;
  company: string | null;
  street: string;
  apartment: string | null;
  city: string;
  postalCode: string;
  phone: string | null;
  isDefault: boolean;
};

type Props = { addresses: Address[] };

export function AddressesClient({ addresses }: Props) {
  const [editing, setEditing] = useState<(Partial<AddressInput> & { id?: string }) | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Adresy dostawy</h1>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing({})}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            + Dodaj adres
          </button>
        )}
      </div>

      {editing && (
        <AddressForm initial={editing} onDone={() => setEditing(null)} />
      )}

      {addresses.length === 0 && !editing && (
        <p className="text-sm text-muted-foreground">Brak zapisanych adresów.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onEdit={(a) =>
              setEditing({
                id: a.id,
                firstName: a.firstName,
                lastName: a.lastName,
                company: a.company ?? "",
                street: a.street,
                apartment: a.apartment ?? "",
                city: a.city,
                postalCode: a.postalCode,
                phone: a.phone ?? "",
                isDefault: a.isDefault,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
