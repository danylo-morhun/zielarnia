import { ArrowRight, BadgePercent, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/features/catalog/actions";
import { formatPrice } from "@/lib/format";

type Props = {
  product?: ProductListItem | null;
};

export function HeroSection({ product = null }: Props) {
  const variant = product?.variants[0];
  const image = product?.images[0];

  return (
    <section className="grid gap-4 lg:grid-cols-3" aria-labelledby="hero-heading">
      {/* Main panel */}
      <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl bg-primary/5 px-6 py-12 md:px-10 md:py-16 lg:col-span-2">
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 85% 50%, oklch(0.45 0.14 145 / 0.08) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <h1
              id="hero-heading"
              className="mb-4 animate-fade-up text-balance font-heading text-4xl font-semibold leading-tight motion-reduce:animate-none md:text-5xl"
            >
              Twoje zdrowie zaczyna się tutaj
            </h1>
            <p
              className="mb-8 max-w-[52ch] animate-fade-up text-lg text-muted-foreground motion-reduce:animate-none"
              style={{ animationDelay: "80ms" }}
            >
              Certyfikowane suplementy diety, witaminy i produkty bio. Sprawdzona jakość, uczciwe
              ceny.
            </p>
            <div
              className="flex animate-fade-up flex-wrap gap-3 motion-reduce:animate-none"
              style={{ animationDelay: "160ms" }}
            >
              <Link
                href="/katalog"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary-deep motion-reduce:transition-none"
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

          {product && image && variant && (
            <Link
              href={`/produkt/${product.slug}`}
              className="group relative hidden w-64 animate-fade-up rounded-xl bg-card p-4 shadow-card-hover transition-shadow duration-200 hover:shadow-float md:block motion-reduce:animate-none"
              style={{ animationDelay: "240ms" }}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={image.altPl ?? product.namePl}
                  fill
                  priority
                  sizes="256px"
                  className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                />
              </div>
              <div className="mt-3">
                {product.brand && (
                  <p className="text-xs font-medium text-muted-foreground">{product.brand.name}</p>
                )}
                <p className="line-clamp-1 text-sm font-medium text-foreground">{product.namePl}</p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {formatPrice(variant.pricePln)}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Side tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:grid-rows-2">
        <Link
          href="/katalog?promocje=1"
          className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-accent p-6 transition-shadow duration-200 hover:shadow-card-hover motion-reduce:transition-none"
        >
          <BadgePercent className="size-7 text-accent-foreground" strokeWidth={1.75} />
          <div className="mt-6">
            <h2 className="font-heading text-xl font-semibold text-accent-foreground">Promocje</h2>
            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-accent-foreground/80">
              Sprawdź obniżone ceny
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" />
            </p>
          </div>
        </Link>

        <Link
          href="/katalog?nowosci=1"
          className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-secondary p-6 transition-shadow duration-200 hover:shadow-card-hover motion-reduce:transition-none"
        >
          <Sparkles className="size-7 text-secondary-foreground" strokeWidth={1.75} />
          <div className="mt-6">
            <h2 className="font-heading text-xl font-semibold text-secondary-foreground">
              Nowości
            </h2>
            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-secondary-foreground/80">
              Ostatnio dodane produkty
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" />
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
