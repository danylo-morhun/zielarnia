"use client";

import type { OrderStatus } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { updateOrderStatus } from "../actions";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Oczekujące",
  PAYMENT_PENDING: "Oczekuje na płatność",
  PAID: "Opłacone",
  PROCESSING: "W realizacji",
  SHIPPED: "Wysłane",
  DELIVERED: "Dostarczone",
  CANCELLED: "Anulowane",
  REFUNDED: "Zwrócone",
};

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
  currentNote: string | null;
}

export function StatusForm({ orderId, currentStatus, currentNote }: Props) {
  const { execute, isPending } = useAction(updateOrderStatus);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    execute({
      orderId,
      status: fd.get("status") as OrderStatus,
      noteAdmin: (fd.get("noteAdmin") as string) || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="status">
          Status zamówienia
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="noteAdmin">
          Notatka admina
        </label>
        <textarea
          id="noteAdmin"
          name="noteAdmin"
          defaultValue={currentNote ?? ""}
          rows={3}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {isPending ? "Zapisywanie…" : "Zapisz"}
      </button>
    </form>
  );
}
