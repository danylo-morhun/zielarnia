"use client";

import type { Tag, TagType } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { deleteTag, saveTag } from "../actions";

const TAG_TYPE_LABELS: Record<TagType, string> = {
  DIETARY_CLAIM: "Dieta",
  ALLERGEN_FREE: "Bez alergenów",
  CERTIFICATION: "Certyfikat",
  OTHER: "Inne",
};

interface Props {
  tags: Tag[];
}

export function TagForm({ tags }: Props) {
  const [editing, setEditing] = useState<Tag | null>(null);
  const [showNew, setShowNew] = useState(false);

  const { execute: execSave, isPending: saving } = useAction(saveTag, {
    onSuccess: () => {
      setEditing(null);
      setShowNew(false);
    },
  });
  const { execute: execDelete, isPending: deleting } = useAction(deleteTag);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    execSave({
      id: (fd.get("id") as string) || undefined,
      slug: fd.get("slug") as string,
      namePl: fd.get("namePl") as string,
      nameEn: (fd.get("nameEn") as string) || undefined,
      type: fd.get("type") as TagType,
      sortOrder: Number(fd.get("sortOrder") || 0),
    });
  }

  const form = (item?: Tag) => (
    <form onSubmit={handleSubmit} className="mt-2 mb-4 grid gap-2 rounded-2xl bg-card p-4 shadow-card">
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
        <select
          name="type"
          defaultValue={item?.type ?? "OTHER"}
          required
          className="rounded-lg border border-border px-2 py-1 text-sm"
        >
          {Object.entries(TAG_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
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
        <h1 className="text-2xl font-bold">Tagi</h1>
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
        {tags.map((tag) => (
          <div key={tag.id}>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium">{tag.namePl}</p>
                <p className="text-xs text-muted-foreground">
                  {tag.slug} · {TAG_TYPE_LABELS[tag.type]}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(tag)}
                  className="rounded-lg border border-border px-2 py-1 text-xs"
                >
                  Edytuj
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => {
                    if (confirm(`Usunąć tag "${tag.namePl}"?`)) execDelete({ id: tag.id });
                  }}
                  className="rounded-lg border border-border border-destructive px-2 py-1 text-xs text-destructive disabled:opacity-50"
                >
                  Usuń
                </button>
              </div>
            </div>
            {editing?.id === tag.id && form(tag)}
          </div>
        ))}
        {tags.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">Brak tagów</p>
        )}
      </div>
    </div>
  );
}
