"use server";

import { cookies } from "next/headers";
import { CART_COOKIE_NAME } from "@/features/cart/lib/session";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { getCartForCheckout } from "./lib/cart";
import { checkoutSchema } from "./schema";

const SHIPPING_COSTS: Record<string, number> = {
  INPOST_PACZKOMAT: 1299,
  DHL: 1999,
  DPD: 1999,
};

export const placeOrder = actionClient
  .schema(checkoutSchema)
  .action(async ({ parsedInput: input }) => {
    const cart = await getCartForCheckout(input.cartId);
    if (!cart || cart.items.length === 0) {
      throw new Error("Koszyk jest pusty");
    }

    const shippingPln = SHIPPING_COSTS[input.shippingMethod] ?? 1999;
    const subtotalPln = cart.items.reduce(
      (sum, item) => sum + item.variant.pricePln * item.quantity,
      0,
    );

    let discountPln = 0;
    let couponId: string | undefined;
    let couponCode: string | undefined;

    if (input.couponCode?.trim()) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: input.couponCode.trim(),
          isActive: true,
          AND: [
            { OR: [{ validFrom: null }, { validFrom: { lte: new Date() } }] },
            { OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }] },
          ],
        },
        select: { id: true, type: true, value: true, maxUsages: true, usageCount: true },
      });

      if (coupon && (coupon.maxUsages === null || coupon.usageCount < coupon.maxUsages)) {
        couponId = coupon.id;
        couponCode = input.couponCode.trim();
        discountPln =
          coupon.type === "PERCENTAGE"
            ? Math.round((subtotalPln * coupon.value) / 100)
            : coupon.value;
      }
    }

    const taxPln = cart.items.reduce((sum, item) => {
      const itemTotal = item.variant.pricePln * item.quantity;
      const rate = Number(item.variant.vatRate);
      return sum + Math.round((itemTotal * rate) / (100 + rate));
    }, 0);

    const totalPln = subtotalPln + shippingPln - discountPln;

    const order = await prisma.$transaction(async (tx) => {
      // Atomic order number
      const seq = await tx.orderSequence.upsert({
        where: { id: 1 },
        update: { value: { increment: 1 } },
        create: { id: 1, value: 1 },
        select: { value: true },
      });
      const year = new Date().getFullYear();
      const orderNumber = `TZ-${year}-${String(seq.value).padStart(5, "0")}`;

      // Decrement stock — fails atomically if insufficient
      for (const item of cart.items) {
        const result = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count === 0) {
          throw new Error(`Produkt niedostępny w wybranej ilości: ${item.variant.product.namePl}`);
        }
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          status: "PAYMENT_PENDING",
          customerEmail: input.email,
          customerPhone: input.phone,
          customerName: `${input.firstName} ${input.lastName}`,
          shippingMethod: input.shippingMethod,
          shippingCostPln: shippingPln,
          shippingPln,
          inpostMachineId: input.inpostMachineId ?? null,
          inpostMachineName: input.inpostMachineName ?? null,
          shipFirstName: input.firstName,
          shipLastName: input.lastName,
          shipStreet: input.street,
          shipApartment: input.apartment ?? null,
          shipCity: input.city,
          shipPostalCode: input.postalCode,
          shipCountry: "PL",
          shipPhone: input.phone,
          wantsFaktura: input.wantsFaktura,
          billCompany: input.billCompany ?? null,
          billNip: input.billNip ?? null,
          billStreet: input.billStreet ?? null,
          billCity: input.billCity ?? null,
          billPostalCode: input.billPostalCode ?? null,
          paymentMethod: input.paymentMethod,
          paymentStatus: "PENDING",
          subtotalPln,
          discountPln,
          taxPln,
          totalPln,
          couponId: couponId ?? null,
          couponCode: couponCode ?? null,
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              productName: item.variant.product.namePl,
              variantOpt: item.variant.optionValue ?? null,
              sku: item.variant.sku,
              quantity: item.quantity,
              unitPricePln: item.variant.pricePln,
              vatRate: item.variant.vatRate,
              totalPln: item.variant.pricePln * item.quantity,
            })),
          },
        },
        select: { orderNumber: true },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    // Clear cart cookie — cart record stays but is now empty
    const cookieStore = await cookies();
    cookieStore.delete(CART_COOKIE_NAME);

    return { orderNumber: order.orderNumber };
  });
