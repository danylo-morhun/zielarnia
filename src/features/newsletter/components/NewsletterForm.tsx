"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "../actions";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { execute, isExecuting } = useAction(subscribeToNewsletter, {
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
      toast.success("Zapisano do newslettera", {
        description: "Dziękujemy! Wkrótce pierwsze nowości.",
        duration: 4000,
      });
    },
    onError: ({ error }) => {
      toast.error("Błąd", {
        description: error.validationErrors?.email?._errors?.[0] ?? "Spróbuj ponownie później",
      });
    },
  });

  if (subscribed) {
    return (
      <p className="mx-auto mt-6 max-w-md rounded-full bg-band-foreground/10 px-6 py-3 text-sm font-medium animate-pop-in motion-reduce:animate-none">
        ✓ Jesteś na liście — do usłyszenia!
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        execute({ email });
      }}
      className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Adres e-mail
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="twoj@email.pl"
        className="flex-1 rounded-full border border-band-foreground/25 bg-band-foreground/10 px-5 py-3 text-sm text-band-foreground placeholder:text-band-foreground/60 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-band-foreground/60"
      />
      <button
        type="submit"
        disabled={isExecuting}
        className="rounded-full bg-band-foreground px-6 py-3 text-sm font-semibold text-band transition-[transform,background-color] duration-200 hover:bg-secondary active:scale-[0.97] disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        <span
          key={isExecuting ? "loading" : "idle"}
          className="animate-[btn-text-in_200ms_ease-out_both] motion-reduce:animate-none"
        >
          {isExecuting ? "Zapisywanie…" : "Zapisz się"}
        </span>
      </button>
    </form>
  );
}
