import type { Metadata } from "next";
import { Inter, Lora, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Twoje Zdrowie — Suplementy i produkty bio",
    template: "%s | Twoje Zdrowie",
  },
  description:
    "Sklep z suplementami diety, witaminami i produktami bio. Szeroki wybór, szybka dostawa InPost i DHL.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://twojezdrowie.pl"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} ${lora.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
