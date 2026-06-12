"use client";

import type { ProductVariant } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { deleteVariant, saveVariant } from "../actions";

type SerializedVariant = Omit<ProductVariant, "vatRate"> & { vatRate: number };

interface Props {
  productId: string;
  variants: SerializedVariant[];
}

const EMPTY_FORM = {
  sku: "",
  optionLabel: "",
  optionValue: "",
  pricePln: "",
  stock: "0",
  vatRate: "5",
  isDefault: false,
  isActive: true,
};

export function VariantsTable({ productId, variants }: Props) {
  const [editing, setEditing] = useState<SerializedVariant | null>(null);
  const [showNew, setShowNew] = useState(false);

  const { execute: execSave, isPending: saving } = useAction(saveVariant, {
    onSuccess: () => {
      setEditing(null);
      setShowNew(false);
    },
  });
  const { execute: execDelete, isPending: deleting } = useAction(deleteVariant);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    execSave({
      id: (fd.get("id") as string) || undefined,
      productId,
      sku: fd.get("sku") as string,
      optionLabel: (fd.get("optionLabel") as string) || undefined,
      optionValue: (fd.get("optionValue") as string) || undefined,
      pricePln: Number(fd.get("pricePln")),
      stock: Number(fd.get("stock") || 0),
      vatRate: Number(fd.get("vatRate") || 5),
      isDefault: fd.get("isDefault") === "on",
      isActive: fd.get("isActive") === "on",
    });
  }

  const variantForm = (item?: SerializedVariant) => (
    <form onSubmit={handleSubmit} className="mt-2 grid gap-2 rounded-xl bg-muted p-3">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid grid-cols-3 gap-2">
        <input
          name="sku"
          defaultValue={item?.sku ?? EMPTY_FORM.sku}
          placeholder="SKU *"
          required
          className="rounded-lg border border-border px-2 py-1 text-sm"
        />
        <input
          name="optionLabel"
          defaultValue={item?.optionLabel ?? ""}
          placeholder="Etykieta (np. Pojemność)"
          className="rounded-lg border border-border px-2 py-1 text-sm"
        />
        <input
          name="optionValue"
          defaultValue={item?.optionValue ?? ""}
          placeholder="Wartość (np. 60 kaps.)"
          className="rounded-lg border border-border px-2 py-1 text-sm"
        />
        <div>
          <label className="mb-0.5 block text-xs text-muted-foreground">
            Cena (grosze) *
            <input
              name="pricePln"
              type="number"
              defaultValue={item?.pricePln ?? ""}
              placeholder="4990 = 49.90 zł"
              required
              min={1}
              className="mt-0.5 w-full rounded-lg border border-border px-2 py-1 text-sm font-normal"
            />
          </label>
        </div>
        <div>
          <label className="mb-0.5 block text-xs text-muted-foreground">
            Stan magazynowy
            <input
              name="stock"
              type="number"
              defaultValue={item?.stock ?? 0}
              min={0}
              className="mt-0.5 w-full rounded-lg border border-border px-2 py-1 text-sm font-normal"
            />
          </label>
        </div>
        <div>
          <label className="mb-0.5 block text-xs text-muted-foreground">
            VAT (%)
            <input
              name="vatRate"
              type="number"
              step="0.01"
              defaultValue={Number(item?.vatRate ?? 5)}
              className="mt-0.5 w-full rounded-lg border border-border px-2 py-1 text-sm font-normal"
            />
          </label>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" name="isDefault" defaultChecked={item?.isDefault} />
          Domyślny
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={item?.isActive ?? true} />
          Aktywny
        </label>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary-deep motion-reduce:transition-none disabled:opacity-50"
        >
          {saving ? "…" : "Zapisz"}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowNew(false);
          }}
          className="rounded-lg border border-border px-3 py-1 text-xs"
        >
          Anuluj
        </button>
      </div>
    </form>
  );

  return (
    <section className="rounded-2xl bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Warianty</h2>
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary-deep motion-reduce:transition-none"
        >
          + Dodaj wariant
        </button>
      </div>
      {showNew && !editing && variantForm()}
      <div className="divide-y">
        {variants.map((v) => (
          <div key={v.id}>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">
                  {v.sku}
                  {v.optionValue && (
                    <span className="ml-2 text-muted-foreground">— {v.optionValue}</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(v.pricePln / 100).toLocaleString("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  })}{" "}
                  · stock: {v.stock}
                  {v.isDefault && " · domyślny"}
                  {!v.isActive && " · nieaktywny"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(v)}
                  className="rounded-lg border border-border px-2 py-1 text-xs"
                >
                  Edytuj
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => {
                    if (confirm(`Usunąć wariant "${v.sku}"?`)) execDelete({ id: v.id });
                  }}
                  className="rounded-lg border border-border border-destructive px-2 py-1 text-xs text-destructive disabled:opacity-50"
                >
                  Usuń
                </button>
              </div>
            </div>
            {editing?.id === v.id && variantForm(v)}
          </div>
        ))}
        {variants.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">Brak wariantów</p>
        )}
      </div>
    </section>
  );
}
