import { Bell } from "lucide-react";

export function NewsletterSection() {
  return (
    <section className="rounded-xl bg-primary px-6 py-12 text-center text-primary-foreground">
      <Bell className="mx-auto mb-3 size-8 opacity-80" />
      <h2 className="mb-2 font-heading text-2xl font-semibold">Bądź na bieżąco</h2>
      <p className="text-primary-foreground/80">
        Zapisz się do newslettera i otrzymuj informacje o nowościach i promocjach.
        <br />
        <span className="mt-1 inline-block text-sm opacity-70">Zapisy wkrótce dostępne.</span>
      </p>
    </section>
  );
}
