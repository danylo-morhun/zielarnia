import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { CartItemRow } from "@/features/cart/components/CartItemRow";
import { CART_COOKIE_NAME, getCart } from "@/features/cart/lib/session";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Koszyk — Twoje Zdrowie",
};

export default async function KoszykPage() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
  const cart = cartId ? await getCart(cartId) : null;
  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <ShoppingBag className="size-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Twój koszyk jest pusty</h1>
          <p className="text-muted-foreground">Przejrzyj katalog i dodaj produkty do koszyka.</p>
          <Link
            href="/katalog"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Przejdź do katalogu
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.variant.pricePln * item.quantity, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold">Koszyk</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y divide-border">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-4 rounded-lg border border-border p-6">
            <h2 className="font-semibold">Podsumowanie</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Wartość produktów</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Dostawa</span>
              <span className="text-muted-foreground">Wkrótce</span>
            </div>
            <div className="flex justify-between border-t border-border pt-4 font-semibold">
              <span>Razem</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground opacity-50"
            >
              Przejdź do kasy
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Dostawa i płatność — wkrótce
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
