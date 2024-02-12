import db from "@/lib/db"
import { ScougiPage } from "./ScougiPage";
import { base64ToUint8Array } from "@/lib/pdf";
import Link from "next/link";

export const YearShelf = async (props: { year: string, trims: number[] }) => {
  const trimFirstPages = await db.selectFrom("ScougiPage").select(['data', 'id']).where("number", '=', 0).where("id", "in", props.trims.filter(t => t)).execute();
  return (
    <div>
      <h2 className="text-center my-4">{props.year}</h2>
      <div className="border border-gray-200 rounded p-2 flex h-26 gap-4 justify-evenly sm:mx-0 mx-2">
        {props.trims.map((t, i) => {
          if (t === null) return null;
          let data = trimFirstPages.find(p => p.id === t);
          if (!data) return null;
          return (
            <Link key={t} className="w-full h-full" href={`/scougi/${props.year}/${i}`} >
              <ScougiPage data={base64ToUint8Array(data.data)} scaleOverwrite={0.12} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
