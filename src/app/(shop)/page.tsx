import { getHomepageData } from "@/features/catalog/lib/homepage";
import { HeroSection } from "@/app/(shop)/components/HeroSection";
import { CategoryGrid } from "@/app/(shop)/components/CategoryGrid";
import { BestsellerRow } from "@/app/(shop)/components/BestsellerRow";
import { TrustStrip } from "@/app/(shop)/components/TrustStrip";
import { NewsletterSection } from "@/app/(shop)/components/NewsletterSection";

export default async function HomePage() {
  const { categories, featured, newArrivals } = await getHomepageData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12 md:space-y-16">
        <HeroSection />
        <TrustStrip />
        <CategoryGrid categories={categories} />
        <BestsellerRow
          products={featured}
          title="Polecane produkty"
          href="/katalog?isFeatured=1"
        />
        <BestsellerRow
          products={newArrivals}
          title="Nowości"
          href="/katalog?nowosci=1"
          variant="scroll"
        />
        <NewsletterSection />
      </div>
    </div>
  );
}
