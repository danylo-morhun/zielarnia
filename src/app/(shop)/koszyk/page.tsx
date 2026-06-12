import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { CartList } from "@/features/cart/components/CartList";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { ShippingProgress } from "@/features/cart/components/ShippingProgress";
import { auth } from "@/lib/auth";
import { CART_COOKIE_NAME, getCart, getCartByCustomerId } from "@/features/cart/lib/session";

export const metadata: Metadata = {
  title: "Koszyk — Twoje Zdrowie",
};

export default async function KoszykPage() {
  const session = await auth();
  let cart = null;

  if (session?.user?.id) {
    cart = await getCartByCustomerId(session.user.id);
  } else {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
    cart = cartId ? await getCart(cartId) : null;
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <ShoppingBag className="size-12 text-muted-foreground" />
          <h1 className="text-balance text-2xl">Twój koszyk jest pusty</h1>
          <p className="text-muted-foreground">Przejrzyj katalog i dodaj produkty do koszyka.</p>
          <Link
            href="/katalog"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary-deep motion-reduce:transition-none"
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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-balance text-2xl">Koszyk</h1>
        <Link
          href="/katalog"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          ← Kontynuuj zakupy
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <CartList items={items} />
          <ShippingProgress subtotal={subtotal} />
        </div>

        <div className="lg:col-span-1">
          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}
