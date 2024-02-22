import db from "@/lib/db";
import { UserRow } from "./UserRow";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { userTable } from "@/lib/db/schema";

export default async function Page() {
  const users = await db.query.userTable.findMany({
    where: eq(userTable.approved, false)
  });

  const approveUser = async (id: string) => {
    'use server'
    await db
      .update(userTable)
      .set({ approved: true })
      .where(eq(userTable.id, id))

    revalidatePath('/admin/approvals')
  }

  return (
    <div>
      <h1>Approvals</h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} approveUser={approveUser} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
