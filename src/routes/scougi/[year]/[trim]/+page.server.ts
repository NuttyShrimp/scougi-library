import db from "$lib/server/db";
import { and, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { ScougiTable } from "$lib/db/schema";
import { error } from "@sveltejs/kit";

export const ssr = false;

export const load: PageServerLoad = async ({ params }) => {
  const scougi = await db.query.ScougiTable.findFirst({
    where: and(eq(ScougiTable.year, params.year), eq(ScougiTable.trim, Number(params.trim)))
  })
  if (!scougi) {
    error(404, "Scougi not found");
  }
  return { scougi }
}
