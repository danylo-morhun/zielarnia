import { createHash } from "node:crypto";

export function p24Sign(data: Record<string, unknown>): string {
  return createHash("sha384").update(JSON.stringify(data)).digest("hex");
}
