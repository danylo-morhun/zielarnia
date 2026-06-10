"use client";
import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="rounded-xl bg-primary px-6 py-12 text-center text-primary-foreground">
      <h2 className="mb-2 font-heading text-2xl font-semibold">Bądź na bieżąco</h2>
      <p className="mb-6 text-primary-foreground/80">
        Otrzymuj informacje o nowościach i promocjach.
      </p>
      {submitted ? (
        <p className="text-lg font-medium">✓ Zapisano!</p>
      ) : (
        <form
          className="mx-auto flex max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Twój adres e-mail"
            className="flex-1 rounded-lg px-4 py-2 text-sm text-foreground"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary-foreground px-5 py-2 text-sm font-semibold text-primary hover:opacity-90"
          >
            Zapisz się
          </button>
        </form>
      )}
    </section>
  );
}
