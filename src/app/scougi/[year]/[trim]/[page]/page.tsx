import { MovablePage } from "@/components/MovablePage";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { PageIndicator } from "./PageIndicator";

export default async function Page({ params }: { params: { year: string; trim: number; page:number } }) {
  const scougi = await db.selectFrom("Scougi").selectAll().where("year", "=", params.year).where("trim", "=", Number(params.trim)).executeTakeFirst();
  if (!scougi) {
    return redirect("/404");
  }

  const page = await db.selectFrom("ScougiPage").selectAll().where('id', "=", scougi.id).where('number', "=", Number(params.page - 1)).executeTakeFirst();
  if (!page) {
    return redirect(`/scougi/${params.year}/${params.trim}/1`);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="py-4 h-[80vh] sm:w-[80vw] w-[95vw] flex items-center justify-center">
        <MovablePage data={page.data} />
      </div>
      <PageIndicator year={params.year} trim={Number(params.trim)} page={Number(params.page)} totalPages={scougi.pages} />
    </div>
  )
}