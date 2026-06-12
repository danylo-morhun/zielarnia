import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail"),
});
