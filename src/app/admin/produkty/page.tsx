import type { ProductStatus } from "@prisma/client";
import Link from "next/link";
import { DeleteProductButton } from "@/features/products/components/DeleteProductButton";
import { prisma } from "@/lib/prisma";

const STATUS_LABELS: Record<ProductStatus, string> = {
  DRAFT: "Szkic",
  ACTIVE: "Aktywny",
  ARCHIVED: "Zarchiwizowany",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      namePl: true,
      slug: true,
      status: true,
      category: { select: { namePl: true } },
      brand: { select: { name: true } },
      _count: { select: { variants: true } },
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produkty</h1>
        <Link
          href="/admin/produkty/nowy"
          className="rounded bg-foreground px-3 py-1.5 text-sm font-medium text-background"
        >
          + Dodaj produkt
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Nazwa</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Kategoria</th>
              <th className="px-4 py-3 font-medium">Marka</th>
              <th className="px-4 py-3 font-medium">Warianty</th>
              <th className="px-4 py-3 font-medium">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/produkty/${product.id}`}
                    className="font-medium hover:underline"
                  >
                    {product.namePl}
                  </Link>
                  <p className="text-xs text-muted-foreground">{product.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {STATUS_LABELS[product.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.category?.namePl ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{product.brand?.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{product._count.variants}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/produkty/${product.id}`}
                      className="rounded border px-2 py-1 text-xs"
                    >
                      Edytuj
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.namePl} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Brak produktów
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
