import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Marki",
  description:
    "Przeglądaj produkty według marek — suplementy, witaminy i produkty bio najwyższej jakości.",
};

export default async function MarkiPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      logo: true,
      countryCode: true,
      _count: { select: { products: true } },
    },
  });

  return (
    <main className="container mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-3xl">Marki</h1>

      {brands.length === 0 ? (
        <p className="text-muted-foreground">Brak marek do wyświetlenia.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/marki/${brand.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl bg-card p-4 text-center shadow-card transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {brand.logo ? (
                <div className="relative h-14 w-full">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 640px) 40vw, 20vw"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-14 w-full items-center justify-center rounded-md bg-muted text-lg font-bold text-muted-foreground">
                  {brand.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary">
                  {brand.name}
                </p>
                <p className="text-xs text-muted-foreground">{brand._count.products} produktów</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
