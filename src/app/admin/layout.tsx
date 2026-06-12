import { SideNav } from "@/components/layout/SideNav";
import { LogoutButton } from "@/app/admin/components/LogoutButton";
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
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full shrink-0 md:w-56">
          <div className="rounded-2xl bg-card p-3 shadow-card">
            <p className="mb-2 px-3.5 pt-1 text-sm font-bold text-foreground">Panel admina</p>
            <nav className="flex flex-col gap-0.5">
              <SideNav items={navItems} />
              <LogoutButton
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              />
            </nav>
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <div className="max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
