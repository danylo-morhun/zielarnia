import Link from "next/link";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import type { ProductListItem } from "@/features/catalog/actions";

type Props = {
  products: ProductListItem[];
  title: string;
  href: string;
};

export function BestsellerRow({ products, title, href }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-balance font-heading text-2xl font-semibold">{title}</h2>
        <Link href={href} className="text-sm font-medium text-primary transition-colors duration-150 hover:text-primary/70">
          Zobacz wszystkie →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p, index) => (
          <ProductCard key={p.id} product={p} priority={index < 4} />
        ))}
      </div>
    </section>
  );
}
