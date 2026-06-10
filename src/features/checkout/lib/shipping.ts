export const SHIPPING_COSTS = {
  INPOST_PACZKOMAT: 1299,
  DHL: 1999,
  DPD: 1999,
} as const;

export const SHIPPING_LABELS = {
  INPOST_PACZKOMAT: "InPost Paczkomat",
  DHL: "DHL Kurier",
  DPD: "DPD Kurier",
} as const;

export type ShippingMethodKey = keyof typeof SHIPPING_COSTS;
