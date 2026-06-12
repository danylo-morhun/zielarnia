import { Bell } from "lucide-react";

export function NewsletterSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary-deep px-6 py-14 text-center text-primary-foreground">
      <div
        className="pointer-events-none absolute -left-12 -top-12 size-48 rounded-full bg-primary-foreground/5 animate-float-soft motion-reduce:animate-none"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-10 size-56 rounded-full bg-primary-foreground/5 animate-float-soft motion-reduce:animate-none"
        style={{ animationDelay: "1.5s" }}
        aria-hidden="true"
      />
      <div className="relative">
        <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary-foreground/10">
          <Bell className="size-6" strokeWidth={1.75} />
        </span>
        <h2 className="mb-2 text-2xl font-bold tracking-tight">Bądź na bieżąco</h2>
        <p className="mx-auto max-w-md text-primary-foreground/75">
          Zapisz się do newslettera i otrzymuj informacje o nowościach i promocjach.
        </p>
        <p className="mt-3 text-sm text-primary-foreground/60">Zapisy wkrótce dostępne.</p>
      </div>
    </section>
  );
}
