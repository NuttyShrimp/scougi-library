import db from "@/lib/db"
import { ScougiPage } from "./ScougiPage";
import { base64ToUint8Array } from "@/lib/pdf";

export const YearShelf = async (props: { year: string, trims: number[] }) => {
  const trimFirstPages = await db.selectFrom("ScougiPage").select(['data', 'id']).where("number", '=', 0).where("id", "in", props.trims.filter(t => t)).execute();
  return (
    <div>
      <h2 className="text-center">{props.year}</h2>
      <div className="border border-gray-200 rounded p-2 flex h-40 gap-4 justify-evenly">
        {props.trims.map(t => {
          let data = trimFirstPages.find(p => p.id === t);
          if (!data) return null;
          return (
            <ScougiPage key={t} data={base64ToUint8Array(data.data)} />
          )
        })}
      </div>
    </div>
  )
}
