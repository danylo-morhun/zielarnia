import { SideNav } from "@/components/layout/SideNav";
import { signOut } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/konto/profil", label: "Profil" },
  { href: "/konto/adresy", label: "Adresy" },
  { href: "/konto/zamowienia", label: "Zamówienia" },
];

export default function KontoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full shrink-0 md:w-56">
          <div className="rounded-2xl bg-card p-3 shadow-card">
            <p className="mb-2 px-3.5 pt-1 text-sm font-bold text-foreground">Moje konto</p>
            <nav className="flex flex-col gap-0.5">
              <SideNav items={NAV_ITEMS} />
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground motion-reduce:transition-none"
                >
                  Wyloguj się
                </button>
              </form>
            </nav>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
