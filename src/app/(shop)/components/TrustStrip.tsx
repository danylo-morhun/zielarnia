import { Truck, ShieldCheck, Leaf, Phone } from "lucide-react";

const items = [
  { icon: Truck, title: "Darmowa dostawa", sub: "przy zamówieniu od 200 zł" },
  { icon: ShieldCheck, title: "Certyfikowana jakość", sub: "produkty atestowane przez GIS/Sanepid" },
  { icon: Leaf, title: "Naturalne składniki", sub: "bez sztucznych dodatków" },
  { icon: Phone, title: "Wsparcie eksperta", sub: "pon–pt 9:00–17:00" },
];

export function TrustStrip() {
  return (
    <section className="rounded-xl border bg-muted/30 px-6 py-8">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {items.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center">
            <Icon className="size-7 text-primary" />
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
