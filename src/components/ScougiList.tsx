import db from "@/lib/db";
import { YearShelf } from "./YearShelf";

export const ScougiList = async () => {
  const scougis = await db.query.ScougiTable.findMany({
    columns: {
      id: true,
      year: true,
      trim: true
    }
  });

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

export const ScougiListSkeleton = async () => {
  return (
    <div className="mx-auto container flex flex-col gap-2 items-center">
      <div className="skeleton w-32 h-8"></div>
      <div className="flex justify-evenly gap-4 w-full">
        <div className="skeleton w-24 h-32"></div>
        <div className="skeleton w-24 h-32"></div>
        <div className="skeleton w-24 h-32"></div>
        <div className="skeleton w-24 h-32"></div>
      </div>
    </div>
  )
}
