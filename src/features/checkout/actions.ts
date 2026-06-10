"use server";

import { cookies, headers } from "next/headers";
import { CART_COOKIE_NAME } from "@/features/cart/lib/session";
import { paymentUrl, registerTransaction } from "@/features/przelewy24/lib/client";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { getCartForCheckout } from "./lib/cart";
import { SHIPPING_COSTS } from "./lib/shipping";
import { checkoutSchema } from "./schema";

export const placeOrder = actionClient
  .schema(checkoutSchema)
  .action(async ({ parsedInput: input }) => {
    const cart = await getCartForCheckout(input.cartId);
    if (!cart || cart.items.length === 0) {
      throw new Error("Koszyk jest pusty");
    }

    const shippingPln = SHIPPING_COSTS[input.shippingMethod as keyof typeof SHIPPING_COSTS] ?? 1999;
    const subtotalPln = cart.items.reduce(
      (sum, item) => sum + item.variant.pricePln * item.quantity,
      0,
    );

    const taxPln = cart.items.reduce((sum, item) => {
      const itemTotal = item.variant.pricePln * item.quantity;
      const rate = Number(item.variant.vatRate);
      return sum + Math.round((itemTotal * rate) / (100 + rate));
    }, 0);

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

      // Coupon — all checks + increment inside tx to prevent race conditions
      let discountPln = 0;
      let couponId: string | undefined;
      let couponCode: string | undefined;

      if (input.couponCode?.trim()) {
        const coupon = await tx.coupon.findFirst({
          where: {
            code: input.couponCode.trim(),
            isActive: true,
            AND: [
              { OR: [{ validFrom: null }, { validFrom: { lte: new Date() } }] },
              { OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }] },
            ],
          },
          select: {
            id: true,
            type: true,
            value: true,
            maxUsages: true,
            usageCount: true,
            minOrderPln: true,
          },
        });

        if (coupon) {
          if (coupon.minOrderPln !== null && subtotalPln < coupon.minOrderPln) {
            throw new Error(
              `Minimalna wartość zamówienia dla tego kodu: ${formatPrice(coupon.minOrderPln)}`,
            );
          }

          // Atomic increment — WHERE guards against exceeding maxUsages
          const used = await tx.coupon.updateMany({
            where: {
              id: coupon.id,
              OR: [{ maxUsages: null }, { usageCount: { lt: coupon.maxUsages ?? 0 } }],
            },
            data: { usageCount: { increment: 1 } },
          });

          if (used.count === 0) {
            throw new Error("Kod rabatowy jest już wyczerpany");
          }

          couponId = coupon.id;
          couponCode = input.couponCode.trim();
          discountPln =
            coupon.type === "PERCENTAGE"
              ? Math.round((subtotalPln * coupon.value) / 100)
              : coupon.value;
        }
      }

      const totalPln = subtotalPln + shippingPln - discountPln;

      // Decrement stock atomically
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
          billCountry: input.wantsFaktura ? "PL" : null,
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

      return { orderNumber: newOrder.orderNumber, totalPln };
    });

    const cookieStore = await cookies();
    cookieStore.delete(CART_COOKIE_NAME);

    if (process.env.P24_SANDBOX_BYPASS === "true") {
      return { orderNumber: order.orderNumber, redirectUrl: null };
    }

    // Register Przelewy24 transaction
    const headersList = await headers();
    const host = headersList.get("host") ?? "";
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `${proto}://${host}`;

    const token = await registerTransaction({
      sessionId: order.orderNumber,
      amount: order.totalPln,
      description: `Zamówienie ${order.orderNumber}`,
      email: input.email,
      urlReturn: `${appUrl}/zamowienie/potwierdzenie/${order.orderNumber}`,
      urlStatus: `${appUrl}/api/p24/notify`,
    });

    return {
      orderNumber: order.orderNumber,
      redirectUrl: paymentUrl(token),
    };
  });
