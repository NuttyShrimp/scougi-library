import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return redirect("/login/dropbox");
  // return (
  //   <>
  //     <h1>Sign in</h1>
  //     <a href="/login/dropbox">Sign in with Dropbox</a>
  //   </>
  // );
}
