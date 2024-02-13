import db from "@/lib/db"
import ScougiPage from "./ScougiPage";
import Link from "next/link";

export const YearShelf = async (props: { year: string, trims: number[] }) => {
  const trimFirstPages = await db.selectFrom("ScougiPage").select(['data', 'id']).where("number", '=', 0).where("id", "in", props.trims.filter(t => t)).execute();
  return (
    <div>
      <h2 className="text-center my-4">{props.year}</h2>
      <div className="border border-gray-200 rounded p-2 flex h-24 gap-4 justify-evenly sm:mx-0 mx-2">
        {props.trims.map((t, i) => {
          if (t === null) return null;
          let data = trimFirstPages.find(p => p.id === t);
          if (!data) return null;
          return (
            <Link key={`${props.year}-${data.id}`} href={`/scougi/${props.year}/${i}`} >
              <ScougiPage data={data.data} height={80} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
