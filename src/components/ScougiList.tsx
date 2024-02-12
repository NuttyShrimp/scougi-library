import db from "@/lib/db";
import { YearShelf } from "./YearShelf";

export const ScougiList = async () => {
const scougis = await db.selectFrom("Scougi").select(['id', "year", 'trim']).execute();

  const groupedScougis: Record<string, number[]> = {};
  scougis.forEach(s => {
    if (!groupedScougis[s.year]) {
      groupedScougis[s.year] = [];
    }
    groupedScougis[s.year][s.trim] = s.id;
  });
  return (
    <div className="container mx-auto">
        {
          Object.keys(groupedScougis)
            .reverse()
            .map(year => <YearShelf key={year} year={year} trims={groupedScougis[year]} />)
        }
      </div>
  )
};