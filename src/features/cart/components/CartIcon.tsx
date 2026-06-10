import { cookies } from "next/headers";
import { CART_COOKIE_NAME, getCart } from "../lib/session";
import { CartIconClient } from "./CartIconClient";

export async function CartIcon() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  const cart = cartId ? await getCart(cartId) : null;
  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return <CartIconClient itemCount={itemCount} items={items} />;
}
