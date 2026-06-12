"use client";

import type { Category } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { deleteCategory, saveCategory } from "../actions";

interface Props {
  categories: Category[];
}

export function CategoryForm({ categories }: Props) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [showNew, setShowNew] = useState(false);

  const { execute: execSave, isPending: saving } = useAction(saveCategory, {
    onSuccess: () => {
      setEditing(null);
      setShowNew(false);
    },
  });
  const { execute: execDelete, isPending: deleting } = useAction(deleteCategory);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    execSave({
      id: (fd.get("id") as string) || undefined,
      slug: fd.get("slug") as string,
      namePl: fd.get("namePl") as string,
      nameEn: (fd.get("nameEn") as string) || undefined,
      sortOrder: Number(fd.get("sortOrder") || 0),
    });
  }

  const form = (item?: Category) => (
    <form onSubmit={handleSubmit} className="mt-2 grid gap-2 rounded-2xl bg-card p-4 shadow-card">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid grid-cols-2 gap-2">
        <input
          name="namePl"
          defaultValue={item?.namePl}
          placeholder="Nazwa (PL) *"
          required
          className="rounded-lg border border-border px-2 py-1 text-sm"
        />
        <input
          name="slug"
          defaultValue={item?.slug}
          placeholder="Slug *"
          required
          className="rounded-lg border border-border px-2 py-1 text-sm"
        />
        <input
          name="nameEn"
          defaultValue={item?.nameEn ?? ""}
          placeholder="Nazwa (EN)"
          className="rounded-lg border border-border px-2 py-1 text-sm"
        />
        <input
          name="sortOrder"
          type="number"
          defaultValue={item?.sortOrder ?? 0}
          placeholder="Kolejność"
          className="rounded-lg border border-border px-2 py-1 text-sm"
        />
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
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kategorie</h1>
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary-deep motion-reduce:transition-none"
        >
          + Dodaj
        </button>
      </div>
      {showNew && !editing && form()}
      <div className="divide-y divide-border rounded-2xl bg-card shadow-card">
        {categories.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium">{cat.namePl}</p>
                <p className="text-xs text-muted-foreground">{cat.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(cat)}
                  className="rounded-lg border border-border px-2 py-1 text-xs"
                >
                  Edytuj
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => {
                    if (confirm(`Usunąć kategorię "${cat.namePl}"?`)) execDelete({ id: cat.id });
                  }}
                  className="rounded-lg border border-border border-destructive px-2 py-1 text-xs text-destructive disabled:opacity-50"
                >
                  Usuń
                </button>
              </div>
            </div>
            {editing?.id === cat.id && form(cat)}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">Brak kategorii</p>
        )}
      </div>
    </div>
  );
}
