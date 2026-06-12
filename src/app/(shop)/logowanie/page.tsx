import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Logowanie — Twoje Zdrowie",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-8 text-balance text-2xl">Zaloguj się</h1>
      <LoginForm callbackUrl={callbackUrl} />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Nie masz konta?{" "}
        <Link href="/rejestracja" className="font-medium text-primary hover:underline">
          Zarejestruj się
        </Link>
      </p>
    </div>
  );
}
