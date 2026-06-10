import { Footer } from "@/components/layout/Footer";
import { NavBar } from "@/components/layout/NavBar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
