import { ProductForm } from "@/features/products/components/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function AdminNewProductPage() {
  const [categories, brands, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { namePl: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nowy produkt</h1>
      <ProductForm categories={categories} brands={brands} tags={tags} />
    </div>
  );
}
