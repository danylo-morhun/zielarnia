import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "Imię jest wymagane").max(60),
  lastName: z.string().min(1, "Nazwisko jest wymagane").max(60),
  phone: z.string().max(15).optional(),
});

export const addressSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["shipping", "billing"]).default("shipping"),
  isDefault: z.boolean().default(false),
  firstName: z.string().min(1, "Imię jest wymagane").max(60),
  lastName: z.string().min(1, "Nazwisko jest wymagane").max(60),
  company: z.string().max(120).optional(),
  street: z.string().min(1, "Ulica jest wymagana"),
  apartment: z.string().optional(),
  city: z.string().min(1, "Miasto jest wymagane"),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, "Format: XX-XXX"),
  phone: z.string().max(15).optional(),
});

export const deleteAddressSchema = z.object({
  addressId: z.string().min(1),
});

export type UpdateProfileInput = z.input<typeof updateProfileSchema>;
export type AddressInput = z.input<typeof addressSchema>;
