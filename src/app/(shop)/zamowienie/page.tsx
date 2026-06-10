import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CART_COOKIE_NAME, getCart } from "@/features/cart/lib/session";
import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Zamówienie — Twoje Zdrowie",
};

export default async function ZamowieniePage() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
  const cart = cartId ? await getCart(cartId) : null;
  const items = cart?.items ?? [];

  if (!cartId || items.length === 0) {
    redirect("/koszyk");
  }

  const subtotal = items.reduce((sum, item) => sum + item.variant.pricePln * item.quantity, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold">Zamówienie</h1>
      <CheckoutForm cartId={cartId} items={items} subtotal={subtotal} />
    </div>
  );
}
