import { TrimesterNames } from "@/enums/trimesterNames";
import db from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({ children, params }: { children: React.ReactNode, params: { year: string; trim: number; }}) {
  const scougi = await db.selectFrom("Scougi").selectAll().where("year", "=", params.year).where("trim", "=", Number(params.trim)).executeTakeFirst();
  if (!scougi) {
    return redirect("/404");
  }

  return (
        <div className='w-screen'>
      <div className="border-b-1 m-2 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Link href="/">
            <ArrowLeft className='cursor-pointer' />
          </Link>
          <span className="font-bold">
            Scougi - {scougi.year} - {TrimesterNames[scougi.trim]}
          </span>
        </div>
        {/* <DownloadBtn data={base64ToUint8Array(scougiPages[0].data)} /> */}
      </div>
      <div className='container mx-auto'>
        {children}
      </div>
    </div>
  )
}