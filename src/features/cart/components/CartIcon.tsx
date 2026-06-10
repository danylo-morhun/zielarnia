import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { CART_COOKIE_NAME, getCart, getCartByCustomerId } from "../lib/session";
import { CartIconClient } from "./CartIconClient";

export async function CartIcon() {
  const session = await auth();

  const cart = session?.user?.id
    ? await getCartByCustomerId(session.user.id)
    : await (async () => {
        const cookieStore = await cookies();
        const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
        return cartId ? getCart(cartId) : null;
      })();

  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return <CartIconClient itemCount={itemCount} items={items} />;
}
