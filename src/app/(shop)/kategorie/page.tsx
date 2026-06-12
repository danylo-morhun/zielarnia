import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Kategorie",
  description: "Przeglądaj produkty według kategorii — suplementy, witaminy i produkty bio.",
};

export default async function KategoriePage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      slug: true,
      namePl: true,
      image: true,
      children: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          slug: true,
          namePl: true,
          _count: { select: { products: { where: { status: "ACTIVE" } } } },
        },
      },
      _count: { select: { products: { where: { status: "ACTIVE" } } } },
    },
  });

  return (
    <main className="container mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-3xl">Kategorie</h1>

      {categories.length === 0 ? (
        <p className="text-muted-foreground">Brak kategorii do wyświetlenia.</p>
      ) : (
        <div className="space-y-10">
          {categories.map((cat) => (
            <section key={cat.id}>
              <Link
                href={`/kategoria/${cat.slug}`}
                className="group mb-4 flex items-center gap-3 hover:text-primary"
              >
                {cat.image ? (
                  <div className="relative size-10 shrink-0">
                    <Image src={cat.image} alt={cat.namePl} fill className="object-contain" />
                  </div>
                ) : null}
                <h2 className="text-xl">{cat.namePl}</h2>
                <span className="text-sm text-muted-foreground">({cat._count.products})</span>
              </Link>

              {cat.children.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {cat.children.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/kategoria/${sub.slug}`}
                      className="rounded-full bg-secondary px-3.5 py-2 text-sm text-secondary-foreground transition-colors duration-200 hover:bg-primary hover:text-primary-foreground motion-reduce:transition-none"
                    >
                      <span className="font-medium">{sub.namePl}</span>
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({sub._count.products})
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
