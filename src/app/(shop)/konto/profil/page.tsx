import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/features/account/components/ProfileForm";

export const metadata = { title: "Profil — Twoje Zdrowie" };

export default async function ProfilPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/logowanie");

  const customer = await prisma.customer.findUnique({
    where: { id: session.user.id },
    select: { email: true, firstName: true, lastName: true, phone: true },
  });
  if (!customer) redirect("/logowanie");

  return (
    <ProfileForm
      email={customer.email}
      firstName={customer.firstName ?? ""}
      lastName={customer.lastName ?? ""}
      phone={customer.phone ?? ""}
    />
  );
}
