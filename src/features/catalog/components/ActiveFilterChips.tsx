"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { X } from "lucide-react";

type Props = {
  categories: { slug: string; namePl: string }[];
  brands: { slug: string; name: string }[];
  tags: { slug: string; namePl: string }[];
  basePath?: string;
};

export function ActiveFilterChips({ categories, brands, tags, basePath = "/katalog" }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("kategoria");
  const activeBrand = searchParams.get("marka");
  const activeTags = searchParams.get("tagi")?.split(",").filter(Boolean) ?? [];

  const chips: { label: string; onRemove: () => void }[] = [];

  if (activeCategory) {
    const cat = categories.find((c) => c.slug === activeCategory);
    chips.push({
      label: cat?.namePl ?? activeCategory,
      onRemove: () => {
        const p = new URLSearchParams(searchParams.toString());
        p.delete("kategoria");
        router.push(`${basePath}?${p.toString()}`);
      },
    });
  }

  if (activeBrand) {
    const brand = brands.find((b) => b.slug === activeBrand);
    chips.push({
      label: brand?.name ?? activeBrand,
      onRemove: () => {
        const p = new URLSearchParams(searchParams.toString());
        p.delete("marka");
        router.push(`${basePath}?${p.toString()}`);
      },
    });
  }

  for (const tagSlug of activeTags) {
    const tag = tags.find((t) => t.slug === tagSlug);
    chips.push({
      label: tag?.namePl ?? tagSlug,
      onRemove: () => {
        const p = new URLSearchParams(searchParams.toString());
        const remaining = activeTags.filter((s) => s !== tagSlug).join(",");
        if (remaining) p.set("tagi", remaining);
        else p.delete("tagi");
        router.push(`${basePath}?${p.toString()}`);
      },
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pb-3">
      {chips.map((chip) => (
        <span
          key={chip.label}
          className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
        >
          {chip.label}
          <button onClick={chip.onRemove} className="ml-1 rounded-full hover:text-destructive">
            <X className="size-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
