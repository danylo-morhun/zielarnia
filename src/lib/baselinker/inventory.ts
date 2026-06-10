// Required env: BASELINKER_INVENTORY_ID
// Optional env: BASELINKER_WAREHOUSE_ID (default 0 = default BL warehouse)
import { prisma } from "@/lib/prisma";
import { blCall } from "./client";

const inventoryId = () => process.env.BASELINKER_INVENTORY_ID ?? "";
const warehouseId = () => Number(process.env.BASELINKER_WAREHOUSE_ID ?? 0);

export async function syncProductToBaselinker(productId: string): Promise<void> {
  if (!inventoryId()) return;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: { where: { isActive: true } } },
  });
  if (!product) return;

  for (const variant of product.variants) {
    const name = variant.optionValue
      ? `${product.namePl} – ${variant.optionValue}`
      : product.namePl;

    const productData = {
      ean: variant.ean ?? "",
      sku: variant.sku,
      name: { pl: name },
      description: { pl: product.descriptionPl ?? "" },
      weight: variant.weightGrams ? variant.weightGrams / 1000 : 0,
      prices: { [warehouseId()]: variant.pricePln / 100 },
      stock: { [warehouseId()]: variant.stock },
    };

    if (variant.baselinkerVariantId) {
      await blCall("updateInventoryProductsData", {
        inventory_id: inventoryId(),
        products: { [variant.baselinkerVariantId]: productData },
      });
    } else {
      const result = await blCall<{ product_id: number }>("addInventoryProduct", {
        inventory_id: inventoryId(),
        ...productData,
      });
      const blId = String(result.product_id);
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { baselinkerVariantId: blId },
      });
      if (!product.baselinkerProductId) {
        await prisma.product.update({
          where: { id: productId },
          data: { baselinkerProductId: blId },
        });
      }
    }
  }
}

export async function syncStockToBaselinker(
  items: { blVariantId: string; stock: number }[],
): Promise<void> {
  if (!inventoryId() || items.length === 0) return;

  const products: Record<string, { stock: Record<number, number> }> = {};
  for (const { blVariantId, stock } of items) {
    products[blVariantId] = { stock: { [warehouseId()]: stock } };
  }

  await blCall("updateInventoryProductsStock", {
    inventory_id: inventoryId(),
    products,
  });
}
