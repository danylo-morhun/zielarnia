import { formatPrice } from "@/lib/format";

const FREE_SHIPPING_THRESHOLD = 20000;

type Props = { subtotal: number };

export function ShippingProgress({ subtotal }: Props) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const pct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return (
      <p className="text-sm font-medium text-success">✓ Masz darmową dostawę!</p>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">
        Dodaj produkty za{" "}
        <span className="font-semibold text-foreground">{formatPrice(remaining)}</span>{" "}
        do darmowej dostawy
      </p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
