import Link from "next/link";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import type { ProductListItem } from "@/features/catalog/actions";

type Props = {
  products: ProductListItem[];
  title: string;
  href: string;
  variant?: "grid" | "scroll";
};

export function BestsellerRow({ products, title, href, variant = "grid" }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-balance font-heading text-2xl font-semibold">{title}</h2>
        <Link
          href={href}
          className="text-sm font-medium text-primary transition-colors duration-150 hover:text-primary/70"
        >
          Zobacz wszystkie →
        </Link>
      </div>

      {variant === "scroll" ? (
        <div className="-mx-4 px-4 md:-mx-0 md:px-0">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {products.map((p, index) => (
              <div key={p.id} className="w-[200px] shrink-0 snap-start sm:w-[220px]">
                <ProductCard product={p} priority={index < 4} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p, index) => (
            <ProductCard key={p.id} product={p} priority={index < 4} />
          ))}
        </div>
      )}
    </section>
  );
}
