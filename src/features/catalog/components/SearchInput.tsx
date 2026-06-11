"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = searchParams.get("szukaj") ?? "";
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when szukaj param is present (nav search icon click)
  useEffect(() => {
    if (searchParams.has("szukaj")) {
      inputRef.current?.focus();
    }
  }, [searchParams]);

  // Sync if URL changes externally
  useEffect(() => {
    setValue(searchParams.get("szukaj") ?? "");
  }, [searchParams]);

  function commit(query: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("szukaj", query);
    } else {
      params.delete("szukaj");
    }
    params.delete("strona");
    router.push(`/katalog?${params.toString()}`);
  }

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit(value);
        }}
        onBlur={() => {
          if (value !== initialValue) commit(value);
        }}
        placeholder="Szukaj produktów…"
        className="w-full rounded-md border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
