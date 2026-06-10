import { StockTable } from "@/features/products/components/StockTable";
import { prisma } from "@/lib/prisma";

export default async function AdminMagazynPage() {
  const variants = await prisma.productVariant.findMany({
    where: { isActive: true },
    orderBy: { sku: "asc" },
    select: {
      id: true,
      sku: true,
      stock: true,
      optionValue: true,
      product: { select: { namePl: true } },
    },
  });

  const rows = variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    stock: v.stock,
    optionValue: v.optionValue,
    productName: v.product.namePl,
  }));

  return <StockTable variants={rows} />;
}
