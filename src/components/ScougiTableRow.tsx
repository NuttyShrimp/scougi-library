"use client"
import { TrimesterNames } from "@/enums/trimesterNames";
import { deleteScougi } from "@/lib/actions";
import { ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";

export const ScougiTableRow = ({ scougi }: { scougi: { id: number, trim: number; year: string; hidden: boolean | null } }) => {
  const handleDelete = async () => {
    try {
      await deleteScougi(scougi.id);
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <tr>
      <td>{scougi.year}</td>
      <td>{TrimesterNames[scougi.trim]}</td>
      <td>
        <input type="checkbox" checked={scougi.hidden ?? false} readOnly className="checkbox disabled" />
      </td>
      <td>
        <details className="dropdown">
          <summary className="m-1 btn">Actions</summary>
          <ul className="not-prose p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box">
            <li>
              <Link className="no-underline" href={`/scougi/${scougi.year}/${scougi.trim}`} target="_blank">
                <ExternalLink size={20} />
                <span>
                  Open
                </span>
              </Link>
            </li>
            <li className="text-red-500" onClick={handleDelete}>
              <span>
                <Trash2 size={20} />
                Delete
              </span>
            </li>
          </ul>
        </details>
      </td>
    </tr>
  )
}
