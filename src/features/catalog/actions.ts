import { prisma } from "@/lib/prisma";
import { buildProductOrderBy, buildProductWhere, type CatalogFilters } from "./lib/filters";

export async function getProducts(filters: CatalogFilters) {
  const where = buildProductWhere(filters);
  const orderBy = buildProductOrderBy(filters.sort);
  const skip = (filters.page - 1) * filters.perPage;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: filters.perPage,
      select: {
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
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
        variants: {
          where: { isDefault: true, isActive: true },
          select: { pricePln: true, comparePricePln: true, stock: true },
          take: 1,
        },
        tags: {
          select: {
            tag: { select: { namePl: true, slug: true, iconUrl: true, type: true } },
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total };
}

export type ProductListItem = Awaited<ReturnType<typeof getProducts>>["items"][number];

export async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    select: {
      id: true,
      slug: true,
      namePl: true,
      nameEn: true,
      shortDescPl: true,
      descriptionPl: true,
      isNewArrival: true,
      isFeatured: true,
      netWeight: true,
      servingSize: true,
      servingsPerContainer: true,
      storageInfo: true,
      countryOfOrigin: true,
      ingredients: true,
      nutritionFacts: true,
      allergenInfo: true,
      healthWarnings: true,
      ageRestriction: true,
      metaTitlePl: true,
      metaDescPl: true,
      brand: {
        select: { id: true, name: true, slug: true, description: true, logo: true },
      },
      category: {
        select: {
          id: true,
          namePl: true,
          slug: true,
          parent: { select: { namePl: true, slug: true } },
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          altPl: true,
          sortOrder: true,
          isMain: true,
          variantId: true,
        },
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          sku: true,
          optionLabel: true,
          optionValue: true,
          pricePln: true,
          comparePricePln: true,
          stock: true,
          isDefault: true,
          weightGrams: true,
        },
        orderBy: { isDefault: "desc" },
      },
      tags: {
        select: {
          tag: {
            select: { id: true, namePl: true, slug: true, iconUrl: true, type: true },
          },
        },
      },
    },
  });
}

export type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProduct>>>;

export async function getCategories() {
  return prisma.category.findMany({
    select: {
      id: true,
      slug: true,
      namePl: true,
      image: true,
      sortOrder: true,
      parentId: true,
      _count: { select: { products: { where: { status: "ACTIVE" } } } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export type CategoryItem = Awaited<ReturnType<typeof getCategories>>[number];

export async function getBrands() {
  return prisma.brand.findMany({
    where: { products: { some: { status: "ACTIVE" } } },
    select: {
      id: true,
      slug: true,
      name: true,
      logo: true,
      _count: { select: { products: { where: { status: "ACTIVE" } } } },
    },
    orderBy: { name: "asc" },
  });
}

export type BrandItem = Awaited<ReturnType<typeof getBrands>>[number];

export async function getTags() {
  return prisma.tag.findMany({
    select: { id: true, slug: true, namePl: true, iconUrl: true, type: true },
    orderBy: { sortOrder: "asc" },
  });
}

export type TagItem = Awaited<ReturnType<typeof getTags>>[number];

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      namePl: true,
      descriptionPl: true,
      image: true,
      parentId: true,
      parent: { select: { namePl: true, slug: true } },
    },
  });
}

export async function getBrandBySlug(slug: string) {
  return prisma.brand.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      logo: true,
      website: true,
      countryCode: true,
    },
  });
}
