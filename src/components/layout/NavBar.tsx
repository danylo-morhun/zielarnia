import { Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CartIcon } from "@/features/cart/components/CartIcon";
import { WishlistIcon, WishlistIconFallback } from "@/features/wishlist/components/WishlistIcon";
import { auth } from "@/lib/auth";

const navLinks = [
  { label: "Katalog", href: "/katalog" },
  { label: "Kategorie", href: "/kategorie" },
  { label: "Marki", href: "/marki" },
  { label: "Promocje", href: "/katalog?promocje=1" },
];

export async function NavBar() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        <Link
          href="/"
          className="shrink-0 font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          Twoje Zdrowie
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <search className="hidden flex-1 justify-end md:flex">
          <form action="/katalog" className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="szukaj"
              placeholder="Szukaj witamin, suplementów…"
              aria-label="Szukaj produktów"
              className="w-full rounded-lg border border-border bg-muted/60 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </form>
        </search>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/katalog?szukaj="
            aria-label="Szukaj produktów"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            <Search className="size-5" />
          </Link>
          <Suspense fallback={<WishlistIconFallback />}>
            <WishlistIcon />
          </Suspense>
          <Suspense
            fallback={
              <span className="rounded-md p-2 text-muted-foreground">
                <ShoppingBag className="size-5" />
              </span>
            }
          >
            <CartIcon />
          </Suspense>
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin/zamowienia"
              className="rounded-md px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Admin
            </Link>
          )}
          <Link
            href="/konto"
            aria-label="Moje konto"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <User className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
