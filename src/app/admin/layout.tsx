import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  if (!user.approved) {
    return redirect("/login/approval");
  }

  return (
    <>
      {children}
    </>
  )
}
