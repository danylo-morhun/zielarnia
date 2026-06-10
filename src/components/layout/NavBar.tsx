import { Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CartIcon } from "@/features/cart/components/CartIcon";
import {
  WishlistIcon,
  WishlistIconFallback,
} from "@/features/wishlist/components/WishlistIcon";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/katalog" className="text-lg font-bold tracking-tight text-foreground">
          Twoje Zdrowie
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/katalog"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Katalog
          </Link>
          <Link
            href="/marki"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Marki
          </Link>
          <Link
            href="/kategorie"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Kategorie
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/katalog?szukaj="
            aria-label="Szukaj produktów"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
