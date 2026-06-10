import { BrandForm } from "@/features/products/components/BrandForm";
import { prisma } from "@/lib/prisma";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return <BrandForm brands={brands} />;
}
