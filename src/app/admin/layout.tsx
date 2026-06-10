import Link from "next/link";
import { signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const lowStockCount = await prisma.productVariant.count({
    where: { stock: { lte: 5, gt: 0 }, trackStock: true },
  });

  const navItems = [
    { href: "/admin/zamowienia", label: "Zamówienia", badge: null },
    { href: "/admin/produkty", label: "Produkty", badge: null },
    { href: "/admin/magazyn", label: "Magazyn", badge: lowStockCount > 0 ? lowStockCount : null },
    { href: "/admin/kategorie", label: "Kategorie", badge: null },
    { href: "/admin/marki", label: "Marki", badge: null },
    { href: "/admin/tagi", label: "Tagi", badge: null },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full shrink-0 md:w-52">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Panel admina
          </p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
                {item.badge !== null && (
                  <span className="rounded-full bg-warning px-1.5 py-0.5 text-xs font-bold text-warning-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Wyloguj się
              </button>
            </form>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
