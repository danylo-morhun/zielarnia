// Required env: BASELINKER_API_KEY
const BASE_URL = "https://api.baselinker.com/connector.php";

export async function blCall<T = Record<string, unknown>>(
  method: string,
  parameters: Record<string, unknown> = {},
): Promise<T> {
  const body = new URLSearchParams({
    token: process.env.BASELINKER_API_KEY ?? "",
    method,
    parameters: JSON.stringify(parameters),
  });

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`BaseLinker HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    status: string;
    error_code?: number;
    error_message?: string;
  } & T;

  if (json.status !== "SUCCESS") {
    throw new Error(`BaseLinker error ${json.error_code}: ${json.error_message}`);
  }

  return json;
}
