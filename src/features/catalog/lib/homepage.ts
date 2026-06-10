import { prisma } from "@/lib/prisma";
import { getCategories } from "../actions";

const productSelect = {
  id: true,
  slug: true,
  namePl: true,
  shortDescPl: true,
  isNewArrival: true,
  isFeatured: true,
  brand: { select: { name: true, slug: true } },
  category: { select: { namePl: true, slug: true } },
  images: {
    where: { isMain: true },
    select: { url: true, altPl: true },
    orderBy: { sortOrder: "asc" as const },
    take: 1,
  },
  variants: {
    where: { isActive: true },
    select: { pricePln: true, comparePricePln: true, stock: true, isDefault: true },
    orderBy: { isDefault: "desc" as const },
    take: 1,
  },
  tags: {
    select: {
      tag: { select: { namePl: true, slug: true, iconUrl: true, type: true } },
    },
  },
} as const;

export async function getHomepageData() {
  const [categories, featured, newArrivals] = await Promise.all([
    getCategories(),
    prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      take: 8,
      orderBy: { updatedAt: "desc" },
      select: productSelect,
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE", isNewArrival: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      select: productSelect,
    }),
  ]);

  return { categories, featured, newArrivals };
}
