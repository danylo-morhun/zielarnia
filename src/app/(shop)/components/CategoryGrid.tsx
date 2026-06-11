import Link from "next/link";
import Image from "next/image";
import type { CategoryItem } from "@/features/catalog/actions";

type Props = { categories: CategoryItem[] };

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
            className="group flex flex-col items-center gap-3 rounded-xl bg-muted/40 p-5 text-center transition-colors duration-150 hover:bg-primary/8"
          >
            {cat.image ? (
              <div className="relative size-16">
                <Image src={cat.image} alt={cat.namePl} fill className="object-contain" />
              </div>
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-muted text-2xl">
                🌿
              </div>
            )}
            <span className="text-sm font-medium">{cat.namePl}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
