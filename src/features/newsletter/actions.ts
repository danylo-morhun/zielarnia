"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { subscribeSchema } from "./schema";

export const subscribeToNewsletter = actionClient
  .schema(subscribeSchema)
  .action(async ({ parsedInput: { email } }) => {
    // Upsert keeps the action idempotent — re-subscribing is not an error
    await prisma.newsletterSubscriber.upsert({
      where: { email: email.toLowerCase() },
      update: {},
      create: { email: email.toLowerCase() },
    });
    return { success: true };
  });
