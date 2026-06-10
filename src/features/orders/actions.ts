"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { adminActionClient } from "@/lib/safe-action";
import { updateOrderStatusSchema } from "./schema";

export const updateOrderStatus = adminActionClient
  .schema(updateOrderStatusSchema)
  .action(async ({ parsedInput: input }) => {
    await prisma.order.update({
      where: { id: input.orderId },
      data: {
        status: input.status,
        ...(input.noteAdmin !== undefined && { noteAdmin: input.noteAdmin }),
      },
    });
    revalidatePath("/admin/zamowienia");
    revalidatePath(`/admin/zamowienia/${input.orderId}`);
    return { success: true };
  });
