import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  if (user.approved) {
    return redirect("/admin");
  }

  
  return (
    <div>
      <h1>Approval</h1>
      <p>
        You need to be approved by an admin before you can access this page.
      </p>
      <p>Your id: {user.dropboxId}</p>
    </div>
  );
}