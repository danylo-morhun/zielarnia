import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CART_COOKIE_NAME, getCart } from "../lib/session";
import { CartIconClient } from "./CartIconClient";

export async function CartIcon() {
  const session = await auth();

  let cart = null;

  if (session?.user?.id) {
    // Logged-in: fetch customer's cart by customerId (post-merge canonical cart)
    const customerCart = await prisma.cart.findUnique({
      where: { customerId: session.user.id },
      select: { id: true },
    });
    if (customerCart) {
      cart = await getCart(customerCart.id);
    }
  } else {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
    if (cartId) cart = await getCart(cartId);
  }

  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return <CartIconClient itemCount={itemCount} items={items} />;
}
