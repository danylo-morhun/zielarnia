import { createSafeActionClient } from "next-safe-action";
import { ActionError } from "./action-error";
import { auth } from "./auth";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    // Only intentional, user-facing messages pass through; everything else
    // (Prisma, network, bugs) stays masked
    if (e instanceof ActionError) return e.message;
    return "Coś poszło nie tak. Spróbuj ponownie.";
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new ActionError("Nie jesteś zalogowany");
  }
  return next({ ctx: { customerId: session.user.id } });
});

export const adminActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new ActionError("Brak uprawnień");
  }
  return next({ ctx: { adminId: session.user.id } });
});
