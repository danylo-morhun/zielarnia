"use client";

import { Menu, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type MenuLink = { label: string; href: string };

type Props = {
  navLinks: MenuLink[];
  utilityLinks: MenuLink[];
};

export function MobileMenu({ navLinks, utilityLinks }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation
  useEffect(() => {
    if (pathname) setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Otwórz menu"
        className="rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary md:hidden"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Plus className="size-3.5 stroke-[3]" />
            </span>
            Twoje Zdrowie
          </SheetTitle>
        </SheetHeader>

        <form action="/katalog" className="relative px-5 pt-4">
          <Search className="pointer-events-none absolute left-8 top-1/2 mt-2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            name="szukaj"
            placeholder="Szukaj produktów…"
            aria-label="Szukaj produktów"
            className="w-full rounded-full border border-border bg-muted/60 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </form>

        <nav className="flex flex-col gap-0.5 p-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/katalog?promocje=1"
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            Promocje
          </Link>
        </nav>

        <div className="mx-5 border-t border-border" />

        <nav className="flex flex-col gap-0.5 p-3">
          {utilityLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
