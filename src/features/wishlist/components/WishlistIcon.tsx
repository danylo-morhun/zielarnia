import { Heart } from "lucide-react";
import { cookies } from "next/headers";
import { getWishlist, WISHLIST_COOKIE_NAME } from "../lib/session";
import { WishlistIconClient } from "./WishlistIconClient";

export async function WishlistIcon() {
  const cookieStore = await cookies();
  const wishlistId = cookieStore.get(WISHLIST_COOKIE_NAME)?.value;

  const wishlist = wishlistId ? await getWishlist(wishlistId) : null;
  const items = wishlist?.items ?? [];
  const itemCount = items.length;

  return <WishlistIconClient itemCount={itemCount} items={items} />;
}

export function WishlistIconFallback() {
  return (
    <div className="rounded-md p-2 text-muted-foreground">
      <Heart className="size-5" />
    </div>
  );
}
