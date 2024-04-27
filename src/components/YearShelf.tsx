import db from "@/lib/db"
import ScougiPage from "./ScougiPage";
import Link from "next/link";
import { and, eq, inArray } from "drizzle-orm";
import { ScougiPageTable } from "@/lib/db/schema";

export const YearShelf = async (props: { year: string, trims: number[] }) => {
  const trimFirstPages = await db.select({
    id: ScougiPageTable.id,
    data: ScougiPageTable.data,
  }).from(ScougiPageTable).where(and(eq(ScougiPageTable.number, 0), inArray(ScougiPageTable.id, props.trims.filter(t => t))));

  return (
    <div>
      <h2 className="text-center my-4" > {props.year} </h2>
      <div className="border border-gray-200 rounded p-2 flex h-32 gap-4 justify-evenly sm:mx-0 mx-2" >
        {
          props.trims.map((t, i) => {
            if (t === null) return null;
            let data = trimFirstPages.find(p => p.id === t);
            if (!data) return null;
            return (
              <Link key={`${props.year}-${data.id}`
              } href={`/scougi/${props.year}/${i}`} >
                <ScougiPage data={data.data} height={110} static />
              </Link>
            )
          })}
      </div>
    </div>
  )
}
