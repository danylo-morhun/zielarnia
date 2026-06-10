import { z } from "zod";

export const toggleWishlistSchema = z.object({
  productId: z.string().min(1),
});

export const removeFromWishlistSchema = z.object({
  wishlistItemId: z.string().min(1),
});
