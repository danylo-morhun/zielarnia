import type { OrderStatus } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Oczekujące",
  PAYMENT_PENDING: "Oczekuje płatności",
  PAID: "Opłacone",
  PROCESSING: "W realizacji",
  SHIPPED: "Wysłane",
  DELIVERED: "Dostarczone",
  CANCELLED: "Anulowane",
  REFUNDED: "Zwrócone",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      totalPln: true,
      customerEmail: true,
      createdAt: true,
      allegroOrderId: true,
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Zamówienia</h1>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Numer</th>
              <th className="px-4 py-3 font-medium">Źródło</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Kwota</th>
              <th className="px-4 py-3 font-medium">Klient</th>
              <th className="px-4 py-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/zamowienia/${order.id}`}
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {order.allegroOrderId ? (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                      Allegro
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Sklep
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {(order.totalPln / 100).toLocaleString("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  })}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{order.customerEmail}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.createdAt.toLocaleDateString("pl-PL")}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Brak zamówień
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
