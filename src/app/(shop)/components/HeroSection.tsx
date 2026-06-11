import Link from "next/link";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-primary/5 px-6 py-16 md:px-12 md:py-24"
      aria-labelledby="hero-heading"
    >
      {/* Nature Lab decorative element — concentric circles + scattered nodes */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-primary opacity-[0.07] md:opacity-[0.10]"
        aria-hidden="true"
      >
        <svg
          width="480"
          height="480"
          viewBox="0 0 480 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="240" cy="240" r="220" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="240" cy="240" r="160" stroke="currentColor" strokeWidth="1" />
          <circle cx="240" cy="240" r="100" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="380" cy="96"  r="18" fill="currentColor" />
          <circle cx="424" cy="196" r="10" fill="currentColor" />
          <circle cx="340" cy="368" r="14" fill="currentColor" />
          <circle cx="116" cy="60"  r="8"  fill="currentColor" />
          <circle cx="60"  cy="318" r="12" fill="currentColor" />
          <circle cx="184" cy="412" r="6"  fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 max-w-xl">
        <h1
          id="hero-heading"
          className="mb-4 text-balance font-heading text-4xl font-semibold leading-tight md:text-5xl"
        >
          Twoje zdrowie zaczyna się tutaj
        </h1>
        <p className="mb-8 max-w-[55ch] text-lg text-foreground">
          Certyfikowane suplementy diety, witaminy i produkty bio. Sprawdzona jakość, uczciwe ceny.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/katalog"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-[oklch(0.40_0.14_145)] motion-reduce:transition-none"
          >
            Przeglądaj produkty
          </Link>
          <Link
            href="/katalog?kategoria=witaminy"
            className="rounded-lg border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-150 hover:bg-muted motion-reduce:transition-none"
          >
            Witaminy i minerały
          </Link>
        </div>
      </div>
    </section>
  );
}
