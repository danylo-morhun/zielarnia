import Image from "next/image";
import Link from "next/link";
import type { CategoryItem } from "@/features/catalog/actions";

type Props = { categories: CategoryItem[] };

function pluralProdukt(n: number): string {
  if (n === 1) return "produkt";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) return "produkty";
  return "produktów";
}

export function CategoryGrid({ categories }: Props) {
  const topLevel = categories.filter((c) => c.parentId === null);

  if (topLevel.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-balance font-heading text-2xl font-semibold">Kategorie</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {topLevel.map((cat) => (
          <Link
            key={cat.id}
            href={`/katalog?kategoria=${cat.slug}`}
            className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition-shadow duration-200 hover:shadow-[0_4px_16px_oklch(0.15_0.02_145/0.08)] motion-reduce:transition-none"
          >
            {cat.image ? (
              <div className="relative size-16">
                <Image src={cat.image} alt={cat.namePl} fill className="object-contain" />
              </div>
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-secondary font-heading text-xl font-semibold text-primary">
                {cat.namePl.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium text-foreground">{cat.namePl}</span>
            {cat._count.products > 0 && (
              <span className="-mt-2 text-xs text-muted-foreground">
                {cat._count.products} {pluralProdukt(cat._count.products)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
