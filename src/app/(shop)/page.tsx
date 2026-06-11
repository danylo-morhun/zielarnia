import { getHomepageData } from "@/features/catalog/lib/homepage";
import { HeroSection } from "@/app/(shop)/components/HeroSection";
import { CategoryGrid } from "@/app/(shop)/components/CategoryGrid";
import { BestsellerRow } from "@/app/(shop)/components/BestsellerRow";
import { TrustStrip } from "@/app/(shop)/components/TrustStrip";
import { NewsletterSection } from "@/app/(shop)/components/NewsletterSection";
import { FadeInView } from "@/app/(shop)/components/FadeInView";

export default async function HomePage() {
  const { categories, featured, newArrivals } = await getHomepageData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12 md:space-y-16">
        <HeroSection />
        <FadeInView>
          <TrustStrip />
        </FadeInView>
        <FadeInView>
          <CategoryGrid categories={categories} />
        </FadeInView>
        <FadeInView>
          <BestsellerRow
            products={featured}
            title="Polecane produkty"
            href="/katalog?isFeatured=1"
          />
        </FadeInView>
        <FadeInView>
          <BestsellerRow
            products={newArrivals}
            title="Nowości"
            href="/katalog?nowosci=1"
            variant="scroll"
          />
        </FadeInView>
        <FadeInView>
          <NewsletterSection />
        </FadeInView>
      </div>
    </div>
  );
}
