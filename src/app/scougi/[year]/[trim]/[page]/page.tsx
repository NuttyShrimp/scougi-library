import { MovablePage } from "@/components/MovablePage";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { PageIndicator } from "./PageIndicator";
import { FloatingIndicator } from "./FloatingIndicator";
import { and, eq } from "drizzle-orm";
import { ScougiPageTable, ScougiTable } from "@/lib/db/schema";

export default async function Page({ params }: { params: { year: string; trim: number; page: number } }) {
  const scougi = await db.query.ScougiTable.findFirst({
    where: and(
      eq(ScougiTable.year, params.year),
      eq(ScougiTable.trim, Number(params.trim))
    )
  });
  if (!scougi) {
    return redirect("/404");
  }

  const page = await db.query.ScougiPageTable.findFirst({
    where: and(
      eq(ScougiPageTable.id, scougi.id),
      eq(ScougiPageTable.number, Number(params.page - 1))
    )
  });

  if (!page) {
    return redirect(`/scougi/${params.year}/${params.trim}/1`);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="py-4 h-[80svh] sm:w-[80vw] w-[90vw] flex items-center justify-center relative overflow-hidden">
        <MovablePage data={page.data} />
        <FloatingIndicator year={params.year} trim={Number(params.trim)} page={Number(params.page)} totalPages={scougi.pages} />
      </div>
      <PageIndicator year={params.year} trim={Number(params.trim)} page={Number(params.page)} totalPages={scougi.pages} />
    </div>
  )
}
