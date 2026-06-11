import { Truck, ShieldCheck, Leaf, Phone } from "lucide-react";

const items = [
  { icon: Truck, title: "Darmowa dostawa", sub: "od 200 zł" },
  { icon: ShieldCheck, title: "Certyfikowana jakość", sub: "atestowane GIS/Sanepid" },
  { icon: Leaf, title: "Naturalne składniki", sub: "bez sztucznych dodatków" },
  { icon: Phone, title: "Wsparcie eksperta", sub: "pon–pt 9:00–17:00" },
];

export function TrustStrip() {
  return (
    <section aria-label="Nasze gwarancje">
      <div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
        {items.map(({ icon: Icon, title, sub }, i) => (
          <div
            key={title}
            className={`flex items-center gap-3 px-5 py-4 ${i === 0 ? "md:pl-0" : ""} ${i === items.length - 1 ? "md:pr-0" : ""}`}
          >
            <Icon className="size-5 shrink-0 text-primary" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-semibold leading-snug">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
