import { Bell } from "lucide-react";

export function NewsletterSection() {
  return (
    <section className="rounded-xl border bg-muted/40 px-6 py-12 text-center">
      <Bell className="mx-auto mb-3 size-7 text-primary" strokeWidth={1.75} />
      <h2 className="mb-2 font-heading text-2xl font-semibold">Bądź na bieżąco</h2>
      <p className="text-muted-foreground">
        Zapisz się do newslettera i otrzymuj informacje o nowościach i promocjach.
      </p>
      <p className="mt-2 text-sm text-muted-foreground/70">Zapisy wkrótce dostępne.</p>
    </section>
  );
}
