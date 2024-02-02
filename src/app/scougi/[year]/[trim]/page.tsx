import { TrimesterNames } from "@/enums/trimesterNames";
import db from "@/lib/db";
import { ArrowLeft, FileDownIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { year: string; trim: number; } }) {
  const scougi = await db.selectFrom("Scougi").selectAll().where("year", "=", params.year).where("trim", "=", Number(params.trim)).executeTakeFirst();
  if (!scougi) {
    return redirect("/404");
  }
  return (
    <div className='w-screen'>
      <div className="border-b-1 m-2 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <ArrowLeft className='cursor-pointer' />
          <span className="font-bold">
            Scougi - {scougi.year} - {TrimesterNames[scougi.trim]}
          </span>
        </div>
        <div className="flex gap-2 items-center cursor-pointer">
          <FileDownIcon />
          <span className="font-bold">
            Download
          </span>
        </div>
      </div>
      <div className='container'>
      </div>
    </div>
  )
}
