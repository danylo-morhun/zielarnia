"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { addressSchema, deleteAddressSchema, updateProfileSchema } from "./schema";

export const updateProfile = authActionClient
  .schema(updateProfileSchema)
  .action(async ({ parsedInput: input, ctx: { customerId } }) => {
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone ?? null,
      },
    });
    revalidatePath("/konto/profil");
    return { success: true };
  });

export const saveAddress = authActionClient
  .schema(addressSchema)
  .action(async ({ parsedInput: input, ctx: { customerId } }) => {
    const { id, ...data } = input;

    if (input.isDefault) {
      await prisma.address.updateMany({
        where: { customerId, type: input.type },
        data: { isDefault: false },
      });
    }

    if (id) {
      await prisma.address.updateMany({
        where: { id, customerId },
        data: { ...data },
      });
    } else {
      await prisma.address.create({
        data: { customerId, ...data },
      });
    }

    revalidatePath("/konto/adresy");
    return { success: true };
  });

export const deleteAddress = authActionClient
  .schema(deleteAddressSchema)
  .action(async ({ parsedInput: { addressId }, ctx: { customerId } }) => {
    await prisma.address.deleteMany({
      where: { id: addressId, customerId },
    });
    revalidatePath("/konto/adresy");
    return { success: true };
  });
