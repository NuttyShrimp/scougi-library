import db from "@/lib/db";
import { UserRow } from "./UserRow";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const users = await db.selectFrom("User").selectAll().where("approved", "=", false).execute();

  const approveUser = async (id: string) => {
    'use server'
    await db
      .updateTable("User")
      .set({ approved: true })
      .where("id", "=", id)
      .execute();
    
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