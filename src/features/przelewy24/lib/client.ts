import { p24Sign } from "./sign";

const BASE_URL =
  process.env.P24_SANDBOX === "true"
    ? "https://sandbox.przelewy24.pl"
    : "https://secure.przelewy24.pl";

const MERCHANT_ID = Number(process.env.P24_MERCHANT_ID);
const POS_ID = Number(process.env.P24_POS_ID ?? process.env.P24_MERCHANT_ID);
const API_KEY = process.env.P24_API_KEY ?? "";
const CRC = process.env.P24_CRC ?? "";

function authHeader(): string {
  return "Basic " + Buffer.from(`${POS_ID}:${API_KEY}`).toString("base64");
}

export async function registerTransaction(params: {
  sessionId: string;
  amount: number;
  description: string;
  email: string;
  urlReturn: string;
  urlStatus: string;
}): Promise<string> {
  const sign = p24Sign({
    sessionId: params.sessionId,
    merchantId: MERCHANT_ID,
    amount: params.amount,
    currency: "PLN",
    crc: CRC,
  });

  const res = await fetch(`${BASE_URL}/api/v1/transaction/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      merchantId: MERCHANT_ID,
      posId: POS_ID,
      sessionId: params.sessionId,
      amount: params.amount,
      currency: "PLN",
      description: params.description,
      email: params.email,
      country: "PL",
      language: "pl",
      urlReturn: params.urlReturn,
      urlStatus: params.urlStatus,
      sign,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`P24 register failed (${res.status}): ${body}`);
  }

  const { data } = (await res.json()) as { data: { token: string } };
  return data.token;
}

export function paymentUrl(token: string): string {
  return `${BASE_URL}/trnRequest/${token}`;
}

export async function verifyTransaction(params: {
  sessionId: string;
  orderId: number;
  amount: number;
}): Promise<void> {
  const sign = p24Sign({
    sessionId: params.sessionId,
    orderId: params.orderId,
    amount: params.amount,
    currency: "PLN",
    crc: CRC,
  });

  const res = await fetch(`${BASE_URL}/api/v1/transaction/verify`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      merchantId: MERCHANT_ID,
      posId: POS_ID,
      sessionId: params.sessionId,
      amount: params.amount,
      currency: "PLN",
      orderId: params.orderId,
      sign,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`P24 verify failed (${res.status}): ${body}`);
  }
}

export { CRC, MERCHANT_ID, POS_ID };
