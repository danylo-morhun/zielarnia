import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Zamówienia — Twoje Zdrowie" };

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Oczekujące",
  PAYMENT_PENDING: "Oczekiwanie na płatność",
  PAID: "Opłacone",
  PROCESSING: "W realizacji",
  SHIPPED: "Wysłane",
  DELIVERED: "Dostarczone",
  CANCELLED: "Anulowane",
  REFUNDED: "Zwrócone",
};

export default async function ZamowieniaPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/logowanie");

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      totalPln: true,
      createdAt: true,
      items: { select: { productName: true }, take: 4 },
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Zamówienia</h1>

      {orders.length === 0 && (
        <p className="text-sm text-muted-foreground">Nie złożyłeś jeszcze żadnego zamówienia.</p>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/konto/zamowienia/${order.orderNumber}`}
            className="flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{order.orderNumber}</p>
              <p className="text-xs text-muted-foreground">
                {order.createdAt.toLocaleDateString("pl-PL")}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {order.items.slice(0, 3).map((i) => i.productName).join(", ")}
                {order.items.length > 3 ? "…" : ""}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
              <span className="font-medium">{formatPrice(order.totalPln)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
