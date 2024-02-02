import { YearShelf } from "@/components/YearShelf";
import db from "@/lib/db"

export default async function Page() {
  const scougis = await db.selectFrom("Scougi").select(['id', "year", 'trim']).execute();

  const groupedScougis: Record<string, number[]> = {};
  scougis.forEach(s => {
    if (!groupedScougis[s.year]) {
      groupedScougis[s.year] = [];
    }
    groupedScougis[s.year][s.trim] = s.id;
  });

  return (
    <div className="w-screen">
      <div className="flex flex-col justify-center items-center">
        <h1 className="mb-3">
          Scougi - Scouts en Gidsen Asse
        </h1>
        <h3 className="mt-3">Lees hier uw favoriete trimestriële blad!</h3>
      </div>
      <div className="container mx-auto">
        {
          Object.keys(groupedScougis)
            .reverse()
            .map(year => <YearShelf key={year} year={year} trims={groupedScougis[year]} />)
        }
      </div>
    </div>
  )
}
