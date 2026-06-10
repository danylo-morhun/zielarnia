import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Logowanie — Twoje Zdrowie",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-8 text-2xl font-bold">Zaloguj się</h1>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Nie masz konta?{" "}
        <Link href="/rejestracja" className="font-medium text-primary hover:underline">
          Zarejestruj się
        </Link>
      </p>
    </div>
  );
}
