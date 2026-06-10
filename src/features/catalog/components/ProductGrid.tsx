import type { ProductListItem } from "../actions";
import { ProductCard } from "./ProductCard";

type Props = {
  products: ProductListItem[];
};

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-foreground">Brak produktów</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Zmień filtry lub wróć do pełnego katalogu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
