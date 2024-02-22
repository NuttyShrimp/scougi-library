'use client'

import { User } from "@/lib/db/schema";

export const UserRow = ({ user, approveUser }: { user: User, approveUser: (id: string) => Promise<void> }) => {
  return (
    <tr className="hover">
      <td>{user.dropboxId}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <button onClick={() => approveUser(user.id)} className="btn">Approve</button>
      </td>
    </tr>
  );
}
