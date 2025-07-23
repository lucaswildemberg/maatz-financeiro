import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardWrapper userName={user.name}>
      {children}
    </DashboardWrapper>
  );
}