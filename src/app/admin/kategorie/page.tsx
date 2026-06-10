import { CategoryForm } from "@/features/products/components/CategoryForm";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return <CategoryForm categories={categories} />;
}
