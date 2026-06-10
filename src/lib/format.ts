export function formatPrice(grosz: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(grosz / 100);
}

export function formatPriceRaw(grosz: number): string {
  return (grosz / 100).toFixed(2);
}
