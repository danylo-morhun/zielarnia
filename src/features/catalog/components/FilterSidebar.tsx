"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { BrandItem, CategoryItem, TagItem } from "../actions";

type Props = {
  categories: CategoryItem[];
  brands: BrandItem[];
  tags: TagItem[];
  basePath?: string;
  onFilterChange?: () => void;
};

export function FilterSidebar({ categories, brands, tags, basePath = "/katalog", onFilterChange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const active = {
    category: searchParams.get("kategoria"),
    brand: searchParams.get("marka"),
    tags: searchParams.get("tagi")?.split(",").filter(Boolean) ?? [],
    sort: searchParams.get("sortuj") ?? "newest",
  };

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("strona");
      router.push(`${basePath}?${params.toString()}`);
      onFilterChange?.();
    },
    [router, searchParams, basePath, onFilterChange],
  );

  const toggleTag = useCallback(
    (slug: string) => {
      const current = searchParams.get("tagi")?.split(",").filter(Boolean) ?? [];
      const next = current.includes(slug) ? current.filter((t) => t !== slug) : [...current, slug];
      setParam("tagi", next.length > 0 ? next.join(",") : null);
    },
    [searchParams, setParam],
  );

  const clearAll = useCallback(() => {
    router.push(basePath);
    onFilterChange?.();
  }, [router, basePath, onFilterChange]);

  const hasActiveFilters = active.category || active.brand || active.tags.length > 0;

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Filtry</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Wyczyść
          </button>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Sortowanie
        </p>
        <select
          value={active.sort}
          onChange={(e) => setParam("sortuj", e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="newest">Najnowsze</option>
          <option value="name_asc">Nazwa A–Z</option>
          <option value="name_desc">Nazwa Z–A</option>
        </select>
      </div>

      {categories.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Kategoria
          </p>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() =>
                    setParam("kategoria", active.category === cat.slug ? null : cat.slug)
                  }
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                    active.category === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <span>{cat.namePl}</span>
                  <span className="text-xs opacity-70">{cat._count.products}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {brands.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Marka
          </p>
          <ul className="space-y-1">
            {brands.map((brand) => (
              <li key={brand.id}>
                <button
                  type="button"
                  onClick={() => setParam("marka", active.brand === brand.slug ? null : brand.slug)}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                    active.brand === brand.slug
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <span>{brand.name}</span>
                  <span className="text-xs opacity-70">{brand._count.products}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Cechy
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isActive = active.tags.includes(tag.slug);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {tag.namePl}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
