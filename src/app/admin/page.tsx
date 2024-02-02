import { ScougiTableRow } from "@/components/ScougiTableRow";
import { ScougiUploader } from "@/components/ScougiUploader";
import db from "@/lib/db";

export default async function Page() {
  const published = await db.selectFrom("Scougi").select(["year", "trim", "id", "hidden"]).orderBy("year", "desc").orderBy("trim", "desc").execute();

  const today = new Date();
  const thisYear =
    today.getMonth() < 8
      ? `${today.getFullYear() - 1}-${today.getFullYear()}`
      : `${today.getFullYear()}-${today.getFullYear() + 1}`;

  const years: Record<string, number[]> = {};
  published.forEach(s => {
    if (!years[s.year]) {
      years[s.year] = [0, 1, 2, 3];
    }
    years[s.year] = years[s.year].filter(t => t !== s.trim);
  });

  if (!years[thisYear]) {
    years[thisYear] = [0, 1, 2, 3];
  }

  return (
    <div className="container mx-auto">
      <h3 className="my-4">Add new Scougis</h3>
      <div className="m-2">
        <ScougiUploader years={years} />
      </div>
      <div className="divider my-2"></div>
      <h3 className="my-2">Published Scougis</h3>
      <table className="table">
        <thead>
          <tr>
            <th>
              Jaar
            </th>
            <th>
              Trimester
            </th>
            <th>
              Hidden
            </th>
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
          {published.map(s => (
            <ScougiTableRow key={`${s.year}-${s.trim}`} scougi={s} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
