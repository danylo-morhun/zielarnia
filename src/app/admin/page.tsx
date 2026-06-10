import Link from "next/link";
import { ShoppingBag, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function AdminPage() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayOrders, pendingOrders, lowStock, revenueResult] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { status: { in: ["PENDING", "PAID", "PROCESSING"] } } }),
    prisma.productVariant.count({ where: { stock: { lte: 5, gt: 0 }, trackStock: true } }),
    prisma.order.aggregate({
      where: {
        paymentStatus: "CAPTURED",
        createdAt: { gte: monthStart },
      },
      _sum: { totalPln: true },
    }),
  ]);

  const kpis = [
    {
      label: "Zamówienia dziś",
      value: todayOrders,
      icon: ShoppingBag,
      href: "/admin/zamowienia",
    },
    {
      label: "Oczekujące",
      value: pendingOrders,
      icon: Clock,
      href: "/admin/zamowienia?status=PENDING",
    },
    {
      label: "Niski stan mag.",
      value: lowStock,
      icon: AlertTriangle,
      href: "/admin/magazyn",
    },
    {
      label: "Przychód (mies.)",
      value: formatPrice(revenueResult._sum.totalPln ?? 0),
      icon: TrendingUp,
      href: null,
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, href }) => {
          const card = (
            <div className="rounded-xl border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          );
          return href ? (
            <Link key={label} href={href} className="hover:opacity-80">
              {card}
            </Link>
          ) : (
            <div key={label}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
