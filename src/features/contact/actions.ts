"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { contactMessageSchema } from "./schema";

export const sendContactMessage = actionClient
  .schema(contactMessageSchema)
  .action(async ({ parsedInput }) => {
    await prisma.contactMessage.create({ data: parsedInput });
    return { success: true };
  });
