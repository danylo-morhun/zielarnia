"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const TABS = [
  { label: "Wszystkie", value: null },
  { label: "Oczekujące", value: "PENDING" },
  { label: "Opłacone", value: "PAID" },
  { label: "W realizacji", value: "PROCESSING" },
  { label: "Wysłane", value: "SHIPPED" },
  { label: "Anulowane", value: "CANCELLED" },
];

export function OrderStatusFilter() {
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "";
  const search = searchParams.get("szukaj");

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const params = new URLSearchParams();
        if (tab.value) params.set("status", tab.value);
        if (search) params.set("szukaj", search);
        const qs = params.size ? `?${params.toString()}` : "";
        const isActive = (tab.value ?? "") === current;

        return (
          <Link
            key={tab.label}
            href={`/admin/zamowienia${qs}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors motion-reduce:transition-none ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
