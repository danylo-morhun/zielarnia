"use client";

import type { Brand, Category, Product, ProductStatus, ProductTag, Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { saveProduct } from "../actions";

const STATUS_LABELS: Record<ProductStatus, string> = {
  DRAFT: "Szkic",
  ACTIVE: "Aktywny",
  ARCHIVED: "Zarchiwizowany",
};

type ProductWithTags = Product & { tags: ProductTag[] };

interface Props {
  product?: ProductWithTags;
  categories: Category[];
  brands: Brand[];
  tags: Tag[];
}

export function ProductForm({ product, categories, brands, tags }: Props) {
  const router = useRouter();
  const { execute, isPending } = useAction(saveProduct, {
    onSuccess: () => {
      if (!product) router.push("/admin/produkty");
    },
  });

  const selectedTagIds = product?.tags.map((t) => t.tagId) ?? [];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const tagIds = fd.getAll("tagIds") as string[];
    const healthWarningsRaw = fd.get("healthWarnings") as string;
    const healthWarnings = healthWarningsRaw
      ? healthWarningsRaw
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    execute({
      id: (fd.get("id") as string) || undefined,
      slug: fd.get("slug") as string,
      namePl: fd.get("namePl") as string,
      nameEn: (fd.get("nameEn") as string) || undefined,
      nameUk: (fd.get("nameUk") as string) || undefined,
      shortDescPl: (fd.get("shortDescPl") as string) || undefined,
      descriptionPl: (fd.get("descriptionPl") as string) || undefined,
      status: fd.get("status") as ProductStatus,
      categoryId: (fd.get("categoryId") as string) || undefined,
      brandId: (fd.get("brandId") as string) || undefined,
      isFeatured: fd.get("isFeatured") === "on",
      isNewArrival: fd.get("isNewArrival") === "on",
      netWeight: (fd.get("netWeight") as string) || undefined,
      servingSize: (fd.get("servingSize") as string) || undefined,
      storageInfo: (fd.get("storageInfo") as string) || undefined,
      countryOfOrigin: (fd.get("countryOfOrigin") as string) || undefined,
      healthWarnings,
      metaTitlePl: (fd.get("metaTitlePl") as string) || undefined,
      metaDescPl: (fd.get("metaDescPl") as string) || undefined,
      tagIds,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}

      {/* Basic info */}
      <section className="rounded-2xl bg-card p-5 shadow-card">
        <h2 className="mb-4 font-semibold">Podstawowe informacje</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="namePl" className="mb-1 block text-sm font-medium">
              Nazwa (PL) *
            </label>
            <input
              id="namePl"
              name="namePl"
              defaultValue={product?.namePl}
              required
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="nameEn" className="mb-1 block text-sm font-medium">
              Nazwa (EN)
            </label>
            <input
              id="nameEn"
              name="nameEn"
              defaultValue={product?.nameEn ?? ""}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="slug" className="mb-1 block text-sm font-medium">
              Slug *
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={product?.slug}
              required
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="status" className="mb-1 block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={product?.status ?? "DRAFT"}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">
              Kategoria
            </label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={product?.categoryId ?? ""}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">— brak —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.namePl}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="brandId" className="mb-1 block text-sm font-medium">
              Marka
            </label>
            <select
              id="brandId"
              name="brandId"
              defaultValue={product?.brandId ?? ""}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">— brak —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="shortDescPl" className="mb-1 block text-sm font-medium">
              Krótki opis (PL)
            </label>
            <textarea
              id="shortDescPl"
              name="shortDescPl"
              defaultValue={product?.shortDescPl ?? ""}
              rows={2}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="descriptionPl" className="mb-1 block text-sm font-medium">
              Pełny opis (PL)
            </label>
            <textarea
              id="descriptionPl"
              name="descriptionPl"
              defaultValue={product?.descriptionPl ?? ""}
              rows={6}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-4 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} />
              Wyróżniony
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isNewArrival" defaultChecked={product?.isNewArrival} />
              Nowość
            </label>
          </div>
        </div>
      </section>

      {/* Supplement details */}
      <section className="rounded-2xl bg-card p-5 shadow-card">
        <h2 className="mb-4 font-semibold">Szczegóły suplementu</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="netWeight" className="mb-1 block text-sm font-medium">
              Waga netto
            </label>
            <input
              id="netWeight"
              name="netWeight"
              defaultValue={product?.netWeight ?? ""}
              placeholder="120 g"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="servingSize" className="mb-1 block text-sm font-medium">
              Porcja
            </label>
            <input
              id="servingSize"
              name="servingSize"
              defaultValue={product?.servingSize ?? ""}
              placeholder="2 kapsułki"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="countryOfOrigin" className="mb-1 block text-sm font-medium">
              Kraj pochodzenia
            </label>
            <input
              id="countryOfOrigin"
              name="countryOfOrigin"
              defaultValue={product?.countryOfOrigin ?? ""}
              placeholder="PL"
              maxLength={2}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="healthWarnings" className="mb-1 block text-sm font-medium">
              Ostrzeżenia (każde w nowej linii)
            </label>
            <textarea
              id="healthWarnings"
              name="healthWarnings"
              defaultValue={
                Array.isArray(product?.healthWarnings)
                  ? (product.healthWarnings as string[]).join("\n")
                  : ""
              }
              rows={3}
              placeholder="Suplement diety nie zastępuje zrównoważonej diety…"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="rounded-2xl bg-card p-5 shadow-card">
        <h2 className="mb-4 font-semibold">Tagi</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                name="tagIds"
                value={tag.id}
                defaultChecked={selectedTagIds.includes(tag.id)}
              />
              {tag.namePl}
            </label>
          ))}
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-2xl bg-card p-5 shadow-card">
        <h2 className="mb-4 font-semibold">SEO</h2>
        <div className="grid gap-3">
          <div>
            <label htmlFor="metaTitlePl" className="mb-1 block text-sm font-medium">
              Meta tytuł (PL)
            </label>
            <input
              id="metaTitlePl"
              name="metaTitlePl"
              defaultValue={product?.metaTitlePl ?? ""}
              maxLength={120}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="metaDescPl" className="mb-1 block text-sm font-medium">
              Meta opis (PL)
            </label>
            <textarea
              id="metaDescPl"
              name="metaDescPl"
              defaultValue={product?.metaDescPl ?? ""}
              rows={2}
              maxLength={320}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary-deep disabled:opacity-50 motion-reduce:transition-none"
      >
        {isPending ? "Zapisywanie…" : product ? "Zapisz zmiany" : "Utwórz produkt"}
      </button>
    </form>
  );
}
