import { Leaf, Phone, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: Truck, title: "Darmowa dostawa", sub: "od 200 zł" },
  { icon: ShieldCheck, title: "Certyfikowana jakość", sub: "atestowane GIS/Sanepid" },
  { icon: Leaf, title: "Naturalne składniki", sub: "bez sztucznych dodatków" },
  { icon: Phone, title: "Wsparcie eksperta", sub: "pon–pt 9:00–17:00" },
];

export function TrustStrip() {
  return (
    <section aria-label="Nasze gwarancje">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map(({ icon: Icon, title, sub }) => (
          <div
            key={title}
            className="group flex items-center gap-3 rounded-2xl bg-card px-4 py-4 shadow-card transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-transform duration-200 group-hover:scale-110 motion-reduce:group-hover:scale-100">
              <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-bold leading-snug text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
