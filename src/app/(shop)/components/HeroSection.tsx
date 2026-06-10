import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary/5 px-6 py-16 md:px-12 md:py-24">
      <div className="relative z-10 max-w-xl">
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Naturalne suplementy
        </span>
        <h1 className="mb-4 font-heading text-4xl font-semibold leading-tight md:text-5xl">
          Twoje zdrowie zaczyna się tutaj
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Certyfikowane suplementy diety, witaminy i produkty bio. Sprawdzona jakość, uczciwe ceny.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/katalog"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Przeglądaj produkty
          </Link>
          <Link
            href="/katalog?kategoria=witaminy"
            className="rounded-lg border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted"
          >
            Witaminy i minerały
          </Link>
        </div>
      </div>
    </section>
  );
}
