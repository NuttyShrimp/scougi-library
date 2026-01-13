import db from "$lib/server/db";
import { json, type Handle } from "@sveltejs/kit";

export const GET: Handle = async () => {
  const scougis = await db.query.ScougiTable.findMany({
    orderBy: (s, { desc }) => [desc(s.year), desc(s.trim)],
  });

  return json(scougis);
}
