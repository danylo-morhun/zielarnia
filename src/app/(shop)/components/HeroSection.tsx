import Link from "next/link";

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[60dvh] flex-col justify-center overflow-hidden rounded-2xl bg-primary/5 px-6 py-16 md:px-12"
      aria-labelledby="hero-heading"
    >
      {/* Radial ambient glow — gives depth without a photo */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 85% 50%, oklch(0.45 0.14 145 / 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Nature Lab decorative — concentric rings + molecule nodes */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-primary opacity-[0.13] md:opacity-[0.18]"
        aria-hidden="true"
      >
        <svg
          width="520"
          height="520"
          viewBox="0 0 480 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="240" cy="240" r="220" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="240" cy="240" r="160" stroke="currentColor" strokeWidth="1" />
          <circle cx="240" cy="240" r="100" stroke="currentColor" strokeWidth="0.75" />
          {/* Connector lines — molecule feel */}
          <line x1="240" y1="240" x2="380" y2="96"  stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="240" y1="240" x2="424" y2="196" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="240" y1="240" x2="340" y2="368" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
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
          className="mb-4 text-balance font-heading text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
        >
          Twoje zdrowie zaczyna się tutaj
        </h1>
        <p className="mb-8 max-w-[52ch] text-lg text-muted-foreground">
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
