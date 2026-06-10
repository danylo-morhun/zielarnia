// Required env: BASELINKER_WEBHOOK_SECRET (token in ?token= query param)
// Optional env: BASELINKER_STATUS_PROCESSING, BASELINKER_STATUS_SHIPPED,
//               BASELINKER_STATUS_DELIVERED, BASELINKER_STATUS_CANCELLED
// Configure BL outgoing webhook to POST to: /api/baselinker/webhook?token=<secret>
import { type NextRequest, NextResponse } from "next/server";
import type { OrderStatus } from "@prisma/client";
import { blCall } from "@/lib/baselinker/client";
import { prisma } from "@/lib/prisma";

type BlOrder = {
  order_id: number;
  status_id: number;
  delivery_package_nr?: string;
  delivery_package_module?: string;
};

function trackingUrl(module: string, nr: string): string {
  if (module.startsWith("inpost")) return `https://inpost.pl/sledzenie-paczek?number=${nr}`;
  if (module.startsWith("dhl")) return `https://www.dhl.com/pl-pl/home/tracking.html?tracking-id=${nr}`;
  if (module.startsWith("dpd")) return `https://tracktrace.dpd.com.pl/parcelDetails?typ=1&p1=${nr}`;
  return "";
}

function mapStatusId(statusId: number): OrderStatus | null {
  const envId = (key: string): number | null => {
    const v = process.env[key];
    return v ? Number(v) : null;
  };
  if (statusId === envId("BASELINKER_STATUS_PROCESSING")) return "PROCESSING";
  if (statusId === envId("BASELINKER_STATUS_SHIPPED")) return "SHIPPED";
  if (statusId === envId("BASELINKER_STATUS_DELIVERED")) return "DELIVERED";
  if (statusId === envId("BASELINKER_STATUS_CANCELLED")) return "CANCELLED";
  return null;
}

export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("token") !== (process.env.BASELINKER_WEBHOOK_SECRET ?? "")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/x-www-form-urlencoded")) {
      body = Object.fromEntries(new URLSearchParams(await req.text()));
    } else {
      body = await req.json();
    }
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const blOrderId = Number(body.bl_order_id ?? body.order_id);
  if (!blOrderId || Number.isNaN(blOrderId)) {
    return NextResponse.json({ error: "missing order_id" }, { status: 400 });
  }

  const result = await blCall<{ orders: BlOrder[] }>("getOrders", {
    filter_order_id: blOrderId,
  });

  const blOrder = result.orders[0];
  if (!blOrder) {
    return NextResponse.json({ error: "order not found in BL" }, { status: 404 });
  }

  const order = await prisma.order.findUnique({
    where: { baselinkerOrderId: String(blOrderId) },
    select: { id: true, shippedAt: true },
  });

  if (!order) {
    return NextResponse.json({ error: "order not in DB" }, { status: 404 });
  }

  const newStatus = mapStatusId(blOrder.status_id);
  const tracking = blOrder.delivery_package_nr ?? null;
  const tUrl =
    tracking && blOrder.delivery_package_module
      ? trackingUrl(blOrder.delivery_package_module, tracking)
      : null;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      baselinkerStatus: String(blOrder.status_id),
      ...(newStatus && { status: newStatus }),
      ...(tracking && { trackingNumber: tracking }),
      ...(tUrl && { trackingUrl: tUrl }),
      ...(newStatus === "SHIPPED" && !order.shippedAt && { shippedAt: new Date() }),
      ...(newStatus === "DELIVERED" && { deliveredAt: new Date() }),
    },
  });

  return NextResponse.json({ ok: true });
}
