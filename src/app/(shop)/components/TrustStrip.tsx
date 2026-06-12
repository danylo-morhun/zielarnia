import { Leaf, Phone, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: Truck, title: "Darmowa dostawa", sub: "od 200 zł" },
  { icon: ShieldCheck, title: "Certyfikowana jakość", sub: "atestowane GIS/Sanepid" },
  { icon: Leaf, title: "Naturalne składniki", sub: "bez sztucznych dodatków" },
  { icon: Phone, title: "Wsparcie eksperta", sub: "pon–pt 9:00–17:00" },
];

export function TrustStrip() {
  return (
    <section aria-label="Nasze gwarancje" className="rounded-2xl bg-secondary px-2 py-2">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {items.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-primary">
              <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-semibold leading-snug text-secondary-foreground">
                {title}
              </p>
              <p className="text-xs text-secondary-foreground/80">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
