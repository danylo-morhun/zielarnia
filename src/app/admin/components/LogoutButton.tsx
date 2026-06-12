"use client";

import { useTransition } from "react";

interface Props {
  action: () => Promise<void>;
}

export function LogoutButton({ action }: Props) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Czy na pewno chcesz się wylogować?")) return;
    startTransition(() => action());
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className="w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground motion-reduce:transition-none disabled:opacity-50"
    >
      {pending ? "Wylogowywanie…" : "Wyloguj się"}
    </button>
  );
}
