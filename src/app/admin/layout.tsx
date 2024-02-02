import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Currently disabled while https://github.com/pilcrowOnPaper/arctic/pull/55 is open
  // const { user } = await validateRequest();
  // if (!user) {
  //   return redirect("/login");
  // }

  return (
    <>
      {children}
    </>
  )
}
