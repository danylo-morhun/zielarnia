"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function AdminSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("szukaj", term);
    else params.delete("szukaj");
    params.delete("strona");
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <input
      type="search"
      placeholder={placeholder}
      defaultValue={searchParams.get("szukaj") ?? ""}
      onChange={(e) => handleSearch(e.target.value)}
      className="w-full max-w-sm rounded-md border px-3 py-2 text-sm"
    />
  );
}
