import { Heart } from "lucide-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { WishlistItemCard } from "@/features/wishlist/components/WishlistItemCard";
import { WISHLIST_COOKIE_NAME, getWishlist } from "@/features/wishlist/lib/session";

export const metadata: Metadata = {
  title: "Ulubione — Twoje Zdrowie",
};

export default async function UlubinonePage() {
  const cookieStore = await cookies();
  const wishlistId = cookieStore.get(WISHLIST_COOKIE_NAME)?.value;
  const wishlist = wishlistId ? await getWishlist(wishlistId) : null;
  const items = wishlist?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Heart className="size-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Brak ulubionych produktów</h1>
          <p className="text-muted-foreground">
            Dodaj produkty do ulubionych, klikając ikonę serca na stronie produktu.
          </p>
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold">Ulubione ({items.length})</h1>
      <div className="divide-y divide-border rounded-lg border border-border">
        {items.map((item) => (
          <div key={item.id} className="px-4">
            <WishlistItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
