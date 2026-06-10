import { createSafeActionClient } from "next-safe-action";
import { auth } from "./auth";

export const actionClient = createSafeActionClient();

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Nie jesteś zalogowany");
  }
  return next({ ctx: { customerId: session.user.id } });
});
