import type { Metadata } from "next";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt — Twoje Zdrowie",
  description: "Skontaktuj się z nami — e-mail, telefon, godziny obsługi.",
};

export default function KontaktPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl">Kontakt</h1>

      <div className="space-y-8">
        <p className="text-sm text-muted-foreground">
          Masz pytanie dotyczące produktu, zamówienia lub dostawy? Chętnie pomożemy.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-card">
            <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">E-mail</p>
              <a
                href="mailto:kontakt@twojezdrowie.pl"
                className="mt-1 block text-sm text-muted-foreground hover:text-primary"
              >
                kontakt@twojezdrowie.pl
              </a>
              <p className="mt-1 text-xs text-muted-foreground">Odpowiedź w ciągu 24 h (dni robocze)</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-card">
            <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Telefon</p>
              <a
                href="tel:+48000000000"
                className="mt-1 block text-sm text-muted-foreground hover:text-primary"
              >
                +48 000 000 000
              </a>
              <p className="mt-1 text-xs text-muted-foreground">Pon–Pt, 9:00–17:00</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-card">
            <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Godziny obsługi</p>
              <p className="mt-1 text-sm text-muted-foreground">Poniedziałek – Piątek</p>
              <p className="text-sm text-muted-foreground">9:00 – 17:00</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-card">
            <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Adres</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Twoje Zdrowie sp. z o.o.
                <br />
                ul. Przykładowa 1
                <br />
                00-000 Warszawa
              </p>
            </div>
          </div>
        </div>

        <section className="rounded-2xl bg-secondary p-6">
          <h2 className="mb-4 text-lg">Formularz kontaktowy</h2>
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium">
                  Imię i nazwisko
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Jan Kowalski"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  Adres e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="jan@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="mb-1 block text-sm font-medium">
                Temat
              </label>
              <input
                id="subject"
                type="text"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Zapytanie o zamówienie"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium">
                Wiadomość
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Opisz swoje pytanie…"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-deep motion-reduce:transition-none"
            >
              Wyślij wiadomość
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
