"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { adminActionClient } from "@/lib/safe-action";
import {
  brandSchema,
  bulkUpdateStockSchema,
  categorySchema,
  deleteByIdSchema,
  deleteImageSchema,
  productImageSchema,
  productSchema,
  tagSchema,
  variantSchema,
} from "./schema";

// ─── Categories ───────────────────────────────────────────────────────────────

export const saveCategory = adminActionClient
  .schema(categorySchema)
  .action(async ({ parsedInput: input }) => {
    const { id, image, nameEn, nameUk, descriptionPl, parentId, ...data } = input;
    const payload = {
      ...data,
      image: image || null,
      nameEn: nameEn || null,
      nameUk: nameUk || null,
      descriptionPl: descriptionPl || null,
      parentId: parentId || null,
    };
    if (id) {
      await prisma.category.update({ where: { id }, data: payload });
    } else {
      await prisma.category.create({ data: payload });
    }
    revalidatePath("/admin/kategorie");
    revalidatePath("/katalog", "layout");
    return { success: true };
  });

export const deleteCategory = adminActionClient
  .schema(deleteByIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/kategorie");
    revalidatePath("/katalog", "layout");
    return { success: true };
  });

// ─── Brands ───────────────────────────────────────────────────────────────────

export const saveBrand = adminActionClient
  .schema(brandSchema)
  .action(async ({ parsedInput: input }) => {
    const { id, logo, website, description, countryCode, ...data } = input;
    const payload = {
      ...data,
      logo: logo || null,
      website: website || null,
      description: description || null,
      countryCode: countryCode || null,
    };
    if (id) {
      await prisma.brand.update({ where: { id }, data: payload });
    } else {
      await prisma.brand.create({ data: payload });
    }
    revalidatePath("/admin/marki");
    revalidatePath("/marki", "layout");
    return { success: true };
  });

export const deleteBrand = adminActionClient
  .schema(deleteByIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.brand.delete({ where: { id } });
    revalidatePath("/admin/marki");
    revalidatePath("/marki", "layout");
    return { success: true };
  });

// ─── Tags ─────────────────────────────────────────────────────────────────────

export const saveTag = adminActionClient
  .schema(tagSchema)
  .action(async ({ parsedInput: input }) => {
    const { id, iconUrl, nameEn, ...data } = input;
    const payload = {
      ...data,
      iconUrl: iconUrl || null,
      nameEn: nameEn || null,
    };
    if (id) {
      await prisma.tag.update({ where: { id }, data: payload });
    } else {
      await prisma.tag.create({ data: payload });
    }
    revalidatePath("/admin/tagi");
    return { success: true };
  });

export const deleteTag = adminActionClient
  .schema(deleteByIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.tag.delete({ where: { id } });
    revalidatePath("/admin/tagi");
    return { success: true };
  });

// ─── Products ─────────────────────────────────────────────────────────────────

export const saveProduct = adminActionClient
  .schema(productSchema)
  .action(async ({ parsedInput: input }) => {
    const { id, tagIds, categoryId, brandId, countryOfOrigin, ...data } = input;
    const payload = {
      ...data,
      categoryId: categoryId || null,
      brandId: brandId || null,
      countryOfOrigin: countryOfOrigin || null,
    };

    await prisma.$transaction(async (tx) => {
      let resolvedId = id;
      if (resolvedId) {
        await tx.product.update({ where: { id: resolvedId }, data: payload });
      } else {
        const created = await tx.product.create({ data: payload });
        resolvedId = created.id;
      }
      // Sync tags
      await tx.productTag.deleteMany({ where: { productId: resolvedId } });
      if (tagIds.length > 0) {
        await tx.productTag.createMany({
          data: tagIds.map((tagId) => ({ productId: resolvedId as string, tagId })),
        });
      }
    });

    revalidatePath("/admin/produkty");
    revalidatePath("/katalog", "layout");
    return { success: true };
  });

export const deleteProduct = adminActionClient
  .schema(deleteByIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    const hasOrders = await prisma.orderItem.findFirst({
      where: { variant: { productId: id } },
    });
    if (hasOrders) {
      throw new Error("Nie można usunąć produktu z przypisanymi zamówieniami");
    }
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/produkty");
    revalidatePath("/katalog", "layout");
    return { success: true };
  });

// ─── Variants ─────────────────────────────────────────────────────────────────

export const saveVariant = adminActionClient
  .schema(variantSchema)
  .action(async ({ parsedInput: input }) => {
    const {
      id,
      ean,
      optionLabel,
      optionValue,
      comparePricePln,
      costPricePln,
      weightGrams,
      ...data
    } = input;
    const payload = {
      ...data,
      ean: ean || null,
      optionLabel: optionLabel || null,
      optionValue: optionValue || null,
      comparePricePln: comparePricePln ?? null,
      costPricePln: costPricePln ?? null,
      weightGrams: weightGrams ?? null,
    };
    if (id) {
      await prisma.productVariant.update({ where: { id }, data: payload });
    } else {
      await prisma.productVariant.create({ data: payload });
    }
    revalidatePath("/admin/produkty");
    revalidatePath(`/admin/produkty/${input.productId}`);
    return { success: true };
  });

export const deleteVariant = adminActionClient
  .schema(deleteByIdSchema)
  .action(async ({ parsedInput: { id } }) => {
    const hasOrders = await prisma.orderItem.findFirst({ where: { variantId: id } });
    if (hasOrders) {
      throw new Error("Nie można usunąć wariantu z przypisanymi zamówieniami");
    }
    await prisma.productVariant.delete({ where: { id } });
    revalidatePath("/admin/produkty");
    return { success: true };
  });

// ─── Bulk stock ───────────────────────────────────────────────────────────────

export const bulkUpdateStock = adminActionClient
  .schema(bulkUpdateStockSchema)
  .action(async ({ parsedInput: { updates } }) => {
    await prisma.$transaction(
      updates.map(({ variantId, stock }) =>
        prisma.productVariant.update({ where: { id: variantId }, data: { stock } }),
      ),
    );
    revalidatePath("/admin/magazyn");
    return { success: true };
  });

// ─── Product images ───────────────────────────────────────────────────────────

export const addProductImage = adminActionClient
  .schema(productImageSchema)
  .action(async ({ parsedInput: input }) => {
    const { altPl, ...data } = input;
    await prisma.productImage.create({
      data: { ...data, altPl: altPl || null },
    });
    revalidatePath("/admin/produkty");
    revalidatePath(`/admin/produkty/${input.productId}`);
    return { success: true };
  });

export const deleteProductImage = adminActionClient
  .schema(deleteImageSchema)
  .action(async ({ parsedInput: { imageId, productId } }) => {
    await prisma.productImage.delete({ where: { id: imageId } });
    revalidatePath("/admin/produkty");
    revalidatePath(`/admin/produkty/${productId}`);
    return { success: true };
  });
