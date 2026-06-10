import { getProducts } from "../actions";
import type { CatalogFilters } from "../lib/filters";
import { Pagination } from "./Pagination";
import { ProductGrid } from "./ProductGrid";

type Props = {
  filters: CatalogFilters;
};

export async function ProductGridServer({ filters }: Props) {
  const { items, total } = await getProducts(filters);

  return (
    <>
      <p className="text-sm text-muted-foreground">
        {total} {total === 1 ? "produkt" : total < 5 ? "produkty" : "produktów"}
      </p>
      <ProductGrid products={items} />
      <Pagination filters={filters} total={total} />
    </>
  );
}
